import React from 'react';

interface Achievement {
  id: string;
  text: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: Achievement[];
}

interface ExperiencePreviewProps {
  items: Experience[];
}

export const ExperiencePreview: React.FC<ExperiencePreviewProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return null; // Ne rien afficher si pas d'expérience
  }

  return (
    <div className="space-y-6">
      {items.map(item => (
        <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-x-6">
          {/* Colonne de gauche pour la date */}
          <div className="md:col-span-1 text-sm text-gray-500 font-medium mb-2 md:mb-0 md:text-right">
            {item.startDate} - {item.endDate || 'Présent'}
          </div>

          {/* Colonne de droite pour les détails */}
          <div className="md:col-span-3">
            <h4 className="text-lg font-semibold text-gray-800">{item.title}</h4>
            <div className="flex items-center text-md text-gray-600 mb-2">
              <span>{item.company}</span>
              {item.location && <span className="mx-2">•</span>}
              <span>{item.location}</span>
            </div>
            {item.description && <p className="text-sm text-gray-600 mb-2">{item.description}</p>}
            {item.achievements && item.achievements.length > 0 && (
              <ul className="list-disc list-outside pl-5 space-y-1 text-sm text-gray-700">
                {item.achievements.map(ach => (
                  <li key={ach.id}>{ach.text}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
