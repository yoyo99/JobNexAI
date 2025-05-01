import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../stores/auth'
import { DashboardStats } from './DashboardStats'
import { UpgradePrompt } from './UpgradePrompt'

function Dashboard() {
  const { t } = useTranslation()
  const { user } = useAuth()

  useEffect(() => {
    document.title = t('dashboard.documentTitle', { ns: 'translation' })
  }, [])

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-white"
        >
          {t('dashboard.welcome')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 mt-1"
        >
          {t('dashboard.greeting', { name: user?.full_name || t('dashboard.userDefault') })}
        </motion.p>
      </div>

      <UpgradePrompt />

      <DashboardStats />
    </div>
  )
}

export default Dashboard;