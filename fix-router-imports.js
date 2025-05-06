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
