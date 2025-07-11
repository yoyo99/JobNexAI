import { useState } from 'react';
import { Trash2 } from 'lucide-react';

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
      {items.map((testimonial) => (
        <div key={testimonial.id} className="relative bg-white/5 rounded-lg p-6 space-y-4">
          <textarea
            placeholder='"Leur expertise a transformé notre projet..."'
            value={testimonial.text}
            onChange={(e) => updateTestimonial(testimonial.id, { text: e.target.value })}
            rows={4}
            className="w-full bg-transparent text-lg italic text-white placeholder-gray-500 focus:outline-none"
          />
          <div className="flex items-center gap-4 pt-4 border-t border-white/10">
            <input
              type="text"
              placeholder="Nom de l'auteur"
              value={testimonial.authorName}
              onChange={(e) => updateTestimonial(testimonial.id, { authorName: e.target.value })}
              className="w-1/2 bg-transparent font-semibold text-white placeholder-gray-400 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Rôle, Entreprise"
              value={testimonial.authorRole}
              onChange={(e) => updateTestimonial(testimonial.id, { authorRole: e.target.value })}
              className="w-1/2 bg-transparent text-gray-400 placeholder-gray-500 focus:outline-none"
            />
          </div>
          <button
            onClick={() => removeTestimonial(testimonial.id)}
            className="absolute top-3 right-3 text-red-500 hover:text-red-400 opacity-50 hover:opacity-100 transition-opacity"
          >
            <Trash2 className="h-5 w-5" />
          </button>
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
