// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// supabase/functions/generate-cover-letter/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

import { corsHeaders } from '../_shared/cors.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // JWT Authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Missing or invalid Authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: user, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid JWT token: ' + (authError?.message || 'User not found'));
    }

    const {
      cvText,
      jobTitle,
      companyName,
      jobDescription,
      customInstructions,
      targetLanguage
    } = await req.json();

    if (!cvText || !jobTitle || !companyName || !jobDescription || !targetLanguage) {
      throw new Error('Missing required fields: cvText, jobTitle, companyName, jobDescription, targetLanguage.');
    }

    const mistralApiKey = Deno.env.get('MISTRAL_API_KEY');
    if (!mistralApiKey) {
      throw new Error('MISTRAL_API_KEY is not set in environment variables.');
    }

    const systemMessage = `You are an expert cover letter writer. Your task is to generate a compelling and professional cover letter in ${targetLanguage}.`;
    
    let userPrompt = `
      Based on the following CV content and job offer details, please write a cover letter.
      The language for the cover letter must be ${targetLanguage}.

      CV Content:
      """
      ${cvText}
      """

      Job Offer Details:
      """
      Job Title: ${jobTitle}
      Company: ${companyName}
      Job Description: ${jobDescription}
      """
    `;

    if (customInstructions) {
      userPrompt += `
        Please also follow these specific instructions:
        """
        ${customInstructions}
        """
      `;
    }

    userPrompt += `
      The cover letter should be tailored to the job description, highlighting relevant skills and experiences from the CV.
      Ensure the tone is professional.
      Generate only the text of the cover letter itself. Do not include any surrounding text like "Here is your cover letter:" or any explanations.
    `;
    
    console.log("Sending prompt to Mistral AI...");

    const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mistralApiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!mistralResponse.ok) {
      const errorBody = await mistralResponse.text();
      throw new Error(`Mistral API error: ${mistralResponse.status} ${errorBody}`);
    }

    const completion = await mistralResponse.json();
    const generatedLetter = completion.choices[0]?.message?.content?.trim();

    if (!generatedLetter) {
      throw new Error('AI failed to generate a cover letter content.');
    }
    
    console.log("Cover letter generated successfully by AI.");

    return new Response(
      JSON.stringify({ coverLetterContent: generatedLetter }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (e) {
    console.error('Error in generate-cover-letter function:', e);
    let errorMessage = 'An unexpected error occurred while generating the cover letter.';
    let errorStack: string | undefined = undefined;

    if (e instanceof Error) {
      errorMessage = e.message;
      errorStack = e.stack;
    } else if (typeof e === 'string') {
      errorMessage = e;
    } else {
      try {
        errorMessage = JSON.stringify(e);
      } catch {
        // If stringify fails, stick to the generic message
      }
    }

    if (errorStack) {
        console.error(errorStack);
    }

    const isInputError = errorMessage === 'MISTRAL_API_KEY is not set in environment variables.' || errorMessage.startsWith('Missing required fields');

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: isInputError ? 400 : 500
      }
    );
  }
});

/*
Variables d'environnement à configurer dans Supabase Dashboard > Edge Functions > generate-cover-letter > Settings:
- MISTRAL_API_KEY: Votre clé API Mistral.

Pour invoquer localement (après supabase start) :
  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-cover-letter' \
    --header 'Authorization: Bearer VOTRE_SUPABASE_ANON_KEY_OU_USER_TOKEN' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "cvText": "Contenu du CV ici...",
        "jobTitle": "Développeur Frontend",
        "companyName": "Tech Solutions Inc.",
        "jobDescription": "Description du poste ici...",
        "customInstructions": "Mettre l\'accent sur l\'expérience React.",
        "targetLanguage": "fr"
    }'
*/
