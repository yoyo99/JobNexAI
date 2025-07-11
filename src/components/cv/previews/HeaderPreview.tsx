import React from 'react';
import { Header } from '@/types/cv';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

interface HeaderPreviewProps {
  content: Header;
  layout?: 'creative' | 'freelance';
}

export const HeaderPreview: React.FC<HeaderPreviewProps> = ({ content, layout }) => {
  if (layout === 'creative') {
    return (
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">{content.name}</h1>
        <p className="text-xl text-teal-300 mt-2">{content.title}</p>
        <div className="mt-4 flex justify-center items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-300">
          {content.email && <span>{content.email}</span>}
          {content.phone && <span>{content.phone}</span>}
          {content.website && <span>{content.website}</span>}
        </div>
      </div>
    );
  }

  const contactItems = [
    content.email && { icon: <Mail size={14} />, text: content.email, href: `mailto:${content.email}` },
    content.phone && { icon: <Phone size={14} />, text: content.phone, href: `tel:${content.phone}` },
    content.address && { icon: <MapPin size={14} />, text: content.address },
    content.website && { icon: <Globe size={14} />, text: 'Website', href: content.website },
  ].filter(Boolean) as { icon: JSX.Element; text: string; href?: string }[];

  return (
    <header className="text-center mb-10 border-b pb-6 border-gray-200">
      <h1 className="text-5xl font-bold text-gray-800 tracking-tight">{content.name || 'Votre Nom'}</h1>
      <h2 className="text-2xl text-gray-500 mt-2">{content.title || 'Titre du Poste'}</h2>

      <div className="mt-6 flex justify-center items-center flex-wrap gap-x-6 gap-y-2 text-gray-600">
        {contactItems.map((item, index) => (
          <div key={index} className="flex items-center">
            {item.icon}
            {item.href ? (
              <a href={item.href} className="ml-2 hover:text-primary-600 transition-colors" target="_blank" rel="noopener noreferrer">
                {item.text}
              </a>
            ) : (
              <span className="ml-2">{item.text}</span>
            )}
          </div>
        ))}
      </div>
    </header>
  );
};
