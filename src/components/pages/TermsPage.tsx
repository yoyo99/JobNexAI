import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 bg-gray-800 text-gray-200 rounded-lg shadow-xl my-8 text-left">
      <h1 className="text-3xl font-bold mb-6 text-primary-400">Conditions d'Utilisation</h1>
      <p className="mb-4">
        En accédant et en utilisant la plateforme JobNexAI (le "Service"), vous acceptez d'être lié par les présentes Conditions d'Utilisation (les "Conditions"). Si vous n'acceptez pas une partie des conditions, vous ne pouvez pas accéder au Service.
      </p>
      <h2 className="text-2xl font-semibold mb-3 mt-5">1. Utilisation du Service</h2>
      <p className="mb-4">
        JobNexAI vous accorde une licence limitée, non exclusive, non transférable et révocable pour utiliser le Service conformément à ces Conditions. Vous vous engagez à ne pas utiliser le Service à des fins illégales ou interdites par ces Conditions.
      </p>
      <h2 className="text-2xl font-semibold mb-3 mt-5">2. Comptes Utilisateurs</h2>
      <p className="mb-4">
        Lorsque vous créez un compte chez nous, vous devez nous fournir des informations exactes, complètes et à jour en tout temps. Le défaut de le faire constitue une violation des Conditions, ce qui peut entraîner la résiliation immédiate de votre compte sur notre Service.
      </p>
      {/* Ajoutez plus de sections et de contenu détaillé ici */}
      <p className="mt-6">
        Ces conditions sont régies et interprétées conformément aux lois françaises, sans égard à ses dispositions relatives aux conflits de lois.
      </p>
      <p className="mt-4">
        Dernière mise à jour : 28 mai 2025
      </p>
    </div>
  );
};

export default TermsPage;
