var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const defaultUrl = 'http://localhost:54321';
const defaultAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
export const supabase = createClient(supabaseUrl || defaultUrl, supabaseAnonKey || defaultAnonKey);
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
        return data;
    });
}
export function getJobSuggestions(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: suggestions, error } = yield supabase
            .from('job_suggestions')
            .select(`
      job_id,
      match_score,
      job:jobs (*)
    `)
            .eq('user_id', userId)
            .order('match_score', { ascending: false });
        if (error)
            throw error;
        return suggestions.map(suggestion => ({
            job: suggestion.job,
            matchScore: suggestion.match_score,
            matchingSkills: []
        }));
    });
}
export function getMarketTrends() {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: jobs, error } = yield supabase
            .from('jobs')
            .select('*')
            .order('posted_at', { ascending: false })
            .limit(1000);
        if (error)
            throw error;
        const jobTypes = jobs.reduce((acc, job) => {
            acc[job.job_type] = (acc[job.job_type] || 0) + 1;
            return acc;
        }, {});
        const totalJobs = jobs.length;
        const jobTypesTrends = Object.entries(jobTypes).map(([category, count]) => ({
            category,
            count,
            percentage: (count / totalJobs) * 100
        }));
        const locations = jobs.reduce((acc, job) => {
            acc[job.location] = (acc[job.location] || 0) + 1;
            return acc;
        }, {});
        const locationTrends = Object.entries(locations)
            .map(([category, count]) => ({
            category,
            count,
            percentage: (count / totalJobs) * 100
        }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
        const salaries = jobs
            .filter(job => job.salary_min && job.salary_max)
            .map(job => ({
            min: job.salary_min,
            max: job.salary_max,
            avg: (job.salary_min + job.salary_max) / 2
        }));
        const avgSalary = salaries.length > 0
            ? salaries.reduce((sum, salary) => sum + salary.avg, 0) / salaries.length
            : 0;
        return {
            jobTypes: jobTypesTrends,
            locations: locationTrends,
            salary: {
                average: avgSalary,
                count: salaries.length
            }
        };
    });
}
