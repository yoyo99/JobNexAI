import React from 'react';

interface Skill {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  skills: Skill[];
}

interface SkillsPreviewProps {
  categories: Category[];
}

export const SkillsPreview: React.FC<SkillsPreviewProps> = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return null; // Ne rien afficher si pas de compétences
  }

  return (
    <div className="space-y-4">
      {categories.map(category => (
        <div key={category.id}>
          <h4 className="text-md font-semibold text-gray-700 mb-2">{category.name}</h4>
          <div className="flex flex-wrap gap-2">
            {category.skills.map(skill => (
              <span 
                key={skill.id} 
                className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
