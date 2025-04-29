
import { createClient } from '@supabase/supabase-js';
import { verify, JwtPayload } from 'jsonwebtoken';

interface InputData {
  sessionId: string;
}










const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SessionStatusResponse {
  status: string
  customer?: string
  subscription?: string
}

interface ResponseError {
  error: string
  code?: string
}

// Fonction pour valider les données d'entrée
const validateInput = (data: any): data is InputData => {
  return typeof data === 'object' && typeof data.sessionId === 'string';
};

export const handler = async (event: any, context: any) => {
  // Initialisation Stripe et Supabase dans le handler
  const { default: Stripe } = await import('stripe');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'JWT_SECRET is not defined' }),
    };
  }

  try {
    // Authentification de l'utilisateur
    const authHeader = event.headers.Authorization;
    if (!authHeader) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Authorization header is missing' }),
      };
    }

    const token = authHeader.split(' ')[1];

    // Vérification du JWT
    let payload: JwtPayload;
    try {
      payload = verify(token, JWT_SECRET) as JwtPayload;
    } catch (e) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid token', code: 'invalid_token' }),
      };
    }

    const userId = payload.sub;
    if (!userId) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'User ID not found in token' }),
      };
    }

    // Récupérer les données de la requête
    const data = JSON.parse(event.body);

    // Valider les données d'entrée
    if (!validateInput(data)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid input data', code: 'invalid_input' }),
      };
    }

    const { sessionId } = data;

    // Récupérer les informations de la session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const response: SessionStatusResponse = {
      status: session.status ?? '',
      customer: typeof session.customer === 'string' ? session.customer : undefined,
      subscription: typeof session.subscription === 'string' ? session.subscription : undefined,
    };

    // Vérifier si la session est complétée et mettre à jour l'abonnement dans Supabase
    if (session.status === 'complete') {
      // Récupérer les informations de l'abonnement
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

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
        });

      if (supabaseError) {
        return {
          statusCode: 500,
          headers: corsHeaders,
          body: JSON.stringify({ error: supabaseError.message, code: supabaseError.code }),
        };
      }
    }

    // Retourner la réponse avec les informations de la session
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(response),
    };
  } catch (error) {
    // Gérer les erreurs
    console.error('Error:', error);
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message, code: error.code }),
    };
  }
};