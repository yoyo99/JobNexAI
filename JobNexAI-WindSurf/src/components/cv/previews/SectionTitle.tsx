import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
  icon?: React.ReactElement;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children, icon }) => {
  return (
    <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-4 flex items-center">
      {icon}
      {children}
    </h2>
  );
};
