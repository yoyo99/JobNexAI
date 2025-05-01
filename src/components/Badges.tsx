import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Composant Badges pour la gamification JobNexAI.
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
  { id: 'starter', label: 'badges.starter.label', description: 'badges.starter.description', icon: '🎉', unlocked: true },
  { id: 'first-app', label: 'badges.firstApp.label', description: 'badges.firstApp.description', icon: '🚀', unlocked: false },
  { id: 'networker', label: 'badges.networker.label', description: 'badges.networker.description', icon: '🤝', unlocked: false },
  { id: 'persistent', label: 'badges.persistent.label', description: 'badges.persistent.description', icon: '🔥', unlocked: false },
  { id: 'winner', label: 'badges.winner.label', description: 'badges.winner.description', icon: '🏆', unlocked: false },
];

const Badges: React.FC<{ badges?: Badge[] }> = ({ badges = defaultBadges }) => {
  const { t } = useTranslation();
  return (
    <div className="prose mx-auto p-8 bg-background text-white rounded-lg max-w-3xl">
      <h2 className="mb-4">{t('badges.title')}</h2>
      <div className="flex flex-wrap gap-4">
        {badges.map(badge => (
          <div
            key={badge.id}
            className={`flex flex-col items-center p-4 rounded-lg shadow-md w-36 h-36 transition-opacity ${badge.unlocked ? 'bg-primary-600/20 opacity-100' : 'bg-white/5 opacity-40'}`}
          >
            <span className="text-4xl mb-2">{badge.icon}</span>
            <span className="font-semibold">{t(badge.label)}</span>
            <span className="text-xs text-gray-400 text-center mt-1">{t(badge.description)}</span>
            {!badge.unlocked && <span className="mt-2 text-xs text-gray-400">{t('badges.toUnlock')}</span>}
          </div>
        ))}
      </div>
      {/* TODO: Brancher sur vraies stats utilisateur plus tard */}
    </div>
  );
};

export default Badges;
