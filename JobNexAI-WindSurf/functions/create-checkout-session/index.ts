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