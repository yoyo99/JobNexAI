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
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../stores/auth';
import { supabase } from '../../lib/supabase';
import { generateBulkApplicationMessages } from '../../lib/ai'; // Fix: remove .ts extension for TypeScript resolver
import { PaperAirplaneIcon, ArrowPathIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../LoadingSpinner';
export function AutomatedApplications() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [selectedJobs, setSelectedJobs] = useState({});
    const [applicationMessages, setApplicationMessages] = useState([]);
    const [cv, setCV] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    useEffect(() => {
        if (user) {
            loadJobs();
            loadCV();
        }
    }, [user]);
    const loadJobs = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            // Récupérer les offres d'emploi correspondant au profil de l'utilisateur
            const { data: suggestions, error: suggestionsError } = yield supabase
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
            // Type guard to ensure suggestion.job exists
            const formattedJobs = suggestions
                .filter((suggestion) => suggestion.job && suggestion.job.id)
                .map((suggestion) => ({
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
            const { data, error } = yield supabase
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
    // Génère les messages de candidature pour les jobs sélectionnés
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
            // Récupérer les descriptions des jobs sélectionnés
            const jobDescriptions = selectedJobsList.map((job) => ({
                id: job.id,
                description: job.description
            }));
            // Générer les messages de candidature
            const messages = yield generateBulkApplicationMessages(cv, jobDescriptions);
            // Formater les messages avec l'état de sélection
            setApplicationMessages(messages.filter((msg) => msg.message !== null)
                .map((msg) => {
                var _a;
                return ({
                    jobId: msg.jobId,
                    message: (_a = msg.message) !== null && _a !== void 0 ? _a : '',
                    selected: true
                });
            }));
        }
        catch (error) {
            console.error('Error generating application messages:', error);
            setError('Erreur lors de la génération des messages de candidature');
        }
        finally {
            setGenerating(false);
        }
    });
    // Toggle la sélection d'un message de candidature
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
                const { error } = yield supabase
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
        return (_jsx("div", { className: "flex justify-center py-12", children: _jsx(LoadingSpinner, { size: "lg", text: "Chargement des offres d'emploi..." }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-xl font-semibold text-white", children: "Candidatures automatis\u00E9es" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: selectAllJobs, className: "btn-secondary text-sm", children: "Tout s\u00E9lectionner" }), _jsx("button", { onClick: deselectAllJobs, className: "btn-secondary text-sm", children: "Tout d\u00E9s\u00E9lectionner" })] })] }), error && (_jsx("div", { className: "bg-red-900/50 text-red-400 p-4 rounded-lg", children: error })), success && (_jsx("div", { className: "bg-green-900/50 text-green-400 p-4 rounded-lg", children: success })), !cv && (_jsx("div", { className: "bg-yellow-900/50 text-yellow-400 p-4 rounded-lg", children: "Veuillez d'abord cr\u00E9er un CV dans la section CV Builder pour utiliser cette fonctionnalit\u00E9." })), jobs.length === 0 ? (_jsx("div", { className: "text-center py-12 text-gray-400", children: "Aucune offre d'emploi correspondant \u00E0 votre profil n'a \u00E9t\u00E9 trouv\u00E9e." })) : (_jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-gray-400", children: "S\u00E9lectionnez les offres d'emploi pour lesquelles vous souhaitez g\u00E9n\u00E9rer des candidatures automatis\u00E9es." }), _jsx("div", { className: "space-y-4", children: jobs.map((job) => (_jsx("div", { className: `bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors ${selectedJobs[job.id] ? 'border border-primary-500' : 'border border-transparent'}`, children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "pt-1", children: _jsx("input", { type: "checkbox", checked: selectedJobs[job.id] || false, onChange: () => toggleJobSelection(job.id), className: "h-5 w-5 rounded border-white/10 bg-white/5 text-primary-500 focus:ring-primary-500" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-medium text-white", children: job.title }), _jsxs("p", { className: "text-gray-400", children: [job.company, " \u2022 ", job.location] }), _jsx("p", { className: "mt-2 text-sm text-gray-300 line-clamp-2", children: job.description }), _jsx("div", { className: "mt-2", children: _jsx("a", { href: job.url, target: "_blank", rel: "noopener noreferrer", className: "text-primary-400 hover:text-primary-300 text-sm", children: "Voir l'offre \u2192" }) })] })] }) }, job.id))) }), _jsx("div", { className: "flex justify-center", children: _jsx("button", { onClick: generateApplicationMessages, disabled: generating || Object.keys(selectedJobs).filter(id => selectedJobs[id]).length === 0 || !cv, className: "btn-primary flex items-center gap-2", children: generating ? (_jsxs(_Fragment, { children: [_jsx(LoadingSpinner, { size: "sm" }), "G\u00E9n\u00E9ration en cours..."] })) : (_jsxs(_Fragment, { children: [_jsx(DocumentTextIcon, { className: "h-5 w-5" }), "G\u00E9n\u00E9rer les messages de candidature"] })) }) })] })), applicationMessages.length > 0 && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "mt-8 space-y-6", children: [_jsx("h2", { className: "text-xl font-semibold text-white", children: "Messages de candidature g\u00E9n\u00E9r\u00E9s" }), _jsx("div", { className: "space-y-4", children: applicationMessages.map((appMsg) => {
                            const job = jobs.find(j => j.id === appMsg.jobId);
                            return (_jsx("div", { className: `bg-white/5 rounded-lg p-4 ${appMsg.selected ? 'border border-primary-500' : 'border border-transparent'}`, children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "pt-1", children: _jsx("input", { type: "checkbox", checked: appMsg.selected, onChange: () => toggleMessageSelection(appMsg.jobId), className: "h-5 w-5 rounded border-white/10 bg-white/5 text-primary-500 focus:ring-primary-500" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-medium text-white", children: job === null || job === void 0 ? void 0 : job.title }), _jsxs("p", { className: "text-gray-400", children: [job === null || job === void 0 ? void 0 : job.company, " \u2022 ", job === null || job === void 0 ? void 0 : job.location] }), _jsx("div", { className: "mt-4 bg-white/10 rounded-lg p-4", children: _jsx("p", { className: "text-white whitespace-pre-line", children: appMsg.message }) }), _jsx("div", { className: "mt-2 flex justify-end", children: _jsxs("button", { onClick: () => {
                                                            // Régénérer ce message spécifique
                                                            setGenerating(true);
                                                            generateBulkApplicationMessages(cv, [{ id: appMsg.jobId, description: (job === null || job === void 0 ? void 0 : job.description) || '' }])
                                                                .then((messages) => {
                                                                if (messages.length > 0) {
                                                                    setApplicationMessages((prev) => prev.map((msg) => msg.jobId === appMsg.jobId
                                                                        ? Object.assign(Object.assign({}, msg), { message: messages[0].message }) : msg));
                                                                }
                                                            })
                                                                .catch((error) => {
                                                                console.error('Error regenerating message:', error);
                                                                setError('Erreur lors de la régénération du message');
                                                            })
                                                                .finally(() => {
                                                                setGenerating(false);
                                                            });
                                                        }, className: "text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1", children: [_jsx(ArrowPathIcon, { className: "h-4 w-4" }), "R\u00E9g\u00E9n\u00E9rer"] }) })] })] }) }, appMsg.jobId));
                        }) }), _jsx("div", { className: "flex justify-center", children: _jsx("button", { onClick: submitApplications, disabled: submitting || applicationMessages.filter((msg) => msg.selected).length === 0, className: "btn-primary flex items-center gap-2", children: submitting ? (_jsxs(_Fragment, { children: [_jsx(LoadingSpinner, { size: "sm" }), "Envoi en cours..."] })) : (_jsxs(_Fragment, { children: [_jsx(PaperAirplaneIcon, { className: "h-5 w-5" }), "Envoyer les candidatures"] })) }) })] }))] }));
}
