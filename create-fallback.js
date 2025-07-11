/**
 * Script de création d'un fallback pour les erreurs de chargement
 * 
 * Ce script crée un fichier HTML minimaliste qui sera affiché en cas d'erreur
 * de chargement de l'application React principale.
 */

const fs = require('fs');
const path = require('path');

console.log('📝 Création du fallback HTML...');

// Chemin vers le répertoire de distribution
const distDir = path.resolve(__dirname, 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log('📁 Répertoire dist créé');
}

// Contenu HTML du fallback
const fallbackHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JobNexAI</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      background-color: #f9fafb;
      color: #111827;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      padding: 20px;
      text-align: center;
    }
    .container {
      max-width: 600px;
      padding: 40px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: #3b82f6;
    }
    p {
      font-size: 1.1rem;
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }
    .buttons {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
    }
    .button {
      background-color: #3b82f6;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
      text-decoration: none;
    }
    .button:hover {
      background-color: #2563eb;
    }
    .button.secondary {
      background-color: #e5e7eb;
      color: #374151;
    }
    .button.secondary:hover {
      background-color: #d1d5db;
    }
    .language-switcher {
      display: flex;
      gap: 8px;
      margin-top: 20px;
    }
    .language-button {
      background-color: transparent;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      padding: 4px 8px;
      cursor: pointer;
    }
    .language-button:hover {
      background-color: #f3f4f6;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>JobNexAI</h1>
    <p>
      L'application est en cours de chargement ou a rencontré un problème. Nous travaillons à résoudre cela au plus vite.
    </p>
    <p>
      Bienvenue sur notre plateforme innovante qui connecte les demandeurs d'emploi avec les meilleures opportunités.
    </p>
    <div class="buttons">
      <a href="/" class="button">Rafraîchir la page</a>
      <a href="mailto:contact@jobnexai.fr" class="button secondary">Contacter le support</a>
    </div>
    <div class="language-switcher">
      <button class="language-button">FR</button>
      <button class="language-button">EN</button>
      <button class="language-button">DE</button>
      <button class="language-button">ES</button>
      <button class="language-button">IT</button>
    </div>
  </div>
  
  <script>
    // Script de détection d'erreur pour rediriger vers le fallback
    window.addEventListener('error', function(e) {
      console.error('Application error detected:', e);
      document.body.innerHTML = document.body.innerHTML;
    });
    
    // Indiquer en console que le fallback est chargé
    console.log('JobNexAI fallback page loaded');
    
    // Si la page principale n'a pas fini de charger après 10 secondes, on considère que c'est un problème
    setTimeout(function() {
      const root = document.getElementById('root');
      if (root && (!root.hasChildNodes() || root.innerHTML.includes('app-loading-indicator'))) {
        console.warn('Application took too long to load. Showing fallback UI.');
      }
    }, 10000);
  </script>
</body>
</html>`;

// Écrire le fichier fallback.html
const fallbackPath = path.join(distDir, 'fallback.html');
fs.writeFileSync(fallbackPath, fallbackHtml);
console.log(`✅ Fichier ${fallbackPath} créé avec succès`);

// Modifier le index.html pour rediriger en cas d'erreur
const indexPath = path.join(distDir, 'index.html');
if (fs.existsSync(indexPath)) {
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Ajouter le script de redirection en cas d'erreur
  if (!indexContent.includes('app-error-handler')) {
    const scriptToAdd = `
  <!-- Error handler -->
  <script id="app-error-handler">
    window.addEventListener('error', function(e) {
      console.error('Critical application error:', e);
      // Rediriger vers la page de fallback après 3 erreurs
      var errorCount = parseInt(sessionStorage.getItem('app-error-count') || '0');
      errorCount++;
      sessionStorage.setItem('app-error-count', errorCount);
      
      if (errorCount > 3) {
        console.warn('Too many errors, redirecting to fallback page');
        window.location.href = '/fallback.html';
      }
    });
    
    // Si l'application ne se charge pas après 15 secondes, rediriger vers le fallback
    setTimeout(function() {
      var root = document.getElementById('root');
      if (root && (!root.childNodes.length || root.innerHTML.includes('app-loading-indicator'))) {
        console.warn('Application timeout, redirecting to fallback page');
        window.location.href = '/fallback.html';
      }
    }, 15000);
  </script>
`;
    
    indexContent = indexContent.replace('</head>', scriptToAdd + '</head>');
    fs.writeFileSync(indexPath, indexContent);
    console.log('✅ Script de redirection ajouté à index.html');
  }
} else {
  console.log('⚠️ Fichier index.html non trouvé dans le répertoire dist');
}

console.log('✨ Création du fallback terminée!');
