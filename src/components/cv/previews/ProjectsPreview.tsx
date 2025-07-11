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
    return null;
  }

  return (
    <div className="space-y-8">
      {items.map(item => (
        <div key={item.id} className="flex gap-x-8">
          <div className="w-1/4 text-right flex-shrink-0">
            <p className="text-sm font-medium text-gray-500 whitespace-nowrap">
              {item.startDate} &mdash; {item.endDate || 'En cours'}
            </p>
          </div>

          <div className="w-3/4">
            <div className="flex items-center gap-x-3">
              <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">
                  <Link size={16} />
                </a>
              )}
            </div>
            
            {item.description && (
              <p className="mt-3 text-base text-gray-700 leading-relaxed">{item.description}</p>
            )}

            {item.technologies && item.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {item.technologies.map((tech, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-md">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
