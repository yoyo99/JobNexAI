import { useState, useEffect } from 'react'
import { useAuth } from '../../stores/auth'
import { supabase } from '../../lib/supabase'
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline'
import { HeaderPreview } from './previews/HeaderPreview'
import { ExperiencePreview } from './previews/ExperiencePreview'
import { EducationPreview } from './previews/EducationPreview'
import { SkillsPreview } from './previews/SkillsPreview'
import { ProjectsPreview } from './previews/ProjectsPreview'

interface PreviewProps {
  templateId: string
}

export function CVPreview({ templateId }: PreviewProps) {
  const { user } = useAuth()
  const [cv, setCV] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    loadCV()
  }, [templateId])

  const loadCV = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_cvs')
        .select(`
          *,
          template:cv_templates(*)
        `)
        .eq('user_id', user?.id)
        .eq('template_id', templateId)
        .single()

      if (error) throw error
      setCV(data)
    } catch (error) {
      console.error('Error loading CV:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = async () => {
    try {
      setDownloading(true)
      const response = await fetch('/api/generate-cv-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cv_id: cv.id }),
      })

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'cv.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading PDF:', error)
    } finally {
      setDownloading(false)
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

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400"></div>
      </div>
    )
  }

  return (
    <div className="w-1/2 bg-background p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-white">Aperçu</h2>
        <button
          onClick={downloadPDF}
          disabled={downloading}
          className="btn-primary flex items-center gap-2"
        >
          <DocumentArrowDownIcon className="h-5 w-5" />
          {downloading ? 'Téléchargement...' : 'Télécharger PDF'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-xl p-8 text-black">
        {cv && cv.sections ? (
          cv.sections.map((section: any, index: number) => (
            <div key={index}>
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