import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { verify } from 'https://deno.land/x/djwt@v2.9.1/mod.ts';
import { type Payload } from 'https://deno.land/x/djwt@v2.9.1/mod.ts';

// Initialisation de Stripe avec la clé secrète
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);
// Initialisation de Supabase avec l'URL et la clé de service
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Récupération de la clé secrète JWT depuis les variables d'environnement
const JWT_SECRET = Deno.env.get('JWT_SECRET');

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
const validateInput = (data: any): data is InputData => {
    // Vérifier si les données sont bien un objet et non null
    if (!data || typeof data !== 'object') {
        console.error("validateInput : Invalid data type or null")
        return false;
    }
    // Vérifier si sessionId est présent et est une chaîne de caractères
    if (typeof data.sessionId !== 'string') {
        console.error("validateInput : sessionId is not a string")
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
  const payload: Payload = await verify(token, JWT_SECRET, 'HS512').catch((error) => {
    console.error('JWT Verification Error:', error)
    throw new Error('Invalid token')
  })
  const userId = payload.sub
  if (!userId) {
    throw new Error('User ID not found in token')
  }
  return userId
}

// Fonction principale pour gérer les requêtes
async function handler(req: Request): Promise<Response> {
  // Gérer la requête OPTIONS pour CORS
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // Authentification de l'utilisateur
    const userId = await authenticate(req).catch((error) => {
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
    const session = await stripe.checkout.sessions.retrieve(sessionId).catch((stripeError) => {
      console.error('Stripe Error:', stripeError)
      const responseError: ResponseError = {
        error: stripeError.message,
        code: stripeError.code
      }
    return false
      throw responseError
    })
    
    const response: SessionStatusResponse = {
      status: session.status,
      customer: session.customer,
      subscription: session.subscription,
    }

    // Vérifier si la session est complétée et mettre à jour l'abonnement dans Supabase
    if (session.status === 'complete') {
      // Récupérer les informations de l'abonnement
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string).catch((stripeError) => {
        console.error('Stripe Error:', stripeError)
        if (stripeError.code === 'resource_missing'){
            console.error('Subscription not found in Stripe');
            throw new Error("Subscription not found in Stripe")
        }
        const responseError: ResponseError = {
          error: stripeError.message,
          code: stripeError.code
        }
        throw responseError
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
  } catch (error) {
    // Gérer les erreurs
    console.error('Error:', error)
    const errorResponse: ResponseError = { error: error.message, code: error.code }

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