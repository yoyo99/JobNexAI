import React, { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

interface Suggestion {
  code: string;
  label: string;
}

interface AutocompleteInputProps {
  value: string;
  onChange: (value: { label: string; code: string }) => void;
  endpoint: string;
  placeholder?: string;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ value, onChange, endpoint, placeholder }) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedSearchTerm = useDebounce(inputValue, 300);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
            let fullUrl = `${endpoint}?q=${encodeURIComponent(query)}`;
      if (import.meta.env.DEV) {
        // En développement, force l'URL absolue pour éviter les problèmes de résolution
        fullUrl = `http://localhost:8888${endpoint}?q=${encodeURIComponent(query)}`;
      }
      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: Suggestion[] = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchSuggestions(debouncedSearchTerm);
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchTerm, fetchSuggestions]);

  const handleSelect = (suggestion: Suggestion) => {
    setInputValue(suggestion.label);
    onChange({ label: suggestion.label, code: suggestion.code });
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setShowSuggestions(true);
        }}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      {showSuggestions && (inputValue.length > 0) && (
        <ul className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-lg mt-1 max-h-60 overflow-y-auto">
          {isLoading ? (
            <li className="px-4 py-2 text-gray-400">Recherche...</li>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <li
                key={suggestion.code}
                onMouseDown={() => handleSelect(suggestion)} // use onMouseDown to fire before onBlur
                className="px-4 py-2 text-white hover:bg-primary-500 cursor-pointer"
              >
                {suggestion.label}
              </li>
            ))
          ) : (
            debouncedSearchTerm.length > 1 && <li className="px-4 py-2 text-gray-400">Aucun résultat</li>
          )}
        </ul>
      )}
    </div>
  );
};
