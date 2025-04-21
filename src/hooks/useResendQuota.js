import { useEffect, useState } from 'react';

/**
 * Hook pour récupérer le quota Resend via la fonction Edge monitor-resend-quota
 * @returns { sent, limit, percent, loading, error }
 */
export function useResendQuota() {
  const [quota, setQuota] = useState({ sent: 0, limit: 0, percent: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchQuota() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://klwugophjvzctlautsqz.functions.supabase.co/monitor-resend-quota');
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setQuota({
          sent: data.sent,
          limit: data.limit,
          percent: Math.round((data.sent / data.limit) * 100),
        });
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    }
    fetchQuota();
  }, []);

  return { ...quota, loading, error };
}
