import React, { useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// URL et clé codées en dur du nouveau projet Supabase
const SUPABASE_URL = 'https://pqubbqqzkgeosakziwnh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxdWJicXF6a2dlb3Nha3ppd25oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NTg1ODMsImV4cCI6MjA2NjQzNDU4M30.FdOQOwVJEHdR6pnHlKmculiRV7JMWSfw_Qm4Kpt56Cg';

function AuthTest() {
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  // Création du client Supabase avec les valeurs codées en dur
  const getSupabase = (): SupabaseClient => {
    return createClient(SUPABASE_URL, SUPABASE_KEY);
  };
  
  // Test simple - vérifier si l'API d'authentification répond
  const testAuthAPI = async () => {
    setStatus('Test de l\'API d\'authentification...');
    setError(null);
    setResult(null);
    
    try {
      const supabase = getSupabase();
      const response = await fetch(`${SUPABASE_URL}/auth/v1/`, {
        headers: {
          'apikey': SUPABASE_KEY,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      
      setStatus('API d\'authentification accessible!');
      setResult({ success: true, statusCode: response.status });
    } catch (err) {
      console.error('Erreur lors du test de l\'API:', err);
      setError(err instanceof Error ? err.message : String(err));
      setStatus('Échec du test API');
    }
  };
  
  // Test d'inscription (sans réellement créer un utilisateur)
  const testSignupFlow = async () => {
    setStatus('Test du flux d\'inscription...');
    setError(null);
    setResult(null);
    
    try {
      const supabase = getSupabase();
      
      // On ne crée pas réellement d'utilisateur mais on vérifie que l'API répond correctement
      const { error } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'password_invalid',
        options: {
          // Utiliser captchaToken empêche la création réelle du compte
          captchaToken: 'fake-token'
        }
      });
      
      // Cette erreur est normale et attendue (captcha invalide)
      if (error && error.message.includes('captcha')) {
        setStatus('Flux d\'inscription fonctionnel! (Erreur captcha attendue)');
        setResult({ 
          success: true, 
          note: 'Le flux d\'inscription fonctionne car nous avons reçu l\'erreur captcha attendue.' 
        });
      } else if (error) {
        setStatus('Erreur inattendue dans le flux d\'inscription');
        setError(error.message);
      } else {
        setStatus('Pas d\'erreur reçue, ce qui est inattendu dans ce test');
      }
    } catch (err) {
      console.error('Erreur lors du test d\'inscription:', err);
      setError(err instanceof Error ? err.message : String(err));
      setStatus('Échec du test d\'inscription');
    }
  };
  
  // Test de connexion réelle
  const testLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email et mot de passe sont requis');
      return;
    }
    
    setStatus('Tentative de connexion...');
    setError(null);
    setResult(null);
    
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      setStatus('Connexion réussie!');
      setResult({
        user: {
          id: data.user?.id,
          email: data.user?.email,
          role: data.user?.role,
        },
        session: {
          expires_at: data.session?.expires_at,
          token_type: data.session?.token_type,
        }
      });
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError(err instanceof Error ? err.message : String(err));
      setStatus('Échec de la connexion');
    }
  };
  
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Test d'Authentification Supabase</h1>
      
      <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
        <h3>Configuration utilisée :</h3>
        <div><strong>URL:</strong> {SUPABASE_URL}</div>
        <div><strong>Clé:</strong> {SUPABASE_KEY.substring(0, 5)}...{SUPABASE_KEY.substring(SUPABASE_KEY.length - 5)}</div>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ 
          padding: '0.5rem 1rem', 
          background: status ? (status.includes('réussie') || status.includes('fonctionnel') ? '#d4edda' : status.includes('Échec') || status.includes('Erreur') ? '#f8d7da' : '#fff3cd') : '#f8f9fa',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          <strong>Status:</strong> {status || 'En attente de test'}
        </div>
        
        {error && (
          <div style={{ 
            padding: '0.5rem 1rem', 
            background: '#f8d7da',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <strong>Erreur:</strong> {error}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button 
            onClick={testAuthAPI}
            style={{ 
              padding: '0.5rem 1rem', 
              background: '#0275d8', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Tester l'API Auth
          </button>
          
          <button 
            onClick={testSignupFlow}
            style={{ 
              padding: '0.5rem 1rem', 
              background: '#5cb85c', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Tester le Flux d'Inscription
          </button>
        </div>
        
        <form onSubmit={testLogin} style={{ 
          background: '#f8f9fa',
          padding: '1rem',
          borderRadius: '4px',
          marginTop: '2rem'
        }}>
          <h3>Tester une Connexion Réelle</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email:</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Mot de passe:</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
          
          <button 
            type="submit"
            style={{ 
              padding: '0.5rem 1rem', 
              background: '#d9534f', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Tester Connexion
          </button>
        </form>
      </div>
      
      {result && (
        <div>
          <h3>Résultat :</h3>
          <pre style={{ 
            background: '#f8f9fa', 
            padding: '1rem', 
            borderRadius: '4px', 
            overflow: 'auto',
            maxHeight: '300px'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default AuthTest;
