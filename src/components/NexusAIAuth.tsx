import React, { useState } from 'react';
import jobnexaiLogo from '../../public/jobnexai-logo.svg';

export default function JobNexAIAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Fonctionnalité de démo. À connecter à votre backend.');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src={jobnexaiLogo} alt="JobNexAI Logo" className="h-14 w-14 mb-2" />
          <h1 className="text-2xl font-bold text-indigo-700">JobNexAI</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-xl font-semibold text-center mb-2">{isLogin ? 'Connexion' : 'Créer un compte'}</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-2 top-2 text-indigo-400"
              tabIndex={-1}
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-7-10-7s2.614-4.134 6.875-6.825M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.125 3.825A10.05 10.05 0 0022 12s-2.614-4.134-6.875-6.825" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.25 2.25l3.75 3.75m0 0l-3.75-3.75m0 0A10.05 10.05 0 0112 19c-5.523 0-10-7-10-7s2.614-4.134 6.875-6.825" /></svg>
              )}
            </button>
          </div>
          {message && <div className="text-center text-sm text-indigo-600">{message}</div>}
          <button type="submit" className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">{isLogin ? 'Connexion' : 'Créer un compte'}</button>
        </form>
        <div className="mt-4 text-center">
          <button
            className="text-indigo-500 hover:underline text-sm"
            onClick={() => setIsLogin(v => !v)}
          >
            {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà inscrit ? Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
}
