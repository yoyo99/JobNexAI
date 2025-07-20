/**
 * @file Centralized AI Service
 * @description This service manages all interactions with different AI models (OpenAI, Mistral, etc.)
 * for tasks like cover letter generation, CV analysis, and job matching.
 */

import { getUserAISettings as fetchUserSettings, UserAISettingsData } from '../lib/supabase';
import { Mistral } from '@mistralai/mistralai';

// Définition des moteurs d'IA supportés
export type SupportedAI = 'openai' | 'mistral' | 'gemini' | 'claude' | 'cohere' | 'huggingface' | 'internal';

const DEFAULT_ENGINE: SupportedAI = 'openai';

// --- Fonctions de service --- //

/**
 * Récupère les paramètres IA d'un utilisateur depuis Supabase ou retourne des valeurs par défaut.
 * @param userId - L'ID de l'utilisateur (optionnel)
 * @returns Les paramètres IA de l'utilisateur.
 */
const getUserSettings = async (userId?: string): Promise<UserAISettingsData> => {
  if (userId) {
    const settings = await fetchUserSettings(userId);
    if (settings) {
      return settings;
    }
  }
  // Retourne des paramètres par défaut si l'utilisateur n'est pas connecté ou n'a pas de configuration
  return {
    feature_engines: {
      coverLetter: DEFAULT_ENGINE,
      matchScore: 'internal',
    },
    api_keys: {},
  };
};

/**
 * Génère une lettre de motivation en utilisant le moteur IA configuré.
 * @param cv - Le contenu du CV de l'utilisateur.
 * @param jobDescription - La description du poste.
 * @param language - La langue de la lettre.
 * @param tone - Le ton de la lettre.
 * @param userId - L'ID de l'utilisateur pour récupérer ses paramètres.
 * @returns La lettre de motivation générée.
 */
