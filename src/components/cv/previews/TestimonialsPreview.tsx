import React from 'react';

interface Testimonial {
  id: string;
  authorName: string;
  authorRole: string;
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
    <div className="space-y-6">
      {items.map(item => (
        <div key={item.id} className="border-l-4 border-gray-200 pl-4">
          <p className="text-gray-600 italic">"{item.text}"</p>
          <footer className="mt-2 text-sm text-gray-800 font-semibold">
            — {item.authorName}, <span className="text-gray-500 font-normal">{item.authorRole}</span>
          </footer>
        </div>
      ))}
    </div>
  );
};
