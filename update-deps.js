/**
 * Script de mise à jour des dépendances problématiques
 * 
 * Ce script analyse le fichier package.json et remplace automatiquement
 * les dépendances obsolètes par des versions plus récentes compatibles.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Chemin vers le fichier package.json
const packageJsonPath = path.resolve(__dirname, 'package.json');

console.log('🔍 Analyse du fichier package.json...');

// Lire le fichier package.json
let packageJson;
try {
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  packageJson = JSON.parse(packageJsonContent);
} catch (error) {
  console.error('❌ Erreur lors de la lecture du fichier package.json:', error);
  process.exit(1);
}

// Liste des dépendances à mettre à jour avec leurs versions recommandées
const dependenciesToUpdate = {
  // Dépendances principales problématiques identifiées dans les logs
  'react-router-dom': {
    version: '^6.30.0',
    note: 'Dépendance critique, assurer sa disponibilité'
  },
  'react-i18next': {
    version: '^14.1.0',
    note: 'Dépendance critique pour l\'internationalisation'
  },
  'framer-motion': {
    version: '^11.0.8',
    note: 'Dépendance pour les animations'
  },
  '@heroicons/react/24/outline': {
    version: '^2.1.1',
    note: 'Module spécifique de heroicons nécessaire'
  },
  '@heroicons/react/24/solid': {
    version: '^2.1.1',
    note: 'Module spécifique de heroicons nécessaire'
  },
  '@headlessui/react': {
    version: '^1.7.18',
    note: 'Dépendance interface utilisateur'
  },
  '@stripe/stripe-js': {
    version: '^3.0.10',
    note: 'Dépendance pour l\'intégration Stripe'
  },
  '@stripe/react-stripe-js': {
    version: '^2.5.0',
    note: 'Dépendance pour l\'intégration Stripe avec React'
  },
  'react-beautiful-dnd': {
    version: '^13.1.1',
    note: 'Package obsolète mais encore utilisé. Ignorer les avertissements.'
  },
  'react-chartjs-2': {
    version: '^5.2.0',
    note: 'Dépendance pour les graphiques'
  },
  'react-dropzone': {
    version: '^14.2.3',
    note: 'Dépendance pour l\'upload de fichiers'
  },
  'react-share': {
    version: '^5.1.0',
    note: 'Dépendance pour le partage social'
  },
  '@tanstack/react-virtual': {
    version: '^3.1.3',
    note: 'Dépendance pour les listes virtualisées'
  },
  '@sentry/react': {
    version: '^7.107.0',
    note: 'Dépendance pour le monitoring d\'erreurs'
  },
  'i18next-http-backend': {
    version: '^2.5.0',
    note: 'Backend pour i18next'
  },
  'i18next-browser-languagedetector': {
    version: '^7.2.0',
    note: 'Détection de langue pour i18next'
  }
};

// Vérifier les dépendances à mettre à jour
let updatesNeeded = false;
console.log('\n📋 Vérification des dépendances problématiques:');

// Vérifier les dépendances principales
for (const [dep, info] of Object.entries(dependenciesToUpdate)) {
  if (packageJson.dependencies && packageJson.dependencies[dep]) {
    console.log(`  • ${dep}: ${packageJson.dependencies[dep]} → ${info.version} [${info.note}]`);
    if (packageJson.dependencies[dep] !== info.version) {
      packageJson.dependencies[dep] = info.version;
      updatesNeeded = true;
    }
  } else if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
    console.log(`  • ${dep}: ${packageJson.devDependencies[dep]} → ${info.version} [${info.note}]`);
    if (packageJson.devDependencies[dep] !== info.version) {
      packageJson.devDependencies[dep] = info.version;
      updatesNeeded = true;
    }
  }
}

// Ajouter des résolveurs explicites pour les conflits connus
if (!packageJson.resolutions) {
  packageJson.resolutions = {};
  updatesNeeded = true;
}

// Résoudre les conflits connus
const resolutionsToAdd = {
  'wrap-ansi': '^7.0.0',
  'string-width': '^4.2.3',
  'strip-ansi': '^6.0.1'
};

for (const [pkg, version] of Object.entries(resolutionsToAdd)) {
  if (!packageJson.resolutions[pkg] || packageJson.resolutions[pkg] !== version) {
    packageJson.resolutions[pkg] = version;
    console.log(`  • Ajout du résolveur pour ${pkg}: ${version}`);
    updatesNeeded = true;
  }
}

// Ajouter ou mettre à jour les configurations spécifiques à Netlify
if (!packageJson.engines) {
  packageJson.engines = {};
  updatesNeeded = true;
}

// Spécifier explicitement la version de Node.js
if (!packageJson.engines.node || packageJson.engines.node !== '>=20.0.0') {
  packageJson.engines.node = '>=20.0.0';
  console.log('  • Ajout de la spécification explicite de Node.js: >=20.0.0');
  updatesNeeded = true;
}

// Sauvegarder les modifications si nécessaire
if (updatesNeeded) {
  console.log('\n✏️ Mise à jour du fichier package.json...');
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log('✅ Fichier package.json mis à jour avec succès!');
} else {
  console.log('\n✅ Aucune mise à jour nécessaire, les dépendances sont déjà optimales.');
}

// Ajouter un fichier .npmrc pour configurer npm de manière optimale pour Netlify
const npmrcPath = path.resolve(__dirname, '.npmrc');
const npmrcContent = `
# Configuration NPM optimisée pour Netlify
loglevel=error
fund=false
audit=false
strict-peer-dependencies=false
legacy-peer-deps=true
`;

fs.writeFileSync(npmrcPath, npmrcContent.trim() + '\n');
console.log('\n✅ Fichier .npmrc créé pour optimiser l\'installation des dépendances.');

console.log('\n🎉 Processus de mise à jour des dépendances terminé!');
