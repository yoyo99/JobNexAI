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
import { generateCoverLetter } from '../../lib/ai'; // Fix: remove .ts extension for TypeScript resolver
import { ArrowPathIcon, ClipboardIcon, CheckIcon, SparklesIcon } from '@heroicons/react/24/outline'; // Remove unused icons
import { LoadingSpinner } from '../LoadingSpinner';
export function CoverLetterGenerator() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [cv, setCV] = useState(null);
    const [coverLetter, setCoverLetter] = useState(null);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [language, setLanguage] = useState('fr');
    const [tone, setTone] = useState('professional');
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
            const letter = yield generateCoverLetter(cv, selectedJob.description, language, tone);
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
        return (_jsx("div", { className: "flex justify-center py-12", children: _jsx(LoadingSpinner, { size: "lg", text: "Chargement des offres d'emploi..." }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h2", { className: "text-xl font-semibold text-white", children: "G\u00E9n\u00E9rateur de lettres de motivation" }), error && (_jsx("div", { className: "bg-red-900/50 text-red-400 p-4 rounded-lg", children: error })), !cv && (_jsx("div", { className: "bg-yellow-900/50 text-yellow-400 p-4 rounded-lg", children: "Veuillez d'abord cr\u00E9er un CV dans la section CV Builder pour utiliser cette fonctionnalit\u00E9." })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-medium text-white", children: "1. S\u00E9lectionnez une offre d'emploi" }), jobs.length === 0 ? (_jsx("div", { className: "text-center py-6 text-gray-400", children: "Aucune offre d'emploi correspondant \u00E0 votre profil n'a \u00E9t\u00E9 trouv\u00E9e." })) : (_jsx("div", { className: "space-y-2 max-h-96 overflow-y-auto pr-2", children: jobs.map((job) => {
                                    var _a, _b;
                                    return (_jsxs("div", { className: `bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer ${selectedJobId === job.id ? 'border border-primary-500' : 'border border-transparent'}`, onClick: () => setSelectedJobId(job.id), children: [_jsx("h4", { className: "text-white font-medium", children: job.title }), _jsxs("p", { className: "text-gray-400 text-sm", children: [job.company, " \u2022 ", job.location] }), _jsxs("div", { className: "mt-2 flex justify-between items-center", children: [_jsxs("span", { className: "text-xs bg-primary-600/20 text-primary-400 px-2 py-1 rounded-full", children: [(_b = (_a = job.matchScore) === null || _a === void 0 ? void 0 : _a.toFixed(0)) !== null && _b !== void 0 ? _b : 'N/A', "% de correspondance"] }), _jsx("a", { href: job.url, target: "_blank", rel: "noopener noreferrer", className: "text-primary-400 hover:text-primary-300 text-sm", onClick: (e) => e.stopPropagation(), children: "Voir l'offre \u2192" })] })] }, job.id));
                                }) }))] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-medium text-white", children: "2. Personnalisez votre lettre" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Langue" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setLanguage('fr'), className: `px-4 py-2 rounded-lg text-sm ${language === 'fr'
                                                            ? 'bg-primary-600 text-white'
                                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'}`, children: "Fran\u00E7ais" }), _jsx("button", { onClick: () => setLanguage('en'), className: `px-4 py-2 rounded-lg text-sm ${language === 'en'
                                                            ? 'bg-primary-600 text-white'
                                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'}`, children: "English" }), _jsx("button", { onClick: () => setLanguage('es'), className: `px-4 py-2 rounded-lg text-sm ${language === 'es'
                                                            ? 'bg-primary-600 text-white'
                                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'}`, children: "Espa\u00F1ol" }), _jsx("button", { onClick: () => setLanguage('de'), className: `px-4 py-2 rounded-lg text-sm ${language === 'de'
                                                            ? 'bg-primary-600 text-white'
                                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'}`, children: "Deutsch" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Ton" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setTone('professional'), className: `px-4 py-2 rounded-lg text-sm ${tone === 'professional'
                                                            ? 'bg-primary-600 text-white'
                                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'}`, children: "Professionnel" }), _jsx("button", { onClick: () => setTone('conversational'), className: `px-4 py-2 rounded-lg text-sm ${tone === 'conversational'
                                                            ? 'bg-primary-600 text-white'
                                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'}`, children: "Conversationnel" }), _jsx("button", { onClick: () => setTone('enthusiastic'), className: `px-4 py-2 rounded-lg text-sm ${tone === 'enthusiastic'
                                                            ? 'bg-primary-600 text-white'
                                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'}`, children: "Enthousiaste" })] })] }), _jsx("div", { className: "flex justify-center pt-4", children: _jsx("button", { onClick: handleGenerateCoverLetter, disabled: generating || !selectedJobId || !cv, className: "btn-primary flex items-center gap-2", children: generating ? (_jsxs(_Fragment, { children: [_jsx(LoadingSpinner, { size: "sm" }), "G\u00E9n\u00E9ration en cours..."] })) : (_jsxs(_Fragment, { children: [_jsx(SparklesIcon, { className: "h-5 w-5" }), "G\u00E9n\u00E9rer la lettre de motivation"] })) }) })] })] })] }), coverLetter && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "mt-8 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-medium text-white", children: "Lettre de motivation g\u00E9n\u00E9r\u00E9e" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: handleGenerateCoverLetter, disabled: generating, className: "btn-secondary flex items-center gap-2", children: [_jsx(ArrowPathIcon, { className: "h-5 w-5" }), "R\u00E9g\u00E9n\u00E9rer"] }), _jsx("button", { onClick: handleCopy, className: "btn-secondary flex items-center gap-2", children: copied ? (_jsxs(_Fragment, { children: [_jsx(CheckIcon, { className: "h-5 w-5" }), "Copi\u00E9 !"] })) : (_jsxs(_Fragment, { children: [_jsx(ClipboardIcon, { className: "h-5 w-5" }), "Copier"] })) })] })] }), _jsx("div", { className: "bg-white/10 rounded-lg p-6 whitespace-pre-line", children: _jsx("p", { className: "text-white", children: coverLetter }) })] }))] }));
}
