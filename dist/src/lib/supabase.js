var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createClient } from "@supabase/supabase-js";
// IMPORTANT : Ne jamais exposer la SERVICE_ROLE_KEY côté client ! Utiliser uniquement la clé publique (anon) pour le front-end.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not set.");
}
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export function getMarketTrends() {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabase
            .from('jobs')
            .select('*');
        if (error)
            throw error;
        if (!data)
            return { jobTypes: [], locations: [], salary: { average: 0, count: 0 } };
        // Job types
        const jobTypeCounts = {};
        for (const job of data) {
            if (job.job_type) {
                jobTypeCounts[job.job_type] = (jobTypeCounts[job.job_type] || 0) + 1;
            }
        }
        const totalJobs = data.length;
        const jobTypes = Object.entries(jobTypeCounts).map(([category, count]) => ({
            category,
            count,
            percentage: totalJobs > 0 ? (count / totalJobs) * 100 : 0
        }));
        // Locations
        const locationCounts = {};
        for (const job of data) {
            if (job.location) {
                locationCounts[job.location] = (locationCounts[job.location] || 0) + 1;
            }
        }
        const locations = Object.entries(locationCounts).map(([category, count]) => ({
            category,
            count,
            percentage: totalJobs > 0 ? (count / totalJobs) * 100 : 0
        }));
        // Salaries
        const salaries = data.filter((job) => typeof job.salary_min === 'number' && typeof job.salary_max === 'number');
        const avgSalary = salaries.length > 0
            ? salaries.reduce((sum, job) => sum + ((job.salary_min + job.salary_max) / 2), 0) / salaries.length
            : 0;
        return {
            jobTypes,
            locations,
            salary: {
                average: avgSalary,
                count: salaries.length
            }
        };
    });
}
export function getJobs() {
    return __awaiter(this, arguments, void 0, function* (filters = {}) {
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
        }
        else {
            query = query.order('posted_at', { ascending: false });
        }
        const { data, error } = yield query;
        if (error)
            throw error;
        // On force le cast via unknown pour satisfaire TypeScript, car la structure est contrôlée par la requête Supabase.
        return data;
    });
}
export function getJobSuggestions(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: suggestions, error } = yield supabase
            .from('job_suggestions')
            .select(`job_id, match_score, job:jobs (*)`)
            .eq('user_id', userId)
            .order('match_score', { ascending: false });
        if (error)
            throw error;
        if (!suggestions)
            return [];
        return suggestions.map(suggestion => ({
            job: Array.isArray(suggestion.job) ? suggestion.job[0] : suggestion.job,
            matchScore: suggestion.match_score,
            matchingSkills: [] // à adapter si tu veux un vrai calcul de matchingSkills
        }));
    });
}
