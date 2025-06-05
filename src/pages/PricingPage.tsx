import React from 'react';
import SubscriptionPlanCard from '../components/SubscriptionPlanCard'; // Vérifiez le chemin
import { useTranslation } from 'react-i18next';

// Remplacez par vos vrais Price IDs Stripe
const PRICE_IDS = {
  PRO_MONTHLY: 'price_1RMqzHQIOmiow8714WydjFom', // Exemple: price_1RCkHsS6wNQV7f...
  PRO_ANNUAL: 'price_1RCiWyQIOmiow871qikbv26N',   // Exemple: price_1RCiWS6wPihZqV...
  ENT_MONTHLY: 'price_1RCibGQIOmiow871TscCjF6g', // Exemple: price_1RCibIS6wUR0fn...
  ENT_ANNUAL: 'price_1RCictQIOmiow871v0V7O7if',   // Exemple: price_1RCic1S6wVXchP...
};

const PricingPage: React.FC = () => {
  const { t } = useTranslation('translation');
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">{t('pricing.title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <SubscriptionPlanCard 
          planName={t('pricing.plans.proMonthly.name')}
          price={t('pricing.plans.proMonthly.price')}
          features={t('pricing.plans.proMonthly.features', { returnObjects: true }) as string[]}
          priceId={PRICE_IDS.PRO_MONTHLY}
        />

        <SubscriptionPlanCard 
          planName={t('pricing.plans.proAnnual.name')}
          price={t('pricing.plans.proAnnual.price')}
          features={t('pricing.plans.proAnnual.features', { returnObjects: true }) as string[]}
          priceId={PRICE_IDS.PRO_ANNUAL}
        />

        <SubscriptionPlanCard 
          planName={t('pricing.plans.entMonthly.name')}
          price={t('pricing.plans.entMonthly.price')}
          features={t('pricing.plans.entMonthly.features', { returnObjects: true }) as string[]}
          priceId={PRICE_IDS.ENT_MONTHLY}
          isEnterprise={true}
        />

        <SubscriptionPlanCard 
          planName={t('pricing.plans.entAnnual.name')}
          price={t('pricing.plans.entAnnual.price')}
          features={t('pricing.plans.entAnnual.features', { returnObjects: true }) as string[]}
          priceId={PRICE_IDS.ENT_ANNUAL}
          isEnterprise={true}
        />

      </div>
      <p className="text-center text-gray-600 mt-12">
        {t('pricing.footerText')}
      </p>
    </div>
  );
};

export default PricingPage;
