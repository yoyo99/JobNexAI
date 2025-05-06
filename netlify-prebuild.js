/**
 * Script de préparation pour Netlify
 * 
 * Ce script s'exécute avant le build sur Netlify pour s'assurer que
 * toutes les dépendances sont correctement installées et disponibles.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
console.log('🚀 Début de la préparation Netlify...');
console.log(`📋 Node.js version: ${process.version}`);
console.log(`📋 Environnement: ${process.env.NODE_ENV || 'development'}`);

// Liste des dépendances critiques à vérifier explicitement
const CRITICAL_PACKAGES = [
  'react-router-dom',
  'react-i18next',
  'framer-motion',
  '@headlessui/react',
  '@heroicons/react', // Le package principal, pas les chemins internes
  '@stripe/stripe-js',
  '@stripe/react-stripe-js',
  'react-beautiful-dnd',
  'react-chartjs-2',
  'i18next-http-backend',
  'i18next-browser-languagedetector'
];

// Fonction pour normaliser les noms de packages
// Convertit les chemins d'importation comme '@heroicons/react/24/outline' en noms de packages npm comme '@heroicons/react'
function normalizePackageName(importPath) {
  // Cas spécial pour @heroicons/react
  if (importPath.startsWith('@heroicons/react/')) {
    return '@heroicons/react';
  }
  
  // Cas général: prendre le premier segment pour les packages scoped
  if (importPath.startsWith('@')) {
    const parts = importPath.split('/');
    if (parts.length >= 2) {
      return `${parts[0]}/${parts[1]}`;
    }
  }
  
  // Pour les packages normaux, prendre tout jusqu'au premier slash
  const slashIndex = importPath.indexOf('/');
  if (slashIndex !== -1) {
    return importPath.substring(0, slashIndex);
  }
  
  // Sinon retourner le chemin tel quel
  return importPath;
}

// Vérification de répertoire node_modules
console.log('\n📂 Vérification du répertoire node_modules...');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');

if (!fs.existsSync(nodeModulesPath)) {
  console.error('❌ Le répertoire node_modules est absent!');
  console.log('🔄 Installation forcée des dépendances...');
  execSync('npm ci --no-audit --no-fund', { stdio: 'inherit' });
} else {
  console.log('✅ Le répertoire node_modules existe');
}

// Vérification et réparation des dépendances critiques
console.log('\n🔍 Vérification des dépendances critiques...');
const missingPackages = [];

CRITICAL_PACKAGES.forEach(pkg => {
  // Normaliser le nom du package (pour gérer les cas comme @heroicons/react/24/outline)
  const normalizedPkg = normalizePackageName(pkg);
  const pkgPath = path.resolve(nodeModulesPath, normalizedPkg);
  
  if (!fs.existsSync(pkgPath)) {
    console.log(`❌ ${normalizedPkg} est manquant`);
    if (!missingPackages.includes(normalizedPkg)) {
      missingPackages.push(normalizedPkg);
    }
  } else {
    console.log(`✅ ${normalizedPkg} est présent`);
  }
});

// Réinstallation des packages manquants
if (missingPackages.length > 0) {
  console.log(`\n🔄 Réinstallation des ${missingPackages.length} packages manquants...`);
  try {
    // Force l'installation des packages manquants sans mettre à jour package.json
    const installCmd = `npm install ${missingPackages.join(' ')} --no-save --legacy-peer-deps`;
    console.log(`Exécution: ${installCmd}`);
    execSync(installCmd, { stdio: 'inherit' });
    console.log('✅ Réinstallation terminée avec succès');
  } catch (error) {
    console.error('❌ Erreur durant la réinstallation:', error);
    // Ne pas faire échouer le build complet, mais enregistrer l'erreur
  }
}

// Vérifier la structure des dépendances spécifiques qui posent problème
console.log('\n🔍 Vérification de la structure de react-router-dom...');
const reactRouterPath = path.resolve(nodeModulesPath, 'react-router-dom');
if (fs.existsSync(reactRouterPath)) {
  const files = fs.readdirSync(reactRouterPath);
  console.log(`Files: ${files.join(', ')}`);
  
  // Vérifier les fichiers principaux
  const indexPath = path.resolve(reactRouterPath, 'index.js');
  const mainPath = path.resolve(reactRouterPath, 'main.js');
  const pkgJsonPath = path.resolve(reactRouterPath, 'package.json');
  
  console.log(`index.js existe: ${fs.existsSync(indexPath)}`);
  console.log(`main.js existe: ${fs.existsSync(mainPath)}`);
  console.log(`package.json existe: ${fs.existsSync(pkgJsonPath)}`);
  
  // Si index.js n'existe pas mais qu'il y a un autre point d'entrée, créer un lien symbolique
  if (!fs.existsSync(indexPath)) {
    console.log('Recherche d\'une alternative à index.js...');
    const distDir = path.resolve(reactRouterPath, 'dist');
    
    if (fs.existsSync(distDir)) {
      console.log('Répertoire dist trouvé, recherche d\'alternatives...');
      const distFiles = fs.readdirSync(distDir);
      console.log(`Fichiers dans dist: ${distFiles.join(', ')}`);
      
      // Chercher un fichier qui pourrait servir d'index
      const indexCandidate = distFiles.find(f => f.includes('index') || f.includes('main') || f.includes('umd'));
      
      if (indexCandidate) {
        console.log(`Alternative trouvée: ${indexCandidate}, création d'un lien symbolique...`);
        try {
          // Créer un fichier index.js qui importe le fichier trouvé
          fs.writeFileSync(indexPath, `module.exports = require('./dist/${indexCandidate}');\n`);
          console.log('✅ Lien créé avec succès');
        } catch (error) {
          console.error('❌ Erreur lors de la création du lien:', error);
        }
      }
    }
  }
}

// Correction finale: nettoyer le cache npm
console.log('\n🧹 Nettoyage du cache npm pour les dépendances problématiques...');
try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('✅ Cache npm nettoyé');
} catch (error) {
  console.error('❌ Erreur lors du nettoyage du cache:', error);
}

console.log('\n✨ Préparation Netlify terminée!');