export const generateCoverLetter = async (
  cv: string,
  jobDescription: string,
  language: string,
  tone: string,
  userId?: string
): Promise<string> => {
  const settings = await getUserSettings(userId);
  const engine = settings.feature_engines?.coverLetter || DEFAULT_ENGINE;

  console.log(`Generating cover letter with ${engine}...`);

  try {
    if (engine === 'mistral') {
      return await generateWithMistral(cv, jobDescription, language, tone);
    } else if (engine === 'openai') {
      // TODO: Implémenter OpenAI
      throw new Error('OpenAI non encore implémenté');
    } else {
      // Fallback vers Mistral par défaut
      return await generateWithMistral(cv, jobDescription, language, tone);
    }
  } catch (error) {
    console.error('Erreur lors de la génération de la lettre:', error);
    throw new Error(`Impossible de générer la lettre de motivation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};

/**
 * Génère une lettre de motivation avec l'API Mistral
 */
async function generateWithMistral(
  cv: string,
  jobDescription: string,
  language: string,
  tone: string
): Promise<string> {
  const apiKey = import.meta.env.VITE_MISTRAL_API_KEY || process.env.MISTRAL_API_KEY;
  
  if (!apiKey) {
    throw new Error('Clé API Mistral manquante. Veuillez configurer MISTRAL_API_KEY dans les variables d\'environnement.');
  }

  const mistral = new Mistral({
    apiKey: apiKey,
  });

  const languageMap: Record<string, string> = {
    'fr': 'français',
    'en': 'anglais',
    'es': 'espagnol',
    'de': 'allemand'
  };

  const toneMap: Record<string, string> = {
    'professional': 'professionnel et formel',
    'conversational': 'conversationnel et accessible',
    'enthusiastic': 'enthousiaste et dynamique'
  };

  const prompt = `Tu es un expert en rédaction de lettres de motivation. Génère une lettre de motivation personnalisée et convaincante.

**Informations du candidat (CV) :**
${cv}

**Description du poste :**
${jobDescription}

**Instructions :**
- Langue : ${languageMap[language] || 'français'}
- Ton : ${toneMap[tone] || 'professionnel'}
- Structure : En-tête, introduction, corps (2-3 paragraphes), conclusion
- Personnalise le contenu en mettant en avant les compétences et expériences du CV qui correspondent au poste
- Sois spécifique et évite les généralités
- Longueur : 250-400 mots
- Format : Texte simple, prêt à être copié

Génère uniquement la lettre de motivation, sans commentaires supplémentaires.`;

  const response = await mistral.chat.complete({
    model: 'mistral-small-latest',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    maxTokens: 800,
  });

  const generatedText = response.choices?.[0]?.message?.content;
  
  if (!generatedText) {
    throw new Error('Aucune réponse reçue de l\'API Mistral');
  }

  // Gérer le cas où content peut être un string ou un array
  const textContent = typeof generatedText === 'string' ? generatedText : generatedText.join('');
  return textContent.trim();
}

/**
 * Calcule le score de matching entre un CV et une offre d'emploi.
 * @param cv - Le contenu du CV.
 * @param jobDescription - La description de l'offre.
 * @param userId - L'ID de l'utilisateur.
 * @returns Un objet avec le score et une explication.
 */
export const getMatchScore = async (
  cv: string,
  jobDescription: string,
  userId?: string
): Promise<{ score: number; explanation: string }> => {
  const settings = await getUserSettings(userId);
  const engine = settings.feature_engines?.matchScore || 'internal';

  console.log(`Calculating match score with ${engine}...`);

  try {
    if (engine === 'mistral') {
      return await calculateMatchWithMistral(cv, jobDescription);
    } else if (engine === 'internal') {
      // Algorithme interne simple
      return calculateInternalMatch(cv, jobDescription);
    } else {
      // Fallback vers algorithme interne
      return calculateInternalMatch(cv, jobDescription);
    }
  } catch (error) {
    console.error('Erreur lors du calcul du score:', error);
    // Fallback vers algorithme interne en cas d'erreur
    return calculateInternalMatch(cv, jobDescription);
  }
};

/**
 * Calcule le score de matching avec l'API Mistral
 */
async function calculateMatchWithMistral(
  cv: string,
  jobDescription: string
): Promise<{ score: number; explanation: string }> {
  const apiKey = import.meta.env.VITE_MISTRAL_API_KEY || process.env.MISTRAL_API_KEY;
  
  if (!apiKey) {
    throw new Error('Clé API Mistral manquante');
  }

  const mistral = new Mistral({
    apiKey: apiKey,
  });

  const prompt = `Tu es un expert en recrutement. Analyse la correspondance entre ce CV et cette offre d'emploi.

**CV du candidat :**
${cv}

**Description du poste :**
${jobDescription}

**Instructions :**
- Évalue la correspondance sur une échelle de 0 à 100
- Analyse les compétences, l'expérience, la formation
- Identifie les points forts et les lacunes
- Sois objectif et précis

Réponds au format JSON suivant :
{
  "score": [nombre entre 0 et 100],
  "explanation": "[explication détaillée en 2-3 phrases]"
}`;

  const response = await mistral.chat.complete({
    model: 'mistral-small-latest',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.3, // Plus déterministe pour l'évaluation
    maxTokens: 300,
  });

  const generatedText = response.choices?.[0]?.message?.content;
  
  if (!generatedText) {
    throw new Error('Aucune réponse reçue de l\'API Mistral');
  }

  const textContent = typeof generatedText === 'string' ? generatedText : generatedText.join('');
  
  try {
    // Extraire le JSON de la réponse
    const jsonMatch = textContent.match(/\{[^}]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return {
        score: Math.max(0, Math.min(100, result.score || 0)), // S'assurer que le score est entre 0 et 100
        explanation: result.explanation || 'Score calculé par IA'
      };
    }
  } catch (parseError) {
    console.warn('Erreur de parsing JSON, utilisation du texte brut:', parseError);
  }

  // Fallback: essayer d'extraire un score du texte
  const scoreMatch = textContent.match(/(\d+)/);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : 75;
  
  return {
    score: Math.max(0, Math.min(100, score)),
    explanation: textContent.substring(0, 200) + '...'
  };
}

/**
 * Algorithme interne simple pour calculer le score de matching
 */
function calculateInternalMatch(
  cv: string,
  jobDescription: string
): { score: number; explanation: string } {
  const cvLower = cv.toLowerCase();
  const jobLower = jobDescription.toLowerCase();
  
  // Mots-clés techniques courants
  const techKeywords = [
    'javascript', 'typescript', 'react', 'vue', 'angular', 'node', 'python', 'java',
    'php', 'sql', 'mongodb', 'postgresql', 'git', 'docker', 'kubernetes', 'aws',
    'azure', 'gcp', 'html', 'css', 'sass', 'tailwind', 'bootstrap', 'api', 'rest',
    'graphql', 'microservices', 'agile', 'scrum', 'ci/cd', 'devops'
  ];
  
  let matches = 0;
  let totalKeywords = 0;
  
  for (const keyword of techKeywords) {
    if (jobLower.includes(keyword)) {
      totalKeywords++;
      if (cvLower.includes(keyword)) {
        matches++;
      }
    }
  }
  
  // Score de base entre 60 et 95
  const baseScore = totalKeywords > 0 ? Math.round((matches / totalKeywords) * 35) + 60 : 75;
  
  return {
    score: Math.max(60, Math.min(95, baseScore)),
    explanation: `Score calculé sur ${matches}/${totalKeywords} compétences techniques correspondantes. ${matches > totalKeywords * 0.7 ? 'Excellent' : matches > totalKeywords * 0.4 ? 'Bon' : 'Moyen'} niveau de correspondance.`
  };
}
