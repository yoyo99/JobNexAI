import { createClient } from 'npm:@supabase/supabase-js@2';
import { pdf } from 'npm:unpdf';

// --- Configuration Validation ---
console.log('Initializing Edge Function: parse-cv-v2');

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const mistralApiKey = Deno.env.get('MISTRAL_API_KEY');

if (!supabaseUrl || !serviceRoleKey || !mistralApiKey) {
  const missing = [
    !supabaseUrl ? 'SUPABASE_URL' : null,
    !serviceRoleKey ? 'SUPABASE_SERVICE_ROLE_KEY' : null,
    !mistralApiKey ? 'MISTRAL_API_KEY' : null,
  ].filter(Boolean).join(', ');
  
  console.error(`FATAL: Missing required environment variables: ${missing}`);
  throw new Error(`Server configuration error: Missing secrets [${missing}]`);
}

console.log('All required secrets are present.');

// Initialize Supabase client
const supabase = createClient(supabaseUrl, serviceRoleKey);



// Liste des origines autorisées
const allowedOrigins = [
  'http://localhost:3000',
  'https://jobnexus.netlify.app',
  'https://*.netlify.app',
  'https://*.supabase.co',
];

// Fonction pour déterminer l'origine autorisée
function getAllowedOrigin(origin: string | null): string {
  if (!origin) return '*'; // En développement ou pour les tests
  
  // Vérifier si l'origine est dans la liste des autorisées
  const allowedOrigin = allowedOrigins.find(allowed => 
    origin === allowed || 
    (allowed.includes('*') && origin.endsWith(allowed.split('*')[1]))
  );
  
  return allowedOrigin || allowedOrigins[0]; // Retourne la première origine autorisée par défaut
}

// En-têtes CORS dynamiques
const getCorsHeaders = (origin: string | null) => ({
  'Access-Control-Allow-Origin': getAllowedOrigin(origin),
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET, PUT, DELETE',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-edge-version, x-requested-with',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400', // 24 hours
});

Deno.serve(async (req) => {
  // Récupérer l'origine de la requête
  const origin = req.headers.get('origin');
  console.log('Request origin:', origin);
  
  // Créer les en-têtes CORS dynamiques
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request with headers:', corsHeaders);
    return new Response('ok', { 
      headers: corsHeaders,
      status: 204 
    });
  }
  
  // Log request details
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });
  
  console.log('Request received:', {
    method: req.method,
    url: req.url,
    headers
  });

  // Fonction utilitaire pour renvoyer une réponse avec CORS
  const jsonResponse = (data: any, status = 200) => 
    new Response(JSON.stringify(data), {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });

  const errorResponse = (message: string, status = 400) =>
    jsonResponse({ error: message }, status);

  // Vérifier que la méthode est POST
  if (req.method !== 'POST') {
    return errorResponse('Method not allowed. Only POST requests are accepted.', 405);
  }

  try {
    console.log('=== Starting parse-cv-v2 function ===');
    // --- TEMPORARY TEST CODE ---
    console.log('parse-cv-v2 invoked for a test.');
    // On log le corps de la requête pour voir ce qui arrive
    const body = await req.json();
    console.log('Request body:', body);

    return new Response(JSON.stringify({ success: true, message: 'Test successful' }), {
      headers: { ...getCorsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
      status: 200,
    });
    // --- END OF TEMPORARY TEST CODE ---
  } catch (error) {
    console.error('Error processing CV:', error);
    return errorResponse(`Failed to process CV: ${error.message}`, 500);
  }
});
