import React from 'react';

interface HeaderContent {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
}

interface HeaderPreviewProps {
  content: HeaderContent;
}

export const HeaderPreview: React.FC<HeaderPreviewProps> = ({ content }) => {
  return (
    <div className="text-center border-b pb-4 mb-4">
      <h1 className="text-3xl font-bold text-gray-800">{content.name}</h1>
      <h2 className="text-xl text-gray-600">{content.title}</h2>
      <div className="flex justify-center gap-4 mt-2 text-sm text-gray-500">
        <span>{content.email}</span>
        <span>{content.phone}</span>
        <span>{content.location}</span>
      </div>
      <div className="flex justify-center gap-4 mt-1 text-sm text-blue-500">
        <a href={content.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href={content.website} target="_blank" rel="noopener noreferrer">Website</a>
      </div>
    </div>
  );
};
