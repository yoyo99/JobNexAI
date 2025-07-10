import { useState, useEffect } from 'react'
import { useAuth } from '../../stores/auth'
import { supabase } from '../../lib/supabase'
import { CVTemplate } from './CVTemplate'
import { CVEditor } from './CVEditor'
import { CVPreview } from './CVPreview'

interface Template {
  id: string
  name: string
  description: string
  structure: any
  category: string
}

function CVBuilder() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [cvSections, setCvSections] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTemplates()
  }, [])

  useEffect(() => {
    if (selectedTemplate) {
      setError(null);
      loadCV(selectedTemplate);
    }
  }, [selectedTemplate]);

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('cv_templates')
        .select('*')
        .order('name')

      if (error) throw error
      setTemplates(data || [])
    } catch (error) {
      console.error('Error loading templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCV = async (templateId: string) => {
    try {
      setLoading(true)
      const { data: template, error: templateError } = await supabase
        .from('cv_templates')
        .select('structure')
        .eq('id', templateId)
        .single()

      if (templateError) throw templateError;

      console.log('--- DEBUG: Template Structure ---');
      console.log(JSON.stringify(template.structure, null, 2));
      console.log('---------------------------------');

      const { data: cv, error: cvError } = await supabase
        .from('user_cvs')
        .select('sections')
        .eq('user_id', user?.id)
        .eq('template_id', templateId)
        .single()

      // Si une erreur se produit mais qu'elle n'est pas 'aucune ligne trouvée', on la lance.
      if (cvError && cvError.code !== 'PGRST116') {
        throw cvError;
      }

      if (cv && cv.sections) {
        setCvSections(cv.sections);
      } else {
        // Pré-remplissage si aucun CV n'existe
        const newSections = template.structure.sections.map((section: any) => {
          const currentContent = section.content || {};
          if (section.type === 'header') {
            return {
              ...section,
              content: {
                ...currentContent,
                name: user?.full_name || currentContent.name || '',
                email: user?.email || currentContent.email || '',
                title: user?.title || currentContent.title || '',
                phone: user?.phone || currentContent.phone || '',
                location: user?.location || currentContent.location || '',
                linkedin: user?.linkedin || currentContent.linkedin || '',
                website: user?.website || currentContent.website || '',
              },
            };
          }
          return section;
        });
        setCvSections(newSections);
      }
    } catch (error: any) {
      console.error('Detailed Error loading CV:', error);
      setError(`Erreur de chargement : ${error.message || 'Erreur inconnue'}. Veuillez réessayer.`);
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <p className="text-red-400">{error}</p>
        <button onClick={() => { setSelectedTemplate(null); setError(null); }} className="btn-secondary mt-4">Retour</button>
      </div>
    )
  }

  if (loading && !selectedTemplate) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400"></div>
      </div>
    )
  }

  if (!selectedTemplate) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Créer votre CV</h1>
          <p className="text-gray-400 mt-1">
            Choisissez un modèle pour commencer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {templates.map((template) => (
            <CVTemplate
              key={template.id}
              template={template}
              onSelect={() => setSelectedTemplate(template.id)}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <CVEditor
        templateId={selectedTemplate!}
        onBack={() => {
          setSelectedTemplate(null);
          setCvSections(null);
        }}
        sections={cvSections || []}
        onSectionsChange={setCvSections}
      />
      <CVPreview sections={cvSections} />
    </div>
  )
}

export default CVBuilder;