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
exports.AutomatedApplications = AutomatedApplications;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const auth_1 = require("../../stores/auth");
const supabase_1 = require("../../lib/supabase");
const ai_1 = require("../../lib/ai");
const outline_1 = require("@heroicons/react/24/outline");
const LoadingSpinner_1 = require("../LoadingSpinner");
function AutomatedApplications() {
    const { user } = (0, auth_1.useAuth)();
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [generating, setGenerating] = (0, react_1.useState)(false);
    const [submitting, setSubmitting] = (0, react_1.useState)(false);
    const [jobs, setJobs] = (0, react_1.useState)([]);
    const [selectedJobs, setSelectedJobs] = (0, react_1.useState)({});
    const [applicationMessages, setApplicationMessages] = (0, react_1.useState)([]);
    const [cv, setCV] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const [success, setSuccess] = (0, react_1.useState)(null);
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
    const toggleJobSelection = (jobId) => {
        setSelectedJobs(prev => (Object.assign(Object.assign({}, prev), { [jobId]: !prev[jobId] })));
    };
    const selectAllJobs = () => {
        const newSelection = {};
        jobs.forEach(job => {
            newSelection[job.id] = true;
        });
        setSelectedJobs(newSelection);
    };
    const deselectAllJobs = () => {
        setSelectedJobs({});
    };
    const generateApplicationMessages = () => __awaiter(this, void 0, void 0, function* () {
        if (!cv) {
            setError('Veuillez d\'abord créer un CV dans la section CV Builder');
            return;
        }
        const selectedJobsList = jobs.filter(job => selectedJobs[job.id]);
        if (selectedJobsList.length === 0) {
            setError('Veuillez sélectionner au moins une offre d\'emploi');
            return;
        }
        try {
            setGenerating(true);
            setError(null);
            const jobDescriptions = selectedJobsList.map(job => ({
                id: job.id,
                description: job.description
            }));
            const messages = yield (0, ai_1.generateBulkApplicationMessages)(cv, jobDescriptions);
            // Formater les messages avec l'état de sélection
            const formattedMessages = messages.map(msg => (Object.assign(Object.assign({}, msg), { selected: true })));
            setApplicationMessages(formattedMessages);
        }
        catch (error) {
            console.error('Error generating application messages:', error);
            setError('Erreur lors de la génération des messages de candidature');
        }
        finally {
            setGenerating(false);
        }
    });
    const toggleMessageSelection = (jobId) => {
        setApplicationMessages(prev => prev.map(msg => msg.jobId === jobId ? Object.assign(Object.assign({}, msg), { selected: !msg.selected }) : msg));
    };
    const submitApplications = () => __awaiter(this, void 0, void 0, function* () {
        const selectedMessages = applicationMessages.filter(msg => msg.selected);
        if (selectedMessages.length === 0) {
            setError('Veuillez sélectionner au moins un message à envoyer');
            return;
        }
        try {
            setSubmitting(true);
            setError(null);
            // Pour chaque message sélectionné, créer une candidature
            for (const message of selectedMessages) {
                const job = jobs.find(j => j.id === message.jobId);
                if (!job)
                    continue;
                // Créer la candidature dans la base de données
                const { error } = yield supabase_1.supabase
                    .from('job_applications')
                    .insert({
                    user_id: user === null || user === void 0 ? void 0 : user.id,
                    job_id: message.jobId,
                    status: 'applied',
                    notes: message.message,
                    applied_at: new Date().toISOString()
                });
                if (error)
                    throw error;
            }
            setSuccess(`${selectedMessages.length} candidature(s) envoyée(s) avec succès`);
            // Réinitialiser l'état
            setSelectedJobs({});
            setApplicationMessages([]);
            // Recharger les offres après un court délai
            setTimeout(() => {
                loadJobs();
            }, 2000);
        }
        catch (error) {
            console.error('Error submitting applications:', error);
            setError('Erreur lors de l\'envoi des candidatures');
        }
        finally {
            setSubmitting(false);
        }
    });
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center py-12", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { size: "lg", text: "Chargement des offres d'emploi..." }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-white", children: "Candidatures automatis\u00E9es" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: selectAllJobs, className: "btn-secondary text-sm", children: "Tout s\u00E9lectionner" }), (0, jsx_runtime_1.jsx)("button", { onClick: deselectAllJobs, className: "btn-secondary text-sm", children: "Tout d\u00E9s\u00E9lectionner" })] })] }), error && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-900/50 text-red-400 p-4 rounded-lg", children: error })), success && ((0, jsx_runtime_1.jsx)("div", { className: "bg-green-900/50 text-green-400 p-4 rounded-lg", children: success })), !cv && ((0, jsx_runtime_1.jsx)("div", { className: "bg-yellow-900/50 text-yellow-400 p-4 rounded-lg", children: "Veuillez d'abord cr\u00E9er un CV dans la section CV Builder pour utiliser cette fonctionnalit\u00E9." })), jobs.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-12 text-gray-400", children: "Aucune offre d'emploi correspondant \u00E0 votre profil n'a \u00E9t\u00E9 trouv\u00E9e." })) : ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "S\u00E9lectionnez les offres d'emploi pour lesquelles vous souhaitez g\u00E9n\u00E9rer des candidatures automatis\u00E9es." }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: jobs.map((job) => ((0, jsx_runtime_1.jsx)("div", { className: `bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors ${selectedJobs[job.id] ? 'border border-primary-500' : 'border border-transparent'}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "pt-1", children: (0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: selectedJobs[job.id] || false, onChange: () => toggleJobSelection(job.id), className: "h-5 w-5 rounded border-white/10 bg-white/5 text-primary-500 focus:ring-primary-500" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-white", children: job.title }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-400", children: [job.company, " \u2022 ", job.location] }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm text-gray-300 line-clamp-2", children: job.description }), (0, jsx_runtime_1.jsx)("div", { className: "mt-2", children: (0, jsx_runtime_1.jsx)("a", { href: job.url, target: "_blank", rel: "noopener noreferrer", className: "text-primary-400 hover:text-primary-300 text-sm", children: "Voir l'offre \u2192" }) })] })] }) }, job.id))) }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-center", children: (0, jsx_runtime_1.jsx)("button", { onClick: generateApplicationMessages, disabled: generating || Object.keys(selectedJobs).filter(id => selectedJobs[id]).length === 0 || !cv, className: "btn-primary flex items-center gap-2", children: generating ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { size: "sm" }), "G\u00E9n\u00E9ration en cours..."] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(outline_1.DocumentTextIcon, { className: "h-5 w-5" }), "G\u00E9n\u00E9rer les messages de candidature"] })) }) })] })), applicationMessages.length > 0 && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "mt-8 space-y-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-white", children: "Messages de candidature g\u00E9n\u00E9r\u00E9s" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: applicationMessages.map((appMsg) => {
                            const job = jobs.find(j => j.id === appMsg.jobId);
                            return ((0, jsx_runtime_1.jsx)("div", { className: `bg-white/5 rounded-lg p-4 ${appMsg.selected ? 'border border-primary-500' : 'border border-transparent'}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "pt-1", children: (0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: appMsg.selected, onChange: () => toggleMessageSelection(appMsg.jobId), className: "h-5 w-5 rounded border-white/10 bg-white/5 text-primary-500 focus:ring-primary-500" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-white", children: job === null || job === void 0 ? void 0 : job.title }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-400", children: [job === null || job === void 0 ? void 0 : job.company, " \u2022 ", job === null || job === void 0 ? void 0 : job.location] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 bg-white/10 rounded-lg p-4", children: (0, jsx_runtime_1.jsx)("p", { className: "text-white whitespace-pre-line", children: appMsg.message }) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-2 flex justify-end", children: (0, jsx_runtime_1.jsxs)("button", { onClick: () => {
                                                            // Régénérer ce message spécifique
                                                            setGenerating(true);
                                                            (0, ai_1.generateBulkApplicationMessages)(cv, [{ id: appMsg.jobId, description: (job === null || job === void 0 ? void 0 : job.description) || '' }])
                                                                .then(messages => {
                                                                if (messages.length > 0) {
                                                                    setApplicationMessages(prev => prev.map(msg => msg.jobId === appMsg.jobId
                                                                        ? Object.assign(Object.assign({}, msg), { message: messages[0].message }) : msg));
                                                                }
                                                            })
                                                                .catch(error => {
                                                                console.error('Error regenerating message:', error);
                                                                setError('Erreur lors de la régénération du message');
                                                            })
                                                                .finally(() => {
                                                                setGenerating(false);
                                                            });
                                                        }, className: "text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(outline_1.ArrowPathIcon, { className: "h-4 w-4" }), "R\u00E9g\u00E9n\u00E9rer"] }) })] })] }) }, appMsg.jobId));
                        }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-center", children: (0, jsx_runtime_1.jsx)("button", { onClick: submitApplications, disabled: submitting || applicationMessages.filter(msg => msg.selected).length === 0, className: "btn-primary flex items-center gap-2", children: submitting ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { size: "sm" }), "Envoi en cours..."] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(outline_1.PaperAirplaneIcon, { className: "h-5 w-5" }), "Envoyer les candidatures"] })) }) })] }))] }));
}
