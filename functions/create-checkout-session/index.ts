import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@11.1.0';

// ID de l'offre d'essai gratuit
const FREE_TRIAL_PRICE_ID = 'price_1RWdHcQIOmiow871I3yM8fQM';

// Headers CORS pour les réponses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialisation du client Stripe
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
});

// Démarrage du serveur de la fonction
serve(async (req: Request) => {
  // Gérer la requête pre-flight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { priceId, userId, userType } = await req.json();

    if (!userId) throw new Error('User ID is required.');
    if (!priceId) throw new Error('Price ID is required.');

    // Initialisation du client Supabase Admin
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Nettoyer le priceId reçu pour éviter les erreurs de comparaison
    const trimmedPriceId = priceId.trim();

    // === LOGIQUE DE L'ESSAI GRATUIT ===
    if (trimmedPriceId === FREE_TRIAL_PRICE_ID) {
            console.log('Free trial offer detected for user:', userId);
      
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 2); // 48 heures d'essai

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          subscription_status: 'trialing',
          trial_ends_at: trialEndDate.toISOString(),
          has_used_trial: true,
          price_id: trimmedPriceId
        })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ Erreur Supabase lors de la mise à jour du profil:', updateError);
        throw new Error(`Erreur Supabase: ${updateError.message}`);
      }

      console.log('✅ Essai gratuit activé avec succès pour:', userId);
      const redirectUrl = `${req.headers.get('origin')}/app/dashboard?trial=success`;
      
      return new Response(JSON.stringify({ url: redirectUrl, isFree: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // === LOGIQUE DE PAIEMENT STRIPE (si ce n'est pas une offre gratuite) ===
    console.log('ℹ️ Pas une offre gratuite. Création de la session de paiement Stripe...');

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const { data: user } = await supabase.auth.admin.getUserById(userId);
      const customer = await stripe.customers.create({ email: user?.email });
      customerId = customer.id;
      await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', userId);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: customerId,
      line_items: [{ price: trimmedPriceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/app/dashboard?payment=success`,
      cancel_url: `${req.headers.get('origin')}/pricing`,
      metadata: {
        user_id: userId,
        user_type: userType,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error('❌ Unexpected error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
