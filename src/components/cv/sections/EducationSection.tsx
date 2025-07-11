import { motion } from 'framer-motion'
import { TrashIcon } from 'lucide-react'

interface Education {
  id: string
  degree: string
  school: string
  location: string
  startDate: string
  endDate?: string
  current: boolean
  description?: string
}

interface EducationProps {
  items: Education[];
  onChange: (items: Education[]) => void;
}

export function EducationSection({ items, onChange }: EducationProps) {
  const addEducation = () => {
    const newEducation: Education = {
      id: crypto.randomUUID(),
      degree: '',
      school: '',
      location: '',
      startDate: '',
      current: false,
    }

    onChange([...items, newEducation]);
  }

  const updateEducation = (id: string, updates: Partial<Education>) => {
    onChange(items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  }

  const removeEducation = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  }

  return (
    <div className="space-y-6">
      {items.map((education) => (
        <motion.div
          key={education.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white/5 rounded-lg p-6 flex gap-x-6"
        >
          {/* Colonne de gauche pour les dates */}
          <div className="w-1/4 space-y-2 text-sm text-gray-400">
            <div>
              <label className="block font-medium mb-1">Date de début</label>
              <input
                type="month"
                value={education.startDate}
                onChange={(e) => updateEducation(education.id, { startDate: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            {!education.current && (
              <div>
                <label className="block font-medium mb-1">Date de fin</label>
                <input
                  type="month"
                  value={education.endDate}
                  onChange={(e) => updateEducation(education.id, { endDate: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id={`current-edu-${education.id}`}
                checked={education.current}
                onChange={(e) => updateEducation(education.id, { current: e.target.checked, endDate: e.target.checked ? undefined : education.endDate })}
                className="rounded border-white/10 bg-white/5 text-primary-500 focus:ring-primary-500"
              />
              <label htmlFor={`current-edu-${education.id}`}>En cours</label>
            </div>
          </div>

          {/* Colonne de droite pour les détails */}
          <div className="flex-1 space-y-4">
            <input
              type="text"
              placeholder="Diplôme ou Titre de la formation"
              value={education.degree}
              onChange={(e) => updateEducation(education.id, { degree: e.target.value })}
              className="w-full bg-transparent text-xl font-bold text-white placeholder-gray-500 focus:outline-none"
            />

            <div className="flex items-center gap-4 text-gray-400">
              <input
                type="text"
                placeholder="Établissement"
                value={education.school}
                onChange={(e) => updateEducation(education.id, { school: e.target.value })}
                className="w-1/2 bg-transparent focus:outline-none placeholder-gray-500"
              />
              <span className="text-gray-600">|</span>
              <input
                type="text"
                placeholder="Lieu"
                value={education.location}
                onChange={(e) => updateEducation(education.id, { location: e.target.value })}
                className="w-1/2 bg-transparent focus:outline-none placeholder-gray-500"
              />
            </div>

            <div>
              <textarea
                placeholder="Description (optionnel)..."
                value={education.description}
                onChange={(e) => updateEducation(education.id, { description: e.target.value })}
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-gray-500"
              />
            </div>
          </div>

          <button
            onClick={() => removeEducation(education.id)}
            className="absolute top-3 right-3 text-red-500 hover:text-red-400 opacity-50 hover:opacity-100 transition-opacity"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </motion.div>
      ))}

      <button
        onClick={addEducation}
        className="w-full py-2 border-2 border-dashed border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors"
      >
        Ajouter une formation
      </button>
    </div>
  )
}