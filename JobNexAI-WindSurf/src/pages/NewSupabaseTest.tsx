import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Valeurs codées en dur du nouveau projet Supabase
const CORRECT_URL = 'https://pqubbqqzkgeosakziwnh.supabase.co';
const CORRECT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxdWJicXF6a2dlb3Nha3ppd25oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NTg1ODMsImV4cCI6MjA2NjQzNDU4M30.FdOQOwVJEHdR6pnHlKmculiRV7JMWSfw_Qm4Kpt56Cg';

function NewSupabaseTest() {
  const [status, setStatus] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  
  // Test avec le client Supabase
  const testSupabase = async () => {
    setStatus('Test en cours...');
    try {
      const supabase = createClient(CORRECT_URL, CORRECT_KEY);
      
      // Test simple - récupération de la version
      const { data, error } = await supabase.from('_generated_migration_meta').select('*').limit(1);
      
      if (error) {
        console.error('Erreur Supabase:', error);
        setStatus(`Erreur: ${error.message}`);
        setResult({ error });
      } else {
        setStatus('Connexion réussie!');
        setResult({ data });
      }
    } catch (error) {
      console.error('Exception:', error);
      setStatus(`Exception: ${error instanceof Error ? error.message : String(error)}`);
      setResult({ error });
    }
  };
  
  // Test avec fetch brut
  const testFetch = async () => {
    setStatus('Test fetch en cours...');
    try {
      const response = await fetch(`${CORRECT_URL}/rest/v1/profiles?select=*&limit=1`, {
        headers: {
          'apikey': CORRECT_KEY,
          'Authorization': `Bearer ${CORRECT_KEY}`
        }
      });
      
      if (!response.ok) {
        setStatus(`Erreur HTTP: ${response.status}`);
        setResult({ error: { status: response.status, statusText: response.statusText } });
        return;
      }
      
      const data = await response.json();
      setStatus('Fetch réussi!');
      setResult({ data });
    } catch (error) {
      setStatus(`Erreur fetch: ${error instanceof Error ? error.message : String(error)}`);
      setResult({ error });
    }
  };
  
  // Simple ping pour vérifier que le domaine répond
  const pingSupabase = async () => {
    setStatus('Ping en cours...');
    try {
      const startTime = performance.now();
      const response = await fetch(`${CORRECT_URL}/ping`);
      const endTime = performance.now();
      const pingTime = endTime - startTime;
      
      if (!response.ok) {
        setStatus(`Ping échoué: ${response.status}`);
        setResult({ error: { status: response.status, statusText: response.statusText } });
        return;
      }
      
      const data = await response.text();
      setStatus(`Ping réussi! Temps: ${pingTime.toFixed(2)}ms`);
      setResult({ data });
    } catch (error) {
      setStatus(`Erreur ping: ${error instanceof Error ? error.message : String(error)}`);
      setResult({ error });
    }
  };
  
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Test Supabase (Nouvelle Instance)</h1>
      
      <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
        <h3>Configuration utilisée :</h3>
        <div><strong>URL:</strong> {CORRECT_URL}</div>
        <div><strong>Clé:</strong> {CORRECT_KEY.substring(0, 5)}...{CORRECT_KEY.substring(CORRECT_KEY.length - 5)}</div>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ 
          padding: '0.5rem 1rem', 
          background: status ? (status.includes('réussi') ? '#d4edda' : status.includes('Erreur') ? '#f8d7da' : '#fff3cd') : '#f8f9fa',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          <strong>Status:</strong> {status || 'En attente de test'}
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button 
            onClick={testSupabase}
            style={{ 
              padding: '0.5rem 1rem', 
              background: '#0275d8', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Test avec Client Supabase
          </button>
          
          <button 
            onClick={testFetch}
            style={{ 
              padding: '0.5rem 1rem', 
              background: '#5cb85c', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Test avec Fetch
          </button>
          
          <button 
            onClick={pingSupabase}
            style={{ 
              padding: '0.5rem 1rem', 
              background: '#f0ad4e', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Ping Supabase
          </button>
        </div>
      </div>
      
      <div>
        <h3>Résultat :</h3>
        <pre style={{ 
          background: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '4px', 
          overflow: 'auto',
          maxHeight: '300px'
        }}>
          {result ? JSON.stringify(result, null, 2) : 'Aucun résultat pour le moment'}
        </pre>
      </div>
    </div>
  );
}

export default NewSupabaseTest;
