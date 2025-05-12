import React from 'react';
import { supabase } from '../lib/supabaseClient'; // Mise à jour du chemin

interface SubscriptionPlanCardProps {
  planName: string;
  price: string;
  features: string[];
  priceId: string;
  isEnterprise?: boolean; // Pour un style potentiellement différent
}

const handleSubscription = async (priceId: string) => {
  if (!supabase || !supabase.auth) {
    console.error('Supabase client not initialized or auth module missing.');
    alert('Erreur de configuration : client Supabase non initialisé.');
    return;
  }
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Subscription attempt - Session:', session, 'Session Error:', sessionError);
    if (sessionError || !session) {
      console.error('User not authenticated:', sessionError);
      alert('Veuillez vous connecter pour vous abonner.');
      // Idéalement, rediriger vers la page de connexion ici
      return;
    }

    console.log(`Attempting to subscribe to price ID: ${priceId}`);

    const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
      body: { priceId: priceId },
    });

    if (error) {
      console.error('Error invoking Stripe checkout function:', error);
      alert(`Erreur lors de la création de la session de paiement: ${error.message}`);
      return;
    }

    if (data && data.checkoutUrl) {
      console.log('Received checkout URL:', data.checkoutUrl);
      window.location.href = data.checkoutUrl;
    } else {
      console.error('No checkoutUrl received from function:', data);
      alert('Erreur : URL de paiement non reçue.');
    }
  } catch (e) {
    console.error('Unexpected error during subscription process:', e);
    alert(`Une erreur inattendue est survenue: ${(e as Error).message}`);
  }
};

const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({ planName, price, features, priceId, isEnterprise }) => {
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
        Choisir ce plan
      </button>
    </div>
  );
};

export default SubscriptionPlanCard;
