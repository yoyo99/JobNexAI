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
    return null;
  }

  return (
    <div className="space-y-8">
      {items.map(item => (
        <div key={item.id} className="flex gap-x-8">
          <div className="w-1/4 text-right flex-shrink-0">
            <p className="text-sm font-medium text-gray-500 whitespace-nowrap">
              {item.startDate} &mdash; {item.endDate || 'Présent'}
            </p>
          </div>

          <div className="w-3/4">
            <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
            <p className="text-lg font-medium text-gray-600 mt-1">
              {item.company}
              {item.location && <span className="text-gray-400 font-normal before:content-['•'] before:mx-2">{item.location}</span>}
            </p>
            {item.description && (
              <p className="mt-3 text-base text-gray-700 leading-relaxed">{item.description}</p>
            )}
            {item.achievements && item.achievements.length > 0 && (
              <ul className="mt-4 space-y-2">
                {item.achievements.map(ach => (
                  <li key={ach.id} className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1 font-bold">-</span>
                    <span className="text-base text-gray-700 leading-relaxed">{ach.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
