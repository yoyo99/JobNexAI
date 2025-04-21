import React, { useEffect, useState } from 'react';

// Exemple d'API ou de store à adapter selon backend
async function fetchAnalytics() {
  // À remplacer par des appels réels à votre backend/Supabase
  return {
    emailsScraped: 42,
    offersDetected: 18,
    iaRequests: 27,
    iaSuccess: 25,
    iaFailure: 2,
    notificationsSent: 15,
    matchingRate: 78 // en %
  };
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics().then(d => {
      setData(d);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Chargement des statistiques…</div>;
  if (!data) return <div>Erreur lors du chargement des statistiques.</div>;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 24 }}>
      <h2 style={{ fontSize: 22, marginBottom: 24 }}>Tableau de bord analytique</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>📧 Emails scrapés : <b>{data.emailsScraped}</b></li>
        <li>💼 Offres détectées : <b>{data.offersDetected}</b></li>
        <li>🤖 Requêtes IA : <b>{data.iaRequests}</b> (succès : {data.iaSuccess}, échecs : {data.iaFailure})</li>
        <li>🔔 Notifications envoyées : <b>{data.notificationsSent}</b></li>
        <li>📊 Taux de matching IA : <b>{data.matchingRate}%</b></li>
      </ul>
    </div>
  );
}
