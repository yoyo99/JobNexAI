const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Modèles de chemins problématiques à rechercher et corriger
const PROBLEMATIC_PATTERNS = [
  { search: /JobApplications\.tsx\}/g, replace: 'JobApplications.tsx' },
  { search: /\.tsx\}/g, replace: '.tsx' },
  { search: /\.ts\}/g, replace: '.ts' }
];

// Extensions de fichiers à vérifier
const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.json'];

// Fonction récursive pour explorer les répertoires et traiter les fichiers
async function processDirectory(dirPath) {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      // Ignorer node_modules, .git, dist, etc.
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist' || entry.name === '.netlify') {
        continue;
      }
      
      if (entry.isDirectory()) {
        await processDirectory(fullPath);
      } else if (entry.isFile() && FILE_EXTENSIONS.includes(path.extname(entry.name))) {
        await processFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`Erreur lors du traitement du répertoire ${dirPath}:`, error);
  }
}

// Fonction pour traiter un fichier et corriger les chemins problématiques
async function processFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    let newContent = content;
    let hasChanges = false;
    
    // Vérifier et corriger chaque modèle problématique
    for (const pattern of PROBLEMATIC_PATTERNS) {
      if (pattern.search.test(newContent)) {
        newContent = newContent.replace(pattern.search, pattern.replace);
        hasChanges = true;
        console.log(`Corrigé dans ${filePath}: ${pattern.search} -> ${pattern.replace}`);
      }
    }
    
    // Si des modifications ont été apportées, sauvegarder le fichier
    if (hasChanges) {
      await writeFile(filePath, newContent, 'utf8');
    }
  } catch (error) {
    console.error(`Erreur lors du traitement du fichier ${filePath}:`, error);
  }
}

// Point d'entrée principal
async function main() {
  const rootDir = process.argv[2] || '.';
  console.log(`Correction des chemins d'importation dans ${rootDir}...`);
  await processDirectory(rootDir);
  console.log('Terminé !');
}

main().catch(console.error);
