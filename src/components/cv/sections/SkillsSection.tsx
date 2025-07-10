import { useState } from 'react';
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Structure de données unifiée pour l'éditeur et l'aperçu
interface Skill {
  id: string;
  name: string;
}

interface SkillCategory {
  id: string;
  name: string;
  skills: Skill[];
}

interface SkillsProps {
  categories: SkillCategory[];
  onChange: (categories: SkillCategory[]) => void;
}

export function SkillsSection({ categories, onChange }: SkillsProps) {
  // État pour garder la valeur de l'input pour chaque catégorie
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

  const handleInputChange = (categoryId: string, value: string) => {
    setInputValues(prev => ({ ...prev, [categoryId]: value }));
  };

  const addCategory = () => {
    onChange([
      ...categories,
      { id: crypto.randomUUID(), name: 'Nouvelle catégorie', skills: [] },
    ]);
  };

  const updateCategoryName = (id: string, name: string) => {
    onChange(
      categories.map(cat => (cat.id === id ? { ...cat, name } : cat))
    );
  };

  const removeCategory = (id: string) => {
    onChange(categories.filter(cat => cat.id !== id));
  };

  const addSkill = (categoryId: string) => {
    const skillName = inputValues[categoryId]?.trim();
    if (!skillName) return; // Ne pas ajouter de compétence vide

    const newSkill = { id: crypto.randomUUID(), name: skillName };

    onChange(
      categories.map(cat =>
        cat.id === categoryId
          // Éviter les doublons
          ? cat.skills.find(s => s.name.toLowerCase() === skillName.toLowerCase())
            ? cat
            : { ...cat, skills: [...cat.skills, newSkill] }
          : cat
      )
    );

    // Vider l'input
    handleInputChange(categoryId, '');
  };

  const removeSkill = (categoryId: string, skillId: string) => {
    onChange(
      categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, skills: cat.skills.filter(s => s.id !== skillId) }
          : cat
      )
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, categoryId: string) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault(); // Empêcher la soumission ou la virgule
      addSkill(categoryId);
    }
  };

  return (
    <div className="space-y-6">
      {categories.map(category => (
        <div key={category.id} className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              value={category.name}
              onChange={e => updateCategoryName(category.id, e.target.value)}
              placeholder="Nom de la catégorie"
              className="w-full bg-transparent text-white font-medium focus:outline-none text-lg"
            />
            <button
              onClick={() => removeCategory(category.id)}
              className="text-red-400 hover:text-red-300 ml-4"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            {category.skills.map(skill => (
              <span key={skill.id} className="flex items-center gap-1 bg-indigo-500/20 text-indigo-300 text-sm font-medium px-3 py-1 rounded-full">
                {skill.name}
                <button onClick={() => removeSkill(category.id, skill.id)} className="text-indigo-200 hover:text-white">
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
          
          <input
            type="text"
            value={inputValues[category.id] || ''}
            onChange={e => handleInputChange(category.id, e.target.value)}
            onKeyDown={e => handleKeyDown(e, category.id)}
            placeholder="Ajouter une compétence et appuyer sur Entrée..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      ))}
      <button
        onClick={addCategory}
        className="w-full py-2 border-2 border-dashed border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors"
      >
        Ajouter une catégorie de compétences
      </button>
    </div>
  );
}