import React, { useEffect, useState } from 'react';
import { useJobnexai, MarketTrend } from '../hooks/useJobnexai';
import { useTranslation } from 'react-i18next';

const MarketTrends: React.FC = () => {
  const [trends, setTrends] = useState<MarketTrend | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const { jobs } = useJobnexai();

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const trendsData = await jobs.getMarketTrends();
        setTrends(trendsData);
      } catch (err: any) {
        setError(err.message || t('marketTrends.errorUnknown'));
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, [t, jobs]);

  if (loading) return <div className="text-center p-8">{t('marketTrends.loading')}</div>;
  if (error) return <div className="text-center p-8 text-red-400">{t('marketTrends.error', { error })}</div>;
  if (!trends) return <div className="text-center p-8">{t('marketTrends.noData')}</div>;

  // Fonction pour rendre une liste de tendances
  const renderTrendList = (title: string, data: { name: string; count: number }[]) => (
    <div className="mb-8 p-6 bg-gray-800/50 rounded-lg border border-white/10">
      <h3 className="text-xl font-semibold text-primary-300 mb-4">{title}</h3>
      <ul className="space-y-2">
        {data.map((item, index) => (
          <li key={index} className="text-gray-300 flex justify-between">
            <span className="font-medium text-white">{item.name}</span>
            <span>{item.count} {t('marketTrends.postings')}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="p-4 md:p-8 text-white max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary-400">{t('marketTrends.title')}</h2>
      
      {renderTrendList(t('marketTrends.jobTypesTitle'), trends.jobTypes)}
      
      {renderTrendList(t('marketTrends.locationsTitle'), trends.locations)}

      <div className="p-6 bg-gray-800/50 rounded-lg border border-white/10">
        <h3 className="text-xl font-semibold text-primary-300 mb-4">{t('marketTrends.salaryTitle')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-gray-400 text-sm">{t('marketTrends.minSalary')}</p>
            <p className="text-2xl font-bold text-green-400">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(trends.salary.min)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">{t('marketTrends.avgSalary')}</p>
            <p className="text-2xl font-bold text-yellow-400">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(trends.salary.avg)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">{t('marketTrends.maxSalary')}</p>
            <p className="text-2xl font-bold text-red-400">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(trends.salary.max)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketTrends;
