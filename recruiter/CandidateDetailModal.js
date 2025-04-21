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
exports.CandidateDetailModal = CandidateDetailModal;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@headlessui/react");
const outline_1 = require("@heroicons/react/24/outline");
const react_2 = require("react");
function CandidateDetailModal({ isOpen, onClose, candidate }) {
    const [messageContent, setMessageContent] = (0, react_2.useState)('');
    const [sending, setSending] = (0, react_2.useState)(false);
    const handleSendMessage = () => __awaiter(this, void 0, void 0, function* () {
        if (!messageContent.trim())
            return;
        try {
            setSending(true);
            // Simuler l'envoi d'un message
            yield new Promise(resolve => setTimeout(resolve, 1000));
            // Réinitialiser le formulaire
            setMessageContent('');
            // Afficher un message de succès (dans une vraie application)
            alert('Message envoyé avec succès');
        }
        catch (error) {
            console.error('Error sending message:', error);
        }
        finally {
            setSending(false);
        }
    });
    const getAvailabilityLabel = (availability) => {
        switch (availability) {
            case 'available':
                return 'Disponible';
            case 'limited':
                return 'Disponibilité limitée';
            case 'unavailable':
                return 'Non disponible';
            default:
                return availability;
        }
    };
    const getAvailabilityColor = (availability) => {
        switch (availability) {
            case 'available':
                return 'bg-green-600 text-green-100';
            case 'limited':
                return 'bg-yellow-600 text-yellow-100';
            case 'unavailable':
                return 'bg-red-600 text-red-100';
            default:
                return 'bg-gray-600 text-gray-100';
        }
    };
    // Données fictives pour la démonstration
    const candidateDetails = {
        email: `${candidate.full_name.toLowerCase().replace(' ', '.')}@example.com`,
        phone: '+33 6 12 34 56 78',
        experience: [
            {
                id: 'exp1',
                title: 'Senior Developer',
                company: 'TechCorp',
                location: 'Paris',
                start_date: '2020-01',
                end_date: null,
                current: true,
                description: 'Développement d\'applications web avec React et Node.js. Mise en place d\'architectures scalables et de CI/CD pipelines.'
            },
            {
                id: 'exp2',
                title: 'Frontend Developer',
                company: 'WebAgency',
                location: 'Lyon',
                start_date: '2017-03',
                end_date: '2019-12',
                current: false,
                description: 'Création d\'interfaces utilisateur réactives et accessibles. Collaboration avec les designers UX/UI.'
            }
        ],
        education: [
            {
                id: 'edu1',
                degree: 'Master en Informatique',
                school: 'Université de Paris',
                year: '2017',
                description: 'Spécialisation en développement web et applications mobiles'
            }
        ],
        languages: [
            { language: 'Français', level: 'Natif' },
            { language: 'Anglais', level: 'Courant' },
            { language: 'Espagnol', level: 'Intermédiaire' }
        ]
    };
    return ((0, jsx_runtime_1.jsxs)(react_1.Dialog, { open: isOpen, onClose: onClose, className: "relative z-50", children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/75", "aria-hidden": "true" }), (0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 flex items-center justify-center p-4", children: (0, jsx_runtime_1.jsxs)(react_1.Dialog.Panel, { className: "w-full max-w-4xl h-[90vh] overflow-y-auto rounded-lg bg-background p-6 shadow-xl", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(react_1.Dialog.Title, { className: "text-lg font-medium text-white", children: "Profil du candidat" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-white transition-colors", children: (0, jsx_runtime_1.jsx)(outline_1.XMarkIcon, { className: "h-6 w-6" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "md:col-span-1 space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center text-center", children: [(0, jsx_runtime_1.jsx)("img", { src: candidate.avatar_url, alt: candidate.full_name, className: "h-32 w-32 rounded-full object-cover mb-4" }), (0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-white", children: candidate.full_name }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: candidate.title }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center mt-2", children: [(0, jsx_runtime_1.jsx)(outline_1.StarIcon, { className: "h-5 w-5 text-yellow-400" }), (0, jsx_runtime_1.jsxs)("span", { className: "ml-1 text-white font-medium", children: [candidate.match_score, "% match"] })] }), (0, jsx_runtime_1.jsx)("span", { className: `mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(candidate.availability)}`, children: getAvailabilityLabel(candidate.availability) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/5 rounded-lg p-4 space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(outline_1.MapPinIcon, { className: "h-5 w-5 text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white", children: candidate.location })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(outline_1.EnvelopeIcon, { className: "h-5 w-5 text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white", children: candidateDetails.email })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(outline_1.PhoneIcon, { className: "h-5 w-5 text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white", children: candidateDetails.phone })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium mb-2", children: "Comp\u00E9tences" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: candidate.skills.map((skill) => ((0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-600/20 text-primary-400", children: skill }, skill))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium mb-2", children: "Langues" }), (0, jsx_runtime_1.jsx)("ul", { className: "space-y-1", children: candidateDetails.languages.map((lang, index) => ((0, jsx_runtime_1.jsxs)("li", { className: "text-gray-300", children: [lang.language, " - ", (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: lang.level })] }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("button", { className: "btn-primary w-full", children: "T\u00E9l\u00E9charger le CV" }), (0, jsx_runtime_1.jsx)("button", { className: "btn-secondary w-full", children: "Planifier un entretien" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "md:col-span-2 space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-white font-medium mb-4 flex items-center", children: [(0, jsx_runtime_1.jsx)(outline_1.BriefcaseIcon, { className: "h-5 w-5 mr-2" }), "Exp\u00E9rience professionnelle"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: candidateDetails.experience.map((exp) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/5 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium", children: exp.title }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-400", children: [exp.company, " - ", exp.location] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-500", children: [exp.start_date, " - ", exp.current ? 'Présent' : exp.end_date] }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-gray-300", children: exp.description })] }, exp.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-white font-medium mb-4 flex items-center", children: [(0, jsx_runtime_1.jsx)(outline_1.AcademicCapIcon, { className: "h-5 w-5 mr-2" }), "Formation"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: candidateDetails.education.map((edu) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/5 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium", children: edu.degree }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-400", children: [edu.school, " - ", edu.year] }), edu.description && ((0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-gray-300", children: edu.description }))] }, edu.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium mb-4", children: "Envoyer un message" }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/5 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("textarea", { value: messageContent, onChange: (e) => setMessageContent(e.target.value), rows: 4, placeholder: "\u00C9crivez votre message au candidat...", className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4" }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-end", children: (0, jsx_runtime_1.jsx)("button", { onClick: handleSendMessage, disabled: sending || !messageContent.trim(), className: "btn-primary", children: sending ? 'Envoi...' : 'Envoyer le message' }) })] })] })] })] })] }) })] }));
}
