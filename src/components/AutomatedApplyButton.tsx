import React, { useState } from 'react';

/**
 * Bouton d'automatisation de candidature (MVP).
 * Simule une candidature automatique et affiche un état de progression.
 * TODO: Brancher sur une vraie API d'automatisation ou workflow backend.
 */

interface AutomatedApplyButtonProps {
  jobId: string;
  disabled?: boolean;
}

const AutomatedApplyButton: React.FC<AutomatedApplyButtonProps> = ({ jobId, disabled }) => {
  const [isApplying, setIsApplying] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAutomatedApply = async () => {
    setIsApplying(true);
    setSuccess(false);
    // Simulation (à remplacer par appel API réelle)
    await new Promise((res) => setTimeout(res, 1500));
    setIsApplying(false);
    setSuccess(true);
  };

  return (
    <div className="my-2">
      <button
        className="btn-primary"
        onClick={handleAutomatedApply}
        disabled={isApplying || disabled}
      >
        {isApplying ? 'Candidature en cours...' : success ? 'Candidature envoyée !' : 'Candidater automatiquement'}
      </button>
    </div>
  );
};

export default AutomatedApplyButton;
