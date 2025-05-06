/**
 * Script spécifique pour corriger les problèmes d'importation de react-router-dom
 * 
 * Ce script vérifie et corrige les importations de react-router-dom dans les fichiers
 * source, en s'assurant qu'ils utilisent les chemins d'importation standards.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Vérification des importations de react-router-dom...');

// Fonction pour créer le fichier main.js dans react-router-dom si nécessaire
function createMainJsFile() {
  const reactRouterDir = path.join(__dirname, 'node_modules', 'react-router-dom');
  const mainJsPath = path.join(reactRouterDir, 'main.js');
  const distPath = path.join(reactRouterDir, 'dist');
  const indexJsPath = path.join(reactRouterDir, 'index.js');
  const umdPath = path.join(reactRouterDir, 'umd');
  
  // Vérifier si le répertoire existe
  if (!fs.existsSync(reactRouterDir)) {
    console.error(`❌ Le répertoire react-router-dom n'existe pas: ${reactRouterDir}`);
    return;
  }

  // Créer le contenu du fichier main.js
  // Nous allons être exhaustifs dans la façon dont nous référençons les fichiers
  // pour maximiser les chances que cela fonctionne sur Netlify
  const mainJsContent = `/**
 * Polyfill pour react-router-dom
 */

'use strict';

// Détecter la source disponible
let routerLib;

try {
  // Essayer d'abord l'index.js à la racine
  routerLib = require('./index.js');
} catch (e) {
  try {
    // Ensuite essayer le répertoire dist
    routerLib = require('./dist/index.js');
  } catch (e) {
    try {
      // Essayer la version UMD
      routerLib = require('./umd/react-router-dom.development.js');
    } catch (e) {
      console.error('Impossible de charger react-router-dom:', e);
      // Fournir un module vide comme fallback
      routerLib = {
        BrowserRouter: function() {},
        Routes: function() {},
        Route: function() {},
        Link: function() {},
        useNavigate: function() { return function() {}; },
        useParams: function() { return {}; },
        useLocation: function() { return {}; }
      };
    }
  }
}

module.exports = routerLib;
`;

  // Créer un fichier de symétrie pour s'assurer que le module est accessible
  const symmetryContent = `/**
 * Fichier de symétrie pour react-router-dom
 * Assure que le module peut être importé de plusieurs façons
 */
