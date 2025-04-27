import React, { useEffect, useState } from 'react';
import { matchScoreIA, SupportedAI } from '../lib/aiRouter';

/**
 * Composant de matching IA basique pour JobNexAI.
 * Affiche un score de compatibilité simple entre le profil utilisateur et une offre d'emploi.
 * Cette version MVP compare les mots-clés du profil et de l'offre (à remplacer plus tard par un vrai backend IA).
 */

interface MatchingIAProps {
  userSkills: string[];
  jobKeywords: string[];
}

const MatchingIA: React.FC<MatchingIAProps> = ({ userSkills, jobKeywords }) => {
  const [score, setScore] = useState<number>(0);
  const [engine, setEngine] = useState<SupportedAI>('openai');

  useEffect(() => {
    // Récupère le moteur IA et la clé API depuis le localStorage (MVP)
    const settings = localStorage.getItem('user_ai_settings');
    let selectedEngine: SupportedAI = 'openai';
    let apiKeys: Record<string, string> = {};
    if (settings) {
      try {
        const parsed = JSON.parse(settings);
        selectedEngine = parsed.engine || 'openai';
        apiKeys = parsed.apiKeys || {};
      } catch {}
    }
    setEngine(selectedEngine);
    matchScoreIA(userSkills, jobKeywords, { engine: selectedEngine, apiKeys }).then(setScore);
  }, [userSkills, jobKeywords]);

  return (
    <div className="border border-primary-400 rounded-lg p-4 my-4 bg-background/60">
      <h2 className="text-lg font-semibold mb-2">Compatibilité IA</h2>
      <p className="mb-1">
        Score de compatibilité : <span className="font-bold text-primary-400">{score}%</span>
      </p>
      <p className="text-xs text-gray-400">(Calcul réalisé via&nbsp;<span className="font-semibold">{engine.charAt(0).toUpperCase() + engine.slice(1)}</span>. Sélectionnable dans le profil.)</p>
    </div>
  );
};

export default MatchingIA;
