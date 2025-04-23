var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../stores/auth';
import { ContactSalesModal } from './ContactSalesModal';
import { UserIcon, BriefcaseIcon, DocumentTextIcon, } from '@heroicons/react/24/outline';
// Mise à jour des IDs de produits Stripe avec vos valeurs réelles
const plans = [
    {
        name: 'Free',
        price: 0,
        priceId: null,
        description: "Essayez gratuitement toutes les fonctionnalités de base pendant 24h !",
        features: [
            "Durée de l'offre : 24h",
            "Recherche d'emploi basique",
            'CV builder limité',
            'Maximum 5 candidatures par mois',
            "Pas d'accès aux analyses de marché",
            'Pas de suggestions personnalisées',
        ],
        cta: "Commencer l’essai gratuit de 24h",
        mostPopular: false,
    },
    {
        name: 'Pro',
        price: 9.99,
        yearlyPrice: 95.99, // exemple : 9.99 * 12 * 0.8 (20% de réduction)
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
        cta: "S’abonner",
        mostPopular: true,
    },
    {
        name: 'Enterprise',
        price: 29.99,
        yearlyPrice: 287.90, // exemple : 29.99 * 12 * 0.8
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
        price: 0,
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
        price: 14.99,
        yearlyPrice: 143.90,
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
        cta: "S’abonner",
        mostPopular: true,
    },
    {
        name: 'Business',
        price: 24.99,
        yearlyPrice: 239.90,
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
        price: 0,
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
        price: 49.99,
        yearlyPrice: 479.90,
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
        cta: "S’abonner",
        mostPopular: true,
    },
    {
        name: 'Enterprise',
        price: 199.99,
        yearlyPrice: 1919.90,
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
function formatPrice(value) {
    return value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 });
}
export function Pricing() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [currentPlan, setCurrentPlan] = useState(null);
    const [error, setError] = useState(null);
    const [frequency, setFrequency] = useState('monthly');
    const [userType, setUserType] = useState('candidate');
    const [showContactModal, setShowContactModal] = useState(false);
    const [freeTrialUsed, setFreeTrialUsed] = useState(false);
    // Vérification si l'utilisateur a déjà utilisé l'offre gratuite
    React.useEffect(() => {
        function ensureFreeTrialFieldAndFetch() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!user)
                    return;
                let fieldExists = true;
                // Vérifier si la colonne existe
                const { data: columns, error: columnError } = yield supabase.rpc('pg_get_columns', { table_name: 'profiles' });
                if (columnError || !columns) {
                    fieldExists = false;
                }
                else if (!columns.some((col) => col.column_name === 'free_trial_used')) {
                    fieldExists = false;
                }
                // Ajouter la colonne si besoin
                if (!fieldExists) {
                    const { error: alterError } = yield supabase.rpc('run_sql', { sql: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS free_trial_used boolean DEFAULT false;` });
                    if (alterError) {
                        setError("Impossible d'ajouter le champ free_trial_used dans Supabase : " + alterError.message);
                        return;
                    }
                }
                // Ensuite, récupération normale
                const { data, error } = yield supabase
                    .from('profiles')
                    .select('free_trial_used')
                    .eq('id', user.id)
                    .single();
                if (data && data.free_trial_used)
                    setFreeTrialUsed(true);
            });
        }
        ensureFreeTrialFieldAndFetch();
    }, [user]);
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
                    const { error: updateError } = yield supabase
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
                const { error: updateError } = yield supabase
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
            const { data, error } = yield supabase.functions.invoke('create-checkout-session', {
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
    return (_jsxs("div", { className: "min-h-screen py-24 flex flex-col items-center px-4", children: [_jsxs("div", { className: "text-center max-w-3xl mx-auto mb-16", children: [_jsx("h1", { className: "text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text mb-6", children: "Choisissez votre plan" }), _jsx("p", { className: "text-lg text-gray-400 mb-8", children: "Trouvez le plan qui correspond \u00E0 vos besoins et commencez \u00E0 optimiser votre recherche d'emploi d\u00E8s aujourd'hui." }), (user === null || user === void 0 ? void 0 : user.trial_ends_at) && new Date(user.trial_ends_at) > new Date() && (_jsx("div", { className: "bg-primary-600/20 text-primary-400 p-4 rounded-lg inline-block", children: _jsxs("p", { className: "text-lg", children: ["P\u00E9riode d'essai active jusqu'au", ' ', new Date(user.trial_ends_at).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })] }) })), _jsx("div", { className: "mt-8 flex justify-center", children: _jsxs("div", { className: "relative flex rounded-full bg-white/5 p-1", children: [_jsx("button", { type: "button", className: `${userType === 'candidate' ? 'bg-primary-600 text-white' : 'text-gray-400'} rounded-full py-2 px-6 text-sm font-semibold transition-colors`, onClick: () => setUserType('candidate'), children: "Candidat" }), _jsx("button", { type: "button", className: `${userType === 'freelancer' ? 'bg-primary-600 text-white' : 'text-gray-400'} rounded-full py-2 px-6 text-sm font-semibold transition-colors`, onClick: () => setUserType('freelancer'), children: "Freelance" }), _jsx("button", { type: "button", className: `${userType === 'recruiter' ? 'bg-primary-600 text-white' : 'text-gray-400'} rounded-full py-2 px-6 text-sm font-semibold transition-colors`, onClick: () => setUserType('recruiter'), children: "Recruteur" })] }) }), _jsx("div", { className: "mt-8 flex justify-center", children: _jsxs("div", { className: "relative flex rounded-full bg-white/5 p-1", children: [_jsx("button", { type: "button", className: `${frequency === 'monthly' ? 'bg-primary-600 text-white' : 'text-gray-400'} rounded-full py-2 px-6 text-sm font-semibold transition-colors`, onClick: () => setFrequency('monthly'), children: "Mensuel" }), _jsxs("button", { type: "button", className: `${frequency === 'yearly' ? 'bg-primary-600 text-white' : 'text-gray-400'} rounded-full py-2 px-6 text-sm font-semibold transition-colors`, onClick: () => setFrequency('yearly'), children: ["Annuel ", _jsx("span", { className: "text-primary-400 ml-1", children: "-20%" })] })] }) })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4", children: selectedPlans.map((plan) => (_jsxs(motion.div, { className: "bg-white/5 rounded-2xl p-8 flex flex-col shadow-lg", whileHover: { scale: 1.03 }, transition: { type: 'spring', stiffness: 300 }, children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [plan.name === 'Free' ? (_jsx(UserIcon, { className: "w-8 h-8 text-primary-400" })) : plan.name === 'Pro' || plan.name === 'Business' ? (_jsx(BriefcaseIcon, { className: "w-8 h-8 text-primary-400" })) : (_jsx(DocumentTextIcon, { className: "w-8 h-8 text-primary-400" })), _jsx("h3", { className: "text-xl font-bold text-white", children: plan.name })] }), _jsxs("div", { className: "flex items-baseline gap-2 mt-4 mb-2", children: [_jsx("span", { className: "text-4xl font-extrabold tracking-tight text-white", children: frequency === 'yearly' && plan.yearlyPrice !== undefined
                                        ? formatPrice(plan.yearlyPrice)
                                        : formatPrice(plan.price) }), _jsx("span", { className: "text-gray-400 text-base font-semibold", children: frequency === 'yearly' ? '/an' : '/mois' })] }), _jsx("p", { className: "text-gray-400 mb-4", children: plan.description }), _jsx("ul", { className: "mb-6 space-y-2", children: plan.features.map((feature) => (_jsxs("li", { className: "flex items-center text-gray-300", children: [_jsx(CheckIcon, { className: "w-5 h-5 text-primary-400 mr-2" }), feature] }, feature))) }), _jsxs("div", { className: "mt-auto", children: [plan.name === 'Free' && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => handleSubscribe(plan.name.toLowerCase(), plan.priceId), disabled: loading || currentPlan === plan.name.toLowerCase() || freeTrialUsed, className: `w-full btn-primary ${currentPlan === plan.name.toLowerCase() || freeTrialUsed
                                                ? 'opacity-50 cursor-not-allowed'
                                                : ''}`, children: freeTrialUsed
                                                ? 'Essai déjà utilisé'
                                                : currentPlan === plan.name.toLowerCase()
                                                    ? 'Plan actuel'
                                                    : loading
                                                        ? 'Chargement...'
                                                        : 'Commencer l’essai gratuit de 24h' }), freeTrialUsed && (_jsx("div", { className: "text-xs text-red-400 mt-2 text-center", children: "Vous avez d\u00E9j\u00E0 b\u00E9n\u00E9fici\u00E9 de l\u2019essai gratuit de 24h." }))] })), plan.name === 'Enterprise' && (_jsx("button", { onClick: () => setShowContactModal(true), disabled: loading, className: "w-full btn-primary", children: "Contacter les ventes" })), plan.name !== 'Free' && plan.name !== 'Enterprise' && (_jsx("button", { onClick: () => handleSubscribe(plan.name.toLowerCase(), plan.priceId), disabled: loading || currentPlan === plan.name.toLowerCase(), className: `w-full btn-primary ${currentPlan === plan.name.toLowerCase()
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''}`, children: currentPlan === plan.name.toLowerCase()
                                        ? 'Plan actuel'
                                        : loading
                                            ? 'Chargement...'
                                            : 'S’abonner' }))] })] }, plan.name))) }), error && (_jsx("div", { className: "mt-8 p-4 bg-red-900/50 text-red-400 rounded-lg", children: error })), _jsxs("div", { className: "mt-16 max-w-3xl mx-auto text-center", children: [_jsx("h3", { className: "text-2xl font-bold text-white mb-4", children: "Questions fr\u00E9quentes" }), _jsx("dl", { className: "space-y-6 divide-y divide-white/10", children: faqs.map((faq) => (_jsxs("div", { className: "pt-6", children: [_jsx("dt", { className: "text-lg font-medium text-white", children: faq.question }), _jsx("dd", { className: "mt-2 text-base text-gray-400", children: faq.answer })] }, faq.question))) })] }), _jsx(ContactSalesModal, { open: showContactModal, onClose: () => setShowContactModal(false) })] }));
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
    return (_jsx("svg", Object.assign({ xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" }, props, { children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4.5 12.75l6 6 9-13.5" }) })));
}
