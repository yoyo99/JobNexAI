import { useState } from 'react';
import { useJobnexai } from '../hooks/useJobnexai';

export default function TestAuth() {
  const { auth, isLoggedIn, user, profile } = useJobnexai();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setResult(null);
    try {
      const loginResult = await auth.login(email, password);
      setResult(loginResult);
    } catch (error) {
      setResult({ error });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setResult(null);
    try {
      const signUpResult = await auth.register(email, password);
      setResult(signUpResult);
    } catch (error) {
      setResult({ error });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setResult(null);
    try {
      const logoutResult = await auth.logout();
      setResult(logoutResult);
    } catch (error) {
      setResult({ error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Authentification Supabase</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="font-semibold mb-2">État Actuel:</h2>
        <div className="mb-2">
          <span className="font-medium">Connecté:</span> {isLoggedIn ? '✅ Oui' : '❌ Non'}
        </div>
        {user && (
          <div className="mb-2">
            <span className="font-medium">Utilisateur:</span> {user.email}
          </div>
        )}
        {profile && (
          <div className="mb-2">
            <span className="font-medium">Profil:</span> {profile.firstName} {profile.lastName}
          </div>
        )}
      </div>

      <div className="mb-8 space-y-4">
        <div>
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block mb-1">Mot de passe:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Chargement...' : 'Connexion'}
        </button>
        <button
          onClick={handleSignUp}
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Chargement...' : 'Inscription'}
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Chargement...' : 'Déconnexion'}
        </button>
      </div>

      {result && (
        <div className="p-4 bg-gray-100 rounded-lg overflow-auto max-h-80">
          <h3 className="font-semibold mb-2">Résultat:</h3>
          <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
