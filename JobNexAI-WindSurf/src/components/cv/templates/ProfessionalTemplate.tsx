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

interface ProfessionalTemplateProps {
  cv: CVData;
}

export const ProfessionalTemplate: React.FC<ProfessionalTemplateProps> = ({ cv }) => {
  if (!cv) return null;

  return (
    <div className="bg-white text-gray-800 p-8 font-sans shadow-lg">
      {cv.header && <HeaderPreview content={cv.header} />}

      {cv.experience && cv.experience.items && cv.experience.items.length > 0 && (
        <div className="mt-6">
          <SectionTitle>Expérience Professionnelle</SectionTitle>
          <ExperiencePreview items={cv.experience.items} />
        </div>
      )}

      {cv.education && cv.education.items && cv.education.items.length > 0 && (
        <div className="mt-6">
          <SectionTitle>Formation</SectionTitle>
          <EducationPreview items={cv.education.items} />
        </div>
      )}

      {cv.skills && cv.skills.categories && cv.skills.categories.length > 0 && (
        <div className="mt-6">
          <SectionTitle>Compétences</SectionTitle>
          <SkillsPreview categories={cv.skills.categories} />
        </div>
      )}

      {cv.projects && cv.projects.items && cv.projects.items.length > 0 && (
        <div className="mt-6">
          <SectionTitle>Projets</SectionTitle>
          <ProjectsPreview items={cv.projects.items} />
        </div>
      )}

      {cv.services && cv.services.items && cv.services.items.length > 0 && (
        <div className="mt-6">
          <SectionTitle>Services</SectionTitle>
          <ServicesPreview items={cv.services.items} />
        </div>
      )}

      {cv.testimonials && cv.testimonials.items && cv.testimonials.items.length > 0 && (
        <div className="mt-6">
          <SectionTitle>Témoignages</SectionTitle>
          <TestimonialsPreview items={cv.testimonials.items} />
        </div>
      )}
    </div>
  );
};
