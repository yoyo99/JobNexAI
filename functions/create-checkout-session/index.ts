import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export async function handler(event, context) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: 'ok',
    };
  }

  try {
    const { priceId, userId, userType } = JSON.parse(event.body || '{}');

    // 🆓 GESTION DES OFFRES GRATUITES
    const FREE_TRIAL_PRICE_IDS = [
      'price_1RWdHcQIOmiow871I3yM8fQM', // Essai Gratuit 48h
    ];

    // Si c'est une offre gratuite, créer directement l'abonnement
    if (FREE_TRIAL_PRICE_IDS.includes(priceId)) {
      // Récupérer les infos du prix depuis Stripe
      const price = await stripe.prices.retrieve(priceId);
      
      // Créer l'abonnement gratuit directement dans Supabase
      const trialEndDate = new Date();
      trialEndDate.setHours(trialEndDate.getHours() + 48); // 48h d'essai
      
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          status: 'trialing',
          plan: 'essai_gratuit_48h',
          current_period_start: new Date().toISOString(),
          current_period_end: trialEndDate.toISOString(),
          trial_end: trialEndDate.toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (subscriptionError) {
        throw new Error(`Erreur création abonnement gratuit: ${subscriptionError.message}`);
      }

      // Mettre à jour le type d'utilisateur
      if (userType) {
        await supabase
          .from('profiles')
          .update({ user_type: userType })
          .eq('id', userId);
      }

      // Retourner une URL de succès directement (pas de paiement)
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId: null, 
          url: `${(event.headers as any)?.origin || ''}/dashboard?trial=activated`,
          isFree: true,
          message: 'Essai gratuit activé avec succès !'
        }),
      };
    }

    // Créer ou récupérer le client Stripe
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();

    if (!profile) {
      throw new Error('User not found')
    }

    let customerId: string

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    if (subscription?.stripe_customer_id) {
      customerId = subscription.stripe_customer_id
    } else {
      const customer = await stripe.customers.create({
        email: profile.email,
        metadata: {
          supabase_user_id: userId,
          user_type: userType
        },
      })
      customerId = customer.id
    }

    // Mettre à jour le type d'utilisateur si nécessaire
    if (userType) {
      await supabase
        .from('profiles')
        .update({ user_type: userType })
        .eq('id', userId)
    }

    // Créer la session de paiement
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: userId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${(event.headers as any)?.origin || ''}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${(event.headers as any)?.origin || ''}/pricing`,
      subscription_data: {
        metadata: {
          supabase_user_id: userId,
          user_type: userType
        },
      },
    })

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: session.id, url: session.url }),
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    }
  }
}