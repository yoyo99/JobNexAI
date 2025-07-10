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
  return (
    <div className="my-4">
      <h3 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3 text-gray-700">Compétences</h3>
      {categories.map(category => (
        <div key={category.id} className="mb-2">
          <h4 className="text-lg font-semibold text-gray-800">{category.name}</h4>
          <div className="flex flex-wrap gap-2 mt-1">
            {category.skills.map(skill => (
              <span key={skill.id} className="bg-gray-200 text-gray-700 text-sm font-medium px-2 py-1 rounded">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
