import { Header } from '../../../types/cv';
import { AutocompleteInput } from '../../ui/AutocompleteInput';

interface HeaderProps {
  content: Header;
  onChange: (content: Header) => void;
}

export function HeaderSection({ content, onChange }: HeaderProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Nom complet
          </label>
          <input
            type="text"
            value={content.name}
            onChange={(e) => onChange({ ...content, name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Titre professionnel
          </label>
          <AutocompleteInput
            value={content.title}
            onChange={(selected) =>
              onChange({ ...content, title: selected.label, rome_code: selected.code })
            }
            endpoint="/api/rome-search"
            placeholder="Rechercher un métier..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Email
          </label>
          <input
            type="email"
            value={content.email}
            onChange={(e) => onChange({ ...content, email: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Téléphone
          </label>
          <input
            type="tel"
            value={content.phone}
            onChange={(e) => onChange({ ...content, phone: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Localisation
        </label>
        <input
          type="text"
          // @ts-ignore - La localisation n'est pas dans le type Header pour l'instant
          value={content.address}
          // @ts-ignore
          onChange={(e) => onChange({ ...content, address: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            LinkedIn
          </label>
          <input
            type="url"
            value={content.linkedin}
            onChange={(e) => onChange({ ...content, linkedin: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Site web
          </label>
          <input
            type="url"
            value={content.website}
            onChange={(e) => onChange({ ...content, website: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
    </div>
  )
}