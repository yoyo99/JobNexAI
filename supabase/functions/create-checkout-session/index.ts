console.log('[create-checkout-session] SCRIPT EXECUTION STARTED - TOP OF FILE');

import Stripe from 'npm:stripe@14.0.0';
import process from "node:process";
console.log('[create-checkout-session] Stripe import successful.');

import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
console.log('[create-checkout-session] Supabase client import successful.');

// Define the interface for the profile data we expect
interface ProfileInfo {
  stripe_customer_id: string | null;
  email: string | null;
  user_type: 'job_seeker' | 'recruiter' | 'admin' | null;
}

interface RequestPayload {
  priceId: string;
  userId: string;
  userType: 'job_seeker' | 'recruiter' | 'admin' | null;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
console.log('[create-checkout-session] CORS headers defined.');

let stripe: Stripe;
let supabase: ReturnType<typeof createClient>;

try {
  console.log('[create-checkout-session] Initializing Stripe client...');
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
  if (!stripeSecretKey) {
    console.error('[create-checkout-session] CRITICAL: STRIPE_SECRET_KEY is not set.');
    throw new Error('CRITICAL: STRIPE_SECRET_KEY is not set.');
  }
  stripe = new Stripe(stripeSecretKey);
  console.log('[create-checkout-session] Stripe client initialized successfully.');

  console.log('[create-checkout-session] Initializing Supabase client...');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('[create-checkout-session] CRITICAL: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set.');
    throw new Error('CRITICAL: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set.');
  }
  supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  console.log('[create-checkout-session] Supabase client initialized successfully.');

} catch (initError: any) {
  console.error('[create-checkout-session] CRITICAL INITIALIZATION ERROR:', initError.message, initError.stack);
  // If initialization fails, Deno.serve might not even be reached or work correctly,
  // but we'll define it anyway so the file is structurally valid.
  // The actual error might be thrown before Deno.serve is effectively called by the runtime.
}

console.log('[create-checkout-session] About to call Deno.serve...');

Deno.serve(async (req: Request) => {
  console.log(`[create-checkout-session] REQUEST HANDLER: Received request: ${req.method} ${req.url}`);

  if (!stripe || !supabase) {
    console.error('[create-checkout-session] ERROR: Stripe or Supabase client not initialized. Responding 500.');
    return new Response(JSON.stringify({ error: 'Server configuration error: Clients not initialized.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  if (req.method === 'OPTIONS') {
    console.log('[create-checkout-session] REQUEST HANDLER: Handling OPTIONS request.');
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('[create-checkout-session] REQUEST HANDLER: Attempting to parse request JSON...');
    const { priceId, userId, userType } = await req.json() as RequestPayload;
    console.log('[create-checkout-session] REQUEST HANDLER: Request JSON parsed:', { priceId, userId, userType });

    console.log(`[create-checkout-session] REQUEST HANDLER: Fetching profile for userId: ${userId}`);
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email, user_type') // Select all necessary fields
      .eq('id', userId)
      .single<ProfileInfo>();

    if (profileError) {
      console.error(`[create-checkout-session] REQUEST HANDLER: Error fetching profile for userId ${userId}:`, profileError);
      throw new Error(`Error fetching user profile: ${profileError.message}`);
    }
    if (!profile) {
      console.error(`[create-checkout-session] REQUEST HANDLER: User profile not found for userId: ${userId}`);
      throw new Error('User not found');
    }
    console.log(`[create-checkout-session] REQUEST HANDLER: Profile fetched for userId ${userId}:`, profile);

    let customerId: string;
    console.log(`[create-checkout-session] REQUEST HANDLER: Fetching subscription for userId: ${userId}`);
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (subscriptionError && subscriptionError.code !== 'PGRST116') { // PGRST116: single row not found, which is fine
      console.error(`[create-checkout-session] REQUEST HANDLER: Error fetching subscription for userId ${userId}:`, subscriptionError);
      throw new Error(`Error fetching user subscription: ${subscriptionError.message}`);
    }
    console.log(`[create-checkout-session] REQUEST HANDLER: Subscription data for userId ${userId}:`, subscription);

    if (subscription?.stripe_customer_id) {
      customerId = subscription.stripe_customer_id;
      console.log(`[create-checkout-session] REQUEST HANDLER: Using existing Stripe customerId: ${customerId}`);
    } else {
      console.log(`[create-checkout-session] REQUEST HANDLER: No existing Stripe customerId found. Creating new customer for email: ${profile.email}`);
      const customer = await stripe.customers.create({
        email: profile?.email ?? undefined,
        metadata: {
          supabase_user_id: userId,
          user_type: userType
        },
      });
      customerId = customer.id;
      console.log(`[create-checkout-session] REQUEST HANDLER: Created new Stripe customerId: ${customerId}`);
    }

    if (userType) {
      console.log(`[create-checkout-session] REQUEST HANDLER: Updating profile user_type to '${userType}' for userId: ${userId}`);
      
      type ProfileUpdatePayload = {
        user_type: 'job_seeker' | 'recruiter' | 'admin';
      };
      const updatePayload: ProfileUpdatePayload = { user_type: userType };

      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', userId);
      if (updateProfileError) {
        console.error(`[create-checkout-session] REQUEST HANDLER: Error updating profile user_type for userId ${userId}:`, updateProfileError);
        // Not throwing here, as it's not critical for checkout creation itself
      }
      console.log(`[create-checkout-session] REQUEST HANDLER: Profile user_type update call complete for userId: ${userId}`);
    }

    console.log(`[create-checkout-session] REQUEST HANDLER: Creating Stripe checkout session for customerId: ${customerId}, priceId: ${priceId}`);
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
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success-v2?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/pricing`,
      subscription_data: {
        metadata: {
          supabase_user_id: userId,
          user_type: userType
        },
      },
    });
    console.log(`[create-checkout-session] REQUEST HANDLER: Stripe checkout session created: ${session.id}`);

    return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('[create-checkout-session] REQUEST HANDLER CRITICAL ERROR:', error.message, error.stack);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400, // Ou 500 si c'est une erreur serveur plus générique
    });
  }
});

console.log('[create-checkout-session] SCRIPT EXECUTION FINISHED - Deno.serve configured.');