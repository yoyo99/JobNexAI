import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../stores/auth'
import { supabase } from '../lib/supabase'

interface AdminStats {
  totalUsers: number
  totalJobs: number
  totalApplications: number
  activeUsers: number
}

export function Admin() {
  const { user } = useAuth()
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    activeUsers: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAdminStats()
  }, [])

  const loadAdminStats = async () => {
    try {
      setLoading(true)
      
      // Simuler des stats pour la démo
      // Dans une vraie app, on ferait des requêtes Supabase
      setTimeout(() => {
        setStats({
          totalUsers: 1247,
          totalJobs: 3892,
          totalApplications: 8934,
          activeUsers: 342
        })
        setLoading(false)
      }, 1000)
      
    } catch (error) {
      console.error('Error loading admin stats:', error)
      setLoading(false)
    }
  }

  // Vérifier si l'utilisateur est admin
  if (!user?.is_admin && user?.user_type !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Accès refusé</h1>
          <p className="text-gray-400">Vous n'avez pas les permissions pour accéder à cette page.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-gray-400">Tableau de bord administrateur JobNexAI</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h3 className="text-sm font-medium text-gray-400">Utilisateurs totaux</h3>
            <p className="text-2xl font-bold text-white mt-2">{stats.totalUsers.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h3 className="text-sm font-medium text-gray-400">Offres d'emploi</h3>
            <p className="text-2xl font-bold text-white mt-2">{stats.totalJobs.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h3 className="text-sm font-medium text-gray-400">Candidatures</h3>
            <p className="text-2xl font-bold text-white mt-2">{stats.totalApplications.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <h3 className="text-sm font-medium text-gray-400">Utilisateurs actifs</h3>
            <p className="text-2xl font-bold text-primary-400 mt-2">{stats.activeUsers.toLocaleString()}</p>
          </motion.div>
        </div>

        {/* Admin Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-white mb-6">Actions administrateur</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="btn-primary">
              Gérer les utilisateurs
            </button>
            <button className="btn-secondary">
              Modérer les offres
            </button>
            <button className="btn-secondary">
              Voir les logs
            </button>
            <button className="btn-secondary">
              Configuration système
            </button>
            <button className="btn-secondary">
              Rapports & Analytics
            </button>
            <button className="btn-secondary">
              Gestion des paiements
            </button>
          </div>
        </motion.div>

        {/* System Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card mt-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Informations système</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Version:</span>
              <span className="text-white">JobNexAI v1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Environnement:</span>
              <span className="text-green-400">Production</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Base de données:</span>
              <span className="text-green-400">Supabase - Connecté</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Stockage:</span>
              <span className="text-yellow-400">Bucket CVs - À configurer</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
