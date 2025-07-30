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




import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
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

  try {
    console.log('DEBUG: Entering main try block.');
    console.log('DEBUG: Awaiting req.json()...');
    const { cvPath, cvId } = await req.json();
    console.log('DEBUG: req.json() complete.', { cvPath, cvId });

    if (!cvPath || !cvId) {
      throw new Error('Missing cvPath or cvId in request body');
    }

    const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    // 1. Download the CV from Supabase Storage
    console.log('DEBUG: Awaiting storage.download()...');
    const { data: fileBlob, error: downloadError } = await supabaseAdmin.storage
      .from('cvs')
      .download(cvPath);
    console.log('DEBUG: storage.download() complete.');

    if (downloadError) {
      console.error('Download error:', downloadError);
      throw new Error(`Failed to download CV from Supabase Storage: ${downloadError.message}`);
    }
    if (!fileBlob) {
      throw new Error('CV file not found or empty.');
    }
    console.log('Step 1: CV downloaded successfully');

    // 2. Parse the PDF content using unpdf
    console.log('DEBUG: Awaiting fileBlob.arrayBuffer()...');
    const buffer = await fileBlob.arrayBuffer();
    console.log('DEBUG: fileBlob.arrayBuffer() complete.');

    console.log('DEBUG: Awaiting getDocument(buffer)...');
    const doc = await getDocument(buffer).promise;
    console.log('DEBUG: getDocument() complete.');

    let cvText = '';
    for (let i = 1; i <= doc.numPages; i++) {
      console.log(`DEBUG: Awaiting getPage(${i})...`);
      const page = await doc.getPage(i);
      console.log(`DEBUG: getPage(${i}) complete.`);

      console.log(`DEBUG: Awaiting getTextContent() for page ${i}...`);
      const textContent = await page.getTextContent();
      console.log(`DEBUG: getTextContent() for page ${i} complete.`);

      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      cvText += pageText + '\n';
    }
    console.log(`PDF parsed successfully. Total pages: ${doc.numPages}`);

    if (!cvText || cvText.trim().length < 50) {
      console.warn('Warning: Extracted text is very short or empty. Length:', cvText.trim().length);
    }
    console.log('Step 2: PDF parsed successfully. Text length:', cvText.length);

    // 3. Prepare the prompt for OpenAI
    const prompt = `Analyze the following CV and extract the information in JSON format. The fields are: "firstName", "lastName", "email", "phoneNumber", "address", "summary", "skills" (as an array of strings), "experience" (as an array of objects with "title", "company", "period", "description"), and "education" (as an array of objects with "degree", "school", "period"). Here is the CV text: \n\n${cvText}`;

    // 4. Call Mistral AI API
    console.log('DEBUG: Awaiting fetch() to Mistral AI...');
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

    console.log('DEBUG: fetch() to Mistral AI complete.');

    console.log('DEBUG: Awaiting mistralResponse.json()...');
    const mistralData = await mistralResponse.json();
    console.log('DEBUG: mistralResponse.json() complete.');

    const analysisResult = JSON.parse(mistralData.choices[0].message.content);
    console.log('Step 3: Mistral AI analysis successful.');

    // 5. Update the database with the analysis result
    console.log('DEBUG: Awaiting database update...');
    const { error: updateError } = await supabaseAdmin
      .from('cvs')
      .update({ analysis: analysisResult, status: 'analyzed' })
      .eq('id', cvId);
    console.log('DEBUG: Database update complete.');

    if (updateError) {
      console.error('Database update error:', updateError);
      throw new Error(`Failed to update CV in database: ${updateError.message}`);
    }
    console.log('Step 4: Database updated successfully.');

    return new Response(JSON.stringify({ success: true, cvId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Fatal error in parse-cv-v2:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
