import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

function TestDirectSupabase() {
  const [status, setStatus] = useState('Initialisation...');
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [response, setResponse] = useState<any>(null);
  
  useEffect(() => {
    // URL et clé du nouveau projet Supabase
    const correctUrl = 'https://pqubbqqzkgeosakziwnh.supabase.co';
    const correctKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxdWJicXF6a2dlb3Nha3ppd25oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NTg1ODMsImV4cCI6MjA2NjQzNDU4M30.FdOQOwVJEHdR6pnHlKmculiRV7JMWSfw_Qm4Kpt56Cg';
    
    // Tenter de lire les variables d'environnement mais utiliser les valeurs correctes en priorité
    setUrl(correctUrl);
    setKey(correctKey);
    setStatus('Utilisation de l\'URL et clé correctes pour le nouveau projet');
    
    // Log pour débogage
    console.log('[TestDirectSupabase] Using correct Supabase config:', {
      url: correctUrl,
      key: `${correctKey.substring(0, 5)}...${correctKey.substring(correctKey.length - 5)}` 
    });
  }, []);
  
  // Test simple avec fetch pour isoler le problème réseau
  const testWithFetch = async () => {
    setStatus('Test avec fetch native...');
    try {
      // Nous testons simplement si nous pouvons atteindre Supabase avec fetch sans bibliothèque
      const response = await fetch(`${url}/rest/v1/?apikey=${key}`);
      const data = await response.json();
      setResponse({
        status: response.status,
        ok: response.ok,
        data
      });
      setStatus(`Fetch réussi avec statut: ${response.status}`);
    } catch (error: any) {
      setStatus(`Erreur fetch: ${error.message}`);
      setResponse({ error: error.message });
    }
  };
  
  const testWithSupabase = async () => {
    setStatus('Test avec client Supabase...');
    try {
      const supabase = createClient(url, key);
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setStatus(`Erreur Supabase: ${error.message}`);
        setResponse({ error: error });
      } else {
        setStatus('Connexion Supabase réussie!');
        setResponse({
          session: data.session ? 'Session active' : 'Pas de session',
          data
        });
      }
    } catch (error: any) {
      setStatus(`Exception: ${error.message}`);
      setResponse({ error: error.message });
    }
  };
  
  const testPingSupabase = async () => {
    setStatus('Ping Supabase...');
    try {
      const pingUrl = url.replace('https://', 'https://ping.');
      const response = await fetch(pingUrl);
      const pingData = await response.text();
      setResponse({
        status: response.status,
        ping: pingData
      });
      setStatus(`Ping réussi: ${response.status}`);
    } catch (error: any) {
      setStatus(`Erreur ping: ${error.message}`);
      setResponse({ error: error.message });
    }
  };
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Test Direct Supabase</h1>
      
      <div style={{ marginBottom: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '5px' }}>
        <h3>Variables d'environnement</h3>
        <p><strong>URL:</strong> {url || 'Non définie'}</p>
        <p><strong>KEY:</strong> {key ? `${key.substring(0, 5)}...${key.substring(key.length - 5)}` : 'Non définie'}</p>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Status: {status}</h3>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={testWithFetch}
          style={{ padding: '10px 15px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Tester avec Fetch
        </button>
        
        <button 
          onClick={testWithSupabase}
          style={{ padding: '10px 15px', background: '#2196f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Tester avec Supabase Client
        </button>
        
        <button 
          onClick={testPingSupabase}
          style={{ padding: '10px 15px', background: '#ff9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Ping Supabase
        </button>
      </div>
      
      {response && (
        <div style={{ marginTop: '20px' }}>
          <h3>Réponse:</h3>
          <pre style={{ padding: '15px', background: '#f0f0f0', borderRadius: '5px', overflow: 'auto' }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default TestDirectSupabase;
