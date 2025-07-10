import React from 'react';
import { Link } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url: string;
  startDate: string;
  endDate: string;
}

interface ProjectsPreviewProps {
  items: Project[];
}

export const ProjectsPreview: React.FC<ProjectsPreviewProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return null; // Ne rien afficher si pas de projets
  }

  return (
    <div className="space-y-6">
      {items.map(item => (
        <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-x-6">
          {/* Colonne de gauche pour la date */}
          <div className="md:col-span-1 text-sm text-gray-500 font-medium mb-2 md:mb-0 md:text-right">
            {item.startDate} - {item.endDate || 'En cours'}
          </div>

          {/* Colonne de droite pour les détails */}
          <div className="md:col-span-3">
            <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
            {item.description && <p className="text-sm text-gray-600 my-2">{item.description}</p>}
            
            {item.technologies && item.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {item.technologies.map((tech, index) => (
                  <span key={index} className="bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {item.url && (
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline">
                <Link size={14} />
                Voir le projet
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
