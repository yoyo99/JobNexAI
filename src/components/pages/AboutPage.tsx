import React from 'react';
import SiteHeader from '../SiteHeader';

const AboutPage: React.FC = () => {
  return (
    <>
      <SiteHeader />
      <div className="max-w-4xl mx-auto p-6 md:p-10 bg-gray-800 text-gray-200 rounded-lg shadow-xl my-8 text-left">
      <h1 className="text-3xl font-bold mb-6 text-primary-400">À Propos de JobNexAI</h1>
      <p className="mb-4">
        Bienvenue sur JobNexAI ! Notre mission est de révolutionner la recherche d'emploi grâce à la puissance de l'intelligence artificielle.
      </p>
      <p className="mb-4">
        Nous comprenons les défis auxquels sont confrontés les chercheurs d'emploi et les recruteurs. C'est pourquoi nous avons développé une plateforme intuitive et intelligente qui simplifie le processus de recrutement, de la découverte d'opportunités à la gestion des candidatures.
      </p>
      <p>
        Notre équipe est composée de passionnés de technologie et d'experts en ressources humaines, tous dédiés à vous fournir les meilleurs outils pour atteindre vos objectifs professionnels.
      </p>
      {/* Ajoutez plus de contenu ici si vous le souhaitez */}
      </div>
    </>
  );
};

export default AboutPage;
