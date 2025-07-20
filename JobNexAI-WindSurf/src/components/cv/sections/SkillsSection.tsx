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
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [noResultsMessage, setNoResultsMessage] = useState<string | null>(null);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setErrorMessage(null);
      setNoResultsMessage(null);
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    setNoResultsMessage(null);
    
    try {
      const response = await fetch(`/.netlify/functions/skills-search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      // Gestion du cas "aucun résultat" avec message du serveur
      if (data.message && data.suggestions) {
        setSuggestions([]);
        setNoResultsMessage(data.message);
      } else if (Array.isArray(data) && data.length === 0) {
        setSuggestions([]);
        setNoResultsMessage('Aucune compétence trouvée pour cette recherche');
      } else {
        setSuggestions(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch skills:", error);
      setSuggestions([]);
      setErrorMessage('Erreur lors de la recherche. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (categoryId: string, value: string) => {
    setInputValues(prev => ({ ...prev, [categoryId]: value }));
    setActiveCategory(categoryId);

    if (debounceTimeout) clearTimeout(debounceTimeout);
    if (value.trim() === '') {
      setSuggestions([]);
      setErrorMessage(null);
      setNoResultsMessage(null);
      return;
    }

    setDebounceTimeout(setTimeout(() => fetchSuggestions(value), 300));
  };

  const addCategory = () => {
    onChange([...categories, { id: crypto.randomUUID(), name: 'Nouvelle catégorie', skills: [] }]);
  };

  const updateCategoryName = (id: string, name: string) => {
    onChange(categories.map(cat => (cat.id === id ? { ...cat, name } : cat)));
  };

  const removeCategory = (id: string) => {
    onChange(categories.filter(cat => cat.id !== id));
  };

  const addSkill = (categoryId: string, skillNameFromSuggestion?: string) => {
    const skillName = skillNameFromSuggestion || inputValues[categoryId]?.trim();
    if (!skillName) return;

    const newSkill = { id: crypto.randomUUID(), name: skillName };

    onChange(
      categories.map(cat =>
        cat.id === categoryId
          ? cat.skills.find(s => s.name.toLowerCase() === skillName.toLowerCase())
            ? cat
            : { ...cat, skills: [...cat.skills, newSkill] }
          : cat
      )
    );

    setInputValues(prev => ({ ...prev, [categoryId]: '' }));
    setSuggestions([]);
    setActiveCategory(null);
    setErrorMessage(null);
    setNoResultsMessage(null);
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
      e.preventDefault();
      addSkill(categoryId);
    }
  };

  return (
    <div className="space-y-6">
      {categories.map(category => (
        <div key={category.id} className="bg-white/5 rounded-lg p-5 relative">
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
          
          <div className="relative">
            <input
              type="text"
              value={inputValues[category.id] || ''}
              onChange={e => handleInputChange(category.id, e.target.value)}
              onKeyDown={e => handleKeyDown(e, category.id)}
              placeholder="Rechercher une compétence..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {isLoading && activeCategory === category.id && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                Chargement...
              </div>
            )}
            
            {/* Messages d'erreur */}
            {errorMessage && activeCategory === category.id && (
              <div className="absolute z-10 w-full bg-red-900/80 border border-red-500/50 rounded-lg mt-1 p-3 text-red-200 text-sm">
                {errorMessage}
              </div>
            )}
            
            {/* Message aucun résultat */}
            {noResultsMessage && activeCategory === category.id && (
              <div className="absolute z-10 w-full bg-gray-800 border border-white/10 rounded-lg mt-1 p-3 text-gray-400 text-sm">
                {noResultsMessage}
                <div className="mt-2 text-xs text-gray-500">
                  Suggestions : JavaScript, Python, Marketing, Communication
                </div>
              </div>
            )}
            
            {/* Liste des suggestions */}
            {suggestions.length > 0 && activeCategory === category.id && (
              <ul className="absolute z-10 w-full bg-gray-800 border border-white/10 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => addSkill(category.id, suggestion.libelle_competence)}
                    className="px-4 py-2 text-white cursor-pointer hover:bg-primary-500/20 border-b border-white/5 last:border-b-0"
                  >
                    <div className="font-medium">{suggestion.libelle_competence}</div>
                    {suggestion.code_competence && (
                      <div className="text-xs text-gray-400 mt-1">{suggestion.code_competence}</div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
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