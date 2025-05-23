// Utiliser une approche compatible avec l'environnement Netlify
// Définir la fonction createClient manuellement sans dépendre d'importations externes

import { createClient as supabaseCreateClient, SupabaseClient } from '@supabase/supabase-js';

// Types nécessaires pour TypeScript
type SupabaseClientType = SupabaseClient; // Utiliser le vrai type SupabaseClient

// Fonction de création de client fallback pour les environnements où supabase-js n'est pas disponible
function createFallbackClient(): SupabaseClientType { // S'assurer que le fallback retourne le bon type si on le garde
  console.warn("Utilisation du client Supabase de fallback - fonctionnalités limitées. VÉRIFIEZ VOS VARIABLES D'ENVIRONNEMENT SUPABASE.");
  // Retourner une version minimale fonctionnelle ou une version qui throw des erreurs claires
  // Pour l'instant, on va simplifier et ne pas utiliser le fallback dans la création principale.
  // Cela peut être réintroduit si nécessaire avec une logique plus robuste.
  throw new Error("Supabase client could not be initialized, falling back. Check setup.");
}

// Fonction pour créer un client Supabase selon l'environnement
export function createClient(supabaseUrl: string, supabaseKey: string): SupabaseClientType {
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL ou Anon Key manquante. Le client Supabase ne peut pas être initialisé.');
    // Il est préférable de lever une erreur ici ou de retourner un client qui échoue clairement
    // plutôt que de retourner un client fallback silencieux pour les opérations critiques comme l'auth.
    throw new Error('Supabase URL or Anon Key is missing.');
  }
  return supabaseCreateClient(supabaseUrl, supabaseKey);
}

// --- Types et interfaces ---
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  user_type?: string;
  is_admin?: boolean | null;
  trial_ends_at: string | null;
  created_at: string;
  updated_at: string;
  preferred_currency?: string | null; // Ajout de la préférence de devise
}

export interface Subscription {
  id: string;
  user_id: string;
  status: 'trialing' | 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'unpaid';
  plan: 'free' | 'pro' | 'enterprise';
  current_period_end: string | null;
  cancel_at: string | null;
  created_at: string;
  updated_at: string;
  stripe_customer_id?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  job_skills?: Array<{
    job: {
      id: string;
      title: string;
      company: string;
      created_at: string;
    };
  }>;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  proficiency_level: number;
  years_experience: number;
  created_at: string;
  updated_at: string;
  skill: Skill;
}

export interface SkillResponse {
  id: string;
  user_id: string;
  skill_id: string;
  proficiency_level: number;
  years_experience: number;
  created_at: string;
  updated_at: string;
  skill: {
    id: string;
    name: string;
    category: string;
    job_skills: Array<{
      job: {
        id: string;
        title: string;
        company: string;
        created_at: string;
      };
    }>;
  };
}

export interface Job {
  id: string;
  source_id: string;
  title: string;
  company: string;
  company_logo?: string | null;
  location: string;
  description: string | null;
  salary_min: number | null;
  salary_max: number | null;
  currency: string | null;
  job_type: string;
  url: string;
  posted_at: string;
  created_at: string;
  updated_at: string;
  remote_type?: 'remote' | 'hybrid' | 'onsite';
  experience_level?: 'junior' | 'mid' | 'senior';
  required_skills?: string[];
  preferred_skills?: string[];
}

export interface JobSuggestion {
  job: Job;
  matchScore: number;
  matchingSkills: string[];
}

export interface MarketTrend {
  category: string;
  count: number;
  percentage: number;
}

export interface JobApplication {
  id: string;
  job: {
    title: string;
    company: string;
    location: string;
  };
  status: string;
  created_at: string;
  notes?: string | null;
  timeline?: { date: string; description: string }[];
}

// IMPORTANT : Ne jamais exposer la SERVICE_ROLE_KEY côté client ! Utiliser uniquement la clé publique (anon) pour le front-end.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log pour le débogage sur Netlify
console.log('[SupabaseInit] Attempting to initialize Supabase client.');
console.log('[SupabaseInit] VITE_SUPABASE_URL available:', !!supabaseUrl);
console.log('[SupabaseInit] VITE_SUPABASE_ANON_KEY available:', !!supabaseAnonKey);

if (typeof supabaseUrl !== 'string' || supabaseUrl.trim() === '') {
  console.error('[SupabaseInit] VITE_SUPABASE_URL is missing or empty.');
}

