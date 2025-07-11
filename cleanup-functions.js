/**
 * Script de nettoyage des fonctions Netlify
 * 
 * Ce script nettoie le répertoire des fonctions et crée une structure minimale
 * pour éviter les problèmes de déploiement.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Nettoyage des fonctions Netlify...');

// Chemin vers le répertoire des fonctions
const functionsDir = path.resolve(__dirname, 'functions');

// Vérifier si le répertoire des fonctions existe
if (!fs.existsSync(functionsDir)) {
  console.log('📁 Création du répertoire functions...');
  fs.mkdirSync(functionsDir, { recursive: true });
} else {
  // Si le répertoire existe, vider son contenu
  console.log('🗑️ Vidage du répertoire functions...');
  
  try {
    // Lister tous les fichiers et dossiers
    const files = fs.readdirSync(functionsDir);
    
    // Supprimer chaque fichier/dossier
    for (const file of files) {
      const filePath = path.join(functionsDir, file);
      
      if (fs.lstatSync(filePath).isDirectory()) {
        // Supprimer récursivement le dossier
        fs.rmSync(filePath, { recursive: true, force: true });
      } else {
        // Supprimer le fichier
        fs.unlinkSync(filePath);
      }
    }
    
    console.log('✅ Répertoire functions vidé avec succès');
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage du répertoire functions:', error);
  }
}

// Créer une fonction minimale pour éviter les erreurs
console.log('📝 Création d\'une fonction minimale...');

const minimalFunctionDir = path.join(functionsDir, 'placeholder');
if (!fs.existsSync(minimalFunctionDir)) {
  fs.mkdirSync(minimalFunctionDir, { recursive: true });
}

const minimalFunctionContent = `
// Fonction minimale pour éviter les erreurs de déploiement
exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Fonction minimale fonctionnelle" })
  };
};
`;

fs.writeFileSync(path.join(minimalFunctionDir, 'placeholder.js'), minimalFunctionContent);
console.log('✅ Fonction minimale créée avec succès');

console.log('✨ Nettoyage des fonctions terminé!');
