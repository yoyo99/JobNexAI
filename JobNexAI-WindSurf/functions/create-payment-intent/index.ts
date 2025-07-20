// Import Stripe and Supabase client

import { createClient } from '@supabase/supabase-js';

interface Profile {
  email: string;
}

interface Subscription {
  stripe_customer_id: string;
}

interface PaymentIntentResponse {
  clientSecret?: string | null;
  error?: string;
  details?: any;
  code?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export async function handler(event: any, context: any) {
  const { default: Stripe } = await import('stripe');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: 'ok',
    };
  }

  try {
    // Authenticate the request (si besoin, adapte selon ta logique)
    // const userIdFromToken = ...
    // if (!userIdFromToken) { ... }

    // Get data from the request body
    const { priceId, userId, userType } = JSON.parse(event.body || '{}');

    // Vérifie les données
    if (!userId || !priceId) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing userId or priceId' }),
      };
    }

    // Créer ou récupérer le client Stripe
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();

    if (!profile) {
      return {
        statusCode: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    let customerId: string;
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (subscription?.stripe_customer_id) {
      customerId = subscription.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: profile.email,
        metadata: {
          supabase_user_id: userId,
          user_type: userType,
        },
      });
      customerId = customer.id;
    }

    // Mettre à jour le type d'utilisateur si nécessaire
    if (userType) {
      await supabase
        .from('profiles')
        .update({ user_type: userType })
        .eq('id', userId);
    }

    // Créer la PaymentIntent (exemple, adapte selon ton besoin réel)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // adapte le montant
      currency: 'eur',
      customer: customerId,
      metadata: {
        supabase_user_id: userId,
        user_type: userType,
      },
    });

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
}
