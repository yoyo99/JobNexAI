/**
 * @file Centralized AI Service
 * @description This service manages all interactions with different AI models (OpenAI, Mistral, etc.)
 * for tasks like cover letter generation, CV analysis, and job matching.
 */

import { getUserAISettings as fetchUserSettings, UserAISettingsData } from '../lib/supabase';

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
 * Génère une lettre de motivation via la fonction serverless
 */
async function generateWithMistral(
  cv: string,
  jobDescription: string,
  language: string,
  tone: string
): Promise<string> {
  // Appel à la fonction serverless existante pour éviter l'exposition de la clé API
  const response = await fetch('/.netlify/functions/generate-cover-letter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cv,
      jobDescription,
      language,
      tone,
      provider: 'mistral' // Paramètre attendu par la fonction serverless
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Erreur lors de la génération: ${response.status} - ${errorData}`);
  }

  const result = await response.json();
  
  if (!result.letter) {
    throw new Error('Aucune lettre de motivation générée');
  }

  return result.letter;
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

  // Utiliser l'algorithme interne pour l'instant
  // La fonction serverless job-matching est conçue pour matcher des utilisateurs/jobs en base
  // Pour l'analyse de texte brut, nous utilisons l'algorithme interne qui est efficace
  return calculateInternalMatch(cv, jobDescription);
};

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
