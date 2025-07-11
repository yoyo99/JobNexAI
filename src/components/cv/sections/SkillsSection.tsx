import { useState } from 'react';
import { Trash2, X } from 'lucide-react';

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
        <div key={category.id} className="bg-white/5 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              value={category.name}
              onChange={e => updateCategoryName(category.id, e.target.value)}
              placeholder="Nom de la catégorie"
              className="w-full bg-transparent text-xl font-bold text-white placeholder-gray-500 focus:outline-none"
            />
            <button
              onClick={() => removeCategory(category.id)}
              className="text-red-500 hover:text-red-400 opacity-50 hover:opacity-100 transition-opacity ml-4"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {category.skills.map(skill => (
              <span key={skill.id} className="flex items-center gap-1.5 bg-primary-500/10 text-primary-400 text-sm font-medium px-3 py-1.5 rounded-full">
                {skill.name}
                <button onClick={() => removeSkill(category.id, skill.id)} className="text-primary-300 hover:text-white">
                  <X className="h-4 w-4" />
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
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
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