if (typeof supabaseAnonKey !== 'string' || supabaseAnonKey.trim() === '') {
  console.error('[SupabaseInit] VITE_SUPABASE_ANON_KEY is missing or empty.');
}

let supabaseExport;

// Simuler un client Supabase pour le développement local ou les tests si les clés ne sont pas définies
const mockSupabaseClient = {
  auth: {
    getSession: async () => {
      console.warn('[SupabaseInit] Using mock Supabase client: getSession');
      return { data: { session: null }, error: null };
    },
    signInWithPassword: async (credentials: any) => {
      console.warn('[SupabaseInit] Using mock Supabase client: signInWithPassword', credentials);
      return { data: { user: { id: 'mock-user-id', email: credentials.email }, session: { access_token: 'mock-token' } }, error: null };
    },
    signUp: async (credentials: any) => {
      console.warn('[SupabaseInit] Using mock Supabase client: signUp', credentials);
      return { data: { user: { id: 'mock-user-id', email: credentials.email }, session: { access_token: 'mock-token' } }, error: null };
    },
    signOut: async () => {
      console.warn('[SupabaseInit] Using mock Supabase client: signOut');
      return { error: null };
    },
    onAuthStateChange: (callback: (event: string, session: any | null) => void) => {
      console.warn('[SupabaseInit] Using mock Supabase client: onAuthStateChange');
      // Simuler un changement d'état initial (non authentifié)
      callback('INITIAL_SESSION', null);
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              console.warn('[SupabaseInit] Mock subscription unsubscribe.');
            },
          }
        }
      };
    },
    updateUser: async (attributes: any) => {
      console.warn('[SupabaseInit] Using mock Supabase client: updateUser', attributes);
      return { data: { user: { id: 'mock-user-id', ...attributes } }, error: null };
    },
    sendPasswordResetEmail: async (email: string) => {
      console.warn('[SupabaseInit] Using mock Supabase client: sendPasswordResetEmail', email);
      return { error: null };
    },
    getUser: async () => {
      console.warn('[SupabaseInit] Using mock Supabase client: getUser');
      return { data: { user: null }, error: null }; // ou simuler un utilisateur connecté
    },
  },
  from: (table: string) => {
    console.warn(`[SupabaseInit] Using mock Supabase client: from(${table})`);
    const mockChain = {
      select: (...args: any[]) => { console.warn('[SupabaseInit] Mock select', args); return mockChain; },
      insert: (...args: any[]) => { console.warn('[SupabaseInit] Mock insert', args); return Promise.resolve({ data: [], error: null }); },
      update: (...args: any[]) => { console.warn('[SupabaseInit] Mock update', args); return Promise.resolve({ data: [], error: null }); },
      delete: (...args: any[]) => { console.warn('[SupabaseInit] Mock delete', args); return Promise.resolve({ data: [], error: null }); },
      eq: (...args: any[]) => { console.warn('[SupabaseInit] Mock eq', args); return mockChain; },
      single: () => Promise.resolve({ data: null, error: null }), // Simuler une réponse single()
    };
    return mockChain;
  },
  rpc: async (name: string, params?: any) => {
    console.warn(`[SupabaseInit] Using mock Supabase client: rpc(${name})`, params);
    if (name === 'calculate_total_price') {
      return Promise.resolve({ data: 100, error: null }); // Simuler une réponse pour rpc
    }
    return Promise.resolve({ data: null, error: null });
  },
  functions: {
    invoke: async (functionName: string, options?: any) => {
      console.warn(`[SupabaseInit] Using mock Supabase client: functions.invoke(${functionName})`, options);
      // Simuler la réponse pour create-stripe-checkout
      if (functionName === 'create-stripe-checkout') {
        return {
          data: {
            sessionId: 'mock_session_id_12345'
          },
          error: null
        };
      }
      // Simuler la réponse pour get_user_roles
      if (functionName === 'get_user_roles') {
        return {
          data: { roles: ['user'] }, // Simule un utilisateur avec le rôle 'user'
          error: null
        };
      }
      return { data: null, error: { message: 'Mock function not implemented' } }; // Réponse par défaut
    }
  },
  realtime: null, // ou simuler un client realtime basique si besoin
};

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[SupabaseInit] Supabase URL or Anon Key is missing. Falling back to mock client.');
  supabaseExport = mockSupabaseClient as unknown as SupabaseClient;
  console.log('[SupabaseInit] Mock Supabase client assigned due to missing env vars.');
} else {
  try {
    console.log('[SupabaseInit] Initializing Supabase client with provided URL and Key.');
    supabaseExport = createClient(supabaseUrl, supabaseAnonKey);
    console.log('[SupabaseInit] Supabase client initialized successfully.');
  } catch (error) {
    console.error('[SupabaseInit] Error initializing Supabase client:', error);
    console.warn('[SupabaseInit] Falling back to mock client due to initialization error.');
    supabaseExport = mockSupabaseClient as unknown as SupabaseClient;
  }
}

