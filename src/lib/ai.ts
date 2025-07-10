import OpenAI from 'openai';
import { Mistral } from '@mistralai/mistralai';
import { useAuth } from '../stores/auth';

/**
 * Effectue une analyse sémantique d'un texte donné.
 * Cette fonction prend en entrée un texte et retourne une liste de suggestions
 * pour améliorer le texte.
 *
 * @param {_text: string} _text - Le texte à analyser.
 * @returns {string[]} - Une liste de suggestions pour améliorer le texte.
 **/

export function semanticAnalysis(_text: string): string[] {
  // Dans cette première version, nous retournons des suggestions en dur..
  return ["Améliorer la structure de la phrase.", "Ajouter des mots clés pertinents pour le poste.", "Mettre en avant vos expériences les plus significatives."];
}

/**
 * Fonction pour analyser la description d'un poste et extraire des informations pertinentes.
 *
 * @param {_jobDescription: string} _jobDescription - La description du poste.
 * @returns {{ type: string; level: string; skills: string[]; technologies: string[]; }} - Un objet avec le type, le niveau, les compétences et les technologies.
 */

/**
 * Fonction pour analyser la description d'un poste et extraire des informations pertinentes.
 *
 * @param {_jobDescription: string} _jobDescription - La description du poste.
 * @returns {{ type: string; level: string; skills: string[]; technologies: string[]; }} - Un objet avec le type, le niveau, les compétences et les technologies.
 */
 //Fonction pour analyser la description d'un poste
interface JobDescriptionAnalysis {
  type: string;
  level: string;
  skills: string[];
  technologies: string[];
};;

export function analyzeJobDescription(_jobDescription: string): JobDescriptionAnalysis {
  // Stub implementation to satisfy TypeScript
  return { type: 'technical', level: 'junior', skills: [], technologies: [] };
};;

/**
 * Fonction pour générer une question d'entretien en fonction de la description du poste.
 *
 * @param {_jobDescription: string} _jobDescription - La description du poste.
 * @returns {string} - Une question d'entretien.
 */
export function generateInterviewQuestion(_jobDescription: string): string {
  // Stub implementation to satisfy TypeScript
  return 'Pouvez-vous détailler votre expérience pertinente pour ce poste ?';
};;

/**
 * Fonction pour analyser une réponse à une question d'entretien.
 *
 * @param {_answer: string} _answer - La réponse à analyser. 
 * @param {_question: string} _question - La question à laquelle la réponse répond. 
 * @returns {{ feedbacks: string[]; note: number, weakPoints: string[] }} - Une liste de feedbacks et une note, et une liste de points faibles.
 */
export function analyzeAnswer(_answer: string, _question: string): { feedbacks: string[]; note: number, weakPoints: string[] } {
  // Stub implementation to satisfy TypeScript
  return { feedbacks: [], note: 0, weakPoints: [] };
};;

/**
 * Fonction pour donner une note à une réponse.
 *
 * @param {_answer: string} _answer - La réponse à noter.
 * @param {_question: string} _question - La question à laquelle la réponse se rapporte. 
 * @param {_jobDescription: string} _jobDescription - La description du poste.
 * @returns {number} - La note donnée à la réponse.
 */
export function rateAnswer(_answer: string, _question: string, _jobDescription: string): number {
  // Stub implementation to satisfy TypeScript
  return 0;
};;

/**
 * Structure pour stocker les conversations en cours.
 */
interface Conversation {
  conversationId: string;
  jobDescription: string;
  history: any[];
  weakPoints: string[];
}

const conversations: Conversation[] = [];

/**
 * Démarre une nouvelle conversation.
 *
 * @param {string} jobDescription - La description du poste.
 * @returns {string} - L'identifiant de la conversation.
 */
export function startConversation(jobDescription: string): string {
    const conversationId = Math.random().toString(36).substring(2, 9); // Génération d'un ID aléatoire
    const newConversation: Conversation = {
    conversationId,
    jobDescription,
    history: [], 
    weakPoints: []
    };
    conversations.push(newConversation);
    return conversationId;
}

