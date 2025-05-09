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
  trial_ends_at: string | null;
  created_at: string;
  updated_at: string;
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
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are not set.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
