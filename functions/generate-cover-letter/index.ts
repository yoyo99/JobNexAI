import { Handler } from '@netlify/functions';
const OpenAI = require('openai');
const MistralClient = require('@mistralai/mistralai');

const openaiApiKey = process.env.OPENAI_API_KEY;
const mistralApiKey = process.env.MISTRAL_API_KEY;

if (!openaiApiKey) {
  throw new Error('La clé API OpenAI (OPENAI_API_KEY) n\'est pas configurée.');
}
if (!mistralApiKey) {
  throw new Error('La clé API Mistral (MISTRAL_API_KEY) n\'est pas configurée.');
}

const openai = new OpenAI({ apiKey: openaiApiKey });
const mistral = new MistralClient(mistralApiKey);

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { cv, jobDescription, language, tone, provider } = JSON.parse(event.body || '{}');

    if (!cv || !jobDescription || !language || !tone || !provider) {
      return { statusCode: 400, body: 'Paramètres invalides.' };
    }

    const systemPrompt = `En tant qu'expert en recrutement, rédige une lettre de motivation percutante et personnalisée en ${language}. Le ton doit être ${tone}. Utilise les informations du CV et de la description de poste ci-dessous. La lettre doit être concise, mettre en avant les expériences pertinentes et montrer un réel intérêt pour le poste. Ne réponds qu'avec le texte de la lettre.`;

    const userMessage = `CV :\n${JSON.stringify(cv, null, 2)}\n\nDescription du poste :\n${jobDescription}`;

    let letter: string | null = null;

    if (provider === 'openai') {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      });
      letter = response.choices[0].message.content;
    } else if (provider === 'mistral') {
      const response = await mistral.chat.complete({
        model: 'mistral-small-latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        maxTokens: 1024,
      });
      letter = response.choices[0].message.content;
    } else {
      return { statusCode: 400, body: 'Fournisseur non supporté.' };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ letter }),
    };
  } catch (error) {
    console.error('Erreur dans la fonction generate-cover-letter:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur interne du serveur.';
    return {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};

export { handler };
