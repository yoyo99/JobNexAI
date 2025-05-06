/**
 * Script de vérification des dépendances critiques
 * 
 * Ce script vérifie que les dépendances essentielles comme react-router-dom
 * sont correctement installées avant de lancer le build.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Liste des dépendances critiques à vérifier
const CRITICAL_DEPENDENCIES = [
  'react',
  'react-dom',
  'react-router-dom',
  '@supabase/supabase-js',
  'i18next',
  'react-i18next',
  'framer-motion',
  '@headlessui/react',
  '@heroicons/react/24/outline',
  '@heroicons/react/24/solid',
  '@stripe/stripe-js',
  '@stripe/react-stripe-js',
  'react-beautiful-dnd',
  'react-chartjs-2',
  'react-dropzone',
  'react-share',
  '@tanstack/react-virtual',
  '@sentry/react'
];

console.log('🔍 Vérification des dépendances critiques...');

// Vérifier si un module est correctement installé
function isModuleInstalled(moduleName) {
  const nodeModulesPath = path.resolve(__dirname, 'node_modules', moduleName);
  
  // Vérifier si le répertoire du module existe
  if (!fs.existsSync(nodeModulesPath)) {
    return false;
  }
  
  // Vérifier si package.json existe dans ce répertoire
  const packageJsonPath = path.resolve(nodeModulesPath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    return false;
  }
  
  // Lire le fichier package.json pour confirmer que c'est le bon module
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    return packageJson.name === moduleName;
  } catch (error) {
    console.error(`Erreur lors de la lecture du package.json pour ${moduleName}:`, error);
    return false;
  }
}

// Vérifier les dépendances critiques
const missingDependencies = [];

for (const dependency of CRITICAL_DEPENDENCIES) {
  if (!isModuleInstalled(dependency)) {
    missingDependencies.push(dependency);
  } else {
    console.log(`✅ ${dependency} est correctement installé`);
  }
}

// En cas de dépendances manquantes, tenter de les installer
if (missingDependencies.length > 0) {
  console.error('\n❌ Dépendances manquantes détectées:');
  missingDependencies.forEach(dep => {
    console.error(`  → ${dep} n'est pas correctement installé`);
  });
  
  console.log('\n🔧 Tentative d\'installation des dépendances manquantes...');
  
  try {
    // Installer les dépendances manquantes
    const installCommand = `npm install ${missingDependencies.join(' ')} --no-save`;
    console.log(`Exécution de: ${installCommand}`);
    execSync(installCommand, { stdio: 'inherit' });
    
    console.log('\n✅ Installation réussie des dépendances manquantes!');
  } catch (error) {
    console.error('\n❌ Échec de l\'installation des dépendances:');
    console.error(error);
    process.exit(1);
  }
} else {
  console.log('\n✅ Toutes les dépendances critiques sont correctement installées!');
}

// Vérification supplémentaire des fichiers de react-router-dom
const routerDomPath = path.resolve(__dirname, 'node_modules/react-router-dom');
if (fs.existsSync(routerDomPath)) {
  console.log('\n📂 Contenu du répertoire react-router-dom:');
  const files = fs.readdirSync(routerDomPath);
  console.log(files.join(', '));
  
  // Vérifier les fichiers principaux
  const mainFiles = ['index.js', 'main.js', 'package.json'];
  mainFiles.forEach(file => {
    const filePath = path.join(routerDomPath, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} existe dans react-router-dom`);
    } else {
      console.log(`❌ ${file} est ABSENT de react-router-dom`);
    }
  });
}

console.log('\n✨ Vérification des dépendances terminée!');
