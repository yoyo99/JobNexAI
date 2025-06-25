import React, { useEffect, useState } from 'react';

export default function CheckEnv() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // Capturer toutes les variables d'environnement VITE_*
    const vars: Record<string, string> = {};
    Object.keys(import.meta.env).forEach(key => {
      if (key.startsWith('VITE_')) {
        const value = import.meta.env[key];
        vars[key] = typeof value === 'string' 
          ? (key.includes('KEY') ? `${value.substring(0, 5)}...${value.substring(value.length - 5)}` : value)
          : String(value);
      }
    });
    
    setEnvVars(vars);
    
    // Afficher dans la console pour vérification
    console.log('Variables d\'environnement:', 
      Object.entries(import.meta.env)
        .filter(([key]) => key.startsWith('VITE_'))
        .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {})
    );
  }, []);
  
  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Vérification des variables d'environnement</h1>
      
      <div style={{ background: '#f0f8ff', padding: '15px', borderRadius: '5px', marginBottom: '20px', border: '1px solid #cce5ff' }}>
        <h2>Variables VITE_*</h2>
        <p>Date et heure: {new Date().toLocaleString()}</p>
        {Object.entries(envVars).length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {Object.entries(envVars).map(([key, value]) => (
              <li key={key} style={{ padding: '8px 0', borderBottom: '1px solid #e0e0e0' }}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        ) : (
          <p>Chargement des variables d'environnement...</p>
        )}
      </div>
      
      <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '5px', border: '1px solid #ffeeba' }}>
        <h3>Instructions:</h3>
        <p>1. Vérifiez que les valeurs affichées correspondent à ce qui est dans votre fichier .env.local</p>
        <p>2. Si les valeurs ne correspondent pas:</p>
        <ul>
          <li>Arrêtez complètement le serveur (Ctrl+C)</li>
          <li>Supprimez le cache: <code>rm -rf node_modules/.vite</code></li>
          <li>Redémarrez: <code>npm run dev</code></li>
        </ul>
      </div>
    </div>
  );
}
