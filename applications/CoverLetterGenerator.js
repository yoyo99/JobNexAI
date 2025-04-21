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
exports.CoverLetterGenerator = CoverLetterGenerator;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const auth_1 = require("../../stores/auth");
const supabase_1 = require("../../lib/supabase");
const ai_1 = require("../../lib/ai");
const outline_1 = require("@heroicons/react/24/outline");
const LoadingSpinner_1 = require("../LoadingSpinner");
function CoverLetterGenerator() {
    const { user } = (0, auth_1.useAuth)();
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [generating, setGenerating] = (0, react_1.useState)(false);
    const [jobs, setJobs] = (0, react_1.useState)([]);
    const [selectedJobId, setSelectedJobId] = (0, react_1.useState)(null);
    const [cv, setCV] = (0, react_1.useState)(null);
    const [coverLetter, setCoverLetter] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const [copied, setCopied] = (0, react_1.useState)(false);
    const [language, setLanguage] = (0, react_1.useState)('fr');
    const [tone, setTone] = (0, react_1.useState)('professional');
    (0, react_1.useEffect)(() => {
        if (user) {
            loadJobs();
            loadCV();
        }
    }, [user]);
    const loadJobs = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            // Récupérer les offres d'emploi correspondant au profil de l'utilisateur
            const { data: suggestions, error: suggestionsError } = yield supabase_1.supabase
                .from('job_suggestions')
                .select(`
          job_id,
          match_score,
          job:jobs (
            id,
            title,
            company,
            location,
            description,
            url
          )
        `)
                .eq('user_id', user === null || user === void 0 ? void 0 : user.id)
                .order('match_score', { ascending: false })
                .limit(10);
            if (suggestionsError)
                throw suggestionsError;
            // Formater les données
            const formattedJobs = suggestions.map(suggestion => ({
                id: suggestion.job.id,
                title: suggestion.job.title,
                company: suggestion.job.company,
                location: suggestion.job.location,
                description: suggestion.job.description || '',
                url: suggestion.job.url,
                matchScore: suggestion.match_score
            }));
            setJobs(formattedJobs);
        }
        catch (error) {
            console.error('Error loading jobs:', error);
            setError('Erreur lors du chargement des offres d\'emploi');
        }
        finally {
            setLoading(false);
        }
    });
    const loadCV = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabase_1.supabase
                .from('user_cvs')
                .select('content')
                .eq('user_id', user === null || user === void 0 ? void 0 : user.id)
                .single();
            if (error)
                throw error;
            setCV((data === null || data === void 0 ? void 0 : data.content) || null);
        }
        catch (error) {
            console.error('Error loading CV:', error);
            setError('Veuillez d\'abord créer un CV dans la section CV Builder');
        }
    });
    const handleGenerateCoverLetter = () => __awaiter(this, void 0, void 0, function* () {
        if (!cv) {
            setError('Veuillez d\'abord créer un CV dans la section CV Builder');
            return;
        }
        if (!selectedJobId) {
            setError('Veuillez sélectionner une offre d\'emploi');
            return;
        }
        const selectedJob = jobs.find(job => job.id === selectedJobId);
        if (!selectedJob) {
            setError('Offre d\'emploi non trouvée');
            return;
        }
        try {
            setGenerating(true);
            setError(null);
            setCoverLetter(null);
            const letter = yield (0, ai_1.generateCoverLetter)(cv, selectedJob.description, language, tone);
            setCoverLetter(letter || 'Erreur lors de la génération de la lettre de motivation');
        }
        catch (error) {
            console.error('Error generating cover letter:', error);
            setError('Erreur lors de la génération de la lettre de motivation');
        }
        finally {
            setGenerating(false);
        }
    });
    const handleCopy = () => {
        if (!coverLetter)
            return;
        navigator.clipboard.writeText(coverLetter)
            .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        })
            .catch(err => {
            console.error('Error copying text:', err);
        });
    };
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center py-12", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { size: "lg", text: "Chargement des offres d'emploi..." }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-white", children: "G\u00E9n\u00E9rateur de lettres de motivation" }), error && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-900/50 text-red-400 p-4 rounded-lg", children: error })), !cv && ((0, jsx_runtime_1.jsx)("div", { className: "bg-yellow-900/50 text-yellow-400 p-4 rounded-lg", children: "Veuillez d'abord cr\u00E9er un CV dans la section CV Builder pour utiliser cette fonctionnalit\u00E9." })), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-white", children: "1. S\u00E9lectionnez une offre d'emploi" }), jobs.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-6 text-gray-400", children: "Aucune offre d'emploi correspondant \u00E0 votre profil n'a \u00E9t\u00E9 trouv\u00E9e." })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-2 max-h-96 overflow-y-auto pr-2", children: jobs.map((job) => ((0, jsx_runtime_1.jsxs)("div", { className: `bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer ${selectedJobId === job.id ? 'border border-primary-500' : 'border border-transparent'}`, onClick: () => setSelectedJobId(job.id), children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium", children: job.title }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-400 text-sm", children: [job.company, " \u2022 ", job.location] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2 flex justify-between items-center", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-xs bg-primary-600/20 text-primary-400 px-2 py-1 rounded-full", children: [job.matchScore.toFixed(0), "% de correspondance"] }), (0, jsx_runtime_1.jsx)("a", { href: job.url, target: "_blank", rel: "noopener noreferrer", className: "text-primary-400 hover:text-primary-300 text-sm", onClick: (e) => e.stopPropagation(), children: "Voir l'offre \u2192" })] })] }, job.id))) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-white", children: "2. Personnalisez votre lettre" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Langue" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setLanguage('fr'), className: `px-4 py-2 rounded-lg text-sm ${language === 'fr'
                                                            ? 'bg-primary-600 text-white'
                                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'}`, children: "Fran\u00E7ais" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setLanguage('en'), className: `px-4 py-2 rounded-lg text-sm ${language === 'en'
                                                            ? 'bg-primary-600 text-white'
                                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'}`, children: "English" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setLanguage('es'), className: `px-4 py-2 rounded-lg text-sm ${language === 'es'
                                                            ? 'bg-primary-600 text-white'
                                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'}`, children: "Espa\u00F1ol" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setLanguage('de'), className: `px-4 py-2 rounded-lg text-sm ${language === 'de'
                                                            ? 'bg-primary-600 text-white'
                                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'}`, children: "Deutsch" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Ton" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setTone('professional'), className: `px-4 py-2 rounded-lg text-sm ${tone === 'professional'
                                                            ? 'bg-primary-600 text-white'
                                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'}`, children: "Professionnel" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setTone('conversational'), className: `px-4 py-2 rounded-lg text-sm ${tone === 'conversational'
                                                            ? 'bg-primary-600 text-white'
                                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'}`, children: "Conversationnel" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setTone('enthusiastic'), className: `px-4 py-2 rounded-lg text-sm ${tone === 'enthusiastic'
                                                            ? 'bg-primary-600 text-white'
                                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'}`, children: "Enthousiaste" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-center pt-4", children: (0, jsx_runtime_1.jsx)("button", { onClick: handleGenerateCoverLetter, disabled: generating || !selectedJobId || !cv, className: "btn-primary flex items-center gap-2", children: generating ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { size: "sm" }), "G\u00E9n\u00E9ration en cours..."] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(outline_1.SparklesIcon, { className: "h-5 w-5" }), "G\u00E9n\u00E9rer la lettre de motivation"] })) }) })] })] })] }), coverLetter && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "mt-8 space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-white", children: "Lettre de motivation g\u00E9n\u00E9r\u00E9e" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: handleGenerateCoverLetter, disabled: generating, className: "btn-secondary flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(outline_1.ArrowPathIcon, { className: "h-5 w-5" }), "R\u00E9g\u00E9n\u00E9rer"] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleCopy, className: "btn-secondary flex items-center gap-2", children: copied ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(outline_1.CheckIcon, { className: "h-5 w-5" }), "Copi\u00E9 !"] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(outline_1.ClipboardIcon, { className: "h-5 w-5" }), "Copier"] })) })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/10 rounded-lg p-6 whitespace-pre-line", children: (0, jsx_runtime_1.jsx)("p", { className: "text-white", children: coverLetter }) })] }))] }));
}
