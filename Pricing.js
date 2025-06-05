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
exports.Pricing = Pricing;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const react_router_dom_1 = require("react-router-dom");
const supabase_1 = require("../lib/supabase");
const auth_1 = require("../stores/auth");

const trialPlanDetails = {
    name: "Essai Gratuit 48h",
    userFacingPrice: "0€",
    stripePriceId: "price_1RWdHcQIOmiow871I3yM8fQM",
    supabaseProductId: "trial_48h",
    userTypeTarget: "candidate", // Default user type for trial, can be adjusted by webhook if needed
    description: "Testez toutes nos fonctionnalités premium pendant 48 heures.",
    features: [
        "Accès complet aux fonctionnalités 'Objectif Emploi'",
        "Création de CV assistée par IA",
        "Suivi de candidatures",
        "Support standard"
    ],
    cta: "Commencer mon essai gratuit",
    mostPopular: false,
};

const planCategories = [
    {
        categoryName: "Objectif Emploi",
        userTypeTarget: "candidate",
        monthly: {
            name: "Objectif Emploi (Mensuel)",
            userFacingPrice: "9.99€", 
            stripePriceId: "price_1RWdQNQIOmiow871XZcJO7QK",
            supabaseProductId: "objectif_emploi_mensuel",
            description: "Idéal pour une recherche d'emploi active et ciblée.",
            features: ["Recherche avancée", "CV Builder IA", "Suivi candidatures", "Alertes emploi"],
            cta: "Choisir ce plan",
        },
        yearly: {
            name: "Objectif Emploi (Annuel)",
            userFacingPrice: "99.90€", 
            stripePriceId: "price_1RWdSbQIOmiow871HazTXnUJ",
            supabaseProductId: "objectif_emploi_annuel",
            description: "Économisez 2 mois avec notre engagement annuel.",
            features: ["Tous les avantages mensuels", "Support prioritaire", "Analyses de marché"],
            cta: "Choisir ce plan (Annuel)",
            discountInfo: "-16%"
        }
    },
    {
        categoryName: "Freelance Starter",
        userTypeTarget: "freelancer",
        monthly: {
            name: "Freelance Starter (Mensuel)",
            userFacingPrice: "14.99€", 
            stripePriceId: "price_1RWHMeQIOmiow871aruWiSAg",
            supabaseProductId: "freelance_pro",
            description: "Lancez et développez votre activité de freelance.",
            features: ["Accès aux projets", "Profil freelance optimisé", "Facturation simplifiée"],
            cta: "Choisir ce plan",
        },
        yearly: {
            name: "Freelance Starter (Annuel)",
            userFacingPrice: "149.90€", 
            stripePriceId: "price_1RWHQbQIOmiow871ySCJbYPW",
            supabaseProductId: "freelance_pro_annuel",
            description: "Maximisez vos opportunités avec l'engagement annuel.",
            features: ["Tous les avantages mensuels", "Mise en avant du profil", "Outils de gestion"],
            cta: "Choisir ce plan (Annuel)",
            discountInfo: "-16%"
        }
    },
    {
        categoryName: "Recruteur Business",
        userTypeTarget: "recruiter",
        monthly: {
            name: "Recruteur Business (Mensuel)",
            userFacingPrice: "49.99€", 
            stripePriceId: "price_1RWHTwQIOmiow871O2ZWdTfr",
            supabaseProductId: "recruiter_business",
            description: "Trouvez les meilleurs talents pour votre entreprise.",
            features: ["Publication d'offres", "Accès base de CV", "Outils de matching IA"],
            cta: "Choisir ce plan",
        },
        yearly: {
            name: "Recruteur Business (Annuel)",
            userFacingPrice: "499.90€", 
            stripePriceId: "price_1RWHWKQIOmiow871iO6Nn2KC",
            supabaseProductId: "recruiter_business_annuel",
            description: "Solution complète pour les recruteurs exigeants.",
            features: ["Tous les avantages mensuels", "Multi-comptes recruteurs", "Support dédié"],
            cta: "Choisir ce plan (Annuel)",
            discountInfo: "-16%"
        }
    }
];

