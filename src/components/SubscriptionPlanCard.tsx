import React from 'react';
import { supabase } from '../lib/supabaseClient'; // Mise à jour du chemin
import { useAuth } from '../stores/auth'; // Importer useAuth
import { useTranslation } from 'react-i18next';

interface SubscriptionPlanCardProps {
  planName: string;
  price: string;
  features: string[];
  priceId: string;
  userType: 'candidate' | 'freelancer' | 'recruiter';
  isEnterprise?: boolean; // Pour un style potentiellement différent
}

const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({ planName, price, features, priceId, userType, isEnterprise }) => {
  const { user } = useAuth(); // Obtenir l'utilisateur depuis le store/hook
  const { t } = useTranslation('translation');

  const handleSubscription = async (priceId: string) => {
    // Vérifier si l'utilisateur existe (obtenu depuis useAuth)
    if (!user) {
      console.error('User not authenticated (checked via useAuth)');
      alert(t('pricing.alerts.notAuthenticated'));
      return;
    }

    try {
      console.log('🚨 FRONTEND DEBUG: handleSubscribe called!');
      console.log('🚨 FRONTEND DEBUG: priceId =', priceId);
      console.log('🚨 FRONTEND DEBUG: userId =', user.id);
      console.log('🚨 FRONTEND DEBUG: userType =', userType);
      
      console.log('Invoking Stripe checkout function with:', { priceId, userId: user.id, userType });
      
      console.log('🚨 FRONTEND DEBUG: About to call supabase.functions.invoke');
      const { data, error } = await supabase.functions.invoke('create-checkout-session-v2', {
        body: { priceId, userId: user.id, userType },
      });
      
      console.log('🚨 FRONTEND DEBUG: Supabase function response:');
      console.log('🚨 FRONTEND DEBUG: data =', data);
      console.log('🚨 FRONTEND DEBUG: error =', error);

      if (error) {
        console.error('Error invoking Stripe checkout function:', error);
        alert(t('pricing.alerts.checkoutError', { message: error.message }));
        return;
      }

      // 🆓 Gestion des offres gratuites
      if (data && data.isFree) {
        console.log('Offre gratuite activée:', data.message);
        alert(data.message || 'Essai gratuit activé avec succès !');
        window.location.href = data.url; // Redirection vers dashboard
        return;
      }

      // Gestion des offres payantes
      if (data && (data.checkoutUrl || data.url)) {
        const redirectUrl = data.checkoutUrl || data.url;
        console.log('Received checkout URL:', redirectUrl);
        window.location.href = redirectUrl;
      } else {
        console.error('No checkoutUrl received from function:', data);
        alert(t('pricing.alerts.checkoutUrlError'));
      }
    } catch (e) {
      console.error('Unexpected error during subscription process:', e);
      alert(t('pricing.alerts.unexpectedError', { message: (e as Error).message }));
    }
  };

  const cardStyle = `
    border rounded-lg p-6 shadow-lg 
    ${isEnterprise ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200'}
    flex flex-col justify-between h-full
  `;
  const buttonStyle = `
    mt-6 w-full py-2 px-4 rounded font-semibold 
    ${isEnterprise ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}
    transition duration-150 ease-in-out
  `;

  return (
    <div className={cardStyle.replace(/\n\s*/g, ' ')}>
      <div>
        <h3 className={`text-2xl font-semibold ${isEnterprise ? 'text-blue-700' : 'text-gray-800'}`}>{planName}</h3>
        <p className={`text-4xl font-bold my-4 ${isEnterprise ? 'text-blue-600' : 'text-green-600'}`}>{price}</p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
      <button 
        onClick={() => handleSubscription(priceId)} 
        className={buttonStyle.replace(/\n\s*/g, ' ')}
      >
        {t('pricing.selectPlanButton')}
      </button>
    </div>
  );
};

export default SubscriptionPlanCard;