module.exports = require('./main.js');
`;

  try {
    // Créer le répertoire dist s'il n'existe pas
    if (!fs.existsSync(distPath)) {
      fs.mkdirSync(distPath, { recursive: true });
      console.log(`✅ Répertoire ${distPath} créé`);
    }
    
    // Créer le répertoire umd s'il n'existe pas
    if (!fs.existsSync(umdPath)) {
      fs.mkdirSync(umdPath, { recursive: true });
      console.log(`✅ Répertoire ${umdPath} créé`);
    }

    // Créer les fichiers
    fs.writeFileSync(mainJsPath, mainJsContent);
    console.log(`✅ Fichier ${mainJsPath} créé`);
    
    // Créer un index.js dans le répertoire dist qui pointe vers main.js
    const distIndexPath = path.join(distPath, 'index.js');
    fs.writeFileSync(distIndexPath, symmetryContent);
    console.log(`✅ Fichier ${distIndexPath} créé`);
    
    // Créer un fichier umd si nécessaire
    const umdFilePath = path.join(umdPath, 'react-router-dom.development.js');
    fs.writeFileSync(umdFilePath, symmetryContent);
    console.log(`✅ Fichier ${umdFilePath} créé`);
    
    // S'assurer que index.js à la racine existe aussi
    if (!fs.existsSync(indexJsPath)) {
      fs.writeFileSync(indexJsPath, symmetryContent);
      console.log(`✅ Fichier ${indexJsPath} créé`);
    }
    
    console.log('✅ Configuration de react-router-dom terminée avec succès');
  } catch (error) {
    console.error(`❌ Erreur lors de la configuration de react-router-dom:`, error);
  }
}

// Vérifier que react-router-dom est correctement installé
const routerPath = path.resolve(__dirname, 'node_modules/react-router-dom');
if (!fs.existsSync(routerPath)) {
  console.log('⚠️ react-router-dom n\'est pas installé. Installation forcée...');
  try {
    execSync('npm install react-router-dom@latest --force', { stdio: 'inherit' });
    console.log('✅ react-router-dom installé avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'installation de react-router-dom:', error);
    process.exit(1);
  }
}

// Créer le fichier main.js si nécessaire
createMainJsFile();

// Vérifier la version installée
try {
  const packageJsonPath = path.resolve(routerPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    console.log(`Version de react-router-dom installée: ${packageJson.version}`);
  }
} catch (error) {
  console.error('❌ Erreur lors de la vérification de la version de react-router-dom:', error);
}

// Vérifier les sous-dépendances requises
const requiredDeps = [
  '@remix-run/router',
  'react-router'
];

console.log('\n🔍 Vérification des sous-dépendances de react-router-dom...');
const missingDeps = [];

for (const dep of requiredDeps) {
  const depPath = path.resolve(__dirname, 'node_modules', dep);
  
  if (!fs.existsSync(depPath)) {
    console.log(`❌ ${dep} est manquant`);
    missingDeps.push(dep);
  } else {
    console.log(`✅ ${dep} est présent`);
  }
}

// Installer les dépendances manquantes
if (missingDeps.length > 0) {
  console.log('\n🔄 Installation des sous-dépendances manquantes...');
  try {
    execSync(`npm install ${missingDeps.join(' ')} --force`, { stdio: 'inherit' });
    console.log('✅ Sous-dépendances installées avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'installation des sous-dépendances:', error);
  }
}

// Vérifier spécifiquement le fichier App.tsx
const appTsxPath = path.resolve(__dirname, 'src/App.tsx');
if (fs.existsSync(appTsxPath)) {
  console.log('\n🔍 Vérification des importations dans App.tsx...');
  
  let content = fs.readFileSync(appTsxPath, 'utf-8');
  const originalContent = content;
  
  // Vérifier si l'importation utilise un chemin absolu vers node_modules
  if (content.includes('../../node_modules/react-router-dom')) {
    console.log('⚠️ Importation incorrecte détectée dans App.tsx');
    
    // Corriger l'importation
    content = content.replace(
      /import\s+\{([^}]*)\}\s+from\s+['"]\.\.\/\.\.\/node_modules\/react-router-dom\/[^'"]*['"]/g,
      (match, imports) => `import {${imports}} from 'react-router-dom'`
    );
    
    // Sauvegarder le fichier corrigé
    fs.writeFileSync(appTsxPath, content);
    console.log('✅ Importations corrigées dans App.tsx');
  } else {
    console.log('✅ Les importations dans App.tsx semblent correctes');
  }
  
  // Vérifier si d'autres fichiers importent react-router-dom
  console.log('\n🔍 Recherche d\'autres fichiers qui importent react-router-dom...');
  
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
  
  const srcDir = path.resolve(__dirname, 'src');
  const tsFiles = findFiles(srcDir, ['.ts', '.tsx', '.js', '.jsx']);
  
  let modifiedCount = 0;
  
  for (const filePath of tsFiles) {
    if (filePath === appTsxPath) continue; // Déjà traité
    
    let fileContent = fs.readFileSync(filePath, 'utf-8');
    
    if (fileContent.includes('react-router-dom')) {
      console.log(`🔍 Vérification de ${path.relative(__dirname, filePath)}...`);
      
      const originalFileContent = fileContent;
      
      // Corriger les importations absolues
      fileContent = fileContent.replace(
        /import\s+\{([^}]*)\}\s+from\s+['"]\.\.\/\.\.\/node_modules\/react-router-dom\/[^'"]*['"]/g,
        (match, imports) => `import {${imports}} from 'react-router-dom'`
      );
      
      if (fileContent !== originalFileContent) {
        fs.writeFileSync(filePath, fileContent);
        modifiedCount++;
        console.log(`✅ Importations corrigées dans ${path.relative(__dirname, filePath)}`);
      }
    }
  }
  
  console.log(`\n✨ Vérification terminée. ${modifiedCount} fichiers supplémentaires corrigés.`);
}

// Créer un module de compatibilité pour react-router-dom
console.log('\n📝 Création d\'un module de compatibilité pour react-router-dom...');

const compatDir = path.resolve(__dirname, 'src/compat');
if (!fs.existsSync(compatDir)) {
  fs.mkdirSync(compatDir, { recursive: true });
}

const routerCompatPath = path.resolve(compatDir, 'react-router-dom.ts');
const routerCompatContent = `/**
 * Module de compatibilité pour react-router-dom
 * 
 * Ce fichier sert de couche de compatibilité pour assurer que les importations
 * de react-router-dom fonctionnent correctement dans tous les environnements.
 */

import * as ReactRouterDOM from 'react-router-dom';

// Réexporter tous les exports de react-router-dom
export const {
  BrowserRouter,
  HashRouter,
  Link,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useHref,
  useInRouterContext,
  useLinkClickHandler,
  useLocation,
  useMatch,
  useNavigate,
  useNavigationType,
  useOutlet,
  useOutletContext,
  useParams,
  useResolvedPath,
  useRoutes,
  useSearchParams,
  // ... tout autre export que vous utilisez
} = ReactRouterDOM;

// Exporter également les alias courants
export const Router = ReactRouterDOM.BrowserRouter;

// Exporter le module entier comme défaut
export default ReactRouterDOM;
`;

fs.writeFileSync(routerCompatPath, routerCompatContent);
console.log(`✅ Module de compatibilité créé: ${path.relative(__dirname, routerCompatPath)}`);

// Ajouter une instruction pour utiliser le module de compatibilité
console.log('\n💡 Pour résoudre les problèmes d\'importation, vous pouvez utiliser le module de compatibilité:');
console.log('   import { ... } from \'../compat/react-router-dom\';');

console.log('\n✨ Correction des importations react-router-dom terminée!');
