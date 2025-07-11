console.log('[create-checkout-session] SCRIPT EXECUTION STARTED - TOP OF FILE');

import Stripe from 'npm:stripe@14.0.0';
console.log('[create-checkout-session] Stripe import successful.');

import { createClient, SupabaseClient } from 'npm:@supabase/supabase-js@2.39.3';
import { Database } from '../../../src/lib/database.types.ts'; // Types générés par Supabase CLI
console.log('[create-checkout-session] Supabase client import successful.');

// Define the interface for the profile data we expect
interface ProfileInfo {
  stripe_customer_id: string | null;
  email: string | null;
  user_type: 'candidate' | 'freelancer' | 'recruiter' | 'admin' | null; // Updated enum
}

interface RequestPayload {
  priceId: string;
  userId: string;
  supabaseProductId: string; // Added
  userType: 'candidate' | 'freelancer' | 'recruiter' | 'admin' | null; // Updated enum
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
console.log('[create-checkout-session] CORS headers defined.');

let stripe: Stripe;
let supabase: SupabaseClient<Database>;

try {
  console.log('[create-checkout-session] Initializing Stripe client...');
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
  if (!stripeSecretKey) {
    console.error('[create-checkout-session] CRITICAL: STRIPE_SECRET_KEY is not set.');
    throw new Error('CRITICAL: STRIPE_SECRET_KEY is not set.');
  }
  stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16', // Spécifier la version de l'API Stripe
    // typescript: true, // Si vous souhaitez utiliser les types Stripe plus strictement
  });
  console.log('[create-checkout-session] Stripe client initialized successfully.');

  console.log('[create-checkout-session] Initializing Supabase client...');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('[create-checkout-session] CRITICAL: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set.');
    throw new Error('CRITICAL: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set.');
  }
  supabase = createClient<Database>(supabaseUrl, supabaseServiceRoleKey);
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
    const { priceId, userId, supabaseProductId, userType } = await req.json() as RequestPayload;
    console.log('[create-checkout-session] REQUEST HANDLER: Request JSON parsed:', { priceId, userId, userType });

    // 1. Get user email from Supabase Auth
    console.log(`[create-checkout-session] REQUEST HANDLER: Fetching user auth data for userId: ${userId}`);
    const { data: { user }, error: authError } = await supabase.auth.admin.getUserById(userId);

    if (authError || !user) {
      console.error(`[create-checkout-session] REQUEST HANDLER: Could not retrieve user ${userId} from Supabase Auth.`, authError);
      throw new Error('User not found in authentication system.');
    }
    const userEmail = user.email;
    if (!userEmail) {
        console.error(`[create-checkout-session] REQUEST HANDLER: User ${userId} does not have an email.`);
        throw new Error('User email is missing.');
    }
    console.log(`[create-checkout-session] REQUEST HANDLER: User email is ${userEmail}`);

    // 2. Fetch user profile from DB
    console.log(`[create-checkout-session] REQUEST HANDLER: Fetching profile from DB for userId: ${userId}`);
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    // 3. Determine Stripe Customer ID
    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      console.log(`[create-checkout-session] REQUEST HANDLER: No Stripe customer ID found. Creating a new one.`);
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: { supabase_user_id: userId },
      });
      customerId = customer.id;
      console.log(`[create-checkout-session] REQUEST HANDLER: Created new Stripe customerId: ${customerId}`);

      // 4. Upsert profile with the new customer ID and email
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({ id: userId, stripe_customer_id: customerId, email: userEmail }, { onConflict: 'id' });

      if (upsertError) {
        console.error(`[create-checkout-session] REQUEST HANDLER: Failed to upsert profile for userId ${userId}:`, upsertError);
        // Non-critical error, so we don't throw.
      }
    } else {
      console.log(`[create-checkout-session] REQUEST HANDLER: Using existing Stripe customerId: ${customerId}`);
    }
    
    // 5. Update user_type if provided (optional)
    if (userType) {
        console.log(`[create-checkout-session] REQUEST HANDLER: Updating profile user_type to '${userType}' for userId: ${userId}`);
        const { error: updateProfileError } = await supabase
            .from('profiles')
            .update({ user_type: userType })
            .eq('id', userId);
        if (updateProfileError) {
            console.error(`[create-checkout-session] REQUEST HANDLER: Error updating profile user_type for userId ${userId}:`, updateProfileError);
        }
    }

    // 6. Create Stripe Checkout Session
    console.log(`[create-checkout-session] REQUEST HANDLER: Creating Stripe checkout session for customerId: ${customerId}, priceId: ${priceId}`);
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: userId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${req.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/pricing`,
      subscription_data: {
        metadata: {
          supabase_user_id: userId,
          user_type: userType,
          supabase_product_id: supabaseProductId
        },
      },
    });
    console.log(`[create-checkout-session] REQUEST HANDLER: Stripe checkout session created: ${session.id}`);

    return new Response(JSON.stringify({ checkoutUrl: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('[create-checkout-session] REQUEST HANDLER CRITICAL ERROR:', error.message, error.stack);
    return new Response(JSON.stringify({ error: 'Internal Server Error: ' + error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

console.log('[create-checkout-session] SCRIPT EXECUTION FINISHED - Deno.serve configured.');