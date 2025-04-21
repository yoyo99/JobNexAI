var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../stores/auth';
import { PlusIcon, TrashIcon, ArrowLeftIcon, } from '@heroicons/react/24/outline';
export function CreateJobPosting() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    // Récupérer l'ID de l'offre à modifier depuis les paramètres d'URL
    const searchParams = new URLSearchParams(location.search);
    const editJobId = searchParams.get('edit');
    const [jobPosting, setJobPosting] = useState({
        title: '',
        company: '',
        location: '',
        job_type: 'FULL_TIME',
        salary_min: '',
        salary_max: '',
        remote_type: 'hybrid',
        experience_level: 'mid',
        description: '',
        requirements: [''],
        status: 'draft'
    });
    useEffect(() => {
        if (editJobId) {
            loadJobPosting(editJobId);
        }
    }, [editJobId]);
    const loadJobPosting = (id) => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            // Simuler un appel API pour récupérer l'offre d'emploi
            // Dans une vraie application, cela serait remplacé par un appel à Supabase
            const mockJobPosting = {
                id: 'job1',
                title: 'Développeur React Senior',
                company: 'TechInnovate',
                location: 'Paris',
                job_type: 'FULL_TIME',
                salary_min: 55000,
                salary_max: 70000,
                remote_type: 'hybrid',
                experience_level: 'senior',
                description: 'Nous recherchons un développeur React expérimenté pour rejoindre notre équipe...',
                requirements: [
                    '5+ ans d\'expérience en React',
                    'Maîtrise de TypeScript',
                    'Expérience avec les API GraphQL'
                ],
                status: 'active'
            };
            setJobPosting(mockJobPosting);
        }
        catch (error) {
            console.error('Error loading job posting:', error);
        }
        finally {
            setLoading(false);
        }
    });
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        // Validation de base
        if (!jobPosting.title || !jobPosting.description || !jobPosting.location) {
            setMessage({ type: 'error', text: 'Veuillez remplir tous les champs obligatoires' });
            return;
        }
        try {
            setSaving(true);
            setMessage(null);
            // Simuler un délai pour l'enregistrement
            yield new Promise(resolve => setTimeout(resolve, 1000));
            // Dans une vraie application, on sauvegarderait l'offre dans Supabase
            console.log('Saving job posting:', jobPosting);
            setMessage({ type: 'success', text: 'Offre d\'emploi enregistrée avec succès' });
            // Rediriger vers la liste des offres après un court délai
            setTimeout(() => {
                navigate('/recruiter/job-postings');
            }, 1500);
        }
        catch (error) {
            console.error('Error saving job posting:', error);
            setMessage({ type: 'error', text: error.message || 'Une erreur est survenue' });
        }
        finally {
            setSaving(false);
        }
    });
    const addRequirement = () => {
        setJobPosting(Object.assign(Object.assign({}, jobPosting), { requirements: [...jobPosting.requirements, ''] }));
    };
    const updateRequirement = (index, value) => {
        const updatedRequirements = [...jobPosting.requirements];
        updatedRequirements[index] = value;
        setJobPosting(Object.assign(Object.assign({}, jobPosting), { requirements: updatedRequirements }));
    };
    const removeRequirement = (index) => {
        const updatedRequirements = [...jobPosting.requirements];
        updatedRequirements.splice(index, 1);
        setJobPosting(Object.assign(Object.assign({}, jobPosting), { requirements: updatedRequirements }));
    };
    if (loading) {
        return (_jsx("div", { className: "flex justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    return (_jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "flex items-center gap-4 mb-8", children: [_jsx("button", { onClick: () => navigate('/recruiter/job-postings'), className: "p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5", children: _jsx(ArrowLeftIcon, { className: "h-5 w-5" }) }), _jsx("h1", { className: "text-2xl font-bold text-white", children: editJobId ? 'Modifier l\'offre d\'emploi' : 'Créer une offre d\'emploi' })] }), message && (_jsx(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: `mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`, children: message.text })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-lg font-semibold text-white mb-4", children: "Informations de base" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Titre du poste *" }), _jsx("input", { type: "text", value: jobPosting.title, onChange: (e) => setJobPosting(Object.assign(Object.assign({}, jobPosting), { title: e.target.value })), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Entreprise *" }), _jsx("input", { type: "text", value: jobPosting.company, onChange: (e) => setJobPosting(Object.assign(Object.assign({}, jobPosting), { company: e.target.value })), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", required: true })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Localisation *" }), _jsx("input", { type: "text", value: jobPosting.location, onChange: (e) => setJobPosting(Object.assign(Object.assign({}, jobPosting), { location: e.target.value })), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Type de contrat *" }), _jsxs("select", { value: jobPosting.job_type, onChange: (e) => setJobPosting(Object.assign(Object.assign({}, jobPosting), { job_type: e.target.value })), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", required: true, children: [_jsx("option", { value: "FULL_TIME", children: "Temps plein" }), _jsx("option", { value: "PART_TIME", children: "Temps partiel" }), _jsx("option", { value: "CONTRACT", children: "CDD" }), _jsx("option", { value: "FREELANCE", children: "Freelance" }), _jsx("option", { value: "INTERNSHIP", children: "Stage" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Salaire minimum" }), _jsx("input", { type: "number", value: jobPosting.salary_min, onChange: (e) => setJobPosting(Object.assign(Object.assign({}, jobPosting), { salary_min: e.target.value ? Number(e.target.value) : '' })), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", placeholder: "Ex: 45000" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Salaire maximum" }), _jsx("input", { type: "number", value: jobPosting.salary_max, onChange: (e) => setJobPosting(Object.assign(Object.assign({}, jobPosting), { salary_max: e.target.value ? Number(e.target.value) : '' })), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", placeholder: "Ex: 60000" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Type de travail *" }), _jsxs("select", { value: jobPosting.remote_type, onChange: (e) => setJobPosting(Object.assign(Object.assign({}, jobPosting), { remote_type: e.target.value })), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", required: true, children: [_jsx("option", { value: "remote", children: "\u00C0 distance" }), _jsx("option", { value: "hybrid", children: "Hybride" }), _jsx("option", { value: "onsite", children: "Sur site" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Niveau d'exp\u00E9rience *" }), _jsxs("select", { value: jobPosting.experience_level, onChange: (e) => setJobPosting(Object.assign(Object.assign({}, jobPosting), { experience_level: e.target.value })), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", required: true, children: [_jsx("option", { value: "junior", children: "Junior (0-2 ans)" }), _jsx("option", { value: "mid", children: "Confirm\u00E9 (3-5 ans)" }), _jsx("option", { value: "senior", children: "Senior (5+ ans)" })] })] })] })] })] }), _jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-lg font-semibold text-white mb-4", children: "Description et pr\u00E9requis" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Description du poste *" }), _jsx("textarea", { value: jobPosting.description, onChange: (e) => setJobPosting(Object.assign(Object.assign({}, jobPosting), { description: e.target.value })), rows: 6, className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", required: true })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-400", children: "Pr\u00E9requis *" }), _jsx("button", { type: "button", onClick: addRequirement, className: "text-primary-400 hover:text-primary-300", children: _jsx(PlusIcon, { className: "h-5 w-5" }) })] }), _jsx("div", { className: "space-y-2", children: jobPosting.requirements.map((requirement, index) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "text", value: requirement, onChange: (e) => updateRequirement(index, e.target.value), className: "flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", placeholder: "Ex: 3+ ans d'exp\u00E9rience en d\u00E9veloppement React" }), _jsx("button", { type: "button", onClick: () => removeRequirement(index), className: "text-gray-400 hover:text-red-400", disabled: jobPosting.requirements.length <= 1, children: _jsx(TrashIcon, { className: "h-5 w-5" }) })] }, index))) })] })] })] }), _jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-lg font-semibold text-white mb-4", children: "Publication" }), _jsx("div", { className: "space-y-4", children: _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Statut de l'offre" }), _jsxs("select", { value: jobPosting.status, onChange: (e) => setJobPosting(Object.assign(Object.assign({}, jobPosting), { status: e.target.value })), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "draft", children: "Brouillon" }), _jsx("option", { value: "active", children: "Publier imm\u00E9diatement" }), _jsx("option", { value: "paused", children: "Enregistrer mais ne pas publier" })] })] }) })] }), _jsxs("div", { className: "flex justify-end gap-4", children: [_jsx("button", { type: "button", onClick: () => navigate('/recruiter/job-postings'), className: "btn-secondary", children: "Annuler" }), _jsx("button", { type: "submit", disabled: saving, className: "btn-primary", children: saving ? 'Enregistrement...' : editJobId ? 'Mettre à jour l\'offre' : 'Créer l\'offre' })] })] })] }));
}
