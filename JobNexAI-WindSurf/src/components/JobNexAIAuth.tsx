import React from 'react';
import { useNetlifyAuth } from '../contexts/NetlifyAuthContext';

export default function JobNexAIAuth() {
  const { user, login, logout, signup, authReady } = useNetlifyAuth();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">JobNexAI</h1>
          <p className="text-gray-400">Votre assistant de carrière intelligent</p>
        </div>

        {authReady && (
          <div>
            {user ? (
              <div>
                <p className="text-white mb-4">Bienvenue, {user.user_metadata?.full_name || user.email} !</p>
                <button 
                  onClick={logout} 
                  className="w-full py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <button 
                  onClick={login} 
                  className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                >
                  Connexion
                </button>
                <button 
                  onClick={signup} 
                  className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                  S'inscrire
                </button>
              </div>
            )}
          </div>
        )}

        {!authReady && <p className="text-white">Chargement de l'authentification...</p>}

      </div>
    </div>
  );
}
