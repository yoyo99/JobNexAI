import React from 'react';

/**
 * Composant de matching IA basique pour JobNexus.
 * Affiche un score de compatibilité simple entre le profil utilisateur et une offre d'emploi.
 * Cette version MVP compare les mots-clés du profil et de l'offre (à remplacer plus tard par un vrai backend IA).
 */

interface MatchingIAProps {
  userSkills: string[];
  jobKeywords: string[];
}

function computeMatchingScore(userSkills: string[], jobKeywords: string[]): number {
  if (userSkills.length === 0 || jobKeywords.length === 0) return 0;
  const matchCount = jobKeywords.filter((kw) => userSkills.includes(kw)).length;
  return Math.round((matchCount / jobKeywords.length) * 100);
}

const MatchingIA: React.FC<MatchingIAProps> = ({ userSkills, jobKeywords }) => {
  const score = computeMatchingScore(userSkills, jobKeywords);
  return (
    <div className="border border-primary-400 rounded-lg p-4 my-4 bg-background/60">
      <h2 className="text-lg font-semibold mb-2">Compatibilité IA (MVP)</h2>
      <p className="mb-1">
        Score de compatibilité : <span className="font-bold text-primary-400">{score}%</span>
      </p>
      <p className="text-xs text-gray-400">(Calcul basé sur la correspondance des mots-clés, version MVP. À améliorer avec un backend IA.)</p>
    </div>
  );
};

export default MatchingIA;
