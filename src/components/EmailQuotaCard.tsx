import React, { useEffect, useState } from 'react';
import { useAuth } from '../stores/auth'; // Ajustez le chemin si /stores est directement sous /src
import { supabase } from '../lib/supabaseClient'; // Ajustez le chemin si supabaseClient.ts est directement sous /src
import { useTranslation } from 'react-i18next';

interface EmailStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

const EmailQuotaCard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation('common'); // Assurez-vous que 'common' est votre namespace par défaut ou ajustez
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmailStats = async () => {
      if (!user) {
        setError(t('admin.emailQuota.notAuthenticated', 'User not authenticated.'));
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error: functionError } = await supabase.functions.invoke('get-email-usage-stats');

        if (functionError) {
          console.error('Error invoking get-email-usage-stats:', functionError);
          let errorMessage = t('admin.emailQuota.errorFetching', 'Failed to fetch email stats.');
          if (functionError.message.includes('Function not found')) {
            errorMessage = t('admin.emailQuota.errorNotFound', 'Email stats function not found. Please deploy it.');
          } else if (functionError.message.includes('Forbidden')) {
            errorMessage = t('admin.emailQuota.errorForbidden', 'Access to email stats forbidden.');
          }
          throw new Error(errorMessage);
        }
        
        if (data && typeof data.total === 'number' && typeof data.today === 'number' && typeof data.thisWeek === 'number' && typeof data.thisMonth === 'number') {
          setStats(data as EmailStats);
        } else {
          console.error('Invalid data structure from get-email-usage-stats:', data);
          throw new Error(t('admin.emailQuota.errorInvalidData', 'Received invalid data for email stats.'));
        }

      } catch (e: any) {
        console.error('Catch block error in fetchEmailStats:', e);
        setError(e.message || t('admin.emailQuota.errorUnexpected', 'An unexpected error occurred.'));
      }
      setLoading(false);
    };

    fetchEmailStats();
  }, [user, t]);

  if (loading) {
    return (
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">{t('admin.emailQuota.title', 'Email Usage Statistics')}</h3>
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">{t('admin.emailQuota.errorLabel', 'Error')}: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-gray-800 shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">{t('admin.emailQuota.title', 'Email Usage Statistics')}</h3>
        <p className="text-gray-400">{t('admin.emailQuota.noData', 'No email statistics available at the moment.')}</p>
      </div>
    );
  }

  const monthlyQuotaLimit = 3000; 
  const progressPercentage = monthlyQuotaLimit > 0 ? (stats.thisMonth / monthlyQuotaLimit) * 100 : 0;

  return (
    <div className="bg-gray-800 shadow-xl rounded-xl p-6 hover:shadow-primary-500/30 transition-shadow duration-300">
      <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">
        {t('admin.emailQuota.title', 'Email Usage Statistics')}
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { labelKey: 'admin.emailQuota.today', value: stats.today },
          { labelKey: 'admin.emailQuota.thisWeek', value: stats.thisWeek },
          { labelKey: 'admin.emailQuota.thisMonth', value: stats.thisMonth },
          { labelKey: 'admin.emailQuota.total', value: stats.total },
        ].map(stat => (
          <div key={stat.labelKey} className="bg-gray-700/50 p-4 rounded-lg text-center transform hover:scale-105 transition-transform duration-200">
            <p className="text-sm text-gray-400 font-medium">{t(stat.labelKey, stat.labelKey.split('.').pop() || stat.labelKey)}</p>
            <p className="text-3xl font-extrabold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-md font-semibold text-white">
            {t('admin.emailQuota.monthlyUsageLabel', 'Monthly Usage')}
          </h4>
          <p className="text-sm text-gray-300">
            {t('admin.emailQuota.monthlyUsageValue', { count: stats.thisMonth, limit: monthlyQuotaLimit })}
          </p>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 mb-2 overflow-hidden">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ease-out ${ 
              progressPercentage > 85 ? 'bg-red-500' : 
              progressPercentage > 60 ? 'bg-yellow-500' : 
              'bg-gradient-to-r from-primary-500 to-secondary-500'
            }`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-right text-gray-400">
          {t('admin.emailQuota.percentageUsed', { percentage: progressPercentage.toFixed(1) })}%
        </p>
      </div>
    </div>
  );
};

export default EmailQuotaCard;
