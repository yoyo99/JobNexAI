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
    return null;
  }

  return (
    <div className="space-y-4">
      {categories.map(category => (
        <div key={category.id} className="flex gap-x-8">
          <div className="w-1/4 text-right flex-shrink-0">
            <h4 className="text-base font-semibold text-gray-700 mt-1">{category.name}</h4>
          </div>
          <div className="w-3/4">
            <div className="flex flex-wrap gap-2">
              {category.skills.map(skill => (
                <span 
                  key={skill.id} 
                  className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-md"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
