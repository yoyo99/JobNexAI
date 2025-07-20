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
    const { text, targetLanguage } = JSON.parse(event.body || '{}');

    if (!text || !targetLanguage) {
      return { statusCode: 400, body: 'Paramètres invalides : \'text\' et \'targetLanguage\' sont requis.' };
    }

    const systemPrompt = `Tu es un traducteur expert spécialisé dans les documents professionnels et les CV. Ta tâche est de traduire le texte fourni vers la langue suivante : ${targetLanguage}. Instructions : 1. Conserve le formatage et la structure d'origine. 2. Assure une traduction précise et naturelle, en adaptant les termes au contexte professionnel de la langue cible. 3. La réponse doit être uniquement le texte traduit, sans aucune introduction ou phrase supplémentaire.`;

    const chatResponse = await mistral.chat.complete({
      model: 'mistral-small-latest',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
      temperature: 0.2,
      maxTokens: 1500,
    });

    const messageContent = chatResponse.choices[0].message.content;
    if (!messageContent) {
        return { statusCode: 500, body: 'La réponse de l\'IA est vide.' };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ translatedText: messageContent.trim() }),
    };
  } catch (error) {
    console.error('Erreur dans la fonction translate-text:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur interne du serveur.';
    return {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};

export { handler };
