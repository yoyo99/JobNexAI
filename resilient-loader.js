/**
 * Script Resilient Loader pour JobNexAI
 * Ce script rend l'application résiliente aux erreurs d'initialisation
 * et permet de contourner les problèmes de chargement des dépendances
 */

const fs = require('fs');
const path = require('path');

console.log('🛡️ Déploiement du Resilient Loader...');

// Chemin vers le répertoire de build
const distDir = path.join(__dirname, 'dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('❌ Fichier index.html non trouvé dans', distDir);
  process.exit(1);
}

// Lire le contenu du fichier HTML
let htmlContent = fs.readFileSync(indexPath, 'utf8');

// Script de résilience à injecter dans l'en-tête HTML
const resilientScript = `
  <script type="text/javascript">
    // Configuration Globale et Polyfills
    window.supabase = window.supabase || {
      createClient: function() {
        console.warn('Utilisation du client Supabase factice');
        return {
          auth: {
            getUser: function() { return Promise.resolve({ data: { user: null }, error: null }); },
            getSession: function() { return Promise.resolve({ data: { session: null }, error: null }); },
            signOut: function() { return Promise.resolve({ error: null }); },
            onAuthStateChange: function() { return { data: { subscription: { unsubscribe: function() {} } } }; }
          },
          from: function() {
            return {
              select: function() { return { data: [], error: null }; },
              insert: function() { return { data: null, error: null }; },
              update: function() { return { data: null, error: null }; },
              delete: function() { return { data: null, error: null }; },
              eq: function() { return { select: function() { return { data: [], error: null }; } }; }
            };
          }
        };
      }
    };

    // Détection des erreurs bloquantes
    window.APP_ERRORS = [];
    window.APP_INITIALIZED = false;
    window.APP_TIMEOUT_MS = 8000; // 8 secondes de temps de chargement max
    
    // Gestionnaire d'erreurs global
    window.addEventListener('error', function(event) {
      console.error('🔴 Erreur détectée:', event.error || event.message);
      window.APP_ERRORS.push({
        message: event.message,
        source: event.filename,
        lineno: event.lineno,
        time: new Date().toISOString()
      });
      
      // Si trop d'erreurs, forcer le chargement de l'interface de secours
      if (window.APP_ERRORS.length > 3 && !window.FALLBACK_LOADED) {
        showFallbackUI();
      }
    });

    // Surveiller les rejets de promesses non gérés
    window.addEventListener('unhandledrejection', function(event) {
      console.error('🔴 Promesse rejetée non gérée:', event.reason);
      window.APP_ERRORS.push({
        message: event.reason ? (event.reason.message || 'Promesse rejetée') : 'Promesse rejetée',
        reason: event.reason,
        time: new Date().toISOString()
      });
    });
    
    // Fonction pour afficher l'UI de secours si l'application ne se charge pas
    function showFallbackUI() {
      if (window.FALLBACK_LOADED) return;
      window.FALLBACK_LOADED = true;
      
      console.warn('⚠️ Chargement de l\\'interface de secours suite à des erreurs ou un timeout');
      
      // Remplacer le contenu du root par notre interface de secours
      var rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.innerHTML = \`
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: system-ui, sans-serif; text-align: center; padding: 20px;">
            <h1 style="font-size: 2.5rem; color: #3b82f6; margin-bottom: 1rem;">JobNexAI</h1>
            <p style="margin-bottom: 1rem;">L'application rencontre des difficultés lors du chargement.</p>
            <p style="margin-bottom: 1.5rem;">Nous vous suggérons d'essayer :</p>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-bottom: 20px;">
              <button onclick="window.location.reload()" style="padding: 8px 16px; background-color: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">Rafraîchir la page</button>
              <button onclick="window.localStorage.clear(); window.location.reload()" style="padding: 8px 16px; background-color: #9ca3af; color: white; border: none; border-radius: 4px; cursor: pointer;">Vider le cache et rafraîchir</button>
              <a href="mailto:contact@jobnexai.fr" style="padding: 8px 16px; background-color: #e5e7eb; color: #374151; border: none; border-radius: 4px; text-decoration: none;">Contacter le support</a>
            </div>
            <div style="font-size: 0.875rem; color: #6b7280; margin-top: 20px;">
              <p>Si le problème persiste après plusieurs tentatives, veuillez contacter notre équipe support.</p>
            </div>
          </div>
        \`;
      }
      
      // Afficher les erreurs dans la console pour le débogage
      if (window.APP_ERRORS.length > 0) {
        console.group('📋 Erreurs détectées avant le chargement du fallback');
        window.APP_ERRORS.forEach(function(err, i) {
          console.error((i+1) + ')', err.message, err);
        });
        console.groupEnd();
      }
    }
    
    // Mettre en place un timer de secours pour garantir que quelque chose s'affiche
    setTimeout(function() {
      if (!window.APP_INITIALIZED) {
        console.warn('⏱️ Timeout de chargement atteint');
        showFallbackUI();
      }
    }, window.APP_TIMEOUT_MS);

    // Script pour déclarer que l'application est bien chargée
    // à appeler depuis l'application principale quand tout est OK
    window.markAppAsInitialized = function() {
      window.APP_INITIALIZED = true;
      console.log('✅ Application initialisée avec succès');
    };
    
    console.log('🛡️ Resilient Loader activé');
  </script>
`;

