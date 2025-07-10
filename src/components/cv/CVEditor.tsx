import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../stores/auth'
import { supabase } from '../../lib/supabase'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { HeaderSection } from './sections/HeaderSection'
import { ExperienceSection } from './sections/ExperienceSection'
import { EducationSection } from './sections/EducationSection'
import { SkillsSection } from './sections/SkillsSection'
import { ProjectsSection } from './sections/ProjectsSection'

interface EditorProps {
  templateId: string;
  onBack: () => void;
  sections: any[];
  onSectionsChange: (sections: any[]) => void;
}

export function CVEditor({ templateId, onBack, sections, onSectionsChange }: EditorProps) {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const saveCV = async () => {
    try {
      setSaving(true)
      setMessage(null)

      const { error } = await supabase
        .from('user_cvs')
        .upsert({
          user_id: user?.id,
          template_id: templateId,
          data: sections, // Utiliser la colonne 'data'
        })

      if (error) throw error
      setMessage({ type: 'success', text: 'CV enregistré avec succès' })
    } catch (error) {
      console.error('Error saving CV:', error)
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du CV' })
    } finally {
      setSaving(false)
    }
  }

  const updateSection = (index: number, content: any) => {
    const newSections = sections.map((section, i) =>
      i === index ? { ...section, content } : section
    );
    onSectionsChange(newSections);
  }

  const renderSectionEditor = (section: any, index: number) => {
    switch (section.type) {
      case 'header':
        return (
          <HeaderSection
            content={section.content}
            onChange={(content) => updateSection(index, content)}
          />
        )
      case 'experience':
        return (
          <ExperienceSection
            items={section.content.items || []}
            onChange={(items) => updateSection(index, { ...section.content, items })}
          />
        )
      case 'education':
        return (
          <EducationSection
            items={section.content.items || []}
            onChange={(items) => updateSection(index, { ...section.content, items })}
          />
        )
      case 'skills':
        return (
          <SkillsSection
            categories={section.content.categories || []}
            onChange={(categories) => updateSection(index, { ...section.content, categories })}
          />
        )
      case 'projects':
        return (
          <ProjectsSection
            items={section.content.items || []}
            onChange={(items) => updateSection(index, { ...section.content, items })}
          />
        )
      default:
        return (
          <div className="text-gray-400">
            Éditeur non disponible pour cette section
          </div>
        )
    }
  }



  return (
    <div className="w-1/2 bg-background border-r border-white/10 p-6 overflow-y-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-medium text-white">Éditer votre CV</h2>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <h3 className="text-white font-medium mb-4">{section.title}</h3>
            {renderSectionEditor(section, index)}
          </motion.div>
        ))}
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 rounded-lg p-4 ${
            message.type === 'success'
              ? 'bg-green-900/50 text-green-400'
              : 'bg-red-900/50 text-red-400'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={saveCV}
          disabled={saving}
          className="btn-primary"
        >
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  )
}