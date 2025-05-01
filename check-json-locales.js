// check-json-locales.js
const fs = require('fs');
const path = require('path');

function checkJsonFile(filePath) {
  try {
    JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return null; // Pas d'erreur
  } catch (e) {
    return e.message;
  }
}

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else if (f.endsWith('.json')) {
      callback(fullPath);
    }
  });
}

const root = path.join(__dirname, 'public', 'locales');
let errors = 0;

walkDir(root, (file) => {
  const err = checkJsonFile(file);
  if (err) {
    console.error(`❌ JSON invalide : ${file}\n   ↳ ${err}`);
    errors++;
  } else {
    console.log(`✅ ${file}`);
  }
});

if (errors === 0) {
  console.log('Tous les fichiers JSON sont valides !');
} else {
  console.log(`${errors} fichier(s) JSON invalide(s) trouvé(s).`);
}
