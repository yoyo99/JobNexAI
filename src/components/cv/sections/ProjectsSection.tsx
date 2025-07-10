import { useState } from 'react';
import { TrashIcon, Sparkles } from 'lucide-react';
import { optimizeText } from '../../../lib/ai';
import toast from 'react-hot-toast';

interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  url?: string
  startDate: string
  endDate?: string
  current: boolean
}

interface ProjectsProps {
  items: Project[];
  onChange: (items: Project[]) => void;
}

export function ProjectsSection({ items, onChange }: ProjectsProps) {
  const [optimizingId, setOptimizingId] = useState<string | null>(null);
  const addProject = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      technologies: [],
      startDate: '',
      current: false,
    }

    onChange([...items, newProject]);
  }

  const updateProject = (id: string, updates: Partial<Project>) => {
    onChange(items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  }

  const removeProject = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  }

  const addTechnology = (projectId: string) => {
    onChange(items.map(item =>
      item.id === projectId
        ? { ...item, technologies: [...item.technologies, ''] }
        : item
    ));
  }

  const updateTechnology = (projectId: string, index: number, value: string) => {
    onChange(items.map(item =>
      item.id === projectId
        ? {
            ...item,
            technologies: item.technologies.map((tech, i) =>
              i === index ? value : tech
            ),
          }
        : item
    ));
  }

  const removeTechnology = (projectId: string, index: number) => {
    onChange(items.map(item =>
      item.id === projectId
        ? {
            ...item,
            technologies: item.technologies.filter((_, i) => i !== index),
          }
        : item
    ));
  }

  const handleOptimize = async (projectId: string, currentDescription: string) => {
    setOptimizingId(projectId);

    const promise = optimizeText(currentDescription, 'fr');

    toast.promise(promise, {
      loading: 'Optimisation en cours...',
      success: (optimizedDescription) => {
        updateProject(projectId, { description: optimizedDescription });
        setOptimizingId(null);
        return 'Description optimisée avec succès !';
      },
      error: (err) => {
        setOptimizingId(null);
        return `Erreur: ${err.message || 'Impossible d\'optimiser le texte.'}`;
      },
    });
  };

  return (
    <div className="space-y-6">
      {items.map((project, index) => (
        <div
          key={project.id}
          className="bg-white/5 rounded-lg p-4"
        >
          <div className="flex items-start justify-between mb-4">
            <h4 className="text-white font-medium">Projet {index + 1}</h4>
            <button
              onClick={() => removeProject(project.id)}
              className="text-red-400 hover:text-red-300"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Nom du projet
              </label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => updateProject(project.id, { name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-400">
                  Description
                </label>
                <button 
                  type="button"
                  onClick={() => handleOptimize(project.id, project.description)}
                  disabled={!project.description || optimizingId === project.id}
                  className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {optimizingId === project.id ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Optimisation...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      Optimiser avec l'IA
                    </>
                  )}
                </button>
              </div>
              <textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, { description: e.target.value })}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                URL du projet (optionnel)
              </label>
              <input
                type="url"
                value={project.url}
                onChange={(e) => updateProject(project.id, { url: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Date de début
                </label>
                <input
                  type="month"
                  value={project.startDate}
                  onChange={(e) => updateProject(project.id, { startDate: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Date de fin
                </label>
                <input
                  type="month"
                  value={project.endDate}
                  onChange={(e) => updateProject(project.id, { endDate: e.target.value })}
                  disabled={project.current}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`current-${project.id}`}
                checked={project.current}
                onChange={(e) => updateProject(project.id, {
                  current: e.target.checked,
                  endDate: e.target.checked ? undefined : project.endDate,
                })}
                className="rounded border-white/10 bg-white/5 text-primary-500 focus:ring-primary-500"
              />
              <label
                htmlFor={`current-${project.id}`}
                className="text-sm text-gray-400"
              >
                Projet en cours
              </label>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-400">
                  Technologies utilisées
                </label>
                <button
                  onClick={() => addTechnology(project.id)}
                  className="text-primary-400 hover:text-primary-300"
                >
                  +
                </button>
              </div>
              <div className="space-y-2">
                {project.technologies.map((tech, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tech}
                      onChange={(e) => updateTechnology(project.id, i, e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      onClick={() => removeTechnology(project.id, i)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addProject}
        className="w-full py-2 border-2 border-dashed border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors"
      >
        Ajouter un projet
      </button>
    </div>
  )
}