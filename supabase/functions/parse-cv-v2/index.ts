import { createClient } from 'npm:@supabase/supabase-js@2';

import pdf from 'https://esm.sh/pdf-parse@1.1.1';

// Initialize Supabase and OpenAI clients
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);



const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-edge-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
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

    // 2. Parse the PDF content to extract text
    console.log('Step 2: Parsing PDF content...');
    const fileBuffer = await fileBlob.arrayBuffer();
    console.log('File buffer size:', fileBuffer.byteLength);
    const pdfData = await pdf(fileBuffer);
    const cvText = pdfData.text;
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
    return new Response(JSON.stringify({ 
      message: 'CV parsed and data stored successfully.',
      structuredData 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('=== Error in parse-cv-v2 function ===', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
