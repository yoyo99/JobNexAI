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
import { useAuth } from '../../stores/auth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, BookmarkIcon, ClockIcon, CurrencyEuroIcon, MapPinIcon, } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { ProjectProposalModal } from './ProjectProposalModal';
export function FreelanceProjects() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [favorites, setFavorites] = useState({});
    const [search, setSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [budgetMin, setBudgetMin] = useState('');
    const [budgetMax, setBudgetMax] = useState('');
    const [remote, setRemote] = useState(null);
    const [duration, setDuration] = useState(null);
    const [showProposalModal, setShowProposalModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const durations = [
        { value: 'less_than_1_month', label: 'Moins d\'un mois' },
        { value: '1_to_3_months', label: '1 à 3 mois' },
        { value: '3_to_6_months', label: '3 à 6 mois' },
        { value: 'more_than_6_months', label: 'Plus de 6 mois' },
    ];
    const skillsList = [
        'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python',
        'UI/UX Design', 'Graphic Design', 'Content Writing', 'SEO',
        'Marketing', 'Data Analysis', 'Project Management'
    ];
    useEffect(() => {
        loadProjects();
    }, [search, selectedSkills, budgetMin, budgetMax, remote, duration]);
    const loadProjects = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            // Simuler un appel API pour récupérer les projets
            // Dans une vraie application, cela serait remplacé par un appel à Supabase
            const mockProjects = [
                {
                    id: '1',
                    title: 'Développement d\'une application mobile React Native',
                    description: 'Nous recherchons un développeur React Native expérimenté pour créer une application mobile de e-commerce. L\'application doit être compatible iOS et Android, avec des fonctionnalités de paiement, de gestion de profil et de notifications push.',
                    client: {
                        id: 'client1',
                        name: 'TechSolutions SAS',
                        avatar_url: '/landing.png',
                        rating: 4.8
                    },
                    budget_min: 5000,
                    budget_max: 8000,
                    duration: '1_to_3_months',
                    skills: ['React Native', 'JavaScript', 'Mobile Development', 'API Integration'],
                    location: 'Paris',
                    remote: true,
                    deadline: '2025-06-15T00:00:00Z',
                    created_at: '2025-04-01T00:00:00Z',
                    status: 'open'
                },
                {
                    id: '2',
                    title: 'Refonte de site web e-commerce',
                    description: 'Notre entreprise cherche un développeur front-end pour refondre notre site e-commerce existant. Le site doit être responsive, rapide et optimisé pour le SEO. Nous utilisons React et Next.js.',
                    client: {
                        id: 'client2',
                        name: 'ModaShop',
                        avatar_url: '/landing.png',
                        rating: 4.5
                    },
                    budget_min: 3000,
                    budget_max: 6000,
                    duration: 'less_than_1_month',
                    skills: ['React', 'Next.js', 'CSS', 'E-commerce'],
                    location: 'Lyon',
                    remote: true,
                    deadline: '2025-05-20T00:00:00Z',
                    created_at: '2025-04-02T00:00:00Z',
                    status: 'open'
                },
                {
                    id: '3',
                    title: 'Développement d\'une API REST pour une application de gestion',
                    description: 'Nous avons besoin d\'un développeur back-end pour créer une API REST complète pour notre application de gestion interne. L\'API doit être sécurisée, bien documentée et performante.',
                    client: {
                        id: 'client3',
                        name: 'GestionPro',
                        avatar_url: '/landing.png',
                        rating: 4.2
                    },
                    budget_min: 4000,
                    budget_max: 7000,
                    duration: '1_to_3_months',
                    skills: ['Node.js', 'Express', 'MongoDB', 'API Design'],
                    location: 'Bordeaux',
                    remote: false,
                    deadline: '2025-06-30T00:00:00Z',
                    created_at: '2025-04-03T00:00:00Z',
                    status: 'open'
                },
                {
                    id: '4',
                    title: 'Création de contenu pour blog tech',
                    description: 'Nous recherchons un rédacteur technique pour créer du contenu pour notre blog spécialisé dans les nouvelles technologies. Les articles doivent être bien recherchés, engageants et optimisés pour le SEO.',
                    client: {
                        id: 'client4',
                        name: 'TechBlog Media',
                        avatar_url: '/landing.png',
                        rating: 4.9
                    },
                    budget_min: 1000,
                    budget_max: 2000,
                    duration: 'more_than_6_months',
                    skills: ['Content Writing', 'SEO', 'Technical Writing', 'Research'],
                    location: 'Toulouse',
                    remote: true,
                    deadline: '2025-05-15T00:00:00Z',
                    created_at: '2025-04-04T00:00:00Z',
                    status: 'open'
                },
                {
                    id: '5',
                    title: 'Design d\'interface utilisateur pour application mobile',
                    description: 'Nous avons besoin d\'un designer UI/UX pour créer l\'interface utilisateur de notre nouvelle application mobile de fitness. Le design doit être moderne, intuitif et suivre les dernières tendances.',
                    client: {
                        id: 'client5',
                        name: 'FitTech',
                        avatar_url: '/landing.png',
                        rating: 4.7
                    },
                    budget_min: 2500,
                    budget_max: 4000,
                    duration: 'less_than_1_month',
                    skills: ['UI/UX Design', 'Figma', 'Mobile Design', 'Prototyping'],
                    location: 'Marseille',
                    remote: true,
                    deadline: '2025-05-10T00:00:00Z',
                    created_at: '2025-04-05T00:00:00Z',
                    status: 'open'
                },
                {
                    id: '6',
                    title: 'Développement d\'un dashboard analytique',
                    description: 'Nous recherchons un développeur full-stack pour créer un dashboard analytique pour notre plateforme SaaS. Le dashboard doit inclure des graphiques, des tableaux et des filtres avancés.',
                    client: {
                        id: 'client6',
                        name: 'AnalyticsPro',
                        avatar_url: '/landing.png',
                        rating: 4.6
                    },
                    budget_min: 6000,
                    budget_max: 9000,
                    duration: '3_to_6_months',
                    skills: ['React', 'Node.js', 'D3.js', 'Data Visualization'],
                    location: 'Lille',
                    remote: true,
                    deadline: '2025-07-01T00:00:00Z',
                    created_at: '2025-04-06T00:00:00Z',
                    status: 'open'
                }
            ];
            // Filtrer les projets en fonction des critères
            let filteredProjects = [...mockProjects];
            if (search) {
                const searchLower = search.toLowerCase();
                filteredProjects = filteredProjects.filter(project => project.title.toLowerCase().includes(searchLower) ||
                    project.description.toLowerCase().includes(searchLower) ||
                    project.client.name.toLowerCase().includes(searchLower));
            }
            if (selectedSkills.length > 0) {
                filteredProjects = filteredProjects.filter(project => selectedSkills.some(skill => project.skills.includes(skill)));
            }
            if (budgetMin !== '') {
                filteredProjects = filteredProjects.filter(project => project.budget_max >= budgetMin);
            }
            if (budgetMax !== '') {
                filteredProjects = filteredProjects.filter(project => project.budget_min <= budgetMax);
            }
            if (remote !== null) {
                filteredProjects = filteredProjects.filter(project => project.remote === remote);
            }
            if (duration) {
                filteredProjects = filteredProjects.filter(project => project.duration === duration);
            }
            // Simuler les favoris
            const mockFavorites = {
                '1': true,
                '4': true
            };
            setProjects(filteredProjects);
            setFavorites(mockFavorites);
        }
        catch (error) {
            console.error('Error loading projects:', error);
        }
        finally {
            setLoading(false);
        }
    });
    const toggleFavorite = (projectId) => __awaiter(this, void 0, void 0, function* () {
        setFavorites(prev => (Object.assign(Object.assign({}, prev), { [projectId]: !prev[projectId] })));
        // Dans une vraie application, on sauvegarderait ce changement dans la base de données
    });
    const handleApplyToProject = (project) => {
        setSelectedProject(project);
        setShowProposalModal(true);
    };
    const handleSubmitProposal = (projectId, proposal) => __awaiter(this, void 0, void 0, function* () {
        try {
            // Simuler l'envoi d'une proposition
            console.log('Proposition envoyée:', Object.assign({ projectId }, proposal));
            // Fermer le modal
            setShowProposalModal(false);
            setSelectedProject(null);
            // Afficher un message de succès (dans une vraie application)
        }
        catch (error) {
            console.error('Error submitting proposal:', error);
        }
    });
    return (_jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Projets Freelance" }), _jsx("p", { className: "text-gray-400 mt-1", children: "Trouvez des projets qui correspondent \u00E0 vos comp\u00E9tences et \u00E0 vos int\u00E9r\u00EAts" })] }), _jsxs("div", { className: "card mb-8", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center gap-4", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(MagnifyingGlassIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" }), _jsx("input", { type: "text", value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Rechercher un projet...", className: "w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), _jsxs("button", { onClick: () => setShowFilters(!showFilters), className: "btn-secondary flex items-center gap-2", children: [_jsx(AdjustmentsHorizontalIcon, { className: "h-5 w-5" }), "Filtres avanc\u00E9s"] })] }), showFilters && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "mt-6 space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-white mb-2", children: "Comp\u00E9tences" }), _jsx("div", { className: "flex flex-wrap gap-2", children: skillsList.map((skill) => (_jsx("button", { onClick: () => {
                                                if (selectedSkills.includes(skill)) {
                                                    setSelectedSkills(selectedSkills.filter(s => s !== skill));
                                                }
                                                else {
                                                    setSelectedSkills([...selectedSkills, skill]);
                                                }
                                            }, className: `px-3 py-1 rounded-full text-sm ${selectedSkills.includes(skill)
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-white/10 text-gray-300 hover:bg-white/20'}`, children: skill }, skill))) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-white mb-2", children: "Budget" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx("div", { children: _jsx("input", { type: "number", value: budgetMin, onChange: (e) => setBudgetMin(e.target.value ? Number(e.target.value) : ''), placeholder: "Min \u20AC", className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500" }) }), _jsx("div", { children: _jsx("input", { type: "number", value: budgetMax, onChange: (e) => setBudgetMax(e.target.value ? Number(e.target.value) : ''), placeholder: "Max \u20AC", className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500" }) })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-white mb-2", children: "Dur\u00E9e" }), _jsxs("select", { value: duration || '', onChange: (e) => setDuration(e.target.value || null), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "", children: "Toutes les dur\u00E9es" }), durations.map((d) => (_jsx("option", { value: d.value, children: d.label }, d.value)))] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-white mb-2", children: "Type de travail" }), _jsxs("div", { className: "flex gap-4", children: [_jsx("button", { onClick: () => setRemote(null), className: `px-4 py-2 rounded-lg text-sm ${remote === null
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'}`, children: "Tous" }), _jsx("button", { onClick: () => setRemote(true), className: `px-4 py-2 rounded-lg text-sm ${remote === true
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'}`, children: "\u00C0 distance" }), _jsx("button", { onClick: () => setRemote(false), className: `px-4 py-2 rounded-lg text-sm ${remote === false
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'}`, children: "Sur site" })] })] }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { onClick: () => {
                                        setSelectedSkills([]);
                                        setBudgetMin('');
                                        setBudgetMax('');
                                        setRemote(null);
                                        setDuration(null);
                                    }, className: "btn-secondary", children: "R\u00E9initialiser les filtres" }) })] }))] }), loading ? (_jsx("div", { className: "flex justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) })) : (_jsx("div", { className: "space-y-6", children: projects.length === 0 ? (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-400", children: "Aucun projet ne correspond \u00E0 vos crit\u00E8res" }) })) : (projects.map((project) => {
                    var _a;
                    return (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card hover:bg-white/10 transition-colors", children: _jsxs("div", { className: "flex justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsx("h2", { className: "text-xl font-semibold text-white", children: project.title }), _jsx("button", { onClick: () => toggleFavorite(project.id), className: "text-primary-400 hover:text-primary-300 transition-colors", children: favorites[project.id] ? (_jsx(BookmarkIconSolid, { className: "h-6 w-6" })) : (_jsx(BookmarkIcon, { className: "h-6 w-6" })) })] }), _jsxs("div", { className: "flex items-center mt-2 text-sm text-gray-400", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("img", { src: project.client.avatar_url, alt: project.client.name, className: "h-6 w-6 rounded-full mr-2" }), project.client.name] }), _jsx("span", { className: "mx-2", children: "\u2022" }), _jsxs("div", { className: "flex items-center", children: [_jsx(MapPinIcon, { className: "h-4 w-4 mr-1" }), project.location, project.remote && _jsx("span", { className: "ml-1", children: "(Remote)" })] }), _jsx("span", { className: "mx-2", children: "\u2022" }), _jsxs("div", { className: "flex items-center", children: [_jsx(ClockIcon, { className: "h-4 w-4 mr-1" }), (_a = durations.find(d => d.value === project.duration)) === null || _a === void 0 ? void 0 : _a.label] })] }), _jsx("p", { className: "mt-4 text-gray-300 line-clamp-3", children: project.description }), _jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: project.skills.map((skill) => (_jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-600/20 text-primary-400", children: skill }, skill))) })] }), _jsxs("div", { className: "ml-6 flex flex-col items-end justify-between", children: [_jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "flex items-center text-primary-400 font-semibold", children: [_jsx(CurrencyEuroIcon, { className: "h-5 w-5 mr-1" }), project.budget_min.toLocaleString(), " - ", project.budget_max.toLocaleString()] }), _jsxs("p", { className: "text-sm text-gray-400", children: ["Date limite: ", format(new Date(project.deadline), 'dd MMMM yyyy', { locale: fr })] })] }), _jsx("div", { className: "mt-4", children: _jsx("button", { onClick: () => handleApplyToProject(project), className: "btn-primary", children: "Proposer mes services" }) })] })] }) }, project.id));
                })) })), selectedProject && (_jsx(ProjectProposalModal, { isOpen: showProposalModal, onClose: () => {
                    setShowProposalModal(false);
                    setSelectedProject(null);
                }, project: selectedProject, onSubmit: handleSubmitProposal }))] }));
}
