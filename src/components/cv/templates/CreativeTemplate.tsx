import React from 'react';
import { CVData } from '@/types/cv';
import { HeaderPreview } from '../previews/HeaderPreview';
import { ExperiencePreview } from '../previews/ExperiencePreview';
import { EducationPreview } from '../previews/EducationPreview';
import { SkillsPreview } from '../previews/SkillsPreview';
import { ProjectsPreview } from '../previews/ProjectsPreview';
import { SectionTitle } from '../previews/SectionTitle';
import { FaPalette, FaHeart } from 'react-icons/fa';

interface CreativeTemplateProps {
  cv: CVData;
}

export const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ cv }) => {
  const accentColor = 'text-teal-400';
  const bgColor = 'bg-gray-900';
  const textColor = 'text-white';

  return (
    <div className={`${bgColor} ${textColor} p-8 font-sans shadow-2xl flex gap-8`}>
      {/* Sidebar */}
      <div className="flex-shrink-0 w-1/3 bg-gray-800/50 p-6 rounded-lg">
        <HeaderPreview content={cv.header} layout="creative" />

        {cv.skills.categories.length > 0 && (
          <div className="mt-8">
            <SectionTitle icon={<FaPalette className={`${accentColor} mr-2`} />}>Compétences</SectionTitle>
            <SkillsPreview categories={cv.skills.categories} layout="creative" />
          </div>
        )}

        {/* You can add a 'Passions' or 'Interests' section here if it exists in your CVData */}
      </div>

      {/* Main Content */}
      <div className="flex-grow w-2/3">
        {cv.experience.items.length > 0 && (
          <div>
            <SectionTitle>Expériences</SectionTitle>
            <ExperiencePreview items={cv.experience.items} layout="creative" />
          </div>
        )}

        {cv.projects.items.length > 0 && (
          <div className="mt-8">
            <SectionTitle>Projets Notables</SectionTitle>
            <ProjectsPreview items={cv.projects.items} />
          </div>
        )}

        {cv.education.items.length > 0 && (
          <div className="mt-8">
            <SectionTitle>Formation</SectionTitle>
            <EducationPreview items={cv.education.items} />
          </div>
        )}
      </div>
    </div>
  );
};
