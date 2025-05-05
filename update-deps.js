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
  // Dépendances principales
  'react-beautiful-dnd': {
    version: '^13.1.1',
    note: 'Package obsolète mais encore utilisé. Ignorer les avertissements.'
  },
  'emailjs-com': {
    version: '^3.2.0',
    note: 'Considérer "@emailjs/browser" dans une future mise à jour.'
  },
  'spdy': {
    version: '^4.0.2',
    note: 'Package peu maintenu mais encore fonctionnel. À remplacer par une alternative moderne à l\'avenir.'
  },
  
  // Dépendances de développement
  '@testing-library/react': {
    version: '^16.3.0',
    note: 'Version récente, conserver telle quelle.'
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
