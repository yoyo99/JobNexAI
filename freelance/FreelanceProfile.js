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
exports.FreelanceProfile = FreelanceProfile;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const auth_1 = require("../../stores/auth");
const react_dropzone_1 = require("react-dropzone");
const outline_1 = require("@heroicons/react/24/outline");
function FreelanceProfile() {
    const { user } = (0, auth_1.useAuth)();
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [saving, setSaving] = (0, react_1.useState)(false);
    const [editing, setEditing] = (0, react_1.useState)(false);
    const [profile, setProfile] = (0, react_1.useState)(null);
    const [message, setMessage] = (0, react_1.useState)(null);
    const { getRootProps, getInputProps } = (0, react_dropzone_1.useDropzone)({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif']
        },
        maxSize: 5242880, // 5MB
        onDrop: (acceptedFiles) => {
            // Gérer l'upload d'image
            handlePortfolioImageUpload(acceptedFiles[0]);
        }
    });
    (0, react_1.useEffect)(() => {
        if (user) {
            loadProfile();
        }
    }, [user]);
    const loadProfile = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            // Dans une vraie application, on récupérerait le profil depuis Supabase
            // Ici, on simule un profil pour la démonstration
            const mockProfile = {
                id: 'profile1',
                user_id: (user === null || user === void 0 ? void 0 : user.id) || '',
                title: 'Développeur Full Stack React / Node.js',
                hourly_rate: 65,
                description: 'Développeur full stack avec 5 ans d\'expérience, spécialisé dans les technologies React, Node.js et TypeScript. J\'ai travaillé sur divers projets allant des applications web aux solutions e-commerce, en passant par les dashboards analytiques.',
                skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Express', 'GraphQL', 'AWS'],
                experience: [
                    {
                        id: 'exp1',
                        title: 'Développeur Full Stack Senior',
                        company: 'TechInnovate',
                        start_date: '2023-01-01',
                        current: true,
                        description: 'Développement d\'applications web complexes utilisant React, Node.js et MongoDB. Mise en place d\'architectures scalables et de CI/CD pipelines.'
                    },
                    {
                        id: 'exp2',
                        title: 'Développeur Front-end',
                        company: 'WebSolutions',
                        start_date: '2020-03-01',
                        end_date: '2022-12-31',
                        current: false,
                        description: 'Création d\'interfaces utilisateur réactives et accessibles avec React et TypeScript. Collaboration avec les designers UX/UI et l\'équipe back-end.'
                    }
                ],
                education: [
                    {
                        id: 'edu1',
                        degree: 'Master en Informatique',
                        school: 'Université de Paris',
                        year: 2020,
                        description: 'Spécialisation en développement web et applications mobiles'
                    }
                ],
                portfolio: [
                    {
                        id: 'port1',
                        title: 'E-commerce de produits artisanaux',
                        description: 'Plateforme complète avec paiement en ligne, gestion des stocks et interface d\'administration',
                        url: 'https://example.com/project1',
                        image_url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                    },
                    {
                        id: 'port2',
                        title: 'Application de suivi de fitness',
                        description: 'Application mobile React Native permettant de suivre ses activités sportives et son alimentation',
                        url: 'https://example.com/project2',
                        image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                    }
                ],
                availability: 'limited',
                languages: [
                    { language: 'Français', level: 'native' },
                    { language: 'Anglais', level: 'fluent' },
                    { language: 'Espagnol', level: 'conversational' }
                ]
            };
            setProfile(mockProfile);
        }
        catch (error) {
            console.error('Error loading profile:', error);
        }
        finally {
            setLoading(false);
        }
    });
    const saveProfile = () => __awaiter(this, void 0, void 0, function* () {
        if (!profile)
            return;
        try {
            setSaving(true);
            setMessage(null);
            // Dans une vraie application, on sauvegarderait le profil dans Supabase
            // Simuler un délai pour l'enregistrement
            yield new Promise(resolve => setTimeout(resolve, 1000));
            setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
            setEditing(false);
        }
        catch (error) {
            console.error('Error saving profile:', error);
            setMessage({ type: 'error', text: error.message || 'Une erreur est survenue' });
        }
        finally {
            setSaving(false);
        }
    });
    const handlePortfolioImageUpload = (file) => __awaiter(this, void 0, void 0, function* () {
        // Dans une vraie application, on uploaderait l'image vers Supabase Storage
        console.log('Uploading file:', file.name);
    });
    const addPortfolioItem = () => {
        if (!profile)
            return;
        const newItem = {
            id: `port${Date.now()}`,
            title: '',
            description: '',
            url: '',
            image_url: ''
        };
        setProfile(Object.assign(Object.assign({}, profile), { portfolio: [...profile.portfolio, newItem] }));
    };
    const updatePortfolioItem = (id, updates) => {
        if (!profile)
            return;
        setProfile(Object.assign(Object.assign({}, profile), { portfolio: profile.portfolio.map(item => item.id === id ? Object.assign(Object.assign({}, item), updates) : item) }));
    };
    const removePortfolioItem = (id) => {
        if (!profile)
            return;
        setProfile(Object.assign(Object.assign({}, profile), { portfolio: profile.portfolio.filter(item => item.id !== id) }));
    };
    const addSkill = (skill) => {
        if (!profile || profile.skills.includes(skill))
            return;
        setProfile(Object.assign(Object.assign({}, profile), { skills: [...profile.skills, skill] }));
    };
    const removeSkill = (skill) => {
        if (!profile)
            return;
        setProfile(Object.assign(Object.assign({}, profile), { skills: profile.skills.filter(s => s !== skill) }));
    };
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center py-12", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    if (!profile) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-12", children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "Profil non trouv\u00E9" }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-4xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-white", children: "Mon Profil Freelance" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setEditing(!editing), className: editing ? "btn-secondary" : "btn-primary", children: editing ? "Annuler" : "Modifier le profil" })] }), message && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: `mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`, children: message.text })), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-8", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-white mb-4", children: "Informations de base" }), editing ? ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Titre professionnel" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: profile.title, onChange: (e) => setProfile(Object.assign(Object.assign({}, profile), { title: e.target.value })), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Taux horaire (\u20AC)" }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: profile.hourly_rate, onChange: (e) => setProfile(Object.assign(Object.assign({}, profile), { hourly_rate: Number(e.target.value) })), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Description" }), (0, jsx_runtime_1.jsx)("textarea", { value: profile.description, onChange: (e) => setProfile(Object.assign(Object.assign({}, profile), { description: e.target.value })), rows: 4, className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Disponibilit\u00E9" }), (0, jsx_runtime_1.jsxs)("select", { value: profile.availability, onChange: (e) => setProfile(Object.assign(Object.assign({}, profile), { availability: e.target.value })), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "available", children: "Disponible pour de nouveaux projets" }), (0, jsx_runtime_1.jsx)("option", { value: "limited", children: "Disponibilit\u00E9 limit\u00E9e" }), (0, jsx_runtime_1.jsx)("option", { value: "unavailable", children: "Non disponible actuellement" })] })] })] })) : ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-white", children: profile.title }), (0, jsx_runtime_1.jsxs)("p", { className: "text-primary-400 font-semibold mt-2", children: [profile.hourly_rate, "\u20AC / heure"] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-400", children: "Disponibilit\u00E9" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-white", children: [profile.availability === 'available' && 'Disponible pour de nouveaux projets', profile.availability === 'limited' && 'Disponibilité limitée', profile.availability === 'unavailable' && 'Non disponible actuellement'] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-400", children: "\u00C0 propos" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 mt-1", children: profile.description })] })] }))] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "card", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-white mb-4", children: "Comp\u00E9tences" }), editing ? ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: profile.skills.map((skill) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center bg-white/10 rounded-full px-3 py-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-white", children: skill }), (0, jsx_runtime_1.jsx)("button", { onClick: () => removeSkill(skill), className: "ml-2 text-gray-400 hover:text-red-400", children: (0, jsx_runtime_1.jsx)(outline_1.TrashIcon, { className: "h-4 w-4" }) })] }, skill))) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Ajouter une comp\u00E9tence...", className: "flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", onKeyPress: (e) => {
                                                    if (e.key === 'Enter') {
                                                        const input = e.target;
                                                        if (input.value.trim()) {
                                                            addSkill(input.value.trim());
                                                            input.value = '';
                                                        }
                                                    }
                                                } }), (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                                                    const input = document.querySelector('input[placeholder="Ajouter une compétence..."]');
                                                    if (input.value.trim()) {
                                                        addSkill(input.value.trim());
                                                        input.value = '';
                                                    }
                                                }, className: "btn-primary", children: "Ajouter" })] })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: profile.skills.map((skill) => ((0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-600/20 text-primary-400", children: skill }, skill))) }))] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "card", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-white", children: "Portfolio" }), editing && ((0, jsx_runtime_1.jsxs)("button", { onClick: addPortfolioItem, className: "btn-secondary flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(outline_1.PlusIcon, { className: "h-5 w-5" }), "Ajouter un projet"] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: profile.portfolio.map((item) => ((0, jsx_runtime_1.jsx)("div", { className: "bg-white/10 rounded-lg overflow-hidden", children: editing ? ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Titre" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: item.title, onChange: (e) => updatePortfolioItem(item.id, { title: e.target.value }), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Description" }), (0, jsx_runtime_1.jsx)("textarea", { value: item.description, onChange: (e) => updatePortfolioItem(item.id, { description: e.target.value }), rows: 3, className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "URL" }), (0, jsx_runtime_1.jsx)("input", { type: "url", value: item.url, onChange: (e) => updatePortfolioItem(item.id, { url: e.target.value }), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Image" }), (0, jsx_runtime_1.jsxs)("div", Object.assign({}, getRootProps(), { className: "border-2 border-dashed border-white/20 rounded-lg p-4 text-center cursor-pointer hover:border-white/40 transition-colors", children: [(0, jsx_runtime_1.jsx)("input", Object.assign({}, getInputProps())), item.image_url ? ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("img", { src: item.image_url, alt: item.title, className: "h-32 mx-auto object-cover rounded" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400 mt-2", children: "Cliquez ou glissez pour changer l'image" })] })) : ((0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "Cliquez ou glissez une image ici" }))] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-end", children: (0, jsx_runtime_1.jsxs)("button", { onClick: () => removePortfolioItem(item.id), className: "text-red-400 hover:text-red-300 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(outline_1.TrashIcon, { className: "h-4 w-4" }), "Supprimer"] }) })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [item.image_url && ((0, jsx_runtime_1.jsx)("img", { src: item.image_url, alt: item.title, className: "w-full h-48 object-cover" })), (0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium", children: item.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm mt-1", children: item.description }), (0, jsx_runtime_1.jsxs)("a", { href: item.url, target: "_blank", rel: "noopener noreferrer", className: "text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1 mt-2", children: ["Voir le projet", (0, jsx_runtime_1.jsx)(ArrowTopRightOnSquareIcon, { className: "h-4 w-4" })] })] })] })) }, item.id))) }), profile.portfolio.length === 0 && ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-6 text-gray-400", children: editing ? ((0, jsx_runtime_1.jsx)("p", { children: "Ajoutez des projets \u00E0 votre portfolio pour montrer votre travail" })) : ((0, jsx_runtime_1.jsx)("p", { children: "Aucun projet dans le portfolio" })) }))] }), editing && ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-end", children: (0, jsx_runtime_1.jsx)("button", { onClick: saveProfile, disabled: saving, className: "btn-primary", children: saving ? 'Enregistrement...' : 'Enregistrer le profil' }) }))] })] }));
}
