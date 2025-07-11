import React from 'react';
import { CVData } from '@/types/cv';
import { HeaderPreview } from '../previews/HeaderPreview';
import { ExperiencePreview } from '../previews/ExperiencePreview';
import { EducationPreview } from '../previews/EducationPreview';
import { SkillsPreview } from '../previews/SkillsPreview';
import { ProjectsPreview } from '../previews/ProjectsPreview';
import { ServicesPreview } from '../previews/ServicesPreview';
import { TestimonialsPreview } from '../previews/TestimonialsPreview';
import { SectionTitle } from '../previews/SectionTitle';

interface FreelanceTemplateProps {
  cv: CVData;
}

export const FreelanceTemplate: React.FC<FreelanceTemplateProps> = ({ cv }) => {
  if (!cv) return null;

  return (
    <div className="bg-white text-gray-800 p-8 font-serif shadow-lg">
      {cv.header && <HeaderPreview content={cv.header} layout="freelance" />}
      
      <div className="flex gap-8 mt-8">
        {/* Main column */}
        <div className="flex-grow w-2/3">
          {cv.services && cv.services.items && cv.services.items.length > 0 && (
            <div>
              <SectionTitle>Services Proposés</SectionTitle>
              <ServicesPreview items={cv.services.items} />
            </div>
          )}

          {cv.projects && cv.projects.items && cv.projects.items.length > 0 && (
            <div className="mt-6">
              <SectionTitle>Projets Réalisés</SectionTitle>
              <ProjectsPreview items={cv.projects.items} />
            </div>
          )}

          {cv.testimonials && cv.testimonials.items && cv.testimonials.items.length > 0 && (
            <div className="mt-6">
              <SectionTitle>Témoignages Clients</SectionTitle>
              <TestimonialsPreview items={cv.testimonials.items} />
            </div>
          )}

          {cv.experience && cv.experience.items && cv.experience.items.length > 0 && (
            <div className="mt-6">
              <SectionTitle>Expérience</SectionTitle>
              <ExperiencePreview items={cv.experience.items} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex-shrink-0 w-1/3">
          {cv.skills && cv.skills.categories && cv.skills.categories.length > 0 && (
            <div>
              <SectionTitle>Compétences</SectionTitle>
              <SkillsPreview categories={cv.skills.categories} layout="freelance" />
            </div>
          )}

          {cv.education && cv.education.items && cv.education.items.length > 0 && (
            <div className="mt-6">
              <SectionTitle>Formation</SectionTitle>
              <EducationPreview items={cv.education.items} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
