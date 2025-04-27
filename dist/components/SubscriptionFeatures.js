import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckIcon } from '@heroicons/react/24/outline';
export function SubscriptionFeatures({ plan }) {
    // Définir les fonctionnalités disponibles pour chaque plan
    const features = {
        free: [
            'Recherche d\'emploi basique',
            'CV builder limité',
            'Maximum 5 candidatures par mois',
            'Accès limité aux analyses de marché',
            'Pas de suggestions personnalisées',
        ],
        pro: [
            'Recherche d\'emploi avancée avec filtres',
            'CV builder illimité avec IA',
            'Candidatures illimitées',
            'Suivi des candidatures',
            'Analyses et statistiques complètes',
            'Suggestions d\'emploi personnalisées',
            'Alertes emploi personnalisées',
            'Réseau professionnel',
        ],
        enterprise: [
            'Tout le plan Pro',
            'Support prioritaire',
            'API access',
            'Intégration ATS',
            'Formation personnalisée',
            'Analyses avancées du marché',
            'Coaching carrière personnalisé',
            'Accès anticipé aux nouvelles fonctionnalités',
        ],
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-medium text-white", children: "Fonctionnalit\u00E9s incluses" }), _jsx("ul", { className: "space-y-2", children: features[plan].map((feature) => (_jsxs("li", { className: "flex items-start gap-3 text-gray-300", children: [_jsx(CheckIcon, { className: "h-5 w-5 flex-none text-primary-400 mt-0.5" }), _jsx("span", { children: feature })] }, feature))) })] }));
}
