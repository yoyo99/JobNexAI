var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, HeartIcon, SparklesIcon, ShareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getJobs, getJobSuggestions, supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../stores/auth';
import { ShareModal } from './ShareModal';
import { VirtualizedList } from './VirtualizedList';
import { LazyImage } from './LazyImage';
import { cache } from '../lib/cache';
import { LoadingSpinner } from './LoadingSpinner';
export function JobSearch() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [favorites, setFavorites] = useState({});
    const [search, setSearch] = useState('');
    const [jobType, setJobType] = useState('');
    const [location, setLocation] = useState('');
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [salaryMin, setSalaryMin] = useState('');
    const [salaryMax, setSalaryMax] = useState('');
    const [remote, setRemote] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [experienceLevel, setExperienceLevel] = useState('all');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [shareJob, setShareJob] = useState(null);
    const jobTypes = useMemo(() => [
        { value: 'FULL_TIME', label: t('jobSearch.types.fullTime') },
        { value: 'PART_TIME', label: t('jobSearch.types.partTime') },
        { value: 'CONTRACT', label: t('jobSearch.types.contract') },
        { value: 'FREELANCE', label: t('jobSearch.types.freelance') },
        { value: 'INTERNSHIP', label: t('jobSearch.types.internship') }
    ], [t]);
    const remoteOptions = useMemo(() => [
        { value: 'all', label: 'Tous' },
        { value: 'remote', label: 'Full Remote' },
        { value: 'hybrid', label: 'Hybride' },
        { value: 'onsite', label: 'Sur site' }
    ], []);
    const experienceLevels = useMemo(() => [
        { value: 'all', label: 'Tous niveaux' },
        { value: 'junior', label: 'Junior (0-2 ans)' },
        { value: 'mid', label: 'Confirmé (3-5 ans)' },
        { value: 'senior', label: 'Senior (5+ ans)' }
    ], []);
    const loadJobs = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            // Générer une clé de cache basée sur les filtres
            const cacheKey = `jobs:${search}:${jobType}:${location}:${salaryMin}:${salaryMax}:${remote}:${experienceLevel}:${sortBy}`;
            // Essayer de récupérer depuis le cache
            const data = yield cache.getOrSet(cacheKey, () => __awaiter(this, void 0, void 0, function* () {
                return yield getJobs({
                    search,
                    jobType,
                    location,
                    salaryMin: salaryMin || undefined,
                    salaryMax: salaryMax || undefined,
                    remote: remote === 'all' ? undefined : remote,
                    experienceLevel: experienceLevel === 'all' ? undefined : experienceLevel,
                    sortBy
                });
            }), { ttl: 5 * 60 * 1000 } // 5 minutes
            );
            if (user) {
                const { data: favoritesData } = yield supabase
                    .from('job_favorites')
                    .select('job_id')
                    .eq('user_id', user.id);
                const favoritesMap = {};
                favoritesData === null || favoritesData === void 0 ? void 0 : favoritesData.forEach(fav => {
                    favoritesMap[fav.job_id] = true;
                });
                setFavorites(favoritesMap);
            }
            setJobs(showFavoritesOnly ? data.filter(job => favorites[job.id]) : data);
        }
        catch (error) {
            console.error('Error loading jobs:', error);
        }
        finally {
            setLoading(false);
        }
    }), [search, jobType, location, salaryMin, salaryMax, remote, experienceLevel, sortBy, user, showFavoritesOnly, favorites]);
    const loadSuggestions = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        if (!user)
            return;
        try {
            // Utiliser le cache pour les suggestions
            const suggestions = yield cache.getOrSet(`suggestions:${user.id}`, () => __awaiter(this, void 0, void 0, function* () { return yield getJobSuggestions(user.id); }), { ttl: 15 * 60 * 1000 } // 15 minutes
            );
            setSuggestions(suggestions);
        }
        catch (error) {
            console.error('Error loading suggestions:', error);
        }
    }), [user]);
    useEffect(() => {
        loadJobs();
        if (user) {
            loadSuggestions();
        }
    }, [loadJobs, loadSuggestions, user]);
    const toggleFavorite = (jobId) => __awaiter(this, void 0, void 0, function* () {
        if (!user)
            return;
        try {
            if (favorites[jobId]) {
                yield supabase
                    .from('job_favorites')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('job_id', jobId);
                setFavorites(prev => {
                    const next = Object.assign({}, prev);
                    delete next[jobId];
                    return next;
                });
            }
            else {
                yield supabase
                    .from('job_favorites')
                    .insert({
                    user_id: user.id,
                    job_id: jobId
                });
                setFavorites(prev => (Object.assign(Object.assign({}, prev), { [jobId]: true })));
            }
        }
        catch (error) {
            console.error('Error toggling favorite:', error);
        }
    });
    const resetFilters = () => {
        setJobType('');
        setLocation('');
        setSalaryMin('');
        setSalaryMax('');
        setRemote('all');
        setExperienceLevel('all');
        setSortBy('date');
    };
    const renderJob = useCallback((job, matchScore, matchingSkills) => (_jsxs("div", { className: "card hover:bg-white/10 transition-colors", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-4", children: [job.company_logo && (_jsx(LazyImage, { src: job.company_logo, alt: job.company, width: 48, height: 48, className: "rounded-lg" })), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: job.title }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => toggleFavorite(job.id), className: "text-primary-400 hover:text-primary-300 transition-colors", children: favorites[job.id] ? (_jsx(HeartIconSolid, { className: "h-6 w-6" })) : (_jsx(HeartIcon, { className: "h-6 w-6" })) }), _jsx("button", { onClick: () => setShareJob(job), className: "text-primary-400 hover:text-primary-300 transition-colors", children: _jsx(ShareIcon, { className: "h-5 w-5" }) })] }), matchScore !== undefined && (_jsxs("span", { className: "bg-primary-600/20 text-primary-400 text-sm px-2 py-1 rounded-full", children: [matchScore.toFixed(0), "% de correspondance"] }))] })] }), _jsxs("div", { className: "mt-1 flex flex-wrap gap-2", children: [_jsx("span", { className: "text-gray-400", children: job.company }), _jsx("span", { className: "text-gray-400", children: "\u2022" }), _jsx("span", { className: "text-gray-400", children: job.location }), _jsx("span", { className: "text-gray-400", children: "\u2022" }), _jsx("span", { className: "text-gray-400", children: job.job_type }), job.remote_type && (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-gray-400", children: "\u2022" }), _jsx("span", { className: "text-gray-400", children: job.remote_type })] })), job.experience_level && (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-gray-400", children: "\u2022" }), _jsx("span", { className: "text-gray-400", children: job.experience_level })] }))] }), matchingSkills && matchingSkills.length > 0 && (_jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: matchingSkills.map(skill => (_jsx("span", { className: "bg-primary-600/20 text-primary-400 text-xs px-2 py-1 rounded-full", children: skill }, skill))) }))] }), _jsxs("div", { className: "text-right", children: [job.salary_min && job.salary_max && (_jsxs("span", { className: "text-primary-400 font-semibold", children: [job.salary_min.toLocaleString(), " - ", job.salary_max.toLocaleString(), " ", job.currency] })), _jsx("span", { className: "block text-sm text-gray-400", children: format(new Date(job.posted_at), 'dd MMMM yyyy', { locale: fr }) })] })] }), job.description && (_jsx("p", { className: "mt-4 text-gray-400 line-clamp-3", children: job.description })), _jsx("div", { className: "mt-4", children: _jsxs("a", { href: job.url, target: "_blank", rel: "noopener noreferrer", className: "text-primary-400 hover:text-primary-300 text-sm font-medium", children: [t('common.view'), " \u2192"] }) })] })), [favorites, t, toggleFavorite]);
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "card mb-8", children: [_jsxs("div", { className: "max-w-2xl", children: [_jsx("h1", { className: "text-2xl font-bold text-white mb-4", children: t('jobSearch.title') }), _jsx("p", { className: "text-gray-400 mb-6", children: t('jobSearch.subtitle') })] }), _jsxs("form", { className: "space-y-4", onSubmit: (e) => { e.preventDefault(); loadJobs(); }, children: [_jsxs("div", { className: "flex gap-4", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(MagnifyingGlassIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" }), _jsx("input", { type: "text", value: search, onChange: (e) => setSearch(e.target.value), placeholder: t('jobSearch.filters.keyword'), className: "w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), _jsxs("button", { type: "button", onClick: () => setShowAdvancedSearch(!showAdvancedSearch), className: "btn-secondary flex items-center gap-2", children: [_jsx(AdjustmentsHorizontalIcon, { className: "h-5 w-5" }), "Filtres avanc\u00E9s"] })] }), showAdvancedSearch && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Type de contrat" }), _jsxs("select", { value: jobType, onChange: (e) => setJobType(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "", children: "Tous les types" }), jobTypes.map((type) => (_jsx("option", { value: type.value, children: type.label }, type.value)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Mode de travail" }), _jsx("select", { value: remote, onChange: (e) => setRemote(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", children: remoteOptions.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Niveau d'exp\u00E9rience" }), _jsx("select", { value: experienceLevel, onChange: (e) => setExperienceLevel(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", children: experienceLevels.map((level) => (_jsx("option", { value: level.value, children: level.label }, level.value))) })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Localisation" }), _jsx("input", { type: "text", value: location, onChange: (e) => setLocation(e.target.value), placeholder: "Ville ou r\u00E9gion", className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Salaire minimum" }), _jsx("input", { type: "number", value: salaryMin, onChange: (e) => setSalaryMin(e.target.value ? Number(e.target.value) : ''), placeholder: "Ex: 35000", className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Salaire maximum" }), _jsx("input", { type: "number", value: salaryMax, onChange: (e) => setSalaryMax(e.target.value ? Number(e.target.value) : ''), placeholder: "Ex: 75000", className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Trier par" }), _jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "date", children: "Date de publication" }), _jsx("option", { value: "salary", children: "Salaire" })] })] }), _jsx("button", { type: "button", onClick: resetFilters, className: "btn-secondary", children: "R\u00E9initialiser les filtres" })] })] })), _jsxs("div", { className: "flex items-center justify-between mt-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { type: "button", onClick: () => {
                                                            setShowFavoritesOnly(!showFavoritesOnly);
                                                            loadJobs();
                                                        }, className: `btn-secondary flex items-center gap-2 ${showFavoritesOnly ? 'bg-primary-600 hover:bg-primary-500' : ''}`, children: [_jsx(HeartIcon, { className: "h-5 w-5" }), showFavoritesOnly ? 'Tous les emplois' : 'Voir mes favoris'] }), user && suggestions.length > 0 && (_jsxs("button", { type: "button", onClick: () => setShowSuggestions(!showSuggestions), className: `btn-secondary flex items-center gap-2 ${showSuggestions ? 'bg-primary-600 hover:bg-primary-500' : ''}`, children: [_jsx(SparklesIcon, { className: "h-5 w-5" }), "Suggestions"] }))] }), _jsx("button", { type: "submit", className: "btn-primary", children: t('common.search') })] })] })] }), loading ? (_jsx("div", { className: "flex justify-center py-12", children: _jsx(LoadingSpinner, { size: "lg", text: "Chargement des offres d'emploi..." }) })) : (_jsx("div", { className: "space-y-4", children: showSuggestions ? (suggestions.length > 0 ? (_jsx(VirtualizedList, { items: suggestions, height: 600, itemHeight: 200, renderItem: (suggestion) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, children: renderJob(suggestion.job, suggestion.matchScore, suggestion.matchingSkills) })) })) : (_jsx("div", { className: "text-center py-12 text-gray-400", children: "Aucune suggestion disponible. Compl\u00E9tez votre profil pour recevoir des suggestions personnalis\u00E9es." }))) : jobs.length > 0 ? (_jsx(VirtualizedList, { items: jobs, height: 600, itemHeight: 200, renderItem: (job) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, children: renderJob(job) })) })) : (_jsx("div", { className: "text-center py-12 text-gray-400", children: "Aucune offre d'emploi ne correspond \u00E0 vos crit\u00E8res." })) }))] }), shareJob && (_jsx(ShareModal, { isOpen: true, onClose: () => setShareJob(null), job: shareJob }))] }));
}
