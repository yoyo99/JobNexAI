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
import { UserIcon, BriefcaseIcon, DocumentTextIcon, EnvelopeIcon, EyeIcon, PlusCircleIcon, ArrowUpIcon, } from '@heroicons/react/24/outline';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
// Initialiser ChartJS
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);
function RecruiterDashboard() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        activeJobs: 0,
        totalApplications: 0,
        newApplications: 0,
        interviewsScheduled: 0,
        viewRate: 0,
        responseRate: 0
    });
    const [recentApplications, setRecentApplications] = useState([]);
    const [upcomingInterviews, setUpcomingInterviews] = useState([]);
    useEffect(() => {
        if (user) {
            loadDashboardData();
        }
    }, [user]);
    const loadDashboardData = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            // Dans une vraie application, on récupérerait ces données depuis Supabase
            // Ici, on simule des données pour la démonstration
            // Statistiques
            const mockStats = {
                activeJobs: 5,
                totalApplications: 47,
                newApplications: 12,
                interviewsScheduled: 8,
                viewRate: 68,
                responseRate: 42
            };
            // Candidatures récentes
            const mockRecentApplications = [
                {
                    id: 'app1',
                    candidate: {
                        id: 'cand1',
                        name: 'Sophie Martin',
                        avatar_url: 'https://randomuser.me/api/portraits/women/1.jpg',
                        title: 'Développeuse Full Stack'
                    },
                    job: {
                        id: 'job1',
                        title: 'Développeur React Senior'
                    },
                    status: 'new',
                    created_at: '2025-04-10T10:30:00Z'
                },
                {
                    id: 'app2',
                    candidate: {
                        id: 'cand2',
                        name: 'Thomas Dubois',
                        avatar_url: 'https://randomuser.me/api/portraits/men/2.jpg',
                        title: 'Product Manager'
                    },
                    job: {
                        id: 'job2',
                        title: 'Chef de Projet Digital'
                    },
                    status: 'reviewing',
                    created_at: '2025-04-09T14:15:00Z'
                },
                {
                    id: 'app3',
                    candidate: {
                        id: 'cand3',
                        name: 'Julie Moreau',
                        avatar_url: 'https://randomuser.me/api/portraits/women/3.jpg',
                        title: 'UX Designer'
                    },
                    job: {
                        id: 'job3',
                        title: 'UI/UX Designer'
                    },
                    status: 'interview',
                    created_at: '2025-04-08T09:45:00Z'
                },
                {
                    id: 'app4',
                    candidate: {
                        id: 'cand4',
                        name: 'Nicolas Lambert',
                        avatar_url: 'https://randomuser.me/api/portraits/men/4.jpg',
                        title: 'DevOps Engineer'
                    },
                    job: {
                        id: 'job4',
                        title: 'Ingénieur DevOps'
                    },
                    status: 'rejected',
                    created_at: '2025-04-07T16:20:00Z'
                }
            ];
            // Entretiens à venir
            const mockUpcomingInterviews = [
                {
                    id: 'int1',
                    candidate: {
                        id: 'cand3',
                        name: 'Julie Moreau',
                        avatar_url: 'https://randomuser.me/api/portraits/women/3.jpg',
                        title: 'UX Designer'
                    },
                    job: {
                        id: 'job3',
                        title: 'UI/UX Designer'
                    },
                    date: '2025-04-15T14:00:00Z',
                    type: 'technical'
                },
                {
                    id: 'int2',
                    candidate: {
                        id: 'cand5',
                        name: 'Alexandre Petit',
                        avatar_url: 'https://randomuser.me/api/portraits/men/5.jpg',
                        title: 'Data Scientist'
                    },
                    job: {
                        id: 'job5',
                        title: 'Data Analyst'
                    },
                    date: '2025-04-16T10:30:00Z',
                    type: 'hr'
                }
            ];
            setStats(mockStats);
            setRecentApplications(mockRecentApplications);
            setUpcomingInterviews(mockUpcomingInterviews);
        }
        catch (error) {
            console.error('Error loading dashboard data:', error);
        }
        finally {
            setLoading(false);
        }
    });
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
    const getInterviewTypeLabel = (type) => {
        switch (type) {
            case 'technical':
                return 'Technique';
            case 'hr':
                return 'RH';
            case 'final':
                return 'Final';
            default:
                return type;
        }
    };
    // Données pour le graphique des statuts de candidature
    const applicationStatusData = {
        labels: ['Nouvelles', 'En analyse', 'Entretien', 'Offre', 'Embauchés', 'Refusés'],
        datasets: [
            {
                data: [12, 8, 5, 3, 2, 17],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(234, 179, 8, 0.8)',
                    'rgba(22, 163, 74, 0.8)',
                    'rgba(147, 51, 234, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
                borderWidth: 0,
            },
        ],
    };
    // Données pour le graphique des sources de candidature
    const applicationSourceData = {
        labels: ['Site web', 'LinkedIn', 'Indeed', 'Référence', 'Autre'],
        datasets: [
            {
                label: 'Candidatures par source',
                data: [18, 12, 8, 5, 4],
                backgroundColor: 'rgba(236, 72, 153, 0.8)',
            },
        ],
    };
    if (loading) {
        return (_jsx("div", { className: "flex justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    return (_jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Tableau de bord recruteur" }), _jsx("p", { className: "text-gray-400 mt-1", children: "G\u00E9rez vos offres d'emploi et suivez les candidatures" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "p-3 rounded-lg bg-white/5", children: _jsx(BriefcaseIcon, { className: "h-6 w-6 text-primary-400" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-400", children: "Offres actives" }), _jsx("p", { className: "text-2xl font-semibold text-white", children: stats.activeJobs })] })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "card", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "p-3 rounded-lg bg-white/5", children: _jsx(DocumentTextIcon, { className: "h-6 w-6 text-primary-400" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("p", { className: "text-sm text-gray-400", children: "Candidatures" }), _jsxs("span", { className: "text-xs text-green-400 flex items-center", children: [_jsx(ArrowUpIcon, { className: "h-3 w-3" }), stats.newApplications] })] }), _jsx("p", { className: "text-2xl font-semibold text-white", children: stats.totalApplications })] })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "card", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "p-3 rounded-lg bg-white/5", children: _jsx(UserIcon, { className: "h-6 w-6 text-primary-400" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-400", children: "Entretiens programm\u00E9s" }), _jsx("p", { className: "text-2xl font-semibold text-white", children: stats.interviewsScheduled })] })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: "card", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "p-3 rounded-lg bg-white/5", children: _jsx(EnvelopeIcon, { className: "h-6 w-6 text-primary-400" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-400", children: "Taux de r\u00E9ponse" }), _jsxs("p", { className: "text-2xl font-semibold text-white", children: [stats.responseRate, "%"] })] })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 }, className: "card flex flex-col items-center justify-center py-6", children: [_jsx("div", { className: "p-4 rounded-full bg-primary-600/20 mb-4", children: _jsx(PlusCircleIcon, { className: "h-8 w-8 text-primary-400" }) }), _jsx("h3", { className: "text-lg font-medium text-white mb-2", children: "Publier une offre" }), _jsx("p", { className: "text-gray-400 text-sm text-center mb-4", children: "Cr\u00E9ez une nouvelle offre d'emploi et touchez des candidats qualifi\u00E9s" }), _jsx(Link, { to: "/recruiter/create-job", className: "btn-primary", children: "Cr\u00E9er une offre" })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.5 }, className: "card flex flex-col items-center justify-center py-6", children: [_jsx("div", { className: "p-4 rounded-full bg-secondary-600/20 mb-4", children: _jsx(UserIcon, { className: "h-8 w-8 text-secondary-400" }) }), _jsx("h3", { className: "text-lg font-medium text-white mb-2", children: "Rechercher des candidats" }), _jsx("p", { className: "text-gray-400 text-sm text-center mb-4", children: "Trouvez des candidats correspondant \u00E0 vos crit\u00E8res" }), _jsx(Link, { to: "/recruiter/candidates", className: "btn-primary", children: "Rechercher" })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.6 }, className: "card flex flex-col items-center justify-center py-6", children: [_jsx("div", { className: "p-4 rounded-full bg-green-600/20 mb-4", children: _jsx(EyeIcon, { className: "h-8 w-8 text-green-400" }) }), _jsx("h3", { className: "text-lg font-medium text-white mb-2", children: "G\u00E9rer mes offres" }), _jsx("p", { className: "text-gray-400 text-sm text-center mb-4", children: "Consultez et g\u00E9rez vos offres d'emploi actives" }), _jsx(Link, { to: "/recruiter/job-postings", className: "btn-primary", children: "Voir mes offres" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.7 }, className: "card", children: [_jsx("h2", { className: "text-lg font-semibold text-white mb-4", children: "Statuts des candidatures" }), _jsx("div", { className: "h-64", children: _jsx(Pie, { data: applicationStatusData, options: {
                                        plugins: {
                                            legend: {
                                                position: 'right',
                                                labels: {
                                                    color: 'white'
                                                }
                                            }
                                        }
                                    } }) })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.8 }, className: "card", children: [_jsx("h2", { className: "text-lg font-semibold text-white mb-4", children: "Sources des candidatures" }), _jsx("div", { className: "h-64", children: _jsx(Bar, { data: applicationSourceData, options: {
                                        plugins: {
                                            legend: {
                                                display: false
                                            }
                                        },
                                        scales: {
                                            y: {
                                                ticks: {
                                                    color: 'rgba(255, 255, 255, 0.7)'
                                                },
                                                grid: {
                                                    color: 'rgba(255, 255, 255, 0.1)'
                                                }
                                            },
                                            x: {
                                                ticks: {
                                                    color: 'rgba(255, 255, 255, 0.7)'
                                                },
                                                grid: {
                                                    color: 'rgba(255, 255, 255, 0.1)'
                                                }
                                            }
                                        }
                                    } }) })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.9 }, className: "card", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-lg font-semibold text-white", children: "Candidatures r\u00E9centes" }), _jsx(Link, { to: "/recruiter/candidates", className: "text-sm text-primary-400 hover:text-primary-300", children: "Voir tout" })] }), _jsx("div", { className: "space-y-4", children: recentApplications.map((application) => (_jsxs("div", { className: "flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("img", { src: application.candidate.avatar_url, alt: application.candidate.name, className: "h-10 w-10 rounded-full" }), _jsxs("div", { children: [_jsx("h3", { className: "text-white font-medium", children: application.candidate.name }), _jsx("p", { className: "text-sm text-gray-400", children: application.job.title })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: `px-2 py-1 rounded-full text-xs ${getStatusColor(application.status)}`, children: getStatusLabel(application.status) }), _jsx("span", { className: "text-xs text-gray-500", children: format(new Date(application.created_at), 'dd MMM', { locale: fr }) })] })] }, application.id))) })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 1 }, className: "card", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-lg font-semibold text-white", children: "Entretiens \u00E0 venir" }), _jsx(Link, { to: "/recruiter/candidates", className: "text-sm text-primary-400 hover:text-primary-300", children: "Voir tout" })] }), _jsxs("div", { className: "space-y-4", children: [upcomingInterviews.map((interview) => (_jsxs("div", { className: "flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("img", { src: interview.candidate.avatar_url, alt: interview.candidate.name, className: "h-10 w-10 rounded-full" }), _jsxs("div", { children: [_jsx("h3", { className: "text-white font-medium", children: interview.candidate.name }), _jsx("p", { className: "text-sm text-gray-400", children: interview.job.title })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-primary-400 font-medium", children: format(new Date(interview.date), 'dd MMMM à HH:mm', { locale: fr }) }), _jsxs("p", { className: "text-xs text-gray-400", children: ["Entretien ", getInterviewTypeLabel(interview.type)] })] })] }, interview.id))), upcomingInterviews.length === 0 && (_jsx("p", { className: "text-center py-4 text-gray-400", children: "Aucun entretien programm\u00E9" }))] })] })] })] }));
}
export default RecruiterDashboard;