/**
 * Récupère la prochaine question à poser dans une conversation.
 *
 * @param {_conversationId: string} _conversationId - L'identifiant de la conversation.
 * @returns {string} - La prochaine question.
 */
export function getNextQuestion(_conversationId: string): string {
  // Stub implementation to satisfy TypeScript
  return 'Quelle est votre expérience la plus pertinente pour ce poste ?';
}

/**
 * Ajoute une réponse à l'historique d'une conversation et génère des feedbacks.
 *
 * @param {string} conversationId - L'identifiant de la conversation.
 * @param {string} answer - La réponse de l'utilisateur.
 * @returns {string[]} - Les feedbacks générés pour la réponse.
 */
export function addAnswer(conversationId: string, answer: string): string[] {    
    const conversation = conversations.find((c) => c.conversationId === conversationId);
    if (!conversation) {
        throw new Error(`Conversation with ID ${conversationId} not found.`);
    }
    const lastExchange = conversation.history[conversation.history.length - 1];
    if (!lastExchange || !lastExchange.question) return [];
    const jobDescription = conversation.jobDescription;
    const { feedbacks, note, weakPoints } = analyzeAnswer(answer, lastExchange.question,);
    lastExchange.answer = answer;// On ajoute la réponse
    lastExchange.feedbacks = feedbacks;
    lastExchange.note = note;
    // On ajoute les nouveaux points faibles.   
    weakPoints.forEach(weakPoint => {
        if(!conversation.weakPoints.includes(weakPoint)) conversation.weakPoints.push(weakPoint)
    })
    return feedbacks;
}

/**
 * Récupère la moyenne des notes d'une conversation.
 *
 * @param {string} conversationId - L'identifiant de la conversation.
 * @returns {number} - La moyenne des notes.
 */
export function getAverageNote(conversationId: string): number {
    const conversation = conversations.find((c) => c.conversationId === conversationId);
    if (!conversation) {
        throw new Error("Conversation not found");
    }
    if (conversation.history.length === 0) {
        return 0; // Retourne 0 si aucune réponse n'a été donnée
    }
    const totalNotes = conversation.history.reduce(
        (sum: number, exchange: { note?: number }) => sum + (exchange.note || 0),
        0
    );
    return totalNotes / conversation.history.length;
}

/**
 * Fonction pour générer une lettre de motivation personnalisée.
 *
 * @param {any} cv - Le CV de la personne.
 * @param {string} jobDescription - La description du poste.
 * @param {string} language - La langue de la lettre (par défaut : 'fr').
 * @param {string} tone - Le ton de la lettre (par défaut : 'professional').
 * @returns {string} - La lettre de motivation générée.
 */
async function generateCoverLetterWithOpenAI(
  cv: any,
  jobDescription: string,
  language: string,
  tone: 'professional' | 'conversational' | 'enthusiastic'
): Promise<string> {
  const openai = getOpenAIClient();
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
        {
            role: "system",
            content: `Tu es un expert en rédaction de lettres de motivation professionnelles. TÂCHE: Rédige une lettre de motivation personnalisée en ${language} pour la candidature décrite ci-dessous. INSTRUCTIONS: 1. Utilise un ton ${tone === 'professional' ? 'professionnel et formel' : tone === 'conversational' ? 'conversationnel et accessible' : 'enthousiaste et dynamique'}. 2. Structure la lettre avec une introduction, un développement et une conclusion. 3. Mets en valeur les compétences et expériences du CV qui correspondent spécifiquement à l'offre d'emploi. 4. Utilise des exemples concrets tirés du CV pour illustrer l'adéquation avec le poste. 5. Évite les formules génériques et les clichés. 6. Limite la lettre à environ 300-400 mots. 7. Inclus les formules de politesse appropriées en ${language}. FORMAT: Rédige une lettre complète, prête à être envoyée, avec les formules d'usage.`,
        },
        {
            role: "user",
            content: `CV: ${JSON.stringify(cv)}\nDescription du poste: ${jobDescription}`,
        },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });
  return completion.choices[0].message.content as string;
}

