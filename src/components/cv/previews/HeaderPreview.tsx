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
  const contactItems = [
    content.email && { icon: <Mail size={14} />, text: content.email, href: `mailto:${content.email}` },
    content.phone && { icon: <Phone size={14} />, text: content.phone, href: `tel:${content.phone}` },
    content.location && { icon: <MapPin size={14} />, text: content.location, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.location)}` },
    content.linkedin && { icon: <Linkedin size={14} />, text: 'LinkedIn', href: content.linkedin },
    content.website && { icon: <Globe size={14} />, text: 'Website', href: content.website },
  ].filter(Boolean) as { icon: JSX.Element; text: string; href?: string }[];

  return (
    <header className="text-center mb-10 border-b pb-6 border-gray-200">
      <h1 className="text-5xl font-bold text-gray-800 tracking-tight">{content.name || 'Votre Nom'}</h1>
      <h2 className="text-2xl text-gray-500 font-medium mt-2">{content.title || 'Votre Titre'}</h2>
      
      <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-sm text-gray-600 mt-6">
        {contactItems.map((item, index) => (
          <React.Fragment key={index}>
            <a 
              href={item.href}
              target={item.href && !item.href.startsWith('mailto:') && !item.href.startsWith('tel:') ? '_blank' : undefined}
              rel={item.href && !item.href.startsWith('mailto:') && !item.href.startsWith('tel:') ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors"
            >
              {item.icon}
              <span className="font-medium">{item.text}</span>
            </a>
            {index < contactItems.length - 1 && <span className="text-gray-300">•</span>}
          </React.Fragment>
        ))}
      </div>
    </header>
  );
};
