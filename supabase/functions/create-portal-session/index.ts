// Import Stripe library
import Stripe from 'npm:stripe@14.0.0'
// Import the verify function from the djwt library to handle JWT verification
import { verify } from 'https://deno.land/x/djwt@v2.9.1/mod.ts'

// Define an interface for the JWT data to specify the structure
interface JWTData {
  sub: string
}

// Create a new instance of the Stripe API client using the secret key from environment variables
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
})
// Retrieve the JWT secret key from the environment variables
const jwtSecret = Deno.env.get('JWT_SECRET')!

// Define the CORS headers for the HTTP responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

// Middleware function to authenticate the user
async function authenticate(req: Request): Promise<string> {
  // Get the Authorization header
  const authHeader = req.headers.get('Authorization')
  // Check if Authorization header is missing
  if (!authHeader) {
    throw { error: 'Missing Authorization header', code: 401 }
  }
  // Extract the token from the Authorization header
  const token = authHeader.split(' ')[1]
  // Verify the token
  const jwtData = await verify(token, jwtSecret, 'HS512') as JWTData
  // Check if the token is valid
  if (!jwtData.sub) {
    throw { error: 'Invalid token', code: 401 }
  }
  // Return the user id
  return jwtData.sub
}

// Main Deno server function
Deno.serve(async (req) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Try to authenticate the user
  try {
    await authenticate(req)
  } catch (e) { // 'error' renommé en 'e' pour éviter confusion
    const err = e as { error?: string; message?: string; code?: number }; // Assertion de type
    return new Response(JSON.stringify({ error: err.error || err.message || 'Invalid Token', code: err.code || 401 }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: err.code || 401 });
  }

  try {
    const { customerId }: { customerId: string } = await req.json()
    validateInput(customerId)

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${req.headers.get('origin')}/billing`, // MODIFIÉ ICI
    })

    return new Response(
      JSON.stringify({ url: session.url } as createPortalSessionResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (e) { // 'error' renommé en 'e'
    const err = e as { error?: string; message?: string; code?: number }; // Assertion de type
    // Handle any errors that occur during the process
    const message = err.error || err.message || 'Internal Server Error';
    const code = err.code || 500;
    console.error('Error in create-portal-session:', message, e); // Log l'erreur originale 'e' pour plus de détails
    // Return an error response
    return new Response(
      JSON.stringify({ error: message, code } as createPortalSessionResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: code,
      }
    );
  }
})