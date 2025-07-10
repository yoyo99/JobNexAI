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
  return (
    <div className="my-4">
      <h3 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3 text-gray-700">Expérience Professionnelle</h3>
      {items.map(item => (
        <div key={item.id} className="mb-3">
          <div className="flex justify-between items-baseline">
            <h4 className="text-lg font-semibold text-gray-800">{item.title}</h4>
            <span className="text-sm text-gray-500">{item.startDate} - {item.endDate || 'Présent'}</span>
          </div>
          <p className="text-md text-gray-600">{item.company} | {item.location}</p>
          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          <ul className="list-disc list-inside mt-1 text-sm text-gray-600">
            {item.achievements.map(ach => (
              <li key={ach.id}>{ach.text}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
