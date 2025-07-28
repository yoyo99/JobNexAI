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
    const { cvPath, cvId } = await req.json();
    console.log('Received cvId:', cvId, 'and cvPath:', cvPath);

    // 1. Download the CV file from Supabase Storage
    console.log('Step 1: Downloading CV from storage...');
    const { data: fileBlob, error: downloadError } = await supabase.storage
      .from('cvs')
      .download(cvPath);

    if (downloadError) {
      console.error('Download error:', downloadError);
      throw new Error(`Failed to download CV: ${downloadError.message}`);
    }
    console.log('Step 1: CV downloaded successfully');

    // 2. Parse the PDF content using unpdf
    console.log('Step 2: Parsing PDF content with unpdf');
    const pdfBuffer = await fileBlob.arrayBuffer();
    const { text: cvText } = await pdf(pdfBuffer);

    if (!cvText || cvText.trim().length < 50) {
      console.warn('Warning: Extracted text is very short or empty. Length:', cvText.trim().length);
    }

    console.log('Step 2: PDF parsed successfully. Text length:', cvText.length);

    // 3. Prepare the prompt for OpenAI
    console.log('Step 3: Preparing prompt...');
    const prompt = `
      Based on the following CV text, extract the information and return it as a structured JSON object.
      The JSON object should have the following keys: "contact_info", "summary", "experience", "education", "skills".
      - "experience" and "education" should be arrays of objects, each with "title", "company" (or "institution"), "dates", and "description".
      - "skills" should be an array of strings.

      CV Text:
      ---
      ${cvText}
      ---
    `;
    console.log('Step 3: Prompt prepared');

    // 4. Call Mistral AI to get structured data
    console.log('Step 4: Calling Mistral API...');
    const mistralApiKey = Deno.env.get('MISTRAL_API_KEY');
    if (!mistralApiKey) {
      console.error('MISTRAL_API_KEY is missing');
      throw new Error('MISTRAL_API_KEY is missing');
    }
    console.log('Mistral API key is present');
    
    const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mistralApiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: cvText },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    console.log('Mistral API response status:', mistralResponse.status);
    if (!mistralResponse.ok) {
      const errorBody = await mistralResponse.text();
      console.error('Mistral API error:', errorBody);
      throw new Error(`Mistral API error: ${mistralResponse.status} ${errorBody}`);
    }

    const completion = await mistralResponse.json();
    console.log('Mistral API response received');
    const structuredData = JSON.parse(completion.choices[0].message.content);
    console.log('Step 4: Mistral API call successful');

    // 5. Update the user_cvs table with the structured data
    console.log('Step 5: Updating database...');
    const { error: updateError } = await supabase
      .from('user_cvs')
      .update({ cv_data: structuredData, status: 'parsed' })
      .eq('id', cvId);

    if (updateError) {
      console.error('Database update error:', updateError);
      await supabase.from('user_cvs').update({ status: 'failed_parsing' }).eq('id', cvId);
      throw new Error(`Failed to update CV record: ${updateError.message}`);
    }
    console.log('Step 5: Database updated successfully');

    console.log('=== parse-cv-v2 function completed successfully ===');
    return jsonResponse({ 
      message: 'CV parsed and data stored successfully.',
      structuredData 
    });

  } catch (error) {
    console.error('Error processing CV:', error);
    return errorResponse(`Failed to process CV: ${error.message}`, 500);
  }
});
