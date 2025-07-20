import { Handler } from '@netlify/functions';
const MistralClient = require('@mistralai/mistralai');

const mistralApiKey = process.env.MISTRAL_API_KEY;

if (!mistralApiKey) {
  throw new Error('La clé API Mistral (MISTRAL_API_KEY) n\'est pas configurée.');
}

const mistral = new MistralClient(mistralApiKey);

interface JobSearchRequest {
  query: string;
  userProfile?: {
    skills: string[];
    experience: string;
    preferences: string[];
  };
  filters?: {
    location?: string;
    jobType?: string;
    salaryRange?: { min: number; max: number };
    remote?: boolean;
  };
}

interface OptimizedSearch {
  enhancedQuery: string;
  keywords: string[];
  synonyms: string[];
  excludeTerms: string[];
  prioritySkills: string[];
  searchStrategy: 'broad' | 'focused' | 'hybrid';
}

// Headers CORS cohérents
const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { query, userProfile, filters }: JobSearchRequest = JSON.parse(event.body || '{}');

    if (!query) {
      return { 
        statusCode: 400, 
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Query is required' })
      };
    }

    // Construire le prompt pour Mistral
    const systemPrompt = `Tu es un expert en recherche d'emploi et en IA. Ton rôle est d'optimiser les requêtes de recherche d'emploi pour maximiser la pertinence des résultats.

Analyse la requête utilisateur et génère une stratégie de recherche optimisée.

Contexte utilisateur:
- Compétences: ${userProfile?.skills?.join(', ') || 'Non spécifiées'}
- Expérience: ${userProfile?.experience || 'Non spécifiée'}
- Préférences: ${userProfile?.preferences?.join(', ') || 'Non spécifiées'}

Filtres:
- Localisation: ${filters?.location || 'Toute localisation'}
- Type de poste: ${filters?.jobType || 'Tous types'}
- Télétravail: ${filters?.remote ? 'Oui' : 'Non spécifié'}
- Salaire: ${filters?.salaryRange ? `${filters.salaryRange.min}-${filters.salaryRange.max}€` : 'Non spécifié'}

Réponds UNIQUEMENT avec un JSON valide contenant:
{
  "enhancedQuery": "requête optimisée et enrichie",
  "keywords": ["mot-clé1", "mot-clé2", ...],
  "synonyms": ["synonyme1", "synonyme2", ...],
  "excludeTerms": ["terme-à-exclure1", ...],
  "prioritySkills": ["compétence-prioritaire1", ...],
  "searchStrategy": "broad|focused|hybrid"
}`;

    const userPrompt = `Requête utilisateur: "${query}"

Optimise cette recherche d'emploi en tenant compte du profil utilisateur et des filtres.`;

    // Appel à Mistral
    const response = await mistral.chat({
      model: 'mistral-small-latest',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    const aiResponse = response.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('Pas de réponse de Mistral AI');
    }

    // Parser la réponse JSON
    let optimizedSearch: OptimizedSearch;
    try {
      optimizedSearch = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Erreur parsing JSON:', aiResponse);
      // Fallback en cas d'erreur de parsing
      optimizedSearch = {
        enhancedQuery: query,
        keywords: query.split(' ').filter(word => word.length > 2),
        synonyms: [],
        excludeTerms: [],
        prioritySkills: userProfile?.skills?.slice(0, 3) || [],
        searchStrategy: 'hybrid'
      };
    }

    // Ajouter des métadonnées
    const result = {
      ...optimizedSearch,
      originalQuery: query,
      timestamp: new Date().toISOString(),
      confidence: calculateConfidence(optimizedSearch, userProfile)
    };

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Erreur dans ai-job-search:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Erreur lors de l\'optimisation de la recherche',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      })
    };
  }
};

// Fonction pour calculer un score de confiance
function calculateConfidence(optimizedSearch: OptimizedSearch, userProfile?: any): number {
  let confidence = 0.5; // Base confidence
  
  // Augmenter la confiance si on a des informations utilisateur
  if (userProfile?.skills?.length > 0) confidence += 0.2;
  if (userProfile?.experience) confidence += 0.1;
  if (optimizedSearch.keywords.length > 2) confidence += 0.1;
  if (optimizedSearch.synonyms.length > 0) confidence += 0.1;
  
  return Math.min(confidence, 1.0);
}

export { handler };
