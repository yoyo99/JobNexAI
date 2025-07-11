import React, { useRef, useState } from 'react';
import { useAuth } from '../../stores/auth'
import { supabase } from '../../lib/supabase'
import { Download, Languages, ArrowLeft } from 'lucide-react';
import { translateTextsBatch } from '../../lib/ai';
import toast from 'react-hot-toast';
import { HeaderPreview } from './previews/HeaderPreview'
import { ExperiencePreview } from './previews/ExperiencePreview'
import { EducationPreview } from './previews/EducationPreview'
import { SkillsPreview } from './previews/SkillsPreview'
import { ProjectsPreview } from './previews/ProjectsPreview';
import { ServicesPreview } from './previews/ServicesPreview';
import { TestimonialsPreview } from './previews/TestimonialsPreview';
import { SectionTitle } from './previews/SectionTitle';

const LANGUAGES = {
  en: 'Anglais',
  es: 'Espagnol',
  de: 'Allemand',
  it: 'Italien',
};

interface CVPreviewProps {
  sections: any[] | null;
  cvId: string | null; // Gardé pour une utilisation future potentielle
  cvName: string;
}

export const CVPreview: React.FC<CVPreviewProps> = ({ sections, cvName }) => {
  const cvPreviewRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [translatedCv, setTranslatedCv] = useState<any | null>(null);
  const [originalCv, setOriginalCv] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const translateCvData = async (data: any, lang: string): Promise<any> => {
    const textsToTranslate: string[] = [];
    const nonTranslatableKeys = ['id', 'url', 'current', 'startDate', 'endDate', 'type', 'level', 'rating', 'icon'];

    // Étape 1: Collecter tous les textes à traduire
    const collectTexts = (obj: any) => {
      if (!obj) return;

      if (Array.isArray(obj)) {
        obj.forEach(collectTexts);
        return;
      }

      if (typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
          if (nonTranslatableKeys.includes(key)) return;

          const value = obj[key];
          if (typeof value === 'string' && value.trim() && !value.startsWith('http') && !/\d{4}-\d{2}/.test(value)) {
            textsToTranslate.push(value);
          } else {
            collectTexts(value);
          }
        });
      }
    };

    collectTexts(data);

    if (textsToTranslate.length === 0) {
      return data; // Rien à traduire
    }

    // Étape 2: Traduire tous les textes en un seul appel
    const translatedTexts = await translateTextsBatch(textsToTranslate, lang);
    let translatedTextIndex = 0;

    // Étape 3: Restaurer les textes traduits dans une nouvelle structure de données
    const restoreTexts = (obj: any): any => {
      if (!obj) return obj;

      if (Array.isArray(obj)) {
        return obj.map(restoreTexts);
      }

      if (typeof obj === 'object') {
        const newObj = { ...obj };
        Object.keys(newObj).forEach(key => {
          if (nonTranslatableKeys.includes(key)) return;

          const value = newObj[key];
          if (typeof value === 'string' && value.trim() && !value.startsWith('http') && !/\d{4}-\d{2}/.test(value)) {
            if (translatedTextIndex < translatedTexts.length) {
              newObj[key] = translatedTexts[translatedTextIndex++];
            }
          } else {
            newObj[key] = restoreTexts(value);
          }
        });
        return newObj;
      }

      return obj;
    };

    return restoreTexts(data);
  };

  const handleTranslate = async () => {
    if (!targetLanguage) {
      toast.error('Veuillez sélectionner une langue de destination.');
      return;
    }

    if (!sections) return;
    setIsTranslating(true);
    setOriginalCv(sections);
    const translationPromise = translateCvData(sections, targetLanguage);

    toast.promise(translationPromise, {
      loading: `Traduction en ${LANGUAGES[targetLanguage]}...`,
      success: (translated) => {
        setTranslatedCv(translated);
        setIsTranslating(false);
        return 'CV traduit avec succès !';
      },
      error: (err) => {
        setIsTranslating(false);
        setTranslatedCv(null); // Revenir à l'original en cas d'erreur
        return `Erreur de traduction: ${err.message || 'Une erreur est survenue.'}`;
      },
    });
  };

  const handleBackToOriginal = () => {
    setTranslatedCv(null);
    setOriginalCv(null);
  };

  const downloadPDF = async () => {
    if (!cvPreviewRef.current) {
      console.error('CV preview element not found');
      return;
    }

    setIsLoading(true);

    try {
      const htmlContent = cvPreviewRef.current.outerHTML;

      const displayCv = translatedCv || sections;

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
    const { type, content } = section;
    switch (type) {
      case 'header':
        return <HeaderPreview content={content} />;
      case 'experience':
        return <ExperiencePreview items={content.items} />;
      case 'education':
        return <EducationPreview items={content.items} />;
      case 'skills':
        return <SkillsPreview categories={content.categories} />;
      case 'projects':
        return <ProjectsPreview items={content.items} />;
      case 'services':
        return <ServicesPreview items={content.items} />;
      case 'testimonials':
        return <TestimonialsPreview items={content.items} />;
      default:
        return <div className="text-gray-400 text-sm">Aperçu non disponible pour la section "{section.title}".</div>;
    }
  };

  return (
    <div className="w-1/2 bg-background p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          {cvName}{translatedCv ? ` (Traduit en ${LANGUAGES[targetLanguage]})` : ''}
        </h2>
        <div className="flex items-center gap-4">
          {translatedCv ? (
            <button
              onClick={handleBackToOriginal}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'original
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <select 
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 h-full"
              >
                {Object.entries(LANGUAGES).map(([code, name]) => (
                  <option key={code} value={code} className="bg-gray-800 text-white">{name}</option>
                ))}
              </select>
              <button
                onClick={handleTranslate}
                disabled={isTranslating}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center disabled:opacity-50 h-full"
              >
                {isTranslating ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <Languages className="mr-2 h-4 w-4" />
                )}
                Traduire
              </button>
            </div>
          )}
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
      </div>

      <div ref={cvPreviewRef} className="p-12 bg-white rounded-lg shadow-2xl w-full max-w-4xl mx-auto my-8 font-sans">
        {(translatedCv || sections) ? (
          (translatedCv || sections).map((section: any, index: number) => {
            if (section.type === 'header') {
              return <HeaderPreview key={index} content={section.content} />;
            }
            return (
              <section key={index}>
                {section.title && <SectionTitle>{section.title}</SectionTitle>}
                {renderSectionPreview(section)}
              </section>
            );
          })
        ) : (
          <p className="text-center text-gray-500 py-20">Aucun contenu de CV à afficher.</p>
        )}
      </div>
    </div>
  )
}