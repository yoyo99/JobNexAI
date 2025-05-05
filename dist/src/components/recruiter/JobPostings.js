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
import { Link } from 'react-router-dom';
import { useAuth } from '../../stores/auth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PencilIcon, TrashIcon, EyeIcon, PauseIcon, PlayIcon, ArrowPathIcon, PlusCircleIcon, UserGroupIcon, } from '@heroicons/react/24/outline';
import { JobPostingDetailModal } from './JobPostingDetailModal';
function JobPostings() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [jobPostings, setJobPostings] = useState([]);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [filter, setFilter] = useState('all');
    useEffect(() => {
        if (user) {
            loadJobPostings();
        }
    }, [user, filter]);
    const loadJobPostings = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            // Simuler un appel API pour récupérer les offres d'emploi
            // Dans une vraie application, cela serait remplacé par un appel à Supabase
            const mockJobPostings = [
                {
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
                    requirements: ['5+ ans d\'expérience en React', 'Maîtrise de TypeScript', 'Expérience avec les API GraphQL'],
                    status: 'active',
                    applications_count: 12,
                    views_count: 245,
                    created_at: '2025-04-01T00:00:00Z',
                    expires_at: '2025-05-01T00:00:00Z'
                },
                {
                    id: 'job2',
                    title: 'Chef de Projet Digital',
                    company: 'TechInnovate',
                    location: 'Lyon',
                    job_type: 'FULL_TIME',
                    salary_min: 45000,
                    salary_max: 60000,
                    remote_type: 'onsite',
                    experience_level: 'mid',
                    description: 'Nous cherchons un chef de projet digital pour gérer nos projets web et mobiles...',
                    requirements: ['3+ ans d\'expérience en gestion de projet', 'Certification Agile/Scrum', 'Connaissance du secteur digital'],
                    status: 'active',
                    applications_count: 8,
                    views_count: 180,
                    created_at: '2025-04-02T00:00:00Z',
                    expires_at: '2025-05-02T00:00:00Z'
                },
                {
                    id: 'job3',
                    title: 'UI/UX Designer',
                    company: 'TechInnovate',
                    location: 'Bordeaux',
                    job_type: 'FULL_TIME',
                    salary_min: 40000,
                    salary_max: 55000,
                    remote_type: 'remote',
                    experience_level: 'mid',
                    description: 'Nous recherchons un designer UI/UX talentueux pour créer des interfaces utilisateur exceptionnelles...',
                    requirements: ['Portfolio de projets UI/UX', 'Maîtrise de Figma', 'Expérience en recherche utilisateur'],
                    status: 'paused',
                    applications_count: 5,
                    views_count: 120,
                    created_at: '2025-04-03T00:00:00Z',
                    expires_at: '2025-05-03T00:00:00Z'
                },
                {
                    id: 'job4',
                    title: 'Ingénieur DevOps',
                    company: 'TechInnovate',
                    location: 'Toulouse',
                    job_type: 'FULL_TIME',
                    salary_min: 50000,
                    salary_max: 65000,
                    remote_type: 'hybrid',
                    experience_level: 'senior',
                    description: 'Nous cherchons un ingénieur DevOps pour améliorer notre infrastructure et nos processus de déploiement...',
                    requirements: ['Expérience avec Docker et Kubernetes', 'Connaissance des services AWS', 'Maîtrise des pipelines CI/CD'],
                    status: 'expired',
                    applications_count: 3,
                    views_count: 90,
                    created_at: '2025-03-01T00:00:00Z',
                    expires_at: '2025-04-01T00:00:00Z'
                },
                {
                    id: 'job5',
                    title: 'Data Analyst',
                    company: 'TechInnovate',
                    location: 'Paris',
                    job_type: 'FULL_TIME',
                    salary_min: 45000,
                    salary_max: 55000,
                    remote_type: 'hybrid',
                    experience_level: 'mid',
                    description: 'Nous recherchons un analyste de données pour aider à interpréter nos données et générer des insights...',
                    requirements: ['Maîtrise de SQL', 'Expérience avec Python ou R', 'Connaissance des outils de visualisation'],
                    status: 'draft',
                    applications_count: 0,
                    views_count: 0,
                    created_at: '2025-04-05T00:00:00Z',
                    expires_at: '2025-05-05T00:00:00Z'
                }
            ];
            // Filtrer les offres d'emploi en fonction du filtre sélectionné
            let filteredJobs = [...mockJobPostings];
            if (filter !== 'all') {
                filteredJobs = filteredJobs.filter(job => job.status === filter);
            }
            setJobPostings(filteredJobs);
        }
        catch (error) {
            console.error('Error loading job postings:', error);
        }
        finally {
            setLoading(false);
        }
    });
    const handleViewJobPosting = (job) => {
        setSelectedJob(job);
        setShowDetailModal(true);
    };
    const handleToggleJobStatus = (jobId, currentStatus) => __awaiter(this, void 0, void 0, function* () {
        // Dans une vraie application, on mettrait à jour le statut dans la base de données
        const newStatus = currentStatus === 'active' ? 'paused' : 'active';
        setJobPostings(prev => prev.map(job => job.id === jobId ? Object.assign(Object.assign({}, job), { status: newStatus }) : job));
    });
    const handleDeleteJob = (jobId) => __awaiter(this, void 0, void 0, function* () {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre d\'emploi ?')) {
            return;
        }
        // Dans une vraie application, on supprimerait l'offre dans la base de données
        setJobPostings(prev => prev.filter(job => job.id !== jobId));
    });
    const handleRenewJob = (jobId) => __awaiter(this, void 0, void 0, function* () {
        // Dans une vraie application, on renouvellerait l'offre dans la base de données
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
        setJobPostings(prev => prev.map(job => job.id === jobId ? Object.assign(Object.assign({}, job), { status: 'active', expires_at: oneMonthLater.toISOString() }) : job));
    });
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-600 text-green-100';
            case 'paused':
                return 'bg-yellow-600 text-yellow-100';
            case 'expired':
                return 'bg-red-600 text-red-100';
            case 'draft':
                return 'bg-gray-600 text-gray-100';
            default:
                return 'bg-gray-600 text-gray-100';
        }
    };
    const getStatusLabel = (status) => {
        switch (status) {
            case 'active':
                return 'Active';
            case 'paused':
                return 'En pause';
            case 'expired':
                return 'Expirée';
            case 'draft':
                return 'Brouillon';
            default:
                return status;
        }
    };
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
    return (_jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Mes offres d'emploi" }), _jsx("p", { className: "text-gray-400 mt-1", children: "G\u00E9rez vos offres d'emploi et suivez les candidatures" })] }), _jsxs(Link, { to: "/recruiter/create-job", className: "btn-primary flex items-center gap-2", children: [_jsx(PlusCircleIcon, { className: "h-5 w-5" }), "Cr\u00E9er une offre"] })] }), _jsxs("div", { className: "mb-6 flex flex-wrap gap-2", children: [_jsx("button", { onClick: () => setFilter('all'), className: `px-4 py-2 rounded-lg text-sm ${filter === 'all'
                            ? 'bg-primary-600 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'}`, children: "Toutes" }), _jsx("button", { onClick: () => setFilter('active'), className: `px-4 py-2 rounded-lg text-sm ${filter === 'active'
                            ? 'bg-primary-600 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'}`, children: "Actives" }), _jsx("button", { onClick: () => setFilter('paused'), className: `px-4 py-2 rounded-lg text-sm ${filter === 'paused'
                            ? 'bg-primary-600 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'}`, children: "En pause" }), _jsx("button", { onClick: () => setFilter('expired'), className: `px-4 py-2 rounded-lg text-sm ${filter === 'expired'
                            ? 'bg-primary-600 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'}`, children: "Expir\u00E9es" }), _jsx("button", { onClick: () => setFilter('draft'), className: `px-4 py-2 rounded-lg text-sm ${filter === 'draft'
                            ? 'bg-primary-600 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'}`, children: "Brouillons" })] }), loading ? (_jsx("div", { className: "flex justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) })) : (_jsx("div", { className: "space-y-6", children: jobPostings.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("p", { className: "text-gray-400", children: "Aucune offre d'emploi trouv\u00E9e" }), _jsxs(Link, { to: "/recruiter/create-job", className: "btn-primary mt-4 inline-flex items-center gap-2", children: [_jsx(PlusCircleIcon, { className: "h-5 w-5" }), "Cr\u00E9er une offre"] })] })) : (jobPostings.map((job) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card hover:bg-white/10 transition-colors", children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center gap-6", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("h2", { className: "text-xl font-semibold text-white", children: job.title }), _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`, children: getStatusLabel(job.status) })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-400", children: [_jsx("span", { children: job.company }), _jsx("span", { className: "mx-1", children: "\u2022" }), _jsx("span", { children: job.location }), _jsx("span", { className: "mx-1", children: "\u2022" }), _jsx("span", { children: getJobTypeLabel(job.job_type) }), _jsx("span", { className: "mx-1", children: "\u2022" }), _jsx("span", { children: job.remote_type === 'remote' ? 'À distance' : job.remote_type === 'hybrid' ? 'Hybride' : 'Sur site' })] }), _jsxs("div", { className: "flex items-center gap-4 mt-3", children: [_jsxs("div", { className: "flex items-center gap-1 text-sm text-gray-400", children: [_jsx(EyeIcon, { className: "h-4 w-4" }), job.views_count, " vues"] }), _jsxs("div", { className: "flex items-center gap-1 text-sm text-gray-400", children: [_jsx(UserGroupIcon, { className: "h-4 w-4" }), job.applications_count, " candidatures"] }), _jsxs("div", { className: "text-sm text-gray-400", children: ["Expire le ", format(new Date(job.expires_at), 'dd MMMM yyyy', { locale: fr })] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => handleViewJobPosting(job), className: "p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors", title: "Voir les d\u00E9tails", children: _jsx(EyeIcon, { className: "h-5 w-5" }) }), _jsx("button", { onClick: () => handleToggleJobStatus(job.id, job.status), className: "p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors", title: job.status === 'active' ? 'Mettre en pause' : 'Activer', disabled: job.status === 'expired' || job.status === 'draft', children: job.status === 'active' ? (_jsx(PauseIcon, { className: "h-5 w-5" })) : (_jsx(PlayIcon, { className: "h-5 w-5" })) }), job.status === 'expired' && (_jsx("button", { onClick: () => handleRenewJob(job.id), className: "p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors", title: "Renouveler", children: _jsx(ArrowPathIcon, { className: "h-5 w-5" }) })), _jsx(Link, { to: `/recruiter/create-job?edit=${job.id}`, className: "p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors", title: "Modifier", children: _jsx(PencilIcon, { className: "h-5 w-5" }) }), _jsx("button", { onClick: () => handleDeleteJob(job.id), className: "p-2 text-gray-400 hover:text-red-400 rounded-full hover:bg-white/10 transition-colors", title: "Supprimer", children: _jsx(TrashIcon, { className: "h-5 w-5" }) }), _jsx("button", { onClick: () => handleViewJobPosting(job), className: "btn-primary", children: "Voir les candidatures" })] })] }) }, job.id)))) })), selectedJob && (_jsx(JobPostingDetailModal, { isOpen: showDetailModal, onClose: () => {
                    setShowDetailModal(false);
                    setSelectedJob(null);
                }, job: selectedJob }))] }));
}
export default JobPostings;
