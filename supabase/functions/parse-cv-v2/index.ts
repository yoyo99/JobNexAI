import { createClient } from 'npm:@supabase/supabase-js@2';
import { getDocument } from 'https://esm.sh/unpdf/pdfjs';

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
    return new Response(null, { status: 204, headers: corsHeaders });
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
    if (!cvPath || !cvId) {
      throw new Error('Missing cvPath or cvId in request body');
    }

    const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    // 1. Download the CV from Supabase Storage
    console.log('Step 1: Downloading CV from path:', cvPath);
    const { data: fileBlob, error: downloadError } = await supabaseAdmin.storage
      .from('cvs')
      .download(cvPath);

    if (downloadError) {
      console.error('Download error:', downloadError);
      throw new Error(`Failed to download CV from Supabase Storage: ${downloadError.message}`);
    }
    if (!fileBlob) {
      throw new Error('CV file not found or empty.');
    }
    console.log('Step 1: CV downloaded successfully');

    // 2. Parse the PDF content using unpdf
    console.log('Step 2: Parsing PDF buffer with getDocument...');
    const doc = await getDocument(fileBlob.arrayBuffer()).promise;
    let cvText = '';
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      cvText += pageText + '\n'; // Ajouter un saut de ligne entre les pages
    }
    console.log(`PDF parsed successfully. Total pages: ${doc.numPages}`);

    if (!cvText || cvText.trim().length < 50) {
      console.warn('Warning: Extracted text is very short or empty. Length:', cvText.trim().length);
    }
    console.log('Step 2: PDF parsed successfully. Text length:', cvText.length);

    // 3. Prepare the prompt for OpenAI
    const prompt = `Analyze the following CV and extract the information in JSON format. The fields are: "firstName", "lastName", "email", "phoneNumber", "address", "summary", "skills" (as an array of strings), "experience" (as an array of objects with "title", "company", "period", "description"), and "education" (as an array of objects with "degree", "school", "period"). Here is the CV text: \n\n${cvText}`;

    // 4. Call Mistral AI API
    console.log('Step 3: Calling Mistral AI API...');
    const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('MISTRAL_API_KEY')}`,
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        response_format: { type: 'json_object' },
      }),
    });

    if (!mistralResponse.ok) {
      const errorBody = await mistralResponse.text();
      console.error('Mistral AI API error:', errorBody);
      throw new Error(`Mistral AI API request failed with status ${mistralResponse.status}`);
    }

    const mistralData = await mistralResponse.json();
    const analysisResult = JSON.parse(mistralData.choices[0].message.content);
    console.log('Step 3: Mistral AI analysis successful.');

    // 5. Update the database with the analysis result
    console.log('Step 4: Updating database with analysis result...');
    const { error: updateError } = await supabaseAdmin
      .from('cvs')
      .update({ analysis: analysisResult, status: 'analyzed' })
      .eq('id', cvId);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw new Error(`Failed to update CV in database: ${updateError.message}`);
    }
    console.log('Step 4: Database updated successfully.');

    return new Response(JSON.stringify({ success: true, cvId }), {
      headers: { ...getCorsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Fatal error in parse-cv-v2:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...getCorsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
