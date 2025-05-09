import React from 'react';
import SubscriptionPlanCard from '../components/SubscriptionPlanCard'; // Vérifiez le chemin

// Remplacez par vos vrais Price IDs Stripe
const PRICE_IDS = {
  PRO_MONTHLY: 'price_1RMqzHQIOmiow8714WydjFom', // Exemple: price_1RCkHsS6wNQV7f...
  PRO_ANNUAL: 'price_1RCiWyQIOmiow871qikbv26N',   // Exemple: price_1RCiWS6wPihZqV...
  ENT_MONTHLY: 'price_1RCibGQIOmiow871TscCjF6g', // Exemple: price_1RCibIS6wUR0fn...
  ENT_ANNUAL: 'price_1RCictQIOmiow871v0V7O7if',   // Exemple: price_1RCic1S6wVXchP...
};

const PricingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Nos Plans d'Abonnement</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <SubscriptionPlanCard 
          planName="Pro Mensuel"
          price="9.99€/mois"
          features={['Accès aux fonctionnalités Pro', 'Support par email', 'Mises à jour mensuelles']}
          priceId={PRICE_IDS.PRO_MONTHLY}
        />

        <SubscriptionPlanCard 
          planName="Pro Annuel"
          price="95.04€/an"
          features={['Accès aux fonctionnalités Pro', 'Support prioritaire', 'Économie de 2 mois', 'Mises à jour continues']}
          priceId={PRICE_IDS.PRO_ANNUAL}
        />

        <SubscriptionPlanCard 
          planName="Entreprise Mensuel"
          price="29.99€/mois"
          features={['Toutes les fonctionnalités Pro', 'Support dédié 24/7', 'Accès API', 'Analyses avancées']}
          priceId={PRICE_IDS.ENT_MONTHLY}
          isEnterprise={true}
        />

        <SubscriptionPlanCard 
          planName="Entreprise Annuel"
          price="287.90€/an"
          features={['Toutes les fonctionnalités Entreprise', 'Économie significative', 'Accompagnement personnalisé']}
          priceId={PRICE_IDS.ENT_ANNUAL}
          isEnterprise={true}
        />

      </div>
      <p className="text-center text-gray-600 mt-12">
        Tous les prix sont en EUR. Choisissez le plan qui vous convient le mieux et commencez dès aujourd'hui !
      </p>
    </div>
  );
};

export default PricingPage;
