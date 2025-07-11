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
    const { text, language } = JSON.parse(event.body || '{}');

    if (!text || !language) {
      return { statusCode: 400, body: 'Paramètres invalides : \'text\' et \'language\' sont requis.' };
    }

    const systemPrompt = `Tu es un expert en ressources humaines et un coach en carrière spécialisé dans l'optimisation de CV pour le marché francophone. Ton objectif est d'améliorer la clarté, l'impact et le professionnalisme du texte fourni. Instructions : 1. Corrige les fautes de grammaire et d'orthographe. 2. Reformule les phrases pour qu'elles soient plus percutantes et professionnelles, en utilisant un langage orienté vers l'action et les résultats (par exemple, transforme "responsable de" en "j'ai géré", "j'ai accompli"). 3. Assure-toi que le ton est adapté à un contexte professionnel en ${language}. 4. Ne fournis que le texte optimisé, sans aucune introduction, commentaire ou phrase supplémentaire.`;

    const chatResponse = await mistral.chat.complete({
      model: 'mistral-small-latest',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
      temperature: 0.6,
      maxTokens: 1000,
    });

    const messageContent = chatResponse.choices[0].message.content;
    if (!messageContent) {
        return { statusCode: 500, body: 'La réponse de l\'IA est vide.' };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optimizedText: messageContent.trim() }),
    };
  } catch (error) {
    console.error('Erreur dans la fonction optimize-text:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur interne du serveur.';
    return {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};

export { handler };
