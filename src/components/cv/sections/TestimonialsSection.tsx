import { useState } from 'react';
import { TrashIcon } from 'lucide-react';

interface Testimonial {
  id: string;
  authorName: string;
  authorRole: string;
  text: string;
}

interface TestimonialsProps {
  items: Testimonial[];
  onChange: (items: Testimonial[]) => void;
}

export function TestimonialsSection({ items, onChange }: TestimonialsProps) {
  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: crypto.randomUUID(),
      authorName: '',
      authorRole: '',
      text: '',
    };
    onChange([...items, newTestimonial]);
  };

  const updateTestimonial = (id: string, updates: Partial<Testimonial>) => {
    onChange(items.map(item => (item.id === id ? { ...item, ...updates } : item)));
  };

  const removeTestimonial = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {items.map((testimonial, index) => (
        <div key={testimonial.id} className="bg-white/5 rounded-lg p-4">
          <div className="flex items-start justify-between mb-4">
            <h4 className="text-white font-medium">Témoignage {index + 1}</h4>
            <button onClick={() => removeTestimonial(testimonial.id)} className="text-red-400 hover:text-red-300">
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nom de l'auteur</label>
                <input
                  type="text"
                  value={testimonial.authorName}
                  onChange={(e) => updateTestimonial(testimonial.id, { authorName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Rôle de l'auteur</label>
                <input
                  type="text"
                  value={testimonial.authorRole}
                  onChange={(e) => updateTestimonial(testimonial.id, { authorRole: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Témoignage</label>
              <textarea
                value={testimonial.text}
                onChange={(e) => updateTestimonial(testimonial.id, { text: e.target.value })}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={addTestimonial}
        className="w-full py-2 border-2 border-dashed border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors"
      >
        Ajouter un témoignage
      </button>
    </div>
  );
}
