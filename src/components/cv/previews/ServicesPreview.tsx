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
    <div className="space-y-4">
      {items.map(item => (
        <div key={item.id}>
          <h4 className="font-semibold text-gray-800">{item.name}</h4>
          <p className="text-sm text-gray-600">{item.description}</p>
        </div>
      ))}
    </div>
  );
};
