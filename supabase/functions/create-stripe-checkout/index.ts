// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import Stripe from 'npm:stripe@^14.0.0'; // Assurez-vous que la version est compatible ou utilisez la dernière
import { createClient, SupabaseClient } from 'npm:@supabase/supabase-js@^2.0.0';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
if (!STRIPE_SECRET_KEY) {
  console.error('FATAL: Missing STRIPE_SECRET_KEY environment variable. Stripe client cannot be initialized.');
  // In a serverless function, throwing an error here will prevent the function from being served if Stripe isn't configured.
  throw new Error("Stripe secret key is not configured. Function cannot start.");
}
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Utilisez la version API que vous ciblez
  httpClient: Stripe.createFetchHttpClient(), // Nécessaire pour Deno
});

console.log(`Stripe secret key loaded: ${STRIPE_SECRET_KEY ? 'Yes' : 'No'}`);

// Supabase client initialization
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.');
  // Vous pourriez vouloir gérer cette erreur plus globalement
}

// Define the specific Price IDs for the Pro Monthly plan
const PRO_MONTHLY_WITH_TRIAL_ID = 'price_1RMqzHQIOmiow8714WydjFom';
const PRO_MONTHLY_NO_TRIAL_ID = 'price_1RCiVAQIOmiow871DNpiAQRx';

serve(async (req: Request) => {
  // Gestion CORS - ajustez 'Access-Control-Allow-Origin' avec votre URL frontend si nécessaire
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*', // IMPORTANT: For production, restrict this to your frontend's domain
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    // 1. Extraire le priceId du corps de la requête
    const { priceId, quantity = 1 } = await req.json();
    if (!priceId) {
      return new Response(JSON.stringify({ error: 'Missing priceId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
    console.log('Received priceId:', priceId);

    // 2. Récupérer l'utilisateur Supabase à partir du token JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing Authorization header in request.');
      return new Response(JSON.stringify({ error: 'Authentication required: Missing Authorization header.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(JSON.stringify({ error: 'Supabase environment variables not set in Edge Function.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
    const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey,
      {
        global: { headers: { Authorization: authHeader } } // Use the checked authHeader
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Error getting user:', userError?.message);
      return new Response(JSON.stringify({ error: 'Authentication required: ' + (userError?.message || 'User not found') }), {
        status: 401, // Unauthorized
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const supabaseUserId = user.id;
    const userEmail = user.email;
    console.log(`Authenticated user: ${supabaseUserId}, email: ${userEmail}`);

    // Logique pour trouver/créer un client Stripe (`stripeCustomerId`)
    let stripeCustomerId: string | undefined;

    // 1. Vérifier si l'utilisateur Supabase a déjà un `stripe_customer_id`
    // Assurez-vous d'avoir une table 'profiles' avec une colonne 'stripe_customer_id'
    // et que les politiques RLS permettent à l'utilisateur de lire son propre profil.
    const { data: profileData, error: profileError } = await supabase
      .from('profiles') // Remplacez 'profiles' par le nom de votre table de profils si différent
      .select('stripe_customer_id, has_used_trial') // Added has_used_trial
      .eq('id', supabaseUserId) // Supposant que la clé primaire de 'profiles' est 'id' et correspond à supabaseUserId
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116: row not found, ce qui est ok ici
      console.error('Error fetching profile:', profileError);
      return new Response(JSON.stringify({ error: 'Error fetching user profile: ' + profileError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    if (profileData && profileData.stripe_customer_id) {
      stripeCustomerId = profileData.stripe_customer_id;
      console.log(`Found existing Stripe Customer ID: ${stripeCustomerId}`);
    } else {
      // 2. Si non, créer un nouveau client Stripe
      try {
        console.log(`No Stripe Customer ID found for user ${supabaseUserId}. Creating a new one.`);
        const customer = await stripe.customers.create({
          email: userEmail,
          // Vous pouvez ajouter d'autres infos ici, comme le nom, si disponibles
          name: user.user_metadata?.full_name || undefined, // Exemple
          metadata: {
            supabase_user_id: supabaseUserId,
          },
        });
        stripeCustomerId = customer.id;
        console.log(`Created new Stripe Customer ID: ${stripeCustomerId}`);

        // 3. Stocker le nouveau `stripeCustomerId` dans la table `profiles` de l'utilisateur Supabase
        // Assurez-vous que les politiques RLS permettent à l'utilisateur de mettre à jour son propre profil.
        const { error: updateProfileError } = await supabase
          .from('profiles') // Remplacez 'profiles' par le nom de votre table de profils
          .update({ stripe_customer_id: stripeCustomerId })
          .eq('id', supabaseUserId);

        if (updateProfileError) {
          console.error('Error updating profile with Stripe Customer ID:', updateProfileError);
          // Ne pas bloquer la création de session de paiement pour cela, mais logguer l'erreur.
          // Vous pourriez vouloir une gestion d'erreur plus robuste ici.
        }
      } catch (e) {
        console.error('Error creating Stripe customer or updating profile:', e);
        return new Response(JSON.stringify({ error: 'Failed to create Stripe customer: ' + (e as Error).message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
    }

    const userHasUsedTrial = profileData && profileData.has_used_trial;

    // Determine the final price ID to use
    let finalPriceId = priceId;
    if (userHasUsedTrial && priceId === PRO_MONTHLY_WITH_TRIAL_ID) {
      console.log(`User ${user.id} has already used a trial and is requesting the trial plan. Switching to non-trial plan.`);
      finalPriceId = PRO_MONTHLY_NO_TRIAL_ID;
    } else {
      console.log(`User ${user.id} is proceeding with priceId: ${priceId}. Trial status: ${userHasUsedTrial}`);
    }

    // 3. Créer la session de paiement Stripe
    const origin = req.headers.get('origin');
    // L'en-tête 'origin' est crucial pour construire les URL de redirection.
    if (!origin) {
      throw new Error("L'en-tête 'origin' est manquant, impossible de construire les URLs de redirection.");
    }
    console.log(`Origine de la requête pour les URLs de redirection : ${origin}`);

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: 'subscription', // ou 'payment' pour un achat unique
      client_reference_id: supabaseUserId, // Lier la session à l'utilisateur Supabase
      line_items: [
        {
          price: finalPriceId,
          quantity: quantity,
        },
      ],
      customer: stripeCustomerId, // Utiliser le stripeCustomerId trouvé ou créé
      // Si vous n'utilisez pas `customer` ID, vous pouvez pré-remplir l'email du client comme ceci :
      // customer_email: userEmail, 
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      metadata: { // Très important pour les webhooks !
        supabase_user_id: supabaseUserId,
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);
    console.log('Stripe session created:', session.id);

    return new Response(JSON.stringify({ sessionId: session.id, checkoutUrl: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });

  } catch (error) {
    console.error('Error creating Stripe session:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create Stripe session';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-stripe-checkout' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
