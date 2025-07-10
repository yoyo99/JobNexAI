import React from 'react';

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
  return (
    <div className="my-4">
      <h3 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3 text-gray-700">Projets</h3>
      {items.map(item => (
        <div key={item.id} className="mb-3">
          <div className="flex justify-between items-baseline">
            <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
            <span className="text-sm text-gray-500">{item.startDate} - {item.endDate || 'En cours'}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {item.technologies.map((tech, index) => (
              <span key={index} className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded">
                {tech}
              </span>
            ))}
          </div>
          {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 mt-1">Voir le projet</a>}
        </div>
      ))}
    </div>
  );
};
