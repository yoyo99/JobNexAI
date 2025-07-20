/**
 * Script de nettoyage du répertoire de build pour Netlify
 * Supprime les fichiers et dossiers indésirables du répertoire de sortie
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Répertoire de sortie de la compilation
const BUILD_DIR = path.resolve(__dirname, 'dist');

// Liste des fichiers et dossiers à supprimer du répertoire de build
const EXCLUDED_PATTERNS = [
  '.git',
  'node_modules',
  '.github',
  '.vscode',
  '.idea',
  'tests',
  '.DS_Store',
  '.env',
  '.env.*',
  '*.log',
  'clean-build.js'
];

console.log('🧹 Nettoyage du répertoire de build...');

// Vérifier si le répertoire de build existe
if (!fs.existsSync(BUILD_DIR)) {
  console.log('❌ Le répertoire de build n\'existe pas.');
  process.exit(1);
}

// Fonction récursive pour supprimer les fichiers/dossiers correspondant aux motifs
function cleanDirectory(directory) {
  const items = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(directory, item.name);
    
    // Vérifier si le fichier/dossier correspond à un motif exclu
    if (EXCLUDED_PATTERNS.some(pattern => {
      if (pattern.includes('*')) {
        return new RegExp(pattern.replace('*', '.*')).test(item.name);
      }
      return item.name === pattern;
    })) {
      try {
        if (item.isDirectory()) {
          fs.rmSync(fullPath, { recursive: true, force: true });
          console.log(`✅ Suppression du dossier: ${fullPath}`);
        } else {
          fs.unlinkSync(fullPath);
          console.log(`✅ Suppression du fichier: ${fullPath}`);
        }
      } catch (error) {
        console.error(`❌ Erreur lors de la suppression de ${fullPath}:`, error);
      }
    } else if (item.isDirectory()) {
      // Récursion dans les sous-dossiers
      cleanDirectory(fullPath);
    }
  }
}

// Nettoyer le répertoire de build
cleanDirectory(BUILD_DIR);

console.log('✨ Nettoyage terminé avec succès !');

// Afficher les informations sur la taille du build
try {
  const stats = execSync(`du -sh ${BUILD_DIR}`).toString().trim();
  console.log(`📊 Taille du build après nettoyage: ${stats}`);
} catch (error) {
  console.log('Impossible d\'obtenir la taille du répertoire.');
}
