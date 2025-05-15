import Stripe from "npm:stripe@^14.0.0";
import { createClient } from "npm:@supabase/supabase-js@^2.39.3";
import { verify } from 'https://deno.land/x/djwt@v2.9.1/mod.ts';
const textEncoder = new TextEncoder();
import { type Payload } from 'https://deno.land/x/djwt@v2.9.1/mod.ts';

// Initialisation de Stripe avec la clé secrète
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  // Permet une chaîne de version API personnalisée du dashboard Stripe
  // deno-lint-ignore-next-line no-explicit-any
  apiVersion: '2025-04-30.basil' as any,
  // typescript: true, // Optionnel: pour une meilleure inférence de type si supporté
});
// Initialisation de Supabase avec l'URL et la clé de service
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Récupération de la clé secrète JWT depuis les variables d'environnement
const JWT_SECRET = Deno.env.get('JWT_SECRET');
const JWT_SECRET_READ_REPLICA = Deno.env.get('JWT_SECRET_READ_REPLICA');

// Vérification si la clé secrète JWT est définie
if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined');


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SessionStatusResponse {
  status: string
  customer: string | null
  subscription: string | null
}

interface ResponseError {
  error: string
  code?: string
}

// Interface pour les données d'entrée attendues
interface InputData {
  sessionId: string
}

// Fonction pour valider les données d'entrée
const validateInput = (data: unknown): data is InputData => {
    // Vérifier si les données sont bien un objet et non null
    if (!data || typeof data !== 'object' || data === null) { // Ajout de data === null pour la complétude
        console.error("validateInput : Invalid data type or null")
        return false;
    }
    // Après la vérification, nous pouvons caster data vers un type plus spécifique
    const potentialInput = data as { sessionId?: unknown };
    // Vérifier si sessionId est présent et est une chaîne de caractères
    if (typeof potentialInput.sessionId !== 'string') {
        console.error("validateInput : sessionId is not a string or missing")
        return false;
    }
    return true;
};


const authenticate = async (req: Request): Promise<string> => {
  // Récupérer le token JWT depuis les headers
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    throw new Error('Authorization header is missing')
  }

  const token = authHeader.split(' ')[1]

  // Vérifier si le token est valide
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not set in environment variables.');
    throw new Error('JWT_SECRET is not configured.');
  }

  const mainCryptoKey = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  let payload: Payload;
  try {
    payload = await verify(token, mainCryptoKey);
  } catch (error) {
    console.warn('Primary JWT verification failed. Attempting with read replica secret.', error);
    if (!JWT_SECRET_READ_REPLICA) {
      console.error('JWT_SECRET_READ_REPLICA is not set, and primary verification failed.');
      throw new Error('Token verification failed, no fallback secret.');
    }
    const readCryptoKey = await crypto.subtle.importKey(
      'raw',
      textEncoder.encode(JWT_SECRET_READ_REPLICA),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    try {
      payload = await verify(token, readCryptoKey);
    } catch (readError) {
      console.error('Read replica JWT verification also failed:', readError);
      throw new Error('Invalid token (all verification attempts failed).');
    }
  }

  // Suite du code si la vérification réussit avec l'une des clés...
  // Exemple de log pour voir quel payload a été utilisé :
  // console.log('JWT payload:', payload);

  // Remplacer la ligne suivante si la capture d'erreur précédente est retirée :
  // const payload: Payload = await verify(token, cryptoKeyRead).catch((error: unknown) => {
  // Par exemple (si on ne garde que la vérification principale):
  // const payload: Payload = await verify(token, mainCryptoKey).catch((error: unknown) => {
  // Fin du bloc de code inséré précédemment, les lignes ci-dessus étaient orphelines et ont été supprimées.
  const userId = payload.sub;
  if (!userId) {
    // Ceci ne devrait techniquement pas arriver si la vérification djwt réussit
    // car la spec JWT exige un 'sub' dans la plupart des cas d'usage.
    // Mais une vérification est une bonne pratique.
    console.error('User ID (sub) not found in JWT payload after successful verification.');
    throw new Error('User ID not found in token after verification.');
  }
  return userId;
}

