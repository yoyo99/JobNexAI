import React from 'react';

interface Service {
  id: string;
  name: string;
  description: string;
}

interface ServicesPreviewProps {
  items: Service[];
}

export const ServicesPreview: React.FC<ServicesPreviewProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {items.map(item => (
        <div key={item.id} className="flex gap-x-8">
          <div className="w-1/4 text-right flex-shrink-0">
            <h4 className="text-base font-bold text-gray-800 mt-1">{item.name}</h4>
          </div>
          <div className="w-3/4">
            <p className="text-base text-gray-700 leading-relaxed">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
