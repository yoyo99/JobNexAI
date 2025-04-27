import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { XMarkIcon, UserIcon, StarIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
export function JobPostingDetailModal({ isOpen, onClose, job }) {
    const [activeTab, setActiveTab] = useState('details');
    const getJobTypeLabel = (jobType) => {
        switch (jobType) {
            case 'FULL_TIME':
                return 'Temps plein';
            case 'PART_TIME':
                return 'Temps partiel';
            case 'CONTRACT':
                return 'CDD';
            case 'FREELANCE':
                return 'Freelance';
            case 'INTERNSHIP':
                return 'Stage';
            default:
                return jobType;
        }
    };
    const getRemoteTypeLabel = (remoteType) => {
        switch (remoteType) {
            case 'remote':
                return 'À distance';
            case 'hybrid':
                return 'Hybride';
            case 'onsite':
                return 'Sur site';
            default:
                return remoteType;
        }
    };
    const getExperienceLevelLabel = (level) => {
        switch (level) {
            case 'junior':
                return 'Junior (0-2 ans)';
            case 'mid':
                return 'Confirmé (3-5 ans)';
            case 'senior':
                return 'Senior (5+ ans)';
            default:
                return level;
        }
    };
    // Données fictives pour la démonstration
    const mockApplications = [
        {
            id: 'app1',
            candidate: {
                id: 'cand1',
                name: 'Sophie Martin',
                title: 'Développeuse Full Stack',
                avatar_url: 'https://randomuser.me/api/portraits/women/1.jpg',
                match_score: 92
            },
            status: 'new',
            created_at: '2025-04-10T10:30:00Z'
        },
        {
            id: 'app2',
            candidate: {
                id: 'cand2',
                name: 'Thomas Dubois',
                title: 'Product Manager',
                avatar_url: 'https://randomuser.me/api/portraits/men/2.jpg',
                match_score: 85
            },
            status: 'reviewing',
            created_at: '2025-04-09T14:15:00Z'
        },
        {
            id: 'app3',
            candidate: {
                id: 'cand3',
                name: 'Julie Moreau',
                title: 'UX Designer',
                avatar_url: 'https://randomuser.me/api/portraits/women/3.jpg',
                match_score: 78
            },
            status: 'interview',
            created_at: '2025-04-08T09:45:00Z'
        }
    ];
    const getStatusColor = (status) => {
        switch (status) {
            case 'new':
                return 'bg-blue-600 text-blue-100';
            case 'reviewing':
                return 'bg-yellow-600 text-yellow-100';
            case 'interview':
                return 'bg-green-600 text-green-100';
            case 'offer':
                return 'bg-purple-600 text-purple-100';
            case 'hired':
                return 'bg-primary-600 text-primary-100';
            case 'rejected':
                return 'bg-red-600 text-red-100';
            default:
                return 'bg-gray-600 text-gray-100';
        }
    };
    const getStatusLabel = (status) => {
        switch (status) {
            case 'new':
                return 'Nouvelle';
            case 'reviewing':
                return 'En cours d\'analyse';
            case 'interview':
                return 'Entretien';
            case 'offer':
                return 'Offre';
            case 'hired':
                return 'Embauché';
            case 'rejected':
                return 'Refusé';
            default:
                return status;
        }
    };
    return (_jsxs(Dialog, { open: isOpen, onClose: onClose, className: "relative z-50", children: [_jsx("div", { className: "fixed inset-0 bg-black/75", "aria-hidden": "true" }), _jsx("div", { className: "fixed inset-0 flex items-center justify-center p-4", children: _jsxs(Dialog.Panel, { className: "w-full max-w-4xl h-[90vh] overflow-y-auto rounded-lg bg-background p-6 shadow-xl", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx(Dialog.Title, { className: "text-lg font-medium text-white", children: "D\u00E9tails de l'offre d'emploi" }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-white transition-colors", children: _jsx(XMarkIcon, { className: "h-6 w-6" }) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-2xl font-semibold text-white", children: job.title }), _jsxs("div", { className: "flex items-center gap-2 mt-1 text-gray-400", children: [_jsx("span", { children: job.company }), _jsx("span", { className: "mx-1", children: "\u2022" }), _jsx("span", { children: job.location }), _jsx("span", { className: "mx-1", children: "\u2022" }), _jsx("span", { children: getJobTypeLabel(job.job_type) })] })] }), _jsx("div", { className: "mb-6 border-b border-white/10", children: _jsxs("nav", { className: "flex space-x-8", children: [_jsx("button", { onClick: () => setActiveTab('details'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details'
                                            ? 'border-primary-400 text-primary-400'
                                            : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "D\u00E9tails de l'offre" }), _jsxs("button", { onClick: () => setActiveTab('applications'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'applications'
                                            ? 'border-primary-400 text-primary-400'
                                            : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: ["Candidatures (", job.applications_count, ")"] })] }) }), activeTab === 'details' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "bg-white/5 rounded-lg p-4", children: [_jsx("h3", { className: "text-sm font-medium text-gray-400 mb-1", children: "Salaire" }), _jsxs("p", { className: "text-white font-medium", children: [job.salary_min.toLocaleString(), " - ", job.salary_max.toLocaleString(), " \u20AC"] })] }), _jsxs("div", { className: "bg-white/5 rounded-lg p-4", children: [_jsx("h3", { className: "text-sm font-medium text-gray-400 mb-1", children: "Type de travail" }), _jsx("p", { className: "text-white font-medium", children: getRemoteTypeLabel(job.remote_type) })] }), _jsxs("div", { className: "bg-white/5 rounded-lg p-4", children: [_jsx("h3", { className: "text-sm font-medium text-gray-400 mb-1", children: "Niveau d'exp\u00E9rience" }), _jsx("p", { className: "text-white font-medium", children: getExperienceLevelLabel(job.experience_level) })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-white font-medium mb-2", children: "Description du poste" }), _jsx("div", { className: "bg-white/5 rounded-lg p-4", children: _jsx("p", { className: "text-gray-300 whitespace-pre-line", children: job.description }) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-white font-medium mb-2", children: "Pr\u00E9requis" }), _jsx("div", { className: "bg-white/5 rounded-lg p-4", children: _jsx("ul", { className: "list-disc list-inside space-y-1 text-gray-300", children: job.requirements.map((req, index) => (_jsx("li", { children: req }, index))) }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white/5 rounded-lg p-4", children: [_jsx("h3", { className: "text-sm font-medium text-gray-400 mb-1", children: "Date de publication" }), _jsx("p", { className: "text-white", children: format(new Date(job.created_at), 'dd MMMM yyyy', { locale: fr }) })] }), _jsxs("div", { className: "bg-white/5 rounded-lg p-4", children: [_jsx("h3", { className: "text-sm font-medium text-gray-400 mb-1", children: "Date d'expiration" }), _jsx("p", { className: "text-white", children: format(new Date(job.expires_at), 'dd MMMM yyyy', { locale: fr }) })] })] }), _jsxs("div", { className: "flex justify-end gap-4", children: [_jsx(Link, { to: `/recruiter/create-job?edit=${job.id}`, className: "btn-secondary", children: "Modifier l'offre" }), _jsx("button", { className: "btn-primary", children: "Promouvoir l'offre" })] })] })), activeTab === 'applications' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: "text-white font-medium", children: "Candidatures re\u00E7ues" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("select", { className: "bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "all", children: "Tous les statuts" }), _jsx("option", { value: "new", children: "Nouvelles" }), _jsx("option", { value: "reviewing", children: "En analyse" }), _jsx("option", { value: "interview", children: "Entretien" }), _jsx("option", { value: "rejected", children: "Refus\u00E9es" })] }), _jsxs("select", { className: "bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "recent", children: "Plus r\u00E9centes" }), _jsx("option", { value: "match", children: "Meilleur match" })] })] })] }), mockApplications.length === 0 ? (_jsxs("div", { className: "text-center py-12 bg-white/5 rounded-lg", children: [_jsx(UserIcon, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-400", children: "Aucune candidature pour cette offre" })] })) : (_jsx("div", { className: "space-y-4", children: mockApplications.map((application) => (_jsx("div", { className: "bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("img", { src: application.candidate.avatar_url, alt: application.candidate.name, className: "h-12 w-12 rounded-full object-cover" }), _jsxs("div", { children: [_jsx("h4", { className: "text-white font-medium", children: application.candidate.name }), _jsx("p", { className: "text-sm text-gray-400", children: application.candidate.title })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(StarIcon, { className: "h-5 w-5 text-yellow-400" }), _jsxs("span", { className: "text-white font-medium", children: [application.candidate.match_score, "%"] })] }), _jsx("span", { className: `px-2 py-1 rounded-full text-xs ${getStatusColor(application.status)}`, children: getStatusLabel(application.status) }), _jsx("span", { className: "text-sm text-gray-400", children: format(new Date(application.created_at), 'dd MMM', { locale: fr }) }), _jsx("button", { className: "btn-primary text-sm", children: "Voir le profil" })] })] }) }, application.id))) }))] }))] }) })] }));
}
