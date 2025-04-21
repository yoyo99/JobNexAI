"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionFeatures = SubscriptionFeatures;
const jsx_runtime_1 = require("react/jsx-runtime");
const outline_1 = require("@heroicons/react/24/outline");
function SubscriptionFeatures({ plan }) {
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
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-white", children: "Fonctionnalit\u00E9s incluses" }), (0, jsx_runtime_1.jsx)("ul", { className: "space-y-2", children: features[plan].map((feature) => ((0, jsx_runtime_1.jsxs)("li", { className: "flex items-start gap-3 text-gray-300", children: [(0, jsx_runtime_1.jsx)(outline_1.CheckIcon, { className: "h-5 w-5 flex-none text-primary-400 mt-0.5" }), (0, jsx_runtime_1.jsx)("span", { children: feature })] }, feature))) })] }));
}
