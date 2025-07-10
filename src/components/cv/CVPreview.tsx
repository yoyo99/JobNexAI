import React, { useRef, useState } from 'react';
import { useAuth } from '../../stores/auth'
import { supabase } from '../../lib/supabase'
import { Download } from 'lucide-react';
import { HeaderPreview } from './previews/HeaderPreview'
import { ExperiencePreview } from './previews/ExperiencePreview'
import { EducationPreview } from './previews/EducationPreview'
import { SkillsPreview } from './previews/SkillsPreview'
import { ProjectsPreview } from './previews/ProjectsPreview';
import { SectionTitle } from './previews/SectionTitle';

interface CVPreviewProps {
  sections: any[] | null;
  cvId: string | null; // Gardé pour une utilisation future potentielle
}

export const CVPreview: React.FC<CVPreviewProps> = ({ sections }) => {
  const cvPreviewRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const downloadPDF = async () => {
    if (!cvPreviewRef.current) {
      console.error('CV preview element not found');
      return;
    }

    setIsLoading(true);

    try {
      const htmlContent = cvPreviewRef.current.outerHTML;

      const response = await fetch('/api/generate-cv-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ htmlContent }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'cv.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading PDF:', error);
      // You can add a user-facing error message here
    } finally {
      setIsLoading(false);
    }
  }

  const renderSectionPreview = (section: any) => {
    switch (section.type) {
      case 'header':
        return <HeaderPreview content={section.content} />
      case 'experience':
        return <ExperiencePreview items={section.content.items || []} />
      case 'education':
        return <EducationPreview items={section.content.items || []} />
      case 'skills':
        return <SkillsPreview categories={section.content.categories || []} />
      case 'projects':
        return <ProjectsPreview items={section.content.items || []} />
      default:
        return <div className="text-gray-400 text-sm">Aperçu non disponible pour la section "{section.title}".</div>
    }
  }

  return (
    <div className="w-1/2 bg-background p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-white">Aperçu</h2>
        <button 
          onClick={downloadPDF}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2 disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Génération en cours...
            </>
          ) : (
            <>
              <Download size={18} />
              Télécharger en PDF
            </>
          )}
        </button>
      </div>

      <div ref={cvPreviewRef} className="p-8 bg-white rounded-lg shadow-lg w-full max-w-4xl mx-auto my-8">
        {sections ? (
          sections.map((section: any, index: number) => (
            <div key={index} className={section.type !== 'header' ? 'mb-6' : ''}>
              {section.type !== 'header' && section.title && <SectionTitle>{section.title}</SectionTitle>}
              {renderSectionPreview(section)}
            </div>
          ))
        ) : (
          <p className="text-gray-500">Aucun contenu de CV à afficher.</p>
        )}
      </div>
    </div>
  )
}