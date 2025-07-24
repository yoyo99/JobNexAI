import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../stores/auth'
import { useState, useEffect } from 'react'
import { getSupabase } from '../hooks/useSupabaseConfig' // pour requête DB
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { SparklesIcon } from '@heroicons/react/24/outline'

export function UpgradePrompt() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<{ subscription_status: string | null; trial_ends_at: string | null } | null>(null)

  useEffect(() => {
    if (!user) return
    const supabase = getSupabase()
    supabase
      .from('profiles')
      .select('subscription_status, trial_ends_at')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (!error) setProfile(data)
      })
  }, [user])

  // Si l'utilisateur a un abonnement actif, ne pas afficher la bannière
  if (profile?.subscription_status === 'active') {
    return null
  }

  // Si l'utilisateur est en période d'essai, afficher le temps restant
  const isTrialActive = profile?.trial_ends_at && new Date(profile.trial_ends_at) > new Date()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-primary-600/20 to-secondary-600/20 rounded-lg p-6 mb-8"
    >
      <div className="flex items-start gap-4">
        <div className="p-2 bg-primary-600/30 rounded-lg">
          <SparklesIcon className="h-6 w-6 text-primary-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-white">
            {isTrialActive 
              ? 'Votre période d\'essai est active' 
              : 'Débloquez toutes les fonctionnalités premium'}
          </h3>
          <p className="text-gray-300 mt-1">
            {isTrialActive 
              ? `Profitez de toutes les fonctionnalités premium jusqu'au ${format(new Date(user.trial_ends_at!), 'dd MMMM yyyy', { locale: fr })}`
              : 'Accédez à des fonctionnalités avancées pour optimiser votre recherche d\'emploi'}
          </p>
          
          <div className="mt-4">
            <Link
              to="/pricing"
              className="btn-primary inline-flex"
            >
              {isTrialActive ? 'Passer au plan Pro' : 'Voir les plans'}
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}