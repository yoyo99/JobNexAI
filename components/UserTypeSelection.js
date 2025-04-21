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
exports.UserTypeSelection = UserTypeSelection;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const react_router_dom_1 = require("react-router-dom");
const supabase_1 = require("../lib/supabase");
const auth_1 = require("../stores/auth");
const outline_1 = require("@heroicons/react/24/outline");
function UserTypeSelection() {
    const { user, loadUser } = (0, auth_1.useAuth)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleUserTypeSelection = (userType) => __awaiter(this, void 0, void 0, function* () {
        if (!user)
            return;
        try {
            setLoading(true);
            setError(null);
            // Mettre à jour le profil utilisateur avec le type sélectionné
            const { error } = yield supabase_1.supabase
                .from('profiles')
                .update({ user_type: userType })
                .eq('id', user.id);
            if (error)
                throw error;
            // Recharger les informations utilisateur
            yield loadUser();
            // Rediriger vers la page appropriée en fonction du type d'utilisateur
            switch (userType) {
                case 'candidate':
                    navigate('/dashboard');
                    break;
                case 'freelancer':
                    navigate('/freelance/projects');
                    break;
                case 'recruiter':
                    navigate('/recruiter/dashboard');
                    break;
            }
        }
        catch (error) {
            console.error('Error setting user type:', error);
            setError(error.message || 'Une erreur est survenue. Veuillez réessayer.');
        }
        finally {
            setLoading(false);
        }
    });
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-background", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "max-w-3xl w-full space-y-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("h2", { className: "mt-6 text-3xl font-extrabold text-white", children: "Bienvenue sur JobNexus" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-gray-400", children: "Veuillez s\u00E9lectionner votre profil pour continuer" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { whileHover: { scale: 1.05 }, className: "bg-white/10 rounded-xl p-6 text-center cursor-pointer hover:bg-white/15 transition-colors", onClick: () => handleUserTypeSelection('candidate'), children: [(0, jsx_runtime_1.jsx)("div", { className: "mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-600/20 mb-4", children: (0, jsx_runtime_1.jsx)(outline_1.UserIcon, { className: "h-8 w-8 text-primary-400" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-medium text-white mb-2", children: "Candidat" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm", children: "Je cherche un emploi et souhaite utiliser les outils de recherche d'emploi et de gestion de candidatures." })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { whileHover: { scale: 1.05 }, className: "bg-white/10 rounded-xl p-6 text-center cursor-pointer hover:bg-white/15 transition-colors", onClick: () => handleUserTypeSelection('freelancer'), children: [(0, jsx_runtime_1.jsx)("div", { className: "mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-secondary-600/20 mb-4", children: (0, jsx_runtime_1.jsx)(outline_1.DocumentTextIcon, { className: "h-8 w-8 text-secondary-400" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-medium text-white mb-2", children: "Freelance" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm", children: "Je suis freelance et je cherche des projets ou des missions. J'ai besoin d'outils pour g\u00E9rer mon activit\u00E9." })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { whileHover: { scale: 1.05 }, className: "bg-white/10 rounded-xl p-6 text-center cursor-pointer hover:bg-white/15 transition-colors", onClick: () => handleUserTypeSelection('recruiter'), children: [(0, jsx_runtime_1.jsx)("div", { className: "mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-600/20 mb-4", children: (0, jsx_runtime_1.jsx)(outline_1.BriefcaseIcon, { className: "h-8 w-8 text-green-400" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-medium text-white mb-2", children: "Recruteur" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm", children: "Je suis recruteur et je cherche des candidats pour mes offres d'emploi ou des freelances pour des missions." })] })] }), error && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-900/50 text-red-400 p-4 rounded-lg text-center", children: error })), loading && ((0, jsx_runtime_1.jsx)("div", { className: "text-center", children: (0, jsx_runtime_1.jsx)("div", { className: "inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) })), (0, jsx_runtime_1.jsx)("p", { className: "text-center text-sm text-gray-500", children: "Vous pourrez modifier votre profil ult\u00E9rieurement dans les param\u00E8tres de votre compte." })] }) }));
}
