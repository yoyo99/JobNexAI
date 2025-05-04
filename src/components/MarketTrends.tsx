import React, { useEffect, useState } from 'react';
import { AuthService } from '../lib/auth-service';
import { useTranslation } from 'react-i18next';

type MarketTrend = {
  category: string;
  count: number;
  percentage: number;
};

type MarketTrendsData = {
  jobTypes: MarketTrend[];
  locations: MarketTrend[];
  salary: {
    average: number;
    count: number;
  };
};

const MarketTrends: React.FC = () => {
  const [trends, setTrends] = useState<MarketTrendsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    AuthService.getMarketTrends()
      .then(setTrends)
      .catch((err) => setError(err.message || t('marketTrends.errorUnknown')))
      .finally(() => setLoading(false));
  }, [t]);

  if (loading) return <div>{t('marketTrends.loading')}</div>;
  if (error) return <div>{t('marketTrends.error', { error })}</div>;
  if (!trends) return <div>{t('marketTrends.noData')}</div>;

  return (
    <div>
      <h2>{t('marketTrends.title')}</h2>
      <h3>{t('marketTrends.jobTypes')}</h3>
      <ul>
        {(Array.isArray(trends.jobTypes) ? trends.jobTypes : []).map((tItem) => (
          <li key={tItem.category}>
            {tItem.category} : {tItem.count} ({tItem.percentage.toFixed(1)}%)
          </li>
        ))}
      </ul>
      <h3>{t('marketTrends.locations')}</h3>
      <ul>
        {(Array.isArray(trends.locations) ? trends.locations : []).map((lItem) => (
          <li key={lItem.category}>
            {lItem.category} : {lItem.count} ({lItem.percentage.toFixed(1)}%)
          </li>
        ))}
      </ul>
      <h3>{t('marketTrends.salary')}</h3>
      <p>
        {trends.salary.average.toLocaleString()} € ({trends.salary.count} {t('marketTrends.salaryOffers')})
      </p>
    </div>
  );
};

export default MarketTrends;
