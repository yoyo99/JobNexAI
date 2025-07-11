import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

interface Suggestion {
  code: string;
  label: string;
}

interface AutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (suggestion: Suggestion) => void;
  apiEndpoint?: string; // Rendre l'endpoint configurable
}

export function Autocomplete({ value, onChange, onSelect, apiEndpoint = '/api/rome-search' }: AutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(value, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiEndpoint}?q=${encodeURIComponent(debouncedSearchTerm)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
          setIsOpen(true);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des suggestions ROME:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchTerm]);

  const handleSelect = (suggestion: Suggestion) => {
    onChange(suggestion.label);
    onSelect(suggestion);
    setIsOpen(false);
    setSuggestions([]);
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Rechercher un intitulé de poste..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" size={20} />
        )}
      </div>
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.code}
              onClick={() => handleSelect(suggestion)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};