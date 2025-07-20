/**
 * Script de mise à jour du nom de la marque 
 * Ce script s'exécute après la construction et modifie tous les fichiers
 * HTML et JS pour remplacer "JobNexus" par "JobNexAI"
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Mise à jour du nom de marque JobNexus → JobNexAI...');

// Fonction pour remplacer récursivement dans tous les fichiers
function replaceInFiles(dir, extensions) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Récursion dans les sous-répertoires
      replaceInFiles(filePath, extensions);
    } else if (extensions.includes(path.extname(file))) {
      // C'est un fichier à traiter
      try {
        let content = fs.readFileSync(filePath, 'utf-8');
        const originalContent = content;
        
        // Remplacer toutes les occurrences de JobNexus par JobNexAI
        content = content.replace(/JobNexus/g, 'JobNexAI');
        
        // Mise à jour de l'adresse email
        content = content.replace(/support@jobnexus\.example\.com/g, 'contact@jobnexai.fr');
        content = content.replace(/support@jobnexus\.com/g, 'contact@jobnexai.fr');
        
        // Écrire seulement si le contenu a changé
        if (content !== originalContent) {
          fs.writeFileSync(filePath, content);
          console.log(`✅ Mise à jour effectuée dans ${path.relative(__dirname, filePath)}`);
        }
      } catch (error) {
        console.error(`❌ Erreur lors du traitement de ${filePath}:`, error.message);
      }
    }
  }
}

// Chemins à traiter
const distDir = path.resolve(__dirname, 'dist');
const extensionsToProcess = ['.html', '.js', '.css', '.json'];

// Vérifier que le répertoire dist existe
if (fs.existsSync(distDir)) {
  console.log(`🔍 Traitement du répertoire: ${distDir}`);
  replaceInFiles(distDir, extensionsToProcess);
  console.log('✨ Mise à jour de la marque terminée!');
} else {
  console.error(`❌ Le répertoire dist n'existe pas: ${distDir}`);
}

// Créer également un fichier spécifique pour la page de chargement
const loadingHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JobNexAI</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background-color: #f9fafb;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      color: #111827;
    }
    .loading-container {
      text-align: center;
    }
    h1 {
      font-size: 2.5rem;
      color: #3b82f6;
      margin-bottom: 1rem;
    }
  </style>
</head>
<body>
  <div class="loading-container">
    <h1>JobNexAI</h1>
    <p>Loading application...</p>
  </div>
</body>
</html>`;

const loadingPath = path.join(distDir, 'loading.html');
fs.writeFileSync(loadingPath, loadingHtml);
console.log(`✅ Page de chargement créée: ${path.relative(__dirname, loadingPath)}`);

// Créer un nouveau fichier d'index avec une redirection vers notre page de chargement personnalisée
const indexHtmlPath = path.join(distDir, 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  let content = fs.readFileSync(indexHtmlPath, 'utf-8');
  
  // Ajouter un script qui montre notre page de chargement personnalisée
  content = content.replace(
    '</head>',
    `  <script>
    // Afficher la page de chargement
    document.addEventListener('DOMContentLoaded', function() {
      const root = document.getElementById('root');
      if (root) {
        root.innerHTML = '<div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #f9fafb; color: #111827; font-family: system-ui, sans-serif;"><h1 style="font-size: 2.5rem; color: #3b82f6; margin-bottom: 1rem;">JobNexAI</h1><p>Loading application...</p></div>';
      }
    });
  </script>
</head>`
  );
  
  fs.writeFileSync(indexHtmlPath, content);
  console.log(`✅ Script de chargement ajouté à: ${path.relative(__dirname, indexHtmlPath)}`);
}
