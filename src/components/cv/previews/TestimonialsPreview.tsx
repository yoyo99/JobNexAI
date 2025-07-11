import React from 'react';

interface Testimonial {
  id: string;
  author: {
    name: string;
    role: string;
  };
  text: string;
}

interface TestimonialsPreviewProps {
  items: Testimonial[];
}

export const TestimonialsPreview: React.FC<TestimonialsPreviewProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {items.map(item => (
        <figure key={item.id}>
          <blockquote className="border-l-4 border-blue-500 pl-6">
            <p className="text-xl italic text-gray-700 leading-relaxed">“{item.text}”</p>
          </blockquote>
          <figcaption className="mt-4 text-right">
            <p className="font-semibold text-gray-800">— {item.author.name}</p>
            {item.author.role && (
              <p className="text-sm text-gray-500">{item.author.role}</p>
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  );
};
