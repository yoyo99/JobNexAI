import { createClient } from 'npm:@supabase/supabase-js@2';

import pdf from 'https://esm.sh/pdf-parse@1.1.1';

// Initialize Supabase and OpenAI clients
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);



const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { cvPath, cvId } = await req.json();

    // 1. Download the CV file from Supabase Storage
    const { data: fileBlob, error: downloadError } = await supabase.storage
      .from('cvs')
      .download(cvPath);

    if (downloadError) {
      throw new Error(`Failed to download CV: ${downloadError.message}`);
    }

    // 2. Parse the PDF content to extract text
    const fileBuffer = await fileBlob.arrayBuffer();
    const pdfData = await pdf(fileBuffer);
    const cvText = pdfData.text;

    // 3. Prepare the prompt for OpenAI
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

    // 4. Call Mistral AI to get structured data
    const mistralApiKey = Deno.env.get('MISTRAL_API_KEY');
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

    if (!mistralResponse.ok) {
      const errorBody = await mistralResponse.text();
      throw new Error(`Mistral API error: ${mistralResponse.status} ${errorBody}`);
    }

    const completion = await mistralResponse.json();
    const structuredData = JSON.parse(completion.choices[0].message.content);

    // 5. Update the user_cvs table with the structured data
    const { error: updateError } = await supabase
      .from('user_cvs')
      .update({ cv_data: structuredData, status: 'parsed' })
      .eq('id', cvId);

    if (updateError) {
      await supabase.from('user_cvs').update({ status: 'failed_parsing' }).eq('id', cvId);
      throw new Error(`Failed to update CV record: ${updateError.message}`);
    }

    return new Response(JSON.stringify({ 
      message: 'CV parsed and data stored successfully.',
      structuredData 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
