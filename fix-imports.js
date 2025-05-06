/**
 * Script pour corriger les problèmes d'importation dans l'environnement Netlify
 * 
 * Ce script crée des shims pour les importations problématiques et modifie
 * directement les fichiers source pour utiliser des chemins d'importation absolus
 * qui fonctionnent correctement dans l'environnement Netlify.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Correction des problèmes d\'importation pour Netlify...');

// Fonction pour normaliser les noms de packages
function normalizePackageName(packageName) {
  // Supprimer les versions et autres suffixes
  return packageName.split('@')[0] || packageName;
}

// Fonction pour vérifier si un module est installé
function isModuleInstalled(moduleName) {
  const normalizedName = normalizePackageName(moduleName);
  const modulePath = path.join(__dirname, 'node_modules', normalizedName);
  return fs.existsSync(modulePath);
}

// Liste des importations problématiques à corriger
const problematicImports = [
  {
    packageName: '@supabase/supabase-js',
    importPattern: /import\s+\{([^}]*)\}\s+from\s+['"]@supabase\/supabase-js['"]/g,
    replacement: (match, imports) => `// Import direct pour éviter les problèmes de résolution Netlify
import {${imports}} from '../../node_modules/@supabase/supabase-js/dist/index.js'`
  },
  {
    packageName: 'react-router-dom',
    importPattern: /import\s+\{([^}]*)\}\s+from\s+['"]react-router-dom['"]/g,
    replacement: (match, imports) => `// Import direct pour éviter les problèmes de résolution Netlify
import {${imports}} from '../../node_modules/react-router-dom/dist/index.js'`
  }
];

// Vérifier que les packages sont installés
for (const importInfo of problematicImports) {
  if (!isModuleInstalled(importInfo.packageName)) {
    console.log(`⚠️ Le package ${importInfo.packageName} n'est pas installé. Installation forcée...`);
    try {
      execSync(`npm install ${importInfo.packageName}@latest --force`, { stdio: 'inherit' });
    } catch (error) {
      console.error(`❌ Erreur lors de l'installation de ${importInfo.packageName}:`, error);
    }
  }
}

// Rechercher tous les fichiers TypeScript et JavaScript dans src
const srcDir = path.resolve(__dirname, 'src');
console.log(`🔍 Recherche de fichiers dans ${srcDir}...`);

function findFiles(dir, extensions, results = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findFiles(filePath, extensions, results);
    } else if (extensions.includes(path.extname(file).toLowerCase())) {
      results.push(filePath);
    }
  }
  
  return results;
}

const tsFiles = findFiles(srcDir, ['.ts', '.tsx', '.js', '.jsx']);
console.log(`🔍 ${tsFiles.length} fichiers trouvés.`);

// Corriger les importations dans chaque fichier
let modifiedCount = 0;

for (const filePath of tsFiles) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;
  let modified = false;
  
  for (const importInfo of problematicImports) {
    if (content.includes(importInfo.packageName)) {
      content = content.replace(importInfo.importPattern, importInfo.replacement);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    modifiedCount++;
    console.log(`✅ Importations corrigées dans ${path.relative(__dirname, filePath)}`);
  }
}

console.log(`\n✨ Correction des importations terminée! ${modifiedCount} fichiers modifiés.`);

// Créer un fichier de shim global pour les importations problématiques
const shimDir = path.resolve(__dirname, 'src', 'lib');
if (!fs.existsSync(shimDir)) {
  fs.mkdirSync(shimDir, { recursive: true });
}

const importShimPath = path.resolve(shimDir, 'import-shim.js');
const shimContent = `/**
 * Shim pour les importations problématiques dans l'environnement Netlify
 * 
 * Ce fichier fournit des shims pour les modules qui peuvent être
 * difficiles à résoudre dans l'environnement Netlify.
 */

// Shim pour react-router-dom
if (typeof window !== 'undefined' && !window.ReactRouterDOM) {
  try {
    window.ReactRouterDOM = require('react-router-dom');
    console.log('✅ Shim pour react-router-dom chargé');
  } catch (error) {
    console.error('❌ Erreur lors du chargement du shim pour react-router-dom:', error);
  }
}

// Shim pour Supabase
if (typeof window !== 'undefined' && !window.Supabase) {
  try {
    window.Supabase = require('@supabase/supabase-js');
    console.log('✅ Shim pour @supabase/supabase-js chargé');
  } catch (error) {
    console.error('❌ Erreur lors du chargement du shim pour @supabase/supabase-js:', error);
  }
}

// Polyfill pour global
if (typeof global === 'undefined') {
  window.global = window;
}

// Polyfill pour Buffer si nécessaire
if (typeof window !== 'undefined' && typeof window.Buffer === 'undefined') {
  window.Buffer = require('buffer/').Buffer;
}

// Exporter le shim
export const importShim = {
  isShimmed: true,
  environment: typeof process !== 'undefined' ? process.env.NODE_ENV : 'unknown'
};

export default importShim;
`;

fs.writeFileSync(importShimPath, shimContent);
console.log(`✅ Fichier de shim créé: ${path.relative(__dirname, importShimPath)}`);

// Mettre à jour le fichier principal pour importer le shim
const mainFile = path.resolve(__dirname, 'src', 'main.tsx');
if (fs.existsSync(mainFile)) {
  let mainContent = fs.readFileSync(mainFile, 'utf-8');
  
  if (!mainContent.includes('import-shim')) {
    mainContent = `import './lib/import-shim';\n${mainContent}`;
    fs.writeFileSync(mainFile, mainContent);
    console.log(`✅ Shim ajouté au fichier principal: ${path.relative(__dirname, mainFile)}`);
  }
}

console.log('\n✨ Correction des importations terminée avec succès!');
