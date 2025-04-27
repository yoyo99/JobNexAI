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
import { Dialog } from '@headlessui/react';
import { XMarkIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, BriefcaseIcon, AcademicCapIcon, StarIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
export function CandidateDetailModal({ isOpen, onClose, candidate }) {
    const [messageContent, setMessageContent] = useState('');
    const [sending, setSending] = useState(false);
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
    return (_jsxs(Dialog, { open: isOpen, onClose: onClose, className: "relative z-50", children: [_jsx("div", { className: "fixed inset-0 bg-black/75", "aria-hidden": "true" }), _jsx("div", { className: "fixed inset-0 flex items-center justify-center p-4", children: _jsxs(Dialog.Panel, { className: "w-full max-w-4xl h-[90vh] overflow-y-auto rounded-lg bg-background p-6 shadow-xl", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx(Dialog.Title, { className: "text-lg font-medium text-white", children: "Profil du candidat" }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-white transition-colors", children: _jsx(XMarkIcon, { className: "h-6 w-6" }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "md:col-span-1 space-y-6", children: [_jsxs("div", { className: "flex flex-col items-center text-center", children: [_jsx("img", { src: candidate.avatar_url, alt: candidate.full_name, className: "h-32 w-32 rounded-full object-cover mb-4" }), _jsx("h2", { className: "text-xl font-semibold text-white", children: candidate.full_name }), _jsx("p", { className: "text-gray-400", children: candidate.title }), _jsxs("div", { className: "flex items-center mt-2", children: [_jsx(StarIcon, { className: "h-5 w-5 text-yellow-400" }), _jsxs("span", { className: "ml-1 text-white font-medium", children: [candidate.match_score, "% match"] })] }), _jsx("span", { className: `mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(candidate.availability)}`, children: getAvailabilityLabel(candidate.availability) })] }), _jsxs("div", { className: "bg-white/5 rounded-lg p-4 space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MapPinIcon, { className: "h-5 w-5 text-gray-400" }), _jsx("span", { className: "text-white", children: candidate.location })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(EnvelopeIcon, { className: "h-5 w-5 text-gray-400" }), _jsx("span", { className: "text-white", children: candidateDetails.email })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(PhoneIcon, { className: "h-5 w-5 text-gray-400" }), _jsx("span", { className: "text-white", children: candidateDetails.phone })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-white font-medium mb-2", children: "Comp\u00E9tences" }), _jsx("div", { className: "flex flex-wrap gap-2", children: candidate.skills.map((skill) => (_jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-600/20 text-primary-400", children: skill }, skill))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-white font-medium mb-2", children: "Langues" }), _jsx("ul", { className: "space-y-1", children: candidateDetails.languages.map((lang, index) => (_jsxs("li", { className: "text-gray-300", children: [lang.language, " - ", _jsx("span", { className: "text-gray-400", children: lang.level })] }, index))) })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("button", { className: "btn-primary w-full", children: "T\u00E9l\u00E9charger le CV" }), _jsx("button", { className: "btn-secondary w-full", children: "Planifier un entretien" })] })] }), _jsxs("div", { className: "md:col-span-2 space-y-6", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-white font-medium mb-4 flex items-center", children: [_jsx(BriefcaseIcon, { className: "h-5 w-5 mr-2" }), "Exp\u00E9rience professionnelle"] }), _jsx("div", { className: "space-y-4", children: candidateDetails.experience.map((exp) => (_jsxs("div", { className: "bg-white/5 rounded-lg p-4", children: [_jsx("h4", { className: "text-white font-medium", children: exp.title }), _jsxs("p", { className: "text-gray-400", children: [exp.company, " - ", exp.location] }), _jsxs("p", { className: "text-sm text-gray-500", children: [exp.start_date, " - ", exp.current ? 'Présent' : exp.end_date] }), _jsx("p", { className: "mt-2 text-gray-300", children: exp.description })] }, exp.id))) })] }), _jsxs("div", { children: [_jsxs("h3", { className: "text-white font-medium mb-4 flex items-center", children: [_jsx(AcademicCapIcon, { className: "h-5 w-5 mr-2" }), "Formation"] }), _jsx("div", { className: "space-y-4", children: candidateDetails.education.map((edu) => (_jsxs("div", { className: "bg-white/5 rounded-lg p-4", children: [_jsx("h4", { className: "text-white font-medium", children: edu.degree }), _jsxs("p", { className: "text-gray-400", children: [edu.school, " - ", edu.year] }), edu.description && (_jsx("p", { className: "mt-2 text-gray-300", children: edu.description }))] }, edu.id))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-white font-medium mb-4", children: "Envoyer un message" }), _jsxs("div", { className: "bg-white/5 rounded-lg p-4", children: [_jsx("textarea", { value: messageContent, onChange: (e) => setMessageContent(e.target.value), rows: 4, placeholder: "\u00C9crivez votre message au candidat...", className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4" }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { onClick: handleSendMessage, disabled: sending || !messageContent.trim(), className: "btn-primary", children: sending ? 'Envoi...' : 'Envoyer le message' }) })] })] })] })] })] }) })] }));
}
