"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobSearch = JobSearch;
const jsx_runtime_1 = require("react/jsx-runtime");
const outline_1 = require("@heroicons/react/24/outline");
const solid_1 = require("@heroicons/react/24/solid");
const framer_motion_1 = require("framer-motion");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const supabase_1 = require("../lib/supabase");
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
const auth_1 = require("../stores/auth");
const ShareModal_1 = require("./ShareModal");
const VirtualizedList_1 = require("./VirtualizedList");
const LazyImage_1 = require("./LazyImage");
const cache_1 = require("../lib/cache");
const LoadingSpinner_1 = require("./LoadingSpinner");
function JobSearch() {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { user } = (0, auth_1.useAuth)();
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [jobs, setJobs] = (0, react_1.useState)([]);
    const [suggestions, setSuggestions] = (0, react_1.useState)([]);
    const [favorites, setFavorites] = (0, react_1.useState)({});
    const [search, setSearch] = (0, react_1.useState)('');
    const [jobType, setJobType] = (0, react_1.useState)('');
    const [location, setLocation] = (0, react_1.useState)('');
    const [showAdvancedSearch, setShowAdvancedSearch] = (0, react_1.useState)(false);
    const [salaryMin, setSalaryMin] = (0, react_1.useState)('');
    const [salaryMax, setSalaryMax] = (0, react_1.useState)('');
    const [remote, setRemote] = (0, react_1.useState)('all');
    const [sortBy, setSortBy] = (0, react_1.useState)('date');
    const [experienceLevel, setExperienceLevel] = (0, react_1.useState)('all');
    const [showFavoritesOnly, setShowFavoritesOnly] = (0, react_1.useState)(false);
    const [showSuggestions, setShowSuggestions] = (0, react_1.useState)(false);
    const [shareJob, setShareJob] = (0, react_1.useState)(null);
    const jobTypes = (0, react_1.useMemo)(() => [
        { value: 'FULL_TIME', label: t('jobSearch.types.fullTime') },
        { value: 'PART_TIME', label: t('jobSearch.types.partTime') },
        { value: 'CONTRACT', label: t('jobSearch.types.contract') },
        { value: 'FREELANCE', label: t('jobSearch.types.freelance') },
        { value: 'INTERNSHIP', label: t('jobSearch.types.internship') }
    ], [t]);
    const remoteOptions = (0, react_1.useMemo)(() => [
        { value: 'all', label: 'Tous' },
        { value: 'remote', label: 'Full Remote' },
        { value: 'hybrid', label: 'Hybride' },
        { value: 'onsite', label: 'Sur site' }
    ], []);
    const experienceLevels = (0, react_1.useMemo)(() => [
        { value: 'all', label: 'Tous niveaux' },
        { value: 'junior', label: 'Junior (0-2 ans)' },
        { value: 'mid', label: 'Confirmé (3-5 ans)' },
        { value: 'senior', label: 'Senior (5+ ans)' }
    ], []);
    const loadJobs = (0, react_1.useCallback)(() => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            // Générer une clé de cache basée sur les filtres
            const cacheKey = `jobs:${search}:${jobType}:${location}:${salaryMin}:${salaryMax}:${remote}:${experienceLevel}:${sortBy}`;
            // Essayer de récupérer depuis le cache
            const data = yield cache_1.cache.getOrSet(cacheKey, () => __awaiter(this, void 0, void 0, function* () {
                return yield (0, supabase_1.getJobs)({
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
                const { data: favoritesData } = yield supabase_1.supabase
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
    const loadSuggestions = (0, react_1.useCallback)(() => __awaiter(this, void 0, void 0, function* () {
        if (!user)
            return;
        try {
            // Utiliser le cache pour les suggestions
            const suggestions = yield cache_1.cache.getOrSet(`suggestions:${user.id}`, () => __awaiter(this, void 0, void 0, function* () { return yield (0, supabase_1.getJobSuggestions)(user.id); }), { ttl: 15 * 60 * 1000 } // 15 minutes
            );
            setSuggestions(suggestions);
        }
        catch (error) {
            console.error('Error loading suggestions:', error);
        }
    }), [user]);
    (0, react_1.useEffect)(() => {
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
                yield supabase_1.supabase
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
                yield supabase_1.supabase
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
    const renderJob = (0, react_1.useCallback)((job, matchScore, matchingSkills) => ((0, jsx_runtime_1.jsxs)("div", { className: "card hover:bg-white/10 transition-colors", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [job.company_logo && ((0, jsx_runtime_1.jsx)(LazyImage_1.LazyImage, { src: job.company_logo, alt: job.company, width: 48, height: 48, className: "rounded-lg" })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white", children: job.title }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => toggleFavorite(job.id), className: "text-primary-400 hover:text-primary-300 transition-colors", children: favorites[job.id] ? ((0, jsx_runtime_1.jsx)(solid_1.HeartIcon, { className: "h-6 w-6" })) : ((0, jsx_runtime_1.jsx)(outline_1.HeartIcon, { className: "h-6 w-6" })) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setShareJob(job), className: "text-primary-400 hover:text-primary-300 transition-colors", children: (0, jsx_runtime_1.jsx)(outline_1.ShareIcon, { className: "h-5 w-5" }) })] }), matchScore !== undefined && ((0, jsx_runtime_1.jsxs)("span", { className: "bg-primary-600/20 text-primary-400 text-sm px-2 py-1 rounded-full", children: [matchScore.toFixed(0), "% de correspondance"] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-1 flex flex-wrap gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: job.company }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "\u2022" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: job.location }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "\u2022" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: job.job_type }), job.remote_type && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "\u2022" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: job.remote_type })] })), job.experience_level && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "\u2022" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: job.experience_level })] }))] }), matchingSkills && matchingSkills.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "mt-2 flex flex-wrap gap-2", children: matchingSkills.map(skill => ((0, jsx_runtime_1.jsx)("span", { className: "bg-primary-600/20 text-primary-400 text-xs px-2 py-1 rounded-full", children: skill }, skill))) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [job.salary_min && job.salary_max && ((0, jsx_runtime_1.jsxs)("span", { className: "text-primary-400 font-semibold", children: [job.salary_min.toLocaleString(), " - ", job.salary_max.toLocaleString(), " ", job.currency] })), (0, jsx_runtime_1.jsx)("span", { className: "block text-sm text-gray-400", children: (0, date_fns_1.format)(new Date(job.posted_at), 'dd MMMM yyyy', { locale: locale_1.fr }) })] })] }), job.description && ((0, jsx_runtime_1.jsx)("p", { className: "mt-4 text-gray-400 line-clamp-3", children: job.description })), (0, jsx_runtime_1.jsx)("div", { className: "mt-4", children: (0, jsx_runtime_1.jsxs)("a", { href: job.url, target: "_blank", rel: "noopener noreferrer", className: "text-primary-400 hover:text-primary-300 text-sm font-medium", children: [t('common.view'), " \u2192"] }) })] })), [favorites, t, toggleFavorite]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "card mb-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "max-w-2xl", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-white mb-4", children: t('jobSearch.title') }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 mb-6", children: t('jobSearch.subtitle') })] }), (0, jsx_runtime_1.jsxs)("form", { className: "space-y-4", onSubmit: (e) => { e.preventDefault(); loadJobs(); }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1 relative", children: [(0, jsx_runtime_1.jsx)(outline_1.MagnifyingGlassIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: search, onChange: (e) => setSearch(e.target.value), placeholder: t('jobSearch.filters.keyword'), className: "w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), (0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => setShowAdvancedSearch(!showAdvancedSearch), className: "btn-secondary flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(outline_1.AdjustmentsHorizontalIcon, { className: "h-5 w-5" }), "Filtres avanc\u00E9s"] })] }), showAdvancedSearch && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Type de contrat" }), (0, jsx_runtime_1.jsxs)("select", { value: jobType, onChange: (e) => setJobType(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "Tous les types" }), jobTypes.map((type) => ((0, jsx_runtime_1.jsx)("option", { value: type.value, children: type.label }, type.value)))] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Mode de travail" }), (0, jsx_runtime_1.jsx)("select", { value: remote, onChange: (e) => setRemote(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", children: remoteOptions.map((option) => ((0, jsx_runtime_1.jsx)("option", { value: option.value, children: option.label }, option.value))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Niveau d'exp\u00E9rience" }), (0, jsx_runtime_1.jsx)("select", { value: experienceLevel, onChange: (e) => setExperienceLevel(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", children: experienceLevels.map((level) => ((0, jsx_runtime_1.jsx)("option", { value: level.value, children: level.label }, level.value))) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Localisation" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: location, onChange: (e) => setLocation(e.target.value), placeholder: "Ville ou r\u00E9gion", className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Salaire minimum" }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: salaryMin, onChange: (e) => setSalaryMin(e.target.value ? Number(e.target.value) : ''), placeholder: "Ex: 35000", className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Salaire maximum" }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: salaryMax, onChange: (e) => setSalaryMax(e.target.value ? Number(e.target.value) : ''), placeholder: "Ex: 75000", className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Trier par" }), (0, jsx_runtime_1.jsxs)("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "date", children: "Date de publication" }), (0, jsx_runtime_1.jsx)("option", { value: "salary", children: "Salaire" })] })] }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: resetFilters, className: "btn-secondary", children: "R\u00E9initialiser les filtres" })] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mt-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => {
                                                            setShowFavoritesOnly(!showFavoritesOnly);
                                                            loadJobs();
                                                        }, className: `btn-secondary flex items-center gap-2 ${showFavoritesOnly ? 'bg-primary-600 hover:bg-primary-500' : ''}`, children: [(0, jsx_runtime_1.jsx)(outline_1.HeartIcon, { className: "h-5 w-5" }), showFavoritesOnly ? 'Tous les emplois' : 'Voir mes favoris'] }), user && suggestions.length > 0 && ((0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => setShowSuggestions(!showSuggestions), className: `btn-secondary flex items-center gap-2 ${showSuggestions ? 'bg-primary-600 hover:bg-primary-500' : ''}`, children: [(0, jsx_runtime_1.jsx)(outline_1.SparklesIcon, { className: "h-5 w-5" }), "Suggestions"] }))] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "btn-primary", children: t('common.search') })] })] })] }), loading ? ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center py-12", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { size: "lg", text: "Chargement des offres d'emploi..." }) })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: showSuggestions ? (suggestions.length > 0 ? ((0, jsx_runtime_1.jsx)(VirtualizedList_1.VirtualizedList, { items: suggestions, height: 600, itemHeight: 200, renderItem: (suggestion) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, children: renderJob(suggestion.job, suggestion.matchScore, suggestion.matchingSkills) })) })) : ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-12 text-gray-400", children: "Aucune suggestion disponible. Compl\u00E9tez votre profil pour recevoir des suggestions personnalis\u00E9es." }))) : jobs.length > 0 ? ((0, jsx_runtime_1.jsx)(VirtualizedList_1.VirtualizedList, { items: jobs, height: 600, itemHeight: 200, renderItem: (job) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, children: renderJob(job) })) })) : ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-12 text-gray-400", children: "Aucune offre d'emploi ne correspond \u00E0 vos crit\u00E8res." })) }))] }), shareJob && ((0, jsx_runtime_1.jsx)(ShareModal_1.ShareModal, { isOpen: true, onClose: () => setShareJob(null), job: shareJob }))] }));
}
