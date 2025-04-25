import React from 'react';

/**
 * Composant Badges pour la gamification JobNexus.
 * Affiche des badges selon l'activité de l'utilisateur (MVP, à brancher sur vraies stats).
 */

interface Badge {
  id: string;
  label: string;
  description: string;
  icon: string; // Emoji ou icône
  unlocked: boolean;
}

const defaultBadges: Badge[] = [
  { id: 'starter', label: 'Nouveau Talent', description: 'Inscription complétée', icon: '🎉', unlocked: true },
  { id: 'first-app', label: 'Première candidature', description: 'Vous avez postulé à un emploi', icon: '🚀', unlocked: false },
  { id: 'networker', label: 'Connecteur', description: 'Vous avez rejoint la communauté', icon: '🤝', unlocked: false },
  { id: 'persistent', label: 'Persévérant', description: '10 candidatures envoyées', icon: '🔥', unlocked: false },
  { id: 'winner', label: 'Embauché !', description: 'Vous avez accepté une offre', icon: '🏆', unlocked: false },
];

const Badges: React.FC<{ badges?: Badge[] }> = ({ badges = defaultBadges }) => {
  return (
    <div className="prose mx-auto p-8 bg-background text-white rounded-lg max-w-3xl">
      <h2 className="mb-4">Mes badges</h2>
      <div className="flex flex-wrap gap-4">
        {badges.map(badge => (
          <div
            key={badge.id}
            className={`flex flex-col items-center p-4 rounded-lg shadow-md w-36 h-36 transition-opacity ${badge.unlocked ? 'bg-primary-600/20 opacity-100' : 'bg-white/5 opacity-40'}`}
          >
            <span className="text-4xl mb-2">{badge.icon}</span>
            <span className="font-semibold">{badge.label}</span>
            <span className="text-xs text-gray-400 text-center mt-1">{badge.description}</span>
            {!badge.unlocked && <span className="mt-2 text-xs text-gray-400">(À débloquer)</span>}
          </div>
        ))}
      </div>
      {/* TODO: Brancher sur vraies stats utilisateur plus tard */}
    </div>
  );
};

export default Badges;
