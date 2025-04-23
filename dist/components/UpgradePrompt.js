import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../stores/auth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { SparklesIcon } from '@heroicons/react/24/outline';
export function UpgradePrompt() {
    const { user, subscription } = useAuth();
    // Si l'utilisateur a un abonnement actif, ne pas afficher la bannière
    if ((subscription === null || subscription === void 0 ? void 0 : subscription.status) === 'active') {
        return null;
    }
    // Si l'utilisateur est en période d'essai, afficher le temps restant
    const isTrialActive = (user === null || user === void 0 ? void 0 : user.trial_ends_at) && new Date(user.trial_ends_at) > new Date();
    return (_jsx(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: "bg-gradient-to-r from-primary-600/20 to-secondary-600/20 rounded-lg p-6 mb-8", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "p-2 bg-primary-600/30 rounded-lg", children: _jsx(SparklesIcon, { className: "h-6 w-6 text-primary-400" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-medium text-white", children: isTrialActive
                                ? 'Votre période d\'essai est active'
                                : 'Débloquez toutes les fonctionnalités premium' }), _jsx("p", { className: "text-gray-300 mt-1", children: isTrialActive
                                ? `Profitez de toutes les fonctionnalités premium jusqu'au ${format(new Date(user.trial_ends_at), 'dd MMMM yyyy', { locale: fr })}`
                                : 'Accédez à des fonctionnalités avancées pour optimiser votre recherche d\'emploi' }), _jsx("div", { className: "mt-4", children: _jsx(Link, { to: "/pricing", className: "btn-primary inline-flex", children: isTrialActive ? 'Passer au plan Pro' : 'Voir les plans' }) })] })] }) }));
}
