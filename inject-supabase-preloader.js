/**
 * Script d'injection du préchargeur Supabase
 * 
 * Ce script modifie index.html pour y ajouter le script de préchargement 
 * de Supabase avant le démarrage de l'application React.
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 Injection du préchargeur Supabase...');

const distDir = path.join(__dirname, 'dist');
const indexPath = path.join(distDir, 'index.html');
const preloaderPath = path.join(__dirname, 'preload-supabase.js');

// Vérifier que les fichiers existent
if (!fs.existsSync(indexPath)) {
  console.error('❌ Erreur: index.html non trouvé dans le répertoire dist');
  process.exit(1);
}

if (!fs.existsSync(preloaderPath)) {
  console.error('❌ Erreur: preload-supabase.js non trouvé');
  process.exit(1);
}

// Lire le contenu des fichiers
let indexHtml = fs.readFileSync(indexPath, 'utf8');
const preloaderContent = fs.readFileSync(preloaderPath, 'utf8');

// Vérifier si le préchargeur est déjà injecté
if (indexHtml.includes('Préchargement de Supabase')) {
  console.log('✅ Le préchargeur Supabase est déjà injecté');
} else {
  // Créer l'élément script pour le préchargeur
  const preloaderScript = `<script>\n${preloaderContent}\n</script>`;
  
  // Injecter le script juste avant la fermeture de head
  indexHtml = indexHtml.replace('</head>', `${preloaderScript}\n</head>`);
  
  // Écrire le fichier modifié
  fs.writeFileSync(indexPath, indexHtml);
  console.log('✅ Préchargeur Supabase injecté avec succès dans index.html');
}

// Copier le script dans le répertoire dist pour les références externes
fs.copyFileSync(preloaderPath, path.join(distDir, 'preload-supabase.js'));
console.log('✅ Fichier préchargeur copié dans dist');

console.log('✨ Injection du préchargeur Supabase terminée !');
