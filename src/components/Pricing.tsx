import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../stores/auth'
import {
  UserIcon,
  BriefcaseIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'

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
]

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
]

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
]

export function Pricing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [frequency, setFrequency] = useState<'monthly' | 'yearly'>('monthly')
  const [userType, setUserType] = useState<'candidate' | 'freelancer' | 'recruiter'>('candidate')
  
  // Sélectionner les plans en fonction du type d'utilisateur
  const selectedPlans = userType === 'freelancer' 
    ? freelancerPlans 
    : userType === 'recruiter' 
      ? recruiterPlans 
      : plans

  const handleSubscribe = async (planName: string, priceId: string | null) => {
    if (!user) {
      navigate('/login', { state: { from: '/pricing' } })
      return
    }

    if (!priceId) {
      // Pour le plan gratuit - ne pas griser le bouton
      try {
        setLoading(true)
        setError(null)

        // Mettre à jour le type d'utilisateur si ce n'est pas déjà fait
        if (!user.user_type) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ user_type: userType })
            .eq('id', user.id)

          if (updateError) throw updateError
        }

        // Rediriger vers la page appropriée en fonction du type d'utilisateur
        if (userType === 'freelancer') {
          navigate('/freelance/projects')
        } else if (userType === 'recruiter') {
          navigate('/recruiter/dashboard')
        } else {
          navigate('/dashboard')
        }
      } catch (error: any) {
        console.error('Error updating user type:', error)
        setError('Une erreur est survenue. Veuillez réessayer.')
      } finally {
        setLoading(false)
      }
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Mettre à jour le type d'utilisateur si ce n'est pas déjà fait
      if (!user.user_type) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ user_type: userType })
          .eq('id', user.id)

        if (updateError) throw updateError
      }

      // Sélectionner le bon ID de prix en fonction de la fréquence
      const selectedPriceId = frequency === 'yearly' 
        ? selectedPlans.find(p => p.name.toLowerCase() === planName.toLowerCase())?.yearlyPriceId || priceId
        : priceId

      // Créer une session de paiement Stripe
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          userId: user.id, 
          priceId: selectedPriceId, 
          userType: userType 
        }
      })

      if (error) throw error

      // Rediriger vers Stripe Checkout
      window.location.href = data.url
    } catch (error: any) {
      console.error('Error subscribing:', error)
      setError('Une erreur est survenue lors de la souscription. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-24 flex flex-col items-center px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text mb-6">
          Choisissez votre plan
        </h1>
        <p className="text-lg text-gray-400 mb-8">
          Trouvez le plan qui correspond à vos besoins et commencez à optimiser votre recherche d'emploi dès aujourd'hui.
        </p>
        
        {user?.trial_ends_at && new Date(user.trial_ends_at) > new Date() && (
          <div className="bg-primary-600/20 text-primary-400 p-4 rounded-lg inline-block">
            <p className="text-lg">
              Période d'essai active jusqu'au{' '}
              {new Date(user.trial_ends_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        )}
        
        {/* Sélecteur de type d'utilisateur */}
        <div className="mt-8 flex justify-center">
          <div className="relative flex rounded-full bg-white/5 p-1">
            <button
              type="button"
              className={`${
                userType === 'candidate' ? 'bg-primary-600 text-white' : 'text-gray-400'
              } rounded-full py-2 px-6 text-sm font-semibold transition-colors`}
              onClick={() => setUserType('candidate')}
            >
              Candidat
            </button>
            <button
              type="button"
              className={`${
                userType === 'freelancer' ? 'bg-primary-600 text-white' : 'text-gray-400'
              } rounded-full py-2 px-6 text-sm font-semibold transition-colors`}
              onClick={() => setUserType('freelancer')}
            >
              Freelance
            </button>
            <button
              type="button"
              className={`${
                userType === 'recruiter' ? 'bg-primary-600 text-white' : 'text-gray-400'
              } rounded-full py-2 px-6 text-sm font-semibold transition-colors`}
              onClick={() => setUserType('recruiter')}
            >
              Recruteur
            </button>
          </div>
        </div>
        
        {/* Sélecteur de fréquence */}
        <div className="mt-8 flex justify-center">
          <div className="relative flex rounded-full bg-white/5 p-1">
            <button
              type="button"
              className={`${
                frequency === 'monthly' ? 'bg-primary-600 text-white' : 'text-gray-400'
              } rounded-full py-2 px-6 text-sm font-semibold transition-colors`}
              onClick={() => setFrequency('monthly')}
            >
              Mensuel
            </button>
            <button
              type="button"
              className={`${
                frequency === 'yearly' ? 'bg-primary-600 text-white' : 'text-gray-400'
              } rounded-full py-2 px-6 text-sm font-semibold transition-colors`}
              onClick={() => setFrequency('yearly')}
            >
              Annuel <span className="text-primary-400 ml-1">-20%</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {selectedPlans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`relative rounded-2xl border ${
              plan.mostPopular 
                ? 'border-primary-400 bg-primary-900/10' 
                : 'border-white/10 bg-white/5'
            } p-8 shadow-lg`}
          >
            {plan.mostPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-400 text-white px-4 py-1 rounded-full text-sm font-medium">
                Le plus populaire
              </div>
            )}
            
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 mb-4">{plan.description}</p>
              <p className="text-4xl font-bold text-white mb-6">
                {frequency === 'monthly'
                  ? Number(plan.price.replace('€', '').replace(',', '.')).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '€'
                  : plan.name === 'Free'
                    ? '0,00€'
                    : (Number(plan.price.replace('€', '').replace(',', '.')) * 0.8 * 12).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '€'}
                <span className="text-sm text-gray-400">
                  {plan.name !== 'Free' && `/${frequency === 'monthly' ? 'mois' : 'an'}`}
                </span>
              </p>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-gray-300">
                    <CheckIcon className="h-6 w-6 flex-none text-primary-400" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              {/* CTA : Essai gratuit uniquement pour Free, sinon S’abonner ou Contacter les ventes */}
              {plan.name === 'Free' ? (
                <button
                  onClick={() => handleSubscribe(plan.name.toLowerCase(), plan.priceId)}
                  disabled={loading || currentPlan === plan.name.toLowerCase()}
                  className={`w-full btn-primary ${
                    currentPlan === plan.name.toLowerCase()
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {currentPlan === plan.name.toLowerCase()
                    ? 'Plan actuel'
                    : loading
                    ? 'Chargement...'
                    : "Commencer l'essai gratuit"}
                </button>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.name.toLowerCase(), plan.priceId)}
                  disabled={loading || currentPlan === plan.name.toLowerCase()}
                  className={`w-full btn-primary ${
                    currentPlan === plan.name.toLowerCase()
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {currentPlan === plan.name.toLowerCase()
                    ? 'Plan actuel'
                    : loading
                    ? 'Chargement...'
                    : (plan.name === 'Enterprise' ? 'Contacter les ventes' : 'S’abonner')}
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {error && (
        <div className="mt-8 p-4 bg-red-900/50 text-red-400 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="mt-16 max-w-3xl mx-auto text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Questions fréquentes</h3>
        <dl className="space-y-6 divide-y divide-white/10">
          {faqs.map((faq) => (
            <div key={faq.question} className="pt-6">
              <dt className="text-lg font-medium text-white">{faq.question}</dt>
              <dd className="mt-2 text-base text-gray-400">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
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
]

// Ajout de l'icône CheckIcon manquante
function CheckIcon(props) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke="currentColor" 
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}