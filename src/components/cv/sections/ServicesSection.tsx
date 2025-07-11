import { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
}

interface ServicesProps {
  items: Service[];
  onChange: (items: Service[]) => void;
}

export function ServicesSection({ items, onChange }: ServicesProps) {
  const addService = () => {
    const newService: Service = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
    };
    onChange([...items, newService]);
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    onChange(items.map(item => (item.id === id ? { ...item, ...updates } : item)));
  };

  const removeService = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {items.map((service) => (
        <div key={service.id} className="relative bg-white/5 rounded-lg p-6 space-y-4">
          <input
            type="text"
            placeholder="Nom du service"
            value={service.name}
            onChange={(e) => updateService(service.id, { name: e.target.value })}
            className="w-full bg-transparent text-xl font-bold text-white placeholder-gray-500 focus:outline-none"
          />
          <textarea
            placeholder="Description du service..."
            value={service.description}
            onChange={(e) => updateService(service.id, { description: e.target.value })}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-gray-500"
          />
          <button
            onClick={() => removeService(service.id)}
            className="absolute top-3 right-3 text-red-500 hover:text-red-400 opacity-50 hover:opacity-100 transition-opacity"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      ))}
      <button
        onClick={addService}
        className="w-full py-2 border-2 border-dashed border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors"
      >
        Ajouter un service
      </button>
    </div>
  );
}
