import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

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
  const contactInfo = [
    { icon: <Mail size={14} />, text: content.email, href: `mailto:${content.email}` },
    { icon: <Phone size={14} />, text: content.phone, href: `tel:${content.phone}` },
    { icon: <MapPin size={14} />, text: content.location },
  ];

  const socialLinks = [
    { icon: <Linkedin size={14} />, text: 'LinkedIn', href: content.linkedin },
    { icon: <Globe size={14} />, text: 'Website', href: content.website },
  ];

  return (
    <div className="p-6 bg-white rounded-t-lg mb-6 text-gray-800">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-gray-900">{content.name || 'Votre Nom'}</h1>
        <h2 className="text-xl text-indigo-600 font-medium">{content.title || 'Votre Titre'}</h2>
      </div>
      
      <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-gray-600 border-t border-gray-200 py-3">
        {contactInfo.map((item, index) => (
          item.text && (
            <a key={index} href={item.href} className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
              {item.icon}
              <span>{item.text}</span>
            </a>
          )
        ))}
        {socialLinks.map((item, index) => (
          item.href && (
            <a key={index} href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
              {item.icon}
              <span>{item.text}</span>
            </a>
          )
        ))}
      </div>
    </div>
  );
};