export const supabase = supabaseExport;

export async function getMarketTrends(): Promise<{
  jobTypes: MarketTrend[];
  locations: MarketTrend[];
  salary: {
    average: number;
    count: number;
  };
}> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*');
  if (error) throw error;
  if (!data) return { jobTypes: [], locations: [], salary: { average: 0, count: 0 } };

  // Job types
  const jobTypeCounts: Record<string, number> = {};
  for (const job of data) {
    if (job.job_type) {
      jobTypeCounts[job.job_type] = (jobTypeCounts[job.job_type] || 0) + 1;
    }
  }
  const totalJobs = data.length;
  const jobTypes: MarketTrend[] = Object.entries(jobTypeCounts).map(([category, count]) => ({
    category,
    count,
    percentage: totalJobs > 0 ? (count / totalJobs) * 100 : 0
  }));

  // Locations
  const locationCounts: Record<string, number> = {};
  for (const job of data) {
    if (job.location) {
      locationCounts[job.location] = (locationCounts[job.location] || 0) + 1;
    }
  }
  const locations: MarketTrend[] = Object.entries(locationCounts).map(([category, count]) => ({
    category,
    count,
    percentage: totalJobs > 0 ? (count / totalJobs) * 100 : 0
  }));

  // Salaries
  const salaries = data.filter((job: any) => typeof job.salary_min === 'number' && typeof job.salary_max === 'number');
  const avgSalary = salaries.length > 0
    ? salaries.reduce((sum: number, job: any) => sum + ((job.salary_min + job.salary_max) / 2), 0) / salaries.length
    : 0;

  return {
    jobTypes,
    locations,
    salary: {
      average: avgSalary,
      count: salaries.length
    }
  };
}

export async function getJobs(filters: {
  search?: string;
  jobType?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  remote?: 'remote' | 'hybrid' | 'onsite';
  experienceLevel?: 'junior' | 'mid' | 'senior';
  sortBy?: 'date' | 'salary';
  requiredSkills?: string[];
  preferredSkills?: string[];
} = {}): Promise<Job[]> {
  let query = supabase
    .from('jobs')
    .select('*');

  if (filters.search) {
    query = query.textSearch('search_vector', filters.search);
  }
  if (filters.jobType) {
    query = query.eq('job_type', filters.jobType);
  }
  if (filters.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }
  if (filters.salaryMin) {
    query = query.gte('salary_min', filters.salaryMin);
  }
  if (filters.salaryMax) {
    query = query.lte('salary_max', filters.salaryMax);
  }
  if (filters.remote) {
    query = query.eq('remote_type', filters.remote);
  }
  if (filters.experienceLevel) {
    query = query.eq('experience_level', filters.experienceLevel);
  }
  if (filters.sortBy === 'salary') {
    query = query.order('salary_max', { ascending: false });
  } else {
    query = query.order('posted_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  // On force le cast via unknown pour satisfaire TypeScript, car la structure est contrôlée par la requête Supabase.
  return data as unknown as Job[];
}

export async function getJobSuggestions(userId: string): Promise<JobSuggestion[]> {
  const { data: suggestions, error } = await supabase
    .from('job_suggestions')
    .select(`job_id, match_score, job:jobs (*)`)
    .eq('user_id', userId)
    .order('match_score', { ascending: false });

  if (error) throw error;
  if (!suggestions) return [];

  return suggestions.map(suggestion => ({
    job: Array.isArray(suggestion.job) ? suggestion.job[0] as Job : suggestion.job as Job,
    matchScore: suggestion.match_score,
    matchingSkills: [] // à adapter si tu veux un vrai calcul de matchingSkills
  }));
}
