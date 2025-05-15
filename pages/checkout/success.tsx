import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Layout from '@/components/layout/Layout'; // Assurez-vous que ce chemin est correct

// Remplacez ceci par l'URL réelle de votre fonction Supabase
// Idéalement, stockez-la dans une variable d'environnement NEXT_PUBLIC_...
const CHECK_SESSION_STATUS_URL = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF}.supabase.co/functions/v1/check-session-status`;

interface SubscriptionDetails {
  // Définissez ici les champs que vous attendez de check-session-status
  // Par exemple: status, plan, email, etc.
  status?: string;
  plan?: string;
  customer_email?: string;
}

export default function CheckoutSuccessPage() {
  console.log('SuccessPage: Component rendering'); // DEBUG 1
  const router = useRouter();
  const { t } = useTranslation('common'); // Assurez-vous d'avoir 'common.json' ou ajustez
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails | null>(null);

  useEffect(() => {
    console.log('SuccessPage: Main useEffect triggered. router.isReady:', router.isReady, 'router.query:', router.query); // DEBUG 2
    const sessionIdFromQuery = router.query.session_id as string;
    console.log('SuccessPage: Extracted sessionIdFromQuery:', sessionIdFromQuery); // DEBUG 3
    const { session_id } = router.query; // This is redundant if using sessionIdFromQuery, but let's keep for now

    if (!process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF) {
      console.error('NEXT_PUBLIC_SUPABASE_PROJECT_REF is not set in environment variables.');
      setError(t('checkout.success.configError'));
      setLoading(false);
      return;
    }

    if (sessionIdFromQuery) { // Changed to use the consistently defined variable
      console.log('SuccessPage: sessionId found. Attempting to call checkSession with sessionId:', sessionIdFromQuery); // DEBUG 4
      const checkSession = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(CHECK_SESSION_STATUS_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Si votre fonction check-session-status nécessite une clé API Supabase (anon key):
              // 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
              // Si elle est protégée par JWT, vous devrez inclure le token d'authentification
              // 'Authorization': `Bearer ${supabase.auth.session()?.access_token}`,
            },
            body: JSON.stringify({ session_id: sessionIdFromQuery }),
          });

          console.log('Response status from check-session-status:', response.status);
          const data = await response.json();
          console.log('Data from check-session-status:', data);

          if (!response.ok) {
            throw new Error(data.error || `Error: ${response.status}`);
          }
          
          setSubscriptionDetails(data.subscriptionDetails || data); // Adaptez selon la structure de réponse
          setError(null);
        } catch (e: any) {
          console.error('Error calling check-session-status:', e);
          setError(e.message || t('checkout.success.apiError'));
          setSubscriptionDetails(null);
        } finally {
          setLoading(false);
        }
      };

      checkSession();
    } else if (router.isReady && !sessionIdFromQuery) { // More explicit condition
      console.warn('SuccessPage: router is ready, but session_id is missing from query parameters.'); // DEBUG 5
      setError(t('checkout.success.errorNoSessionId'));
      setLoading(false);
    }
  }, [router.query, router.isReady, t]);

  return (
    <Layout>
      <Head>
        <title>{t('checkout.success.title')}</title>
      </Head>
      <div className="container mx-auto px-4 py-8 text-center">
        {loading && (
          <>
            <h1 className="text-2xl font-semibold mb-4">{t('checkout.success.loadingTitle')}</h1>
            <p>{t('checkout.success.loadingMessage')}</p>
            {/* Vous pouvez ajouter un spinner ici */}
          </>
        )}

        {error && (
          <>
            <h1 className="text-2xl font-semibold mb-4 text-red-600">{t('checkout.success.errorTitle')}</h1>
            <p className="text-red-500">{error}</p>
          </>
        )}

        {!loading && !error && subscriptionDetails && (
          <>
            <h1 className="text-2xl font-semibold mb-4 text-green-600">{t('checkout.success.successTitle')}</h1>
            <p>{t('checkout.success.successMessage')}</p>
            {subscriptionDetails.customer_email && (
              <p>{t('checkout.success.emailLabel')} {subscriptionDetails.customer_email}</p>
            )}
            {subscriptionDetails.plan && (
              <p>{t('checkout.success.planLabel')} {subscriptionDetails.plan}</p>
            )}
            {subscriptionDetails.status && (
              <p>{t('checkout.success.statusLabel')} {subscriptionDetails.status}</p>
            )}
            {/* Ajoutez d'autres détails si nécessaire */}
          </>
        )}
      </div>
    </Layout>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'layout'])), // Assurez-vous que 'common' et 'layout' existent
    },
  };
}
