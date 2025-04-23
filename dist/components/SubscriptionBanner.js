import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../stores/auth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { SparklesIcon } from '@heroicons/react/24/outline';
export function SubscriptionBanner() {
    const { user, subscription } = useAuth();
    // Si l'utilisateur a un abonnement actif, ne pas afficher la bannière
    if ((subscription === null || subscription === void 0 ? void 0 : subscription.status) === 'active') {
        return null;
    }
    // Si l'utilisateur est en période d'essai, afficher le temps restant
    const isTrialActive = (user === null || user === void 0 ? void 0 : user.trial_ends_at) && new Date(user.trial_ends_at) > new Date();
    if (!isTrialActive && (subscription === null || subscription === void 0 ? void 0 : subscription.status) !== 'trialing') {
        return null;
    }
    return (_jsx(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: "fixed bottom-4 right-4 z-40 max-w-md bg-gradient-to-r from-primary-600/90 to-secondary-600/90 backdrop-blur-sm rounded-lg p-4 shadow-xl", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "p-2 bg-white/10 rounded-lg", children: _jsx(SparklesIcon, { className: "h-6 w-6 text-white" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-medium text-white", children: isTrialActive
                                ? 'Votre période d\'essai est active'
                                : 'Votre période d\'essai est terminée' }), _jsx("p", { className: "text-white/80 mt-1", children: isTrialActive
                                ? `Profitez de toutes les fonctionnalités premium jusqu'au ${format(new Date(user.trial_ends_at), 'dd MMMM yyyy', { locale: fr })}`
                                : 'Passez à un plan payant pour continuer à profiter de toutes les fonctionnalités' }), _jsxs("div", { className: "mt-4 flex justify-between items-center", children: [_jsx(Link, { to: "/pricing", className: "bg-white text-primary-600 hover:bg-white/90 px-4 py-2 rounded-lg font-medium text-sm", children: isTrialActive ? 'Passer au plan Pro' : 'Voir les plans' }), _jsx("button", { onClick: () => {
                                        // Masquer la bannière en utilisant localStorage
                                        localStorage.setItem('subscription_banner_dismissed', 'true');
                                        // Forcer un re-render
                                        window.location.reload();
                                    }, className: "text-white/80 hover:text-white text-sm", children: "Plus tard" })] })] })] }) }));
}
