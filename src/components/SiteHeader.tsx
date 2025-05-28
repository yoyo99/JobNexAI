import React from 'react';
import { Link } from 'react-router-dom';

const logoUrl = '/assets/Logo-JobNexAI.svg'; // Assurez-vous que ce chemin est correct

interface SiteHeaderProps {
  showAuthLinks?: boolean; // Optionnel, pour afficher/masquer les liens Connexion/Inscription
}

const SiteHeader: React.FC<SiteHeaderProps> = ({ showAuthLinks = false }) => {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8 shadow-md bg-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={logoUrl} alt="JobNexAI Logo" className="h-10 w-auto mr-3" />
          <span className="text-2xl font-bold text-primary-400">JobNexAI</span>
        </Link>
        {showAuthLinks && (
          <nav>
            <Link
              to="/login"
              className="text-gray-300 hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium"
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              className="ml-4 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow-lg transition duration-150 ease-in-out"
            >
              S'inscrire gratuitement
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default SiteHeader;
