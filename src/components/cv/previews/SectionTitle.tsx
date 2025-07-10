import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => {
  return (
    <div className="flex items-center mb-4">
      <h3 className="text-2xl font-bold text-gray-800 pr-4">{children}</h3>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  );
};
