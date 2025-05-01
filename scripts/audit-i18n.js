// Audit automatique des clés de traduction utilisées vs présentes dans les fichiers de langue
// Usage : node scripts/audit-i18n.js

const fs = require('fs');
const path = require('path');

// 1. Config
const LOCALES_DIR = path.join(__dirname, '../public/locales');
const SRC_DIR = path.join(__dirname, '../src');
const FILE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];

// 2. Utilitaires
function walk(dir, extList) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath, extList));
    } else if (extList.includes(path.extname(file))) {
      results.push(filePath);
    }
  });
  return results;
}

function extractKeysFromCode(fileContent) {
  // Match t('...'), t("..."), t(`...`), t('...:...'), etc.
  const regex = /\bt\(['"`]([\w\d_.:-]+)['"`]/g;
  const keys = new Set();
  let match;
  while ((match = regex.exec(fileContent)) !== null) {
    keys.add(match[1]);
  }
  return keys;
}

function extractKeysFromJson(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(extractKeysFromJson(obj[key], prefix ? `${prefix}.${key}` : key));
    } else {
      keys.push(prefix ? `${prefix}.${key}` : key);
    }
  }
  return keys;
}

// 3. Extraction des clés utilisées dans le code
console.log('Analyse du code source...');
const codeFiles = walk(SRC_DIR, FILE_EXTENSIONS);
const usedKeys = new Set();
codeFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  extractKeysFromCode(content).forEach(k => usedKeys.add(k));
});

// 4. Extraction des clés présentes dans chaque langue
console.log('Analyse des fichiers de langue...');
const locales = fs.readdirSync(LOCALES_DIR).filter(f => fs.statSync(path.join(LOCALES_DIR, f)).isDirectory());
const localeKeys = {};
locales.forEach(locale => {
  const jsonPath = path.join(LOCALES_DIR, locale, 'common.json');
  if (fs.existsSync(jsonPath)) {
    const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    localeKeys[locale] = new Set(extractKeysFromJson(json));
  } else {
    localeKeys[locale] = new Set();
  }
});

// 5. Audit et rapport
console.log('\n=== RAPPORT D\'AUDIT DES TRADUCTIONS ===\n');
locales.forEach(locale => {
  const missing = [...usedKeys].filter(k => !localeKeys[locale].has(k));
  const unused = [...localeKeys[locale]].filter(k => !usedKeys.has(k));
  console.log(`Langue : ${locale}`);
  console.log(`  Clés utilisées absentes du fichier : ${missing.length}`);
  if (missing.length) {
    console.log('    - ' + missing.join('\n    - '));
  }
  console.log(`  Clés présentes mais non utilisées dans le code : ${unused.length}`);
  if (unused.length) {
    console.log('    - ' + unused.join('\n    - '));
  }
  console.log('');
});

console.log('Audit terminé.');
