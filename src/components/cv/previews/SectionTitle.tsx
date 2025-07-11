import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => {
  return (
    <div className="mb-6 mt-10 first:mt-0">
      <h3 className="text-lg font-bold text-gray-800 uppercase tracking-widest pb-2 border-b-2 border-gray-800">
        {children}
      </h3>
    </div>
  );
};