async function generateCoverLetterWithMistral(
  cv: any,
  jobDescription: string,
  language: string,
  tone: 'professional' | 'conversational' | 'enthusiastic'
): Promise<string> {
  const mistralClient = getMistralClient();
  const chatResponse = await mistralClient.chat.complete({
    model: 'mistral-large-latest',
    messages: [
        {
            role: 'system',
            content: `Tu es un expert en rédaction de lettres de motivation professionnelles. TÂCHE: Rédige une lettre de motivation personnalisée en ${language} pour la candidature décrite ci-dessous. INSTRUCTIONS: 1. Utilise un ton ${tone === 'professional' ? 'professionnel et formel' : tone === 'conversational' ? 'conversationnel et accessible' : 'enthousiaste et dynamique'}. 2. Structure la lettre avec une introduction, un développement et une conclusion. 3. Mets en valeur les compétences et expériences du CV qui correspondent spécifiquement à l'offre d'emploi. 4. Utilise des exemples concrets tirés du CV pour illustrer l'adéquation avec le poste. 5. Évite les formules génériques et les clichés. 6. Limite la lettre à environ 300-400 mots. 7. Inclus les formules de politesse appropriées en ${language}. FORMAT: Rédige une lettre complète, prête à être envoyée, avec les formules d'usage.`,
        },
        {
            role: 'user',
            content: `CV: ${JSON.stringify(cv)}\nDescription du poste: ${jobDescription}`,
        },
    ],
    temperature: 0.7,
    maxTokens: 1000,
  });
  const messageContent = chatResponse.choices[0].message.content;
  if (typeof messageContent === 'string') {
    return messageContent;
  }
  // Si le contenu n'est pas une chaîne (ex: ContentChunk[]), retourner une chaîne vide.
  return '';
}

export async function generateCoverLetter(
  cv: any,
  jobDescription: string,
  language: string = 'fr',
  tone: 'professional' | 'conversational' | 'enthusiastic' = 'professional'
): Promise<string> {
  try {
    const { user } = useAuth.getState();
    const provider = user?.ai_provider || 'mistral'; // Mistral par défaut

    if (provider === 'openai') {
      return await generateCoverLetterWithOpenAI(cv, jobDescription, language, tone);
    } else {
      return await generateCoverLetterWithMistral(cv, jobDescription, language, tone);
    }
  } catch (error) {
    console.error(`Erreur lors de la génération de la lettre de motivation avec ${useAuth.getState().user?.ai_provider || 'mistral'}:`, error);
    throw error;
  }
}

export async function optimizeText(
  text: string,
  language: string = 'fr'
): Promise<string> {
  try {
    const mistralClient = getMistralClient();
    const chatResponse = await mistralClient.chat.complete({
      model: 'mistral-large-latest',
      messages: [
        {
            role: 'system',
            content: `Tu es un coach de carrière expert et un rédacteur de CV professionnel. Ta tâche est de réécrire et d'optimiser le texte fourni pour le rendre plus percutant et professionnel. Instructions : 1. Utilise des verbes d'action forts. 2. Quantifie les réalisations lorsque c'est possible (même si tu dois suggérer des exemples comme '[X%]' ou '[Y projets]'). 3. Assure-toi que le ton est professionnel et adapté à un CV. 4. La réponse doit être uniquement le texte amélioré, sans aucune introduction ou phrase supplémentaire. La langue du texte est '${language}'.`,
        },
        {
            role: 'user',
            content: text,
        },
      ],
      temperature: 0.6,
      maxTokens: 1000,
    });
    const messageContent = chatResponse.choices[0].message.content;
    return typeof messageContent === 'string' ? messageContent.trim() : '';
  } catch (error) {
    console.error('Erreur lors de l\`optimisation du texte:', error);
    throw error;
  }
}