// Fonction principale pour gérer les requêtes
async function handler(req: Request): Promise<Response> {
  // Gérer la requête OPTIONS pour CORS
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // Authentification de l'utilisateur
    const _userId = await authenticate(req).catch((error: Error) => {
        console.error('Error during authentication:', error.message);
        throw new Error(error.message)
    });


    // Récupérer les données de la requête
    const data = await req.json()
    
    // Valider les données d'entrée
    if (!validateInput(data)) {
        console.error("Invalid input data")
        const responseError: ResponseError = { error: 'Invalid input data', code: 'invalid_input' };
        return new Response(JSON.stringify(responseError), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }
    const { sessionId } = data

    // Récupérer les informations de la session
    let session;
    try {
        session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (stripeError: unknown) {
        console.error('Stripe Error retrieving session:', stripeError);
        let errorMessage = 'Failed to retrieve session from Stripe';
        let errorCode: string | undefined = undefined;
        if (stripeError instanceof Error) {
            errorMessage = stripeError.message;
        }
        // Attempt to access Stripe-specific error code if available, 
        // assuming stripeError might be an object with a code property even if not an Error instance.
        if (typeof stripeError === 'object' && stripeError !== null && 'code' in stripeError) {
            const potentialStripeError = stripeError as { code?: unknown };
            if (typeof potentialStripeError.code === 'string') {
                errorCode = potentialStripeError.code;
            }
        }
        const responseErrorToThrow: ResponseError = {
            error: errorMessage,
            code: errorCode
        };
        throw responseErrorToThrow; // L'erreur sera attrapée par le bloc catch principal de la fonction handler
    }

    // Si on arrive ici, la session a été récupérée avec succès
    const response: SessionStatusResponse = {
      status: session.status as string, // Stripe.Checkout.Session.status can be null, but retrieve() should populate it
      customer: session.customer as string | null, // customer can be string or Stripe.Customer or Stripe.DeletedCustomer
      subscription: session.subscription as string | null, // subscription can be string or Stripe.Subscription
    };

    // Vérifier si la session est complétée et mettre à jour l'abonnement dans Supabase
    if (session.status === 'complete') {
      // Récupérer les informations de l'abonnement
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string).catch((stripeError: unknown) => {
        console.error('Stripe Error retrieving subscription:', stripeError)
        let isResourceMissing = false;
        if (typeof stripeError === 'object' && stripeError !== null && 'code' in stripeError) {
            const potentialStripeError = stripeError as { code?: unknown };
            if (typeof potentialStripeError.code === 'string' && potentialStripeError.code === 'resource_missing'){
                isResourceMissing = true;
            }
        }
        if (isResourceMissing){
            console.error('Subscription not found in Stripe');
            throw new Error("Subscription not found in Stripe") // This will be caught by the main handler
        }

        // If not resource_missing, construct a generic error from stripeError
        let subErrorMessage = 'Failed to retrieve subscription details from Stripe';
        let subErrorCode: string | undefined = undefined;

        if (stripeError instanceof Error) {
            subErrorMessage = stripeError.message;
        }
        if (typeof stripeError === 'object' && stripeError !== null && 'code' in stripeError) {
            const potentialStripeError = stripeError as { code?: unknown };
            if (typeof potentialStripeError.code === 'string') {
                subErrorCode = potentialStripeError.code;
            }
        }
        
        const subscriptionResponseError: ResponseError = {
          error: subErrorMessage,
          code: subErrorCode
        };
        throw subscriptionResponseError; // This will be caught by the main handler
      })

      // Mettre à jour l'abonnement dans Supabase
      const { error: supabaseError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: session.client_reference_id,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          status: subscription.status,
          plan: subscription.metadata.plan || 'pro',
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at: subscription.cancel_at
            ? new Date(subscription.cancel_at * 1000).toISOString()
            : null,
        })

      if (supabaseError) {
        console.error('Supabase Error:', supabaseError)
        const responseError: ResponseError = {
          error: supabaseError.message,
          code: supabaseError.code
        }
        throw responseError
      }
    }

    // Retourner la réponse avec les informations de la session
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: unknown) {
    // Gérer les erreurs
    console.error('Handler Error:', error)
    let errorMessage = 'An unexpected error occurred';
    let errorCode: string | undefined = undefined;

    if (typeof error === 'object' && error !== null) {
        const errObj = error as { message?: unknown; error?: unknown; code?: unknown };
        if (typeof errObj.message === 'string') {
            errorMessage = errObj.message;
        } else if (typeof errObj.error === 'string') { // For our custom ResponseError like objects thrown
            errorMessage = errObj.error;
        }

        if (typeof errObj.code === 'string') {
            errorCode = errObj.code;
        }
    } else if (typeof error === 'string') { // Less common, but possible for errors to be strings
        errorMessage = error;
    }

    const errorResponse: ResponseError = { error: errorMessage, code: errorCode };

    return new Response(
      JSON.stringify(errorResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
};

Deno.serve(handler);