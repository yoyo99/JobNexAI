// Import Stripe and Supabase client
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { verify } from 'jsonwebtoken';

// Initialize Stripe and Supabase clients
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!)

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Define interfaces for data structures
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

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Authenticate the request using JWT.
 */
const authenticate = async (req: Request): Promise<string | null> => {  
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    const jwtSecret = Deno.env.get('SUPABASE_JWT_SECRET')
    if (!jwtSecret) {
      throw new Error('SUPABASE_JWT_SECRET is not defined')
    }
    const payload = verify(token, jwtSecret)
    if (typeof payload === 'object' && payload.sub) {
      return payload.sub;
    }
    return null;
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return null;
  }
};

/**
 * Check if a string is a valid UUID.
 */
const isValidUuid = (uuid: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
};

/**
 * Check if a value is a valid non empty string.
 */
const isValidString = (value: string): boolean => {
  return typeof value === 'string' && value.length > 0
}

/**
 * Verify if the input data are valid.
 */
const validateInput = (userId: any, priceId: any, userType: any): boolean => {
    return isValidUuid(userId) && isValidString(priceId) && (userType === undefined || userType === null || isValidString(userType));
};

/**
 * Create a PaymentIntent.
 */
const createPaymentIntent = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
  }
  try {
    // Authenticate the request
    const userIdFromToken = await authenticate(req);
    if (!userIdFromToken) {
      return new Response(JSON.stringify({ error: 'Unauthorized', code: 'unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Get data from the request body
    const { userId, priceId, planName, userType } = await req.json()

    if (!validateInput(userId, priceId, userType)) {
      return new Response(JSON.stringify({ error: 'Invalid input data', code: 'invalid_input' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 })
    };

    if (userIdFromToken !== userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized', code: 'unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Retrieve price information from Stripe
    let price
    try {
      price = await stripe.prices.retrieve(priceId)
    } catch (stripeError) {
      console.error('Error retrieving price from Stripe:', stripeError);
      const response: PaymentIntentResponse = { error: 'Error retrieving price from Stripe', details: stripeError, code: 'stripe_price_error' }
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    if (!price) {
      console.error('Price not found:', priceId)
      const response: PaymentIntentResponse = { error: 'Price not found', code: 'price_not_found' }
      return new Response(JSON.stringify(response), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 })
    }

    // Fetch or create Stripe customer
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single()

    if (profileError) {
      console.error('Error fetching profile from Supabase:', profileError);
      const response: PaymentIntentResponse = { error: 'Error fetching profile from Supabase', details: profileError, code: 'supabase_profile_fetch_error' };
      return new Response(JSON.stringify(response), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
    } else if (!profile) {
      return new Response(JSON.stringify({ error: 'Profile not found in Supabase', code: 'profile_not_found' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 });
    } 

    // Get Stripe customer ID from subscription or create a new customer
    let customerId: string
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    if (subscriptionError) {
      console.error('Error fetching subscription from Supabase:', subscriptionError)
      const response: PaymentIntentResponse = { error: 'Error fetching subscription from Supabase', details: subscriptionError, code: 'supabase_subscription_fetch_error' }
      return new Response(JSON.stringify(response), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 })
    } else if (subscription?.stripe_customer_id) {
      customerId = subscription.stripe_customer_id
    } else {
      try {
        // Create a new Stripe customer
        const customer = await stripe.customers.create({
          email: profile.email,
          metadata: {
            supabase_user_id: userId,
          },
        })
        customerId = customer.id
        // Update subscription table with the new customer id
      } catch (stripeError) {
        console.error('Error creating Stripe customer:', stripeError)
        const response: PaymentIntentResponse = { error: 'Error creating Stripe customer', details: stripeError, code: 'stripe_customer_create_error' }
        return new Response(JSON.stringify(response), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 })
      }
    }

    // Update profile with the new user type
    if (userType) {
      const { error: updateProfileError } = await supabase.from('profiles').update({ user_type: userType }).eq('id', userId)
      if (updateProfileError) {
        console.error('Error updating profile user type in Supabase:', updateProfileError)
        const response: PaymentIntentResponse = { error: 'Error updating profile user type in Supabase', details: updateProfileError, code: 'supabase_profile_update_error' }
        return new Response(JSON.stringify(response), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 })
      }

    }

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price.unit_amount!,
      currency: price.currency,
      customer: customerId,
      metadata: {
        userId,
        priceId,
        planName,
      },
    })

    // Return the client secret
    const response: PaymentIntentResponse = { clientSecret: paymentIntent.client_secret || null }
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Unhandled error:', error);

    const response: PaymentIntentResponse = {
      error: 'An unexpected error occurred',
      code: 'internal_server_error',
      details: error instanceof Error ? error.message : String(error),
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};

// Start the server
Deno.serve(async (req) => {
  return await createPaymentIntent(req);
});



