// Import Stripe library
import { Stripe } from "npm:stripe@14.0.0";
// Stripe API client
import { verify } from "https://deno.land/x/djwt@v2.9.1/mod.ts"; // Pour la vérification JWT

// Définition directe des en-têtes CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Ou votre URL frontend spécifique
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS', // Ajout de OPTIONS et POST
};

// Define an interface for the JWT data to specify the structure
interface JWTData {
  sub: string
}

// Create a new instance of the Stripe API client using the secret key from environment variables
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
})


// Define an interface for the response data of the createPortalSession function
interface createPortalSessionResponse {
  url?: string
  error?: string
  code?: number
}

// Function to validate the input 'customerId'
function validateInput(customerId: string): void {
  // Check if 'customerId' is missing
  if (!customerId) {
    throw { error: 'Missing customerId', code: 400 }
  }
  // Check if 'customerId' is not a string
  if (typeof customerId !== 'string') {
    throw { error: 'Invalid customerId', code: 400 }
  }
}


// Main Deno server function
Deno.serve(async (req) => {
  console.log(`[create-portal-session] Received ${req.method} request for ${req.url}`); // LOG AJOUTÉ
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('[create-portal-session] Handling OPTIONS request'); // LOG AJOUTÉ
    return new Response('ok', { headers: corsHeaders });
  }

  let userIdFromAuth: string;
  try {
    console.log('[create-portal-session] Attempting JWT authentication directly');
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw { message: 'Missing or invalid Authorization header', code: 401 };
    }
    const token = authHeader.split(' ')[1];
    const currentJwtSecret = Deno.env.get('JWT_SECRET');

    if (!currentJwtSecret) {
      console.error('[create-portal-session] JWT_SECRET is not set in environment variables.');
      throw { message: 'Internal server error: JWT secret not configured.', code: 500 };
    }

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(currentJwtSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const payload = await verify(token, key);

    if (!payload || !payload.sub) {
      throw { message: 'Invalid token payload (missing sub)', code: 401 };
    }
    userIdFromAuth = payload.sub as string;
    console.log(`[create-portal-session] JWT Authentication successful for user ID: ${userIdFromAuth}`);

  } catch (e) {
    const err = e as { message?: string; code?: number; stack?: string, name?: string };
    const errorMessage = err.message || 'Authentication error';
    // Si l'erreur est un objet Error de djwt, son message peut être plus précis
    // Par exemple, si djwt.verify échoue, e.name pourrait être 'Error' et e.message contient la raison.
    console.error('[create-portal-session] JWT Authentication failed:', {
      errorMessage: errorMessage,
      errorCode: err.code || 401,
      errorName: err.name, 
      originalErrorObjectString: String(e) // Pour voir la structure de l'erreur brute
    });
    return new Response(JSON.stringify({ error: errorMessage, code: err.code || 401 }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: err.code || 401 });
  }

  try {
    console.log('[create-portal-session] Attempting to parse request body'); // LOG AJOUTÉ
    const { customerId }: { customerId: string } = await req.json();
    console.log(`[create-portal-session] Parsed customerId: ${customerId}`); // LOG AJOUTÉ
    
    validateInput(customerId);
    console.log('[create-portal-session] CustomerId validation successful'); // LOG AJOUTÉ

    console.log(`[create-portal-session] Creating Stripe billing portal session for customerId: ${customerId}`); // LOG AJOUTÉ
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${req.headers.get('origin')}/billing`,
    });
    console.log(`[create-portal-session] Stripe session created successfully. URL: ${session.url}`); // LOG AJOUTÉ

    return new Response(
      JSON.stringify({ url: session.url } as createPortalSessionResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (e) {
    const err = e as { error?: string; message?: string; code?: number; stack?: string };
    const message = err.error || err.message || 'Internal Server Error';
    const code = err.code || 500;
    console.error('[create-portal-session] Error during portal session creation:', {
        errorMessage: message,
        errorCode: code,
        originalError: err, // Log l'objet erreur complet
        stack: err.stack // Log la pile d'appels si disponible
    }); // LOG AMÉLIORÉ
    return new Response(
      JSON.stringify({ error: message, code } as createPortalSessionResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: code,
      }
    );
  }
})