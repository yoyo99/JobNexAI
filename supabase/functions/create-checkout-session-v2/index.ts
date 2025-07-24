import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from "https://esm.sh/stripe@11.1.0?target=deno&no-check";

// Initialisation Supabase Admin
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { priceId, userId } = body as { priceId: string; userId: string };

    // Test simple pour l'essai gratuit
    if (priceId === 'price_1RoRHKQIOmiow871W7anKnRZ') {
      const trialEndsAt = new Date(Date.now() + 48 * 3600 * 1000).toISOString();
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ subscription_status: 'trialing', trial_ends_at: trialEndsAt })
        .eq('id', userId);

      if (updateError) {
        throw new Error(`DB update failed: ${updateError.message}`);
      }

      const redirectUrl = new URL('/app/dashboard?trial=success', req.headers.get('origin')!).toString();
      return new Response(JSON.stringify({ checkoutUrl: redirectUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);

    if (userError || !userData.user) {
      throw new Error(`Failed to retrieve user: ${userError?.message || 'User not found'}`);
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: userData.user.email,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `https://jobnexai-windsurf.netlify.app/app/dashboard?payment=success`,
      cancel_url: `https://jobnexai-windsurf.netlify.app/app/dashboard?payment=cancelled`,
      metadata: {
        userId: userId,
      },
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ 
      error: 'Function error: ' + error.message,
      stack: error.stack 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

console.log('🏁 FUNCTION SETUP COMPLETE - Waiting for requests...');