function Pricing() {
    const { user } = (0, auth_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [loadingPlan, setLoadingPlan] = (0, react_1.useState)(null); // Track loading state per plan
    const [error, setError] = (0, react_1.useState)(null);
    const [frequency, setFrequency] = (0, react_1.useState)('monthly');

    const handleSubscribe = (planDetails) => __awaiter(this, void 0, void 0, function* () {
        if (!user) {
            navigate('/login', { state: { from: '/pricing' } });
            return;
        }
        if (!planDetails || !planDetails.stripePriceId) {
            console.error("Plan details or Stripe Price ID missing");
            setError("Détails du plan incorrects. Veuillez réessayer.");
            return;
        }

        setLoadingPlan(planDetails.stripePriceId); // Set loading for the specific plan button
        setError(null);

        try {
            const { data, error: invokeError } = yield supabase_1.supabase.functions.invoke('create-checkout-session', {
                body: JSON.stringify({
                    priceId: planDetails.stripePriceId,
                    userId: user.id,
                    metadata: {
                        supabase_product_id: planDetails.supabaseProductId,
                        user_type_target: planDetails.userTypeTarget,
                        // email: user.email // Pass email if your webhook needs it and can't get it from Stripe customer
                    }
                })
            });

            if (invokeError) throw invokeError;
            if (data && data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("URL de redirection Stripe non reçue.");
            }
        }
        catch (error) {
            console.error('Error subscribing:', error);
            setError('Une erreur est survenue lors de la souscription. Veuillez réessayer.');
        }
        finally {
            setLoadingPlan(null); // Clear loading state
        }
    });

    const renderPlanCard = (plan, planKey, isTrial = false) => {
        const currentPriceId = plan.stripePriceId;
        const isLoading = loadingPlan === currentPriceId;

        return ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.3 },
            className: `relative rounded-2xl border ${plan.mostPopular ? 'border-primary-400 bg-primary-900/10' : 'border-white/10 bg-white/5'} p-8 shadow-lg flex flex-col`,
            children: [
                plan.mostPopular && ((0, jsx_runtime_1.jsx)("div", { className: "absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-400 text-white px-4 py-1 rounded-full text-sm font-medium", children: "Le plus populaire" })),
                (0, jsx_runtime_1.jsxs)("div", { className: "flex-grow", children: [
                    (0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-white mb-2", children: plan.name }),
                    (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 mb-4 h-12", children: plan.description }),
                    (0, jsx_runtime_1.jsxs)("p", { className: "text-4xl font-bold text-white mb-6", children: [
                        plan.userFacingPrice,
                        !isTrial && (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-400", children: `/${frequency === 'monthly' ? 'mois' : 'an'}` })
                    ] }),
                    (0, jsx_runtime_1.jsx)("ul", { className: "space-y-4 mb-8", children: plan.features.map((feature) => ((0, jsx_runtime_1.jsxs)("li", { className: "flex items-start gap-3 text-gray-300", children: [
                        (0, jsx_runtime_1.jsx)(CheckIcon, { className: "h-6 w-6 flex-none text-primary-400", "aria-hidden": "true" }),
                        (0, jsx_runtime_1.jsx)("span", { children: feature })
                    ] }, feature)))
                    })
                ]}),
                (0, jsx_runtime_1.jsx)("button", {
                    onClick: () => handleSubscribe(plan),
                    disabled: isLoading,
                    className: `w-full btn-primary mt-auto ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`,
                    children: isLoading ? 'Chargement...' : plan.cta
                })
            ]
        }, planKey));
    };

    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen py-12 sm:py-24 flex flex-col items-center px-4", children: [
        (0, jsx_runtime_1.jsxs)("div", { className: "text-center max-w-3xl mx-auto mb-12 sm:mb-16", children: [
            (0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text mb-6", children: "Choisissez votre aventure" }),
            (0, jsx_runtime_1.jsx)("p", { className: "text-lg text-gray-400 mb-8", children: "Que vous soyez candidat, freelance ou recruteur, nous avons un plan adapté à vos ambitions. Commencez par un essai gratuit ou choisissez directement le plan qui vous propulsera." }),
            (user === null || user === void 0 ? void 0 : user.trial_ends_at) && new Date(user.trial_ends_at) > new Date() && ((0, jsx_runtime_1.jsx)("div", { className: "bg-primary-600/20 text-primary-400 p-4 rounded-lg inline-block mb-4", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-lg", children: ["Période d'essai active jusqu'au", ' ', new Date(user.trial_ends_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })] }) })),
            (0, jsx_runtime_1.jsx)("div", { className: "mt-8 flex justify-center", children: (
                (0, jsx_runtime_1.jsxs)("div", { className: "relative flex rounded-full bg-white/5 p-1", children: [
                    (0, jsx_runtime_1.jsx)("button", { type: "button", className: `${frequency === 'monthly' ? 'bg-primary-600 text-white' : 'text-gray-400'} rounded-full py-2 px-6 text-sm font-semibold transition-colors`, onClick: () => setFrequency('monthly'), children: "Mensuel" }),
                    (0, jsx_runtime_1.jsxs)("button", { type: "button", className: `${frequency === 'yearly' ? 'bg-primary-600 text-white' : 'text-gray-400'} rounded-full py-2 px-6 text-sm font-semibold transition-colors`, onClick: () => setFrequency('yearly'), children: ["Annuel ", (0, jsx_runtime_1.jsx)("span", { className: "text-primary-400 ml-1", children: "Économisez !" })] })
                ] })
            )})
        ] }),

        (0, jsx_runtime_1.jsx)("div", { className: "w-full max-w-md mx-auto mb-12", children: renderPlanCard(trialPlanDetails, 'trial-plan', true) }),

        planCategories.map((category) => ((0, jsx_runtime_1.jsxs)("div", {
            className: "w-full max-w-7xl mx-auto mb-16",
            children: [
                (0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-bold text-white text-center mb-10", children: category.categoryName }),
                (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-1 gap-8", 
                    children: renderPlanCard(category[frequency], `${category.userTypeTarget}-${frequency}`)
                })
            ]
        }, category.userTypeTarget))),

        error && ((0, jsx_runtime_1.jsx)("div", { className: "mt-8 p-4 bg-red-900/50 text-red-400 rounded-lg max-w-3xl mx-auto", children: error })),
        (0, jsx_runtime_1.jsxs)("div", { className: "mt-16 max-w-3xl mx-auto text-center", children: [
            (0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-white mb-4", children: "Questions fréquentes" }),
            (0, jsx_runtime_1.jsx)("dl", { className: "space-y-6 divide-y divide-white/10", children: faqs.map((faq) => ((0, jsx_runtime_1.jsxs)("div", { className: "pt-6", children: [
                (0, jsx_runtime_1.jsx)("dt", { className: "text-lg font-medium text-white", children: faq.question }),
                (0, jsx_runtime_1.jsx)("dd", { className: "mt-2 text-base text-gray-400", children: faq.answer })
            ] }, faq.question))) })
        ] })
    ] }));
}

const faqs = [
    {
        question: 'Puis-je annuler mon abonnement à tout moment ?',
        answer: 'Oui, vous pouvez annuler votre abonnement à tout moment. Vous continuerez à avoir accès aux fonctionnalités premium jusqu\'à la fin de votre période de facturation.',
    },
    {
        question: 'Comment fonctionne la période d\'essai gratuite de 48h ?',
        answer: 'Vous bénéficiez d\'un accès complet à nos fonctionnalités premium pendant 48 heures. Selon la configuration de Stripe, une carte bancaire peut être demandée pour vérification, même pour un essai à 0€.',
    },
    {
        question: 'Y a-t-il des frais supplémentaires ?',
        answer: 'Non, le prix affiché inclut toutes les fonctionnalités du plan. Il n\'y a pas de frais cachés ou supplémentaires.',
    },
    {
        question: 'Puis-je changer de plan ?',
        answer: 'Oui, vous pouvez passer à un plan supérieur à tout moment. Si vous souhaitez passer à un plan inférieur, le changement prendra effet à la fin de votre période de facturation actuelle.',
    },
    {
        question: 'Comment sont protégées mes données personnelles ?',
        answer: 'Nous prenons la protection de vos données très au sérieux. Toutes vos informations sont chiffrées et stockées en toute sécurité. Nous ne partageons jamais vos données avec des tiers sans votre consentement explicite.',
    },
];

function CheckIcon(props) {
    return ((0, jsx_runtime_1.jsx)("svg", Object.assign({ xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" }, props, { children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4.5 12.75l6 6 9-13.5" }) })));
}

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
exports.Pricing = Pricing;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const react_router_dom_1 = require("react-router-dom");
const supabase_1 = require("../lib/supabase");
const auth_1 = require("../stores/auth");
// Mise à jour des IDs de produits Stripe avec vos valeurs réelles
const plans = [
    {
        name: 'Free',
        price: '0€',
        priceId: null,
        description: 'Essayez les fonctionnalités de base gratuitement',
        features: [
            'Recherche d\'emploi basique',
            'CV builder limité',
            'Maximum 5 candidatures par mois',
            'Pas d\'accès aux analyses de marché',
            'Pas de suggestions personnalisées',
        ],
        cta: 'Commencer gratuitement',
        mostPopular: false,
    },
    {
        name: 'Pro',
        price: '9.99€',
        priceId: 'prod_S6wNQ7xaUtpmy1', // Abonnement Pro Mensuel
        yearlyPriceId: 'prod_S6wPih2AhKZEkS', // Abonnement Pro Annuel
        description: 'Tout ce dont vous avez besoin pour votre recherche d\'emploi',
        features: [
            'Recherche d\'emploi avancée avec filtres',
            'CV builder illimité avec IA',
            'Candidatures illimitées',
            'Suivi des candidatures',
            'Analyses et statistiques',
            'Suggestions d\'emploi personnalisées',
            'Alertes emploi personnalisées',
            'Réseau professionnel',
        ],
        cta: 'Commencer l\'essai gratuit',
        mostPopular: true,
    },
    {
        name: 'Enterprise',
        price: '29.99€',
        priceId: 'prod_S6wURmBdYoDuaz', // Abonnement Entreprise Mensuel
        yearlyPriceId: 'prod_S6wVXdjUcpcJ4i', // Abonnement Entreprise Annuel
        description: 'Solution complète pour les professionnels exigeants',
        features: [
            'Tout le plan Pro',
            'Support prioritaire',
            'API access',
            'Intégration ATS',
            'Formation personnalisée',
            'Analyses avancées du marché',
            'Coaching carrière personnalisé',
            'Accès anticipé aux nouvelles fonctionnalités',
        ],
        cta: 'Contacter les ventes',
        mostPopular: false,
    },
];
// Définir les plans spécifiques pour chaque type d'utilisateur
const freelancerPlans = [
    {
        name: 'Free',
        price: '0€',
        priceId: null,
        description: 'Pour les freelances débutants',
        features: [
            'Accès à 5 projets par mois',
            'Profil freelance basique',
            'Maximum 3 propositions par mois',
            'Pas d\'accès aux analyses de marché',
            'Pas de mise en avant du profil',
        ],
        cta: 'Commencer gratuitement',
        mostPopular: false,
    },
    {
        name: 'Pro',
        price: '14.99€',
        priceId: 'prod_S6wNQ7xaUtpmy1', // Utiliser le même ID que pour les candidats pour simplifier
        yearlyPriceId: 'prod_S6wPih2AhKZEkS',
        description: 'Pour les freelances qui veulent développer leur activité',
        features: [
            'Accès illimité aux projets',
            'Profil freelance avancé',
            'Propositions illimitées',
            'Mise en avant du profil',
            'Analyses de marché',
            'Alertes projets personnalisées',
            'Outils de gestion de projet',
            'Facturation simplifiée',
        ],
        cta: 'Commencer l\'essai gratuit',
        mostPopular: true,
    },
    {
        name: 'Business',
        price: '24.99€',
        priceId: 'prod_S6wURmBdYoDuaz', // Utiliser le même ID que pour les candidats pour simplifier
        yearlyPriceId: 'prod_S6wVXdjUcpcJ4i',
        description: 'Pour les freelances confirmés et les agences',
        features: [
            'Tout le plan Pro',
            'Visibilité premium',
            'Accès prioritaire aux nouveaux projets',
            'Outils de collaboration',
            'Gestion d\'équipe',
            'Analyses avancées',
            'Support dédié',
            'Formation et coaching',
        ],
        cta: 'Contacter les ventes',
        mostPopular: false,
    },
];
const recruiterPlans = [
    {
        name: 'Starter',
        price: '0€',
        priceId: null,
        description: 'Pour les petites entreprises et les startups',
        features: [
            '1 offre d\'emploi active',
            'Accès à la base de CV (limité)',
            'Pas d\'accès aux candidats premium',
            'Pas d\'outils d\'analyse',
            'Support par email uniquement',
        ],
        cta: 'Commencer gratuitement',
        mostPopular: false,
    },
    {
        name: 'Business',
        price: '49.99€',
        priceId: 'prod_S6wNQ7xaUtpmy1', // Utiliser le même ID que pour les candidats pour simplifier
        yearlyPriceId: 'prod_S6wPih2AhKZEkS',
        description: 'Pour les entreprises en croissance',
        features: [
            '5 offres d\'emploi actives',
            'Accès complet à la base de CV',
            'Recherche avancée de candidats',
            'Outils d\'analyse de base',
            'Intégration ATS',
            'Alertes candidats',
            'Support prioritaire',
            'Personnalisation de la marque employeur',
        ],
        cta: 'Commencer l\'essai gratuit',
        mostPopular: true,
    },
    {
        name: 'Enterprise',
        price: '199.99€',
        priceId: 'prod_S6wURmBdYoDuaz', // Utiliser le même ID que pour les candidats pour simplifier
        yearlyPriceId: 'prod_S6wVXdjUcpcJ4i',
        description: 'Pour les grandes entreprises et les cabinets de recrutement',
        features: [
            'Offres d\'emploi illimitées',
            'Accès VIP à tous les candidats',
            'Outils d\'analyse avancés',
            'Intégration complète',
            'API dédiée',
            'Gestion multi-utilisateurs',
            'Account manager dédié',
            'Formation et support premium',
        ],
        cta: 'Contacter les ventes',
        mostPopular: false,
    },
];
function Pricing() {
    const { user } = (0, auth_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [currentPlan, setCurrentPlan] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const [frequency, setFrequency] = (0, react_1.useState)('monthly');
    const [userType, setUserType] = (0, react_1.useState)('candidate');
    // Sélectionner les plans en fonction du type d'utilisateur
    const selectedPlans = userType === 'freelancer'
        ? freelancerPlans
        : userType === 'recruiter'
            ? recruiterPlans
            : plans;
    const handleSubscribe = (planName, priceId) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!user) {
            navigate('/login', { state: { from: '/pricing' } });
            return;
        }
        if (!priceId) {
            // Pour le plan gratuit - ne pas griser le bouton
            try {
                setLoading(true);
                setError(null);
                // Mettre à jour le type d'utilisateur si ce n'est pas déjà fait
                if (!user.user_type) {
                    const { error: updateError } = yield supabase_1.supabase
                        .from('profiles')
                        .update({ user_type: userType })
                        .eq('id', user.id);
                    if (updateError)
                        throw updateError;
                }
                // Rediriger vers la page appropriée en fonction du type d'utilisateur
                if (userType === 'freelancer') {
                    navigate('/freelance/projects');
                }
                else if (userType === 'recruiter') {
                    navigate('/recruiter/dashboard');
                }
                else {
                    navigate('/dashboard');
                }
            }
            catch (error) {
                console.error('Error updating user type:', error);
                setError('Une erreur est survenue. Veuillez réessayer.');
            }
            finally {
                setLoading(false);
            }
            return;
        }
        try {
            setLoading(true);
            setError(null);
            // Mettre à jour le type d'utilisateur si ce n'est pas déjà fait
            if (!user.user_type) {
                const { error: updateError } = yield supabase_1.supabase
                    .from('profiles')
                    .update({ user_type: userType })
                    .eq('id', user.id);
                if (updateError)
                    throw updateError;
            }
            // Sélectionner le bon ID de prix en fonction de la fréquence
            const selectedPriceId = frequency === 'yearly'
                ? ((_a = selectedPlans.find(p => p.name.toLowerCase() === planName.toLowerCase())) === null || _a === void 0 ? void 0 : _a.yearlyPriceId) || priceId
                : priceId;
            // Créer une session de paiement Stripe
            const { data, error } = yield supabase_1.supabase.functions.invoke('create-checkout-session', {
                body: {
                    userId: user.id,
                    priceId: selectedPriceId,
                    userType: userType
                }
            });
            if (error)
                throw error;
            // Rediriger vers Stripe Checkout
            window.location.href = data.url;
        }
        catch (error) {
            console.error('Error subscribing:', error);
            setError('Une erreur est survenue lors de la souscription. Veuillez réessayer.');
        }
        finally {
            setLoading(false);
        }
    });
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen py-24 flex flex-col items-center px-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center max-w-3xl mx-auto mb-16", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text mb-6", children: "Choisissez votre plan" }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg text-gray-400 mb-8", children: "Trouvez le plan qui correspond \u00E0 vos besoins et commencez \u00E0 optimiser votre recherche d'emploi d\u00E8s aujourd'hui." }), (user === null || user === void 0 ? void 0 : user.trial_ends_at) && new Date(user.trial_ends_at) > new Date() && ((0, jsx_runtime_1.jsx)("div", { className: "bg-primary-600/20 text-primary-400 p-4 rounded-lg inline-block", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-lg", children: ["P\u00E9riode d'essai active jusqu'au", ' ', new Date(user.trial_ends_at).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })] }) })), (0, jsx_runtime_1.jsx)("div", { className: "mt-8 flex justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative flex rounded-full bg-white/5 p-1", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", className: `${userType === 'candidate' ? 'bg-primary-600 text-white' : 'text-gray-400'} rounded-full py-2 px-6 text-sm font-semibold transition-colors`, onClick: () => setUserType('candidate'), children: "Candidat" }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: `${userType === 'freelancer' ? 'bg-primary-600 text-white' : 'text-gray-400'} rounded-full py-2 px-6 text-sm font-semibold transition-colors`, onClick: () => setUserType('freelancer'), children: "Freelance" }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: `${userType === 'recruiter' ? 'bg-primary-600 text-white' : 'text-gray-400'} rounded-full py-2 px-6 text-sm font-semibold transition-colors`, onClick: () => setUserType('recruiter'), children: "Recruteur" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-8 flex justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative flex rounded-full bg-white/5 p-1", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", className: `${frequency === 'monthly' ? 'bg-primary-600 text-white' : 'text-gray-400'} rounded-full py-2 px-6 text-sm font-semibold transition-colors`, onClick: () => setFrequency('monthly'), children: "Mensuel" }), (0, jsx_runtime_1.jsxs)("button", { type: "button", className: `${frequency === 'yearly' ? 'bg-primary-600 text-white' : 'text-gray-400'} rounded-full py-2 px-6 text-sm font-semibold transition-colors`, onClick: () => setFrequency('yearly'), children: ["Annuel ", (0, jsx_runtime_1.jsx)("span", { className: "text-primary-400 ml-1", children: "-20%" })] })] }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4", children: selectedPlans.map((plan, index) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: index * 0.1 }, className: `relative rounded-2xl border ${plan.mostPopular
                        ? 'border-primary-400 bg-primary-900/10'
                        : 'border-white/10 bg-white/5'} p-8 shadow-lg`, children: [plan.mostPopular && ((0, jsx_runtime_1.jsx)("div", { className: "absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-400 text-white px-4 py-1 rounded-full text-sm font-medium", children: "Le plus populaire" })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-white mb-2", children: plan.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 mb-4", children: plan.description }), (0, jsx_runtime_1.jsxs)("p", { className: "text-4xl font-bold text-white mb-6", children: [frequency === 'monthly'
                                            ? plan.price
                                            : plan.name === 'Free'
                                                ? '0€'
                                                : `${parseFloat(plan.price.replace('€', '')) * 0.8 * 12}€`, (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-400", children: plan.name !== 'Free' && `/${frequency === 'monthly' ? 'mois' : 'an'}` })] }), (0, jsx_runtime_1.jsx)("ul", { className: "space-y-4 mb-8", children: plan.features.map((feature) => ((0, jsx_runtime_1.jsxs)("li", { className: "flex items-start gap-3 text-gray-300", children: [(0, jsx_runtime_1.jsx)(CheckIcon, { className: "h-6 w-6 flex-none text-primary-400", "aria-hidden": "true" }), (0, jsx_runtime_1.jsx)("span", { children: feature })] }, feature))) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleSubscribe(plan.name.toLowerCase(), plan.priceId), disabled: loading || currentPlan === plan.name.toLowerCase(), className: `w-full btn-primary ${currentPlan === plan.name.toLowerCase()
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''}`, children: currentPlan === plan.name.toLowerCase()
                                        ? 'Plan actuel'
                                        : loading
                                            ? 'Chargement...'
                                            : plan.cta })] })] }, plan.name))) }), error && ((0, jsx_runtime_1.jsx)("div", { className: "mt-8 p-4 bg-red-900/50 text-red-400 rounded-lg", children: error })), (0, jsx_runtime_1.jsxs)("div", { className: "mt-16 max-w-3xl mx-auto text-center", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-white mb-4", children: "Questions fr\u00E9quentes" }), (0, jsx_runtime_1.jsx)("dl", { className: "space-y-6 divide-y divide-white/10", children: faqs.map((faq) => ((0, jsx_runtime_1.jsxs)("div", { className: "pt-6", children: [(0, jsx_runtime_1.jsx)("dt", { className: "text-lg font-medium text-white", children: faq.question }), (0, jsx_runtime_1.jsx)("dd", { className: "mt-2 text-base text-gray-400", children: faq.answer })] }, faq.question))) })] })] }));
}
const faqs = [
    {
        question: 'Puis-je annuler mon abonnement à tout moment ?',
        answer: 'Oui, vous pouvez annuler votre abonnement à tout moment. Vous continuerez à avoir accès aux fonctionnalités premium jusqu\'à la fin de votre période de facturation.',
    },
    {
        question: 'Comment fonctionne la période d\'essai gratuite ?',
        answer: 'Vous bénéficiez d\'une période d\'essai de 24 heures pour tester toutes les fonctionnalités premium. Aucune carte bancaire n\'est requise pour commencer l\'essai.',
    },
    {
        question: 'Y a-t-il des frais supplémentaires ?',
        answer: 'Non, le prix affiché inclut toutes les fonctionnalités du plan. Il n\'y a pas de frais cachés ou supplémentaires.',
    },
    {
        question: 'Puis-je changer de plan ?',
        answer: 'Oui, vous pouvez passer à un plan supérieur à tout moment. Si vous souhaitez passer à un plan inférieur, le changement prendra effet à la fin de votre période de facturation actuelle.',
    },
    {
        question: 'Comment sont protégées mes données personnelles ?',
        answer: 'Nous prenons la protection de vos données très au sérieux. Toutes vos informations sont chiffrées et stockées en toute sécurité. Nous ne partageons jamais vos données avec des tiers sans votre consentement explicite.',
    },
];
// Ajout de l'icône CheckIcon manquante
function CheckIcon(props) {
    return ((0, jsx_runtime_1.jsx)("svg", Object.assign({ xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" }, props, { children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4.5 12.75l6 6 9-13.5" }) })));
}
