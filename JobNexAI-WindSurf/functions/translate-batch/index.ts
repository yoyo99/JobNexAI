import { Handler } from '@netlify/functions';
const MistralClient = require('@mistralai/mistralai');

const apiKey = process.env.MISTRAL_API_KEY;

if (!apiKey) {
  throw new Error('La clé API Mistral (MISTRAL_API_KEY) n\'est pas configurée.');
}

const mistral = new MistralClient(apiKey);

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { texts, targetLanguage } = JSON.parse(event.body || '{}');

    if (!texts || !Array.isArray(texts) || texts.length === 0 || !targetLanguage) {
      return { statusCode: 400, body: 'Paramètres invalides : \'texts\' (tableau non vide) et \'targetLanguage\' sont requis.' };
    }

    const systemPrompt = `Tu es un expert en traduction multilingue spécialisé dans les CV professionnels. Traduis le tableau de textes JSON suivant en ${targetLanguage}. Réponds uniquement avec un tableau JSON contenant les traductions, en conservant exactement le même ordre et le même nombre d'éléments. La structure de ta réponse doit être : ["traduction 1", "traduction 2", ...].`;
    const userMessage = JSON.stringify(texts);

    const chatResponse = await mistral.chat.complete({
      model: 'mistral-small-latest',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      responseFormat: { type: 'json_object' },
    });

    const content = chatResponse.choices[0].message.content;
    if (typeof content !== 'string') {
      throw new Error("La réponse de l'IA est vide ou dans un format inattendu.");
    }

    const parsedContent = JSON.parse(content);
    const translations = Array.isArray(parsedContent) 
      ? parsedContent 
      : Object.values(parsedContent).find(Array.isArray);

    if (!translations || !Array.isArray(translations) || translations.length !== texts.length) {
      throw new Error("La réponse de l'IA ne correspond pas au format attendu.");
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(translations),
    };
  } catch (error) {
    let errorMessage = 'Erreur interne du serveur';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('Erreur lors du traitement de la traduction par lot:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};

export { handler };
