import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { Handler } from '@netlify/functions';

const handler: Handler = async (event, context) => {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    console.error('Stripe secret key not set.');
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'STRIPE_SECRET_KEY is not set in environment variables.' }),
    };
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2022-11-15', // Aligned with installed types
  });
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
    const { priceId: rawPriceId, userId, userType } = JSON.parse(event.body || '{}');
    
    if (!rawPriceId || !userId) {
        return {
            statusCode: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'priceId and userId are required.' }),
        };
    }

    const priceId = String(rawPriceId).trim();
    console.log(`✅ BACKEND DEBUG: Received priceId: ${priceId}, userId: ${userId}`);

    const FREE_TRIAL_PRICE_ID = 'price_1RWdHcQIOmiow871I3yM8fQM';

    // === LOGIQUE DE L'ESSAI GRATUIT ===
    if (priceId === FREE_TRIAL_PRICE_ID) {
      // TEMP DEBUG: Return the received priceId to the client
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          debug: true,
          message: 'DEBUGGING...',
          receivedPriceId: priceId,
          expectedPriceId: FREE_TRIAL_PRICE_ID,
          areEqual: priceId === FREE_TRIAL_PRICE_ID
        }),
      };
    }

    console.log('ℹ️ DEBUG: Pas une offre gratuite, création session Stripe...');

    const { data: profile } = await supabase
      .from('profiles')
      .select('email, stripe_customer_id')
      .eq('id', userId)
      .single();

    if (!profile) {
      throw new Error('User profile not found');
    }

    let customerId = profile.stripe_customer_id;

    if (!customerId) {
        const customer = await stripe.customers.create({
            email: profile.email,
            metadata: {
              supabase_user_id: userId,
            },
        });
        customerId = customer.id;

        // Save the new customer ID to the profile
        await supabase
            .from('profiles')
            .update({ stripe_customer_id: customerId })
            .eq('id', userId);
    }
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
          price: priceId,
          quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${(event.headers as any)?.origin || ''}/app/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${(event.headers as any)?.origin || ''}/pricing`,
      subscription_data: {
        metadata: {
          supabase_user_id: userId,
        },
      },
    });

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    };

  } catch (error: any) {
    console.error('Error:', error);
    return {
      statusCode: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
}
