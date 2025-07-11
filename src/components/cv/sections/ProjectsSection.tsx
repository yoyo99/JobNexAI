import { useState } from 'react';
import { Trash2, Sparkles, Link, X } from 'lucide-react';
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
  const [techInput, setTechInput] = useState<{ [key: string]: string }>({});
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

  const handleTechInputChange = (projectId: string, value: string) => {
    setTechInput(prev => ({ ...prev, [projectId]: value }));
  };

  const addTechnology = (projectId: string) => {
    const techName = techInput[projectId]?.trim();
    if (!techName) return;

    onChange(items.map(proj => {
      if (proj.id === projectId) {
        // Éviter les doublons
        if (proj.technologies.find(t => t.toLowerCase() === techName.toLowerCase())) {
          return proj;
        }
        return { ...proj, technologies: [...proj.technologies, techName] };
      }
      return proj;
    }));

    handleTechInputChange(projectId, ''); // Reset input
  };

  const removeTechnology = (projectId: string, techToRemove: string) => {
    onChange(items.map(proj => 
      proj.id === projectId 
        ? { ...proj, technologies: proj.technologies.filter(t => t !== techToRemove) } 
        : proj
    ));
  };

  const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, projectId: string) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTechnology(projectId);
    }
  };

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
      {items.map((project) => (
        <div key={project.id} className="relative bg-white/5 rounded-lg p-6 flex gap-x-6">
          {/* Colonne de gauche pour les dates */}
          <div className="w-1/4 space-y-2 text-sm text-gray-400">
            <div>
              <label className="block font-medium mb-1">Date de début</label>
              <input
                type="month"
                value={project.startDate}
                onChange={(e) => updateProject(project.id, { startDate: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            {!project.current && (
              <div>
                <label className="block font-medium mb-1">Date de fin</label>
                <input
                  type="month"
                  value={project.endDate}
                  onChange={(e) => updateProject(project.id, { endDate: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id={`current-proj-${project.id}`}
                checked={project.current}
                onChange={(e) => updateProject(project.id, { current: e.target.checked, endDate: e.target.checked ? undefined : project.endDate })}
                className="rounded border-white/10 bg-white/5 text-primary-500 focus:ring-primary-500"
              />
              <label htmlFor={`current-proj-${project.id}`}>Projet en cours</label>
            </div>
          </div>

          {/* Colonne de droite pour les détails */}
          <div className="flex-1 space-y-4">
            <input
              type="text"
              placeholder="Nom du projet"
              value={project.name}
              onChange={(e) => updateProject(project.id, { name: e.target.value })}
              className="w-full bg-transparent text-xl font-bold text-white placeholder-gray-500 focus:outline-none"
            />

            <div className="relative">
              <textarea
                placeholder="Description du projet..."
                value={project.description}
                onChange={(e) => updateProject(project.id, { description: e.target.value })}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-gray-500 pr-28"
              />
              <button 
                type="button"
                onClick={() => handleOptimize(project.id, project.description)}
                disabled={!project.description || optimizingId === project.id}
                className="absolute top-2 right-2 text-primary-400 hover:text-primary-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center gap-1.5 text-sm bg-white/10 px-2 py-1 rounded-md"
              >
                <Sparkles className={`h-4 w-4 ${optimizingId === project.id ? 'animate-spin' : ''}`} />
                {optimizingId === project.id ? 'Optimisation...' : 'Optimiser'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Link className="h-4 w-4 text-gray-500" />
              <input
                type="url"
                placeholder="URL du projet (optionnel)"
                value={project.url}
                onChange={(e) => updateProject(project.id, { url: e.target.value })}
                className="w-full bg-transparent text-gray-400 placeholder-gray-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="flex items-center gap-1.5 bg-primary-500/10 text-primary-400 text-sm font-medium px-3 py-1.5 rounded-full">
                    {tech}
                    <button onClick={() => removeTechnology(project.id, tech)} className="text-primary-300 hover:text-white">
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={techInput[project.id] || ''}
                onChange={(e) => handleTechInputChange(project.id, e.target.value)}
                onKeyDown={(e) => handleTechKeyDown(e, project.id)}
                placeholder="Ajouter une technologie et appuyer sur Entrée..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <button
            onClick={() => removeProject(project.id)}
            className="absolute top-3 right-3 text-red-500 hover:text-red-400 opacity-50 hover:opacity-100 transition-opacity"
          >
            <Trash2 className="h-5 w-5" />
          </button>
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