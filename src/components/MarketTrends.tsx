import React, { useEffect, useState } from 'react';
import { AuthService } from '../lib/auth-service';

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

  useEffect(() => {
    AuthService.getMarketTrends()
      .then(setTrends)
      .catch((err) => setError(err.message || 'Erreur inconnue'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Chargement des tendances...</div>;
  if (error) return <div>Erreur : {error}</div>;
  if (!trends) return <div>Aucune donnée disponible.</div>;

  return (
    <div>
      <h2>Tendances du marché</h2>
      <h3>Types de poste</h3>
      <ul>
        {trends.jobTypes.map((t) => (
          <li key={t.category}>
            {t.category} : {t.count} ({t.percentage.toFixed(1)}%)
          </li>
        ))}
      </ul>
      <h3>Localisations</h3>
      <ul>
        {trends.locations.map((l) => (
          <li key={l.category}>
            {l.category} : {l.count} ({l.percentage.toFixed(1)}%)
          </li>
        ))}
      </ul>
      <h3>Salaire moyen</h3>
      <p>
        {trends.salary.average.toLocaleString()} € ({trends.salary.count} offres renseignées)
      </p>
    </div>
  );
};

export default MarketTrends;
