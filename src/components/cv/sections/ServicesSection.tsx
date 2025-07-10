import { useState } from 'react';
import { TrashIcon } from 'lucide-react';

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
      {items.map((service, index) => (
        <div key={service.id} className="bg-white/5 rounded-lg p-4">
          <div className="flex items-start justify-between mb-4">
            <h4 className="text-white font-medium">Service {index + 1}</h4>
            <button onClick={() => removeService(service.id)} className="text-red-400 hover:text-red-300">
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Nom du service</label>
              <input
                type="text"
                value={service.name}
                onChange={(e) => updateService(service.id, { name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
              <textarea
                value={service.description}
                onChange={(e) => updateService(service.id, { description: e.target.value })}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
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
