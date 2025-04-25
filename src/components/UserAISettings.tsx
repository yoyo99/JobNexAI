import React, { useState, useEffect } from 'react';

/**
 * Sélecteur de moteur IA préféré + gestion des clés API utilisateur.
 * Options : OpenAI (défaut), Gemini, Claude, Cohere, HuggingFace, Mistral, IA interne.
 * Les clés API sont stockées côté Supabase si connecté, sinon localStorage.
 */

const IA_ENGINES = [
  { id: 'openai', label: 'OpenAI (GPT-3.5/4)', placeholder: 'sk-...' },
  { id: 'gemini', label: 'Google Gemini', placeholder: 'API Key Gemini' },
  { id: 'claude', label: 'Anthropic Claude', placeholder: 'sk-ant-' },
  { id: 'cohere', label: 'Cohere', placeholder: 'API Key Cohere' },
  { id: 'huggingface', label: 'HuggingFace', placeholder: 'hf_' },
  { id: 'mistral', label: 'Mistral AI', placeholder: 'API Key Mistral' },
  { id: 'custom', label: 'IA interne/maison', placeholder: 'Token interne' },
];

interface UserAISettingsProps {
  userId?: string;
  defaultEngine?: string;
  defaultApiKeys?: Record<string, string>;
  onChange?: (engine: string, apiKeys: Record<string, string>) => void;
}

const UserAISettings: React.FC<UserAISettingsProps> = ({ userId, defaultEngine = 'openai', defaultApiKeys = {}, onChange }) => {
  const [selectedEngine, setSelectedEngine] = useState(defaultEngine);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>(defaultApiKeys);

  // Effet pour charger/sauver les préférences (MVP: localStorage, TODO: Supabase)
  useEffect(() => {
    const saved = localStorage.getItem('user_ai_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSelectedEngine(parsed.engine || defaultEngine);
      setApiKeys(parsed.apiKeys || {});
    }
  }, [defaultEngine]);

  useEffect(() => {
    localStorage.setItem('user_ai_settings', JSON.stringify({ engine: selectedEngine, apiKeys }));
    if (onChange) onChange(selectedEngine, apiKeys);
  }, [selectedEngine, apiKeys, onChange]);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-400 mb-1">Moteur IA préféré</label>
      <select
        value={selectedEngine}
        onChange={e => setSelectedEngine(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {IA_ENGINES.map(engine => (
          <option key={engine.id} value={engine.id}>{engine.label}</option>
        ))}
      </select>
      <label className="block text-sm font-medium text-gray-400 mb-1 mt-4">Clé API pour {IA_ENGINES.find(e => e.id === selectedEngine)?.label}</label>
      <input
        type="text"
        value={apiKeys[selectedEngine] || ''}
        onChange={e => setApiKeys({ ...apiKeys, [selectedEngine]: e.target.value })}
        placeholder={IA_ENGINES.find(e => e.id === selectedEngine)?.placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        autoComplete="off"
      />
      <p className="text-xs text-gray-400 mt-2">
        La clé API n’est jamais partagée ni utilisée sans ton accord. Elle est requise pour accéder à certains moteurs IA. Par défaut, OpenAI est utilisé si aucune clé n’est fournie.
      </p>
    </div>
  );
};

export default UserAISettings;