export async function translateText(
  text: string,
  targetLanguage: string
): Promise<string> {
  try {
    const mistralClient = getMistralClient();
    const chatResponse = await mistralClient.chat.complete({
      model: 'mistral-large-latest',
      messages: [
        {
            role: 'system',
            content: `Tu es un traducteur expert spécialisé dans les documents professionnels et les CV. Ta tâche est de traduire le texte fourni vers la langue suivante : ${targetLanguage}. Instructions : 1. Conserve le formatage et la structure d'origine. 2. Assure une traduction précise et naturelle, en adaptant les termes au contexte professionnel de la langue cible. 3. La réponse doit être uniquement le texte traduit, sans aucune introduction ou phrase supplémentaire.`,
        },
        {
            role: 'user',
            content: text,
        },
      ],
      temperature: 0.2,
      maxTokens: 1500,
    });
    const messageContent = chatResponse.choices[0].message.content;
    return typeof messageContent === 'string' ? messageContent.trim() : '';
  } catch (error) {
    console.error('Erreur lors de la traduction du texte:', error);
    throw error;
  }
}

/**
 * Traduit un lot de textes dans une langue cible en utilisant l'IA de Mistral.
 * @param texts - Un tableau de chaînes de caractères à traduire.
 * @param targetLanguage - La langue cible pour la traduction (ex: 'anglais').
 * @returns Une promesse qui se résout avec un tableau de textes traduits.
 */
export async function translateTextsBatch(texts: string[], targetLanguage: string): Promise<string[]> {
  if (!texts || texts.length === 0) {
    return [];
  }

  const mistral = getMistralClient();

  const systemPrompt = `Tu es un expert en traduction multilingue spécialisé dans les CV professionnels. Traduis le tableau de textes JSON suivant en ${targetLanguage}. Réponds uniquement avec un tableau JSON contenant les traductions, en conservant exactement le même ordre et le même nombre d'éléments. La structure de ta réponse doit être : ["traduction 1", "traduction 2", ...].`;

  const userMessage = JSON.stringify(texts);

  try {
    const chatResponse = await mistral.chat.complete({
      model: 'mistral-large-latest',
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

    // Le contenu peut être une chaîne JSON contenant un tableau, ou directement le tableau.
    // Nous devons le parser pour obtenir le tableau de chaînes.
    const parsedContent = JSON.parse(content);
    
    // Le modèle peut parfois retourner un objet avec une clé (ex: { translations: [...] }).
    // Nous cherchons le premier tableau de chaînes de caractères trouvé dans la réponse.
    const translations = Array.isArray(parsedContent) 
      ? parsedContent 
      : Object.values(parsedContent).find(Array.isArray);

    if (!translations || !Array.isArray(translations) || translations.length !== texts.length) {
      throw new Error("La réponse de l'IA ne correspond pas au format attendu ou le nombre de traductions est incorrect.");
    }

    return translations;
  } catch (error) {
    console.error('Erreur lors de la traduction par lot avec Mistral:', error);
    throw new Error('Impossible de traduire le lot de textes.');
  }
}

export async function generateBulkApplicationMessages(
  cv: any,
  jobDescriptions: { id: string; description: string }[]
): Promise<{ jobId: string; message: string | null }[]> {
  // Stub impl. renvoyant un objet vide pour chaque description
  return jobDescriptions.map(job => ({ jobId: job.id, message: null }));
}

let openai: OpenAI | null = null;
let mistral: Mistral | null = null;

function getMistralClient(): Mistral {
  if (!mistral) {
    const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
    if (!apiKey) {
      throw new Error('La clé API Mistral (VITE_MISTRAL_API_KEY) n\'est pas configurée dans les variables d\'environnement.');
    }
    mistral = new Mistral({ apiKey });
  }
  return mistral;
}

function getOpenAIClient(): OpenAI {
  if (!openai) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('La clé API OpenAI (VITE_OPENAI_API_KEY) n\'est pas configurée dans les variables d\'environnement.');
    }
    openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // AVERTISSEMENT: Pour la production, utilisez une fonction Edge sécurisée.
    });
  }
  return openai;
}