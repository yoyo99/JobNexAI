import React, { useState, useEffect } from 'react';

interface LoadingFallbackProps {
  message?: string;
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({ message = 'Chargement de la page...' }) => {
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    // Après 10 secondes, considérer que le chargement est bloqué
    const timer = setTimeout(() => {
      setIsStuck(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[200px] bg-background">
      <div className="w-12 h-12 mb-4 rounded-full border-4 border-white/10 border-t-primary-600 animate-spin"></div>
      <div className="text-white font-medium">{message}</div>
      
      {isStuck && (
        <div className="mt-6 text-secondary-300">
          <p>Le chargement semble prendre plus de temps que prévu.</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary mt-4"
          >
            Recharger la page
          </button>
        </div>
      )}
    </div>
  );
};