// Injecter notre script résilient juste avant la fermeture de la balise head
htmlContent = htmlContent.replace('</head>', resilientScript + '\n</head>');

// Créer aussi un loader plus visible
const loaderStyle = `
  <style>
    #app-loading-indicator {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #f9fafb;
      color: #111827;
      font-family: system-ui, -apple-system, sans-serif;
      z-index: 9999;
    }
    #app-loading-spinner {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(59, 130, 246, 0.2);
      border-radius: 50%;
      border-top-color: #3b82f6;
      animation: spin 1s ease-in-out infinite;
      margin-bottom: 20px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    #root:empty + #app-loading-indicator { display: flex; }
    #root:not(:empty) + #app-loading-indicator { display: none; }
  </style>
`;

// Ajouter le style dans le head
htmlContent = htmlContent.replace('</head>', loaderStyle + '\n</head>');

// Ajouter un loader visible qui disparaîtra automatiquement quand l'app sera chargée
const loaderDiv = `
<div id="app-loading-indicator">
  <div id="app-loading-spinner"></div>
  <h1 style="font-size: 24px; margin-bottom: 16px;">JobNexAI</h1>
  <p>Loading application...</p>
</div>
`;

// Injecter le loader après la div root
htmlContent = htmlContent.replace('<div id="root"></div>', '<div id="root"></div>\n' + loaderDiv);

// Créer un script à injecter dans le main.tsx pour marquer l'application comme chargée
const appInitScript = `
  // Marquer l'application comme initialisée une fois chargée
  if (typeof window !== 'undefined' && window.markAppAsInitialized) {
    window.markAppAsInitialized();
  }
`;

// Écrire les modifications dans le fichier index.html
fs.writeFileSync(indexPath, htmlContent);
console.log('✅ Script de résilience ajouté à index.html');

// Créer un fichier de marquage d'initialisation dans dist
const initMarkerPath = path.join(distDir, 'init-marker.js');
fs.writeFileSync(initMarkerPath, appInitScript);
console.log('✅ Fichier de marquage d\'initialisation créé:', initMarkerPath);

// Si c'est possible, injecter aussi dans les chunks JS principaux
try {
  const assetsDir = path.join(distDir, 'assets');
  const files = fs.readdirSync(assetsDir);
  
  // Chercher le fichier index principal (plus gros fichier JS)
  let mainJsFile = null;
  let maxSize = 0;
  
  for (const file of files) {
    if (file.endsWith('.js') && file.startsWith('index-')) {
      const filePath = path.join(assetsDir, file);
      const stats = fs.statSync(filePath);
      if (stats.size > maxSize) {
        maxSize = stats.size;
        mainJsFile = filePath;
      }
    }
  }
  
  if (mainJsFile) {
    // Lire le contenu du fichier JS principal
    let jsContent = fs.readFileSync(mainJsFile, 'utf8');
    
    // Ajouter notre code d'initialisation à la fin
    jsContent += `\n\n${appInitScript}\n`;
    
    // Écrire les modifications
    fs.writeFileSync(mainJsFile, jsContent);
    console.log('✅ Code d\'initialisation ajouté au fichier JS principal:', path.basename(mainJsFile));
  } else {
    console.warn('⚠️ Fichier JS principal non trouvé');
  }
} catch (error) {
  console.error('❌ Erreur lors de la modification du fichier JS principal:', error.message);
}

console.log('✨ Déploiement du Resilient Loader terminé avec succès!');
