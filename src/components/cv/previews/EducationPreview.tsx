import React from 'react';

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface EducationPreviewProps {
  items: Education[];
}

export const EducationPreview: React.FC<EducationPreviewProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return null; // Ne rien afficher si pas de formation
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
            <h4 className="text-lg font-semibold text-gray-800">{item.degree}</h4>
            <div className="flex items-center text-md text-gray-600 mb-2">
              <span>{item.institution}</span>
              {item.location && <span className="mx-2">•</span>}
              <span>{item.location}</span>
            </div>
            {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};
