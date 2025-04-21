"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobPostingDetailModal = JobPostingDetailModal;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@headlessui/react");
const outline_1 = require("@heroicons/react/24/outline");
const react_2 = require("react");
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
function JobPostingDetailModal({ isOpen, onClose, job }) {
    const [activeTab, setActiveTab] = (0, react_2.useState)('details');
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
    return ((0, jsx_runtime_1.jsxs)(react_1.Dialog, { open: isOpen, onClose: onClose, className: "relative z-50", children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/75", "aria-hidden": "true" }), (0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 flex items-center justify-center p-4", children: (0, jsx_runtime_1.jsxs)(react_1.Dialog.Panel, { className: "w-full max-w-4xl h-[90vh] overflow-y-auto rounded-lg bg-background p-6 shadow-xl", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(react_1.Dialog.Title, { className: "text-lg font-medium text-white", children: "D\u00E9tails de l'offre d'emploi" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-white transition-colors", children: (0, jsx_runtime_1.jsx)(outline_1.XMarkIcon, { className: "h-6 w-6" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-semibold text-white", children: job.title }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mt-1 text-gray-400", children: [(0, jsx_runtime_1.jsx)("span", { children: job.company }), (0, jsx_runtime_1.jsx)("span", { className: "mx-1", children: "\u2022" }), (0, jsx_runtime_1.jsx)("span", { children: job.location }), (0, jsx_runtime_1.jsx)("span", { className: "mx-1", children: "\u2022" }), (0, jsx_runtime_1.jsx)("span", { children: getJobTypeLabel(job.job_type) })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "mb-6 border-b border-white/10", children: (0, jsx_runtime_1.jsxs)("nav", { className: "flex space-x-8", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('details'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details'
                                            ? 'border-primary-400 text-primary-400'
                                            : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "D\u00E9tails de l'offre" }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setActiveTab('applications'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'applications'
                                            ? 'border-primary-400 text-primary-400'
                                            : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: ["Candidatures (", job.applications_count, ")"] })] }) }), activeTab === 'details' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white/5 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-400 mb-1", children: "Salaire" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-white font-medium", children: [job.salary_min.toLocaleString(), " - ", job.salary_max.toLocaleString(), " \u20AC"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/5 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-400 mb-1", children: "Type de travail" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white font-medium", children: getRemoteTypeLabel(job.remote_type) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/5 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-400 mb-1", children: "Niveau d'exp\u00E9rience" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white font-medium", children: getExperienceLevelLabel(job.experience_level) })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium mb-2", children: "Description du poste" }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/5 rounded-lg p-4", children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 whitespace-pre-line", children: job.description }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium mb-2", children: "Pr\u00E9requis" }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/5 rounded-lg p-4", children: (0, jsx_runtime_1.jsx)("ul", { className: "list-disc list-inside space-y-1 text-gray-300", children: job.requirements.map((req, index) => ((0, jsx_runtime_1.jsx)("li", { children: req }, index))) }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white/5 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-400 mb-1", children: "Date de publication" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white", children: (0, date_fns_1.format)(new Date(job.created_at), 'dd MMMM yyyy', { locale: locale_1.fr }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/5 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-400 mb-1", children: "Date d'expiration" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white", children: (0, date_fns_1.format)(new Date(job.expires_at), 'dd MMMM yyyy', { locale: locale_1.fr }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-4", children: [(0, jsx_runtime_1.jsx)(Link, { to: `/recruiter/create-job?edit=${job.id}`, className: "btn-secondary", children: "Modifier l'offre" }), (0, jsx_runtime_1.jsx)("button", { className: "btn-primary", children: "Promouvoir l'offre" })] })] })), activeTab === 'applications' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium", children: "Candidatures re\u00E7ues" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsxs)("select", { className: "bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "Tous les statuts" }), (0, jsx_runtime_1.jsx)("option", { value: "new", children: "Nouvelles" }), (0, jsx_runtime_1.jsx)("option", { value: "reviewing", children: "En analyse" }), (0, jsx_runtime_1.jsx)("option", { value: "interview", children: "Entretien" }), (0, jsx_runtime_1.jsx)("option", { value: "rejected", children: "Refus\u00E9es" })] }), (0, jsx_runtime_1.jsxs)("select", { className: "bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "recent", children: "Plus r\u00E9centes" }), (0, jsx_runtime_1.jsx)("option", { value: "match", children: "Meilleur match" })] })] })] }), mockApplications.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12 bg-white/5 rounded-lg", children: [(0, jsx_runtime_1.jsx)(outline_1.UserIcon, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "Aucune candidature pour cette offre" })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: mockApplications.map((application) => ((0, jsx_runtime_1.jsx)("div", { className: "bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("img", { src: application.candidate.avatar_url, alt: application.candidate.name, className: "h-12 w-12 rounded-full object-cover" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium", children: application.candidate.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: application.candidate.title })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(outline_1.StarIcon, { className: "h-5 w-5 text-yellow-400" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-white font-medium", children: [application.candidate.match_score, "%"] })] }), (0, jsx_runtime_1.jsx)("span", { className: `px-2 py-1 rounded-full text-xs ${getStatusColor(application.status)}`, children: getStatusLabel(application.status) }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-400", children: (0, date_fns_1.format)(new Date(application.created_at), 'dd MMM', { locale: locale_1.fr }) }), (0, jsx_runtime_1.jsx)("button", { className: "btn-primary text-sm", children: "Voir le profil" })] })] }) }, application.id))) }))] }))] }) })] }));
}
