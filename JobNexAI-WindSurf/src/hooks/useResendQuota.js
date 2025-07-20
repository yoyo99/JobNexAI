import { useState, useEffect, useCallback } from 'react';

/**
 * Hook pour récupérer le quota Resend via la fonction Edge monitor-resend-quota
 * @returns { sent, limit, percent, loading, error }
 */
export function useResendQuota() {
  const [sent, setSent] = useState(0);
  const [limit, setLimit] = useState(0);
  const [percent, setPercent] = useState(0);
  const [loading, setLoading] = useState(false); // Default to false as we are not fetching
  const [error, setError] = useState(null); // Default to null

  const fetchQuota = useCallback(async () => {
    // console.log('Resend quota fetching is currently disabled.');
    // setLoading(true);
    // setError(null);
    // try {
    //   // Assurez-vous que l'URL est correcte pour votre fonction Supabase Edge
    //   const res = await fetch('https://klwugophjvzctlautsqz.functions.supabase.co/monitor-resend-quota');
    //   if (!res.ok) {
    //     // Tenter de lire le corps de la réponse pour obtenir plus de détails sur l'erreur
    //     let errorBody = 'Failed to fetch quota from provider';
    //     try {
    //       errorBody = await res.json(); // ou res.text() si ce n'est pas du JSON
    //     } catch (e) {
    //       // Ignorer l'erreur si le corps ne peut pas être lu ou n'est pas du JSON
    //     }
    //     throw new Error(typeof errorBody === 'string' ? errorBody : JSON.stringify(errorBody));
    //   }
    //   const data = await res.json();
    //   setSent(data.sent || 0);
    //   setLimit(data.limit || 0);
    //   setPercent(data.limit > 0 ? Math.round((data.sent / data.limit) * 100) : 0);
    // } catch (err) {
    //   setError(err.message || 'An unknown error occurred');
    //   // Réinitialiser les valeurs en cas d'erreur pour éviter d'afficher des données obsolètes ou incorrectes
    //   setSent(0);
    //   setLimit(0);
    //   setPercent(0);
    // }
    // setLoading(false);
  }, []);

  useEffect(() => {
    // fetchQuota(); // Do not fetch on mount
  }, [fetchQuota]);

  // Return default/empty values
  return { sent, limit, percent, loading, error, refetchQuota: fetchQuota };
}
