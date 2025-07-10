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
  return (
    <div className="my-4">
      <h3 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3 text-gray-700">Formation</h3>
      {items.map(item => (
        <div key={item.id} className="mb-3">
          <div className="flex justify-between items-baseline">
            <h4 className="text-lg font-semibold text-gray-800">{item.degree}</h4>
            <span className="text-sm text-gray-500">{item.startDate} - {item.endDate || 'Présent'}</span>
          </div>
          <p className="text-md text-gray-600">{item.institution} | {item.location}</p>
          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
        </div>
      ))}
    </div>
  );
};
