// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// supabase/functions/generate-cover-letter/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import OpenAI from 'https://deno.land/x/openai@v4.24.1/mod.ts'; // Vérifiez la dernière version compatible

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Ajustez pour la production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
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

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables.');
    }

    const openai = new OpenAI({ apiKey: openAIApiKey });

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
    
    console.log("Sending prompt to OpenAI...");

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", 
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7, 
      max_tokens: 1024, 
    });

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

    const isInputError = errorMessage === 'OPENAI_API_KEY is not set in environment variables.' || errorMessage.startsWith('Missing required fields');

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
- OPENAI_API_KEY: Votre clé API OpenAI.

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
