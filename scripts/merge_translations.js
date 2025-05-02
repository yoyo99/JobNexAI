// Script Node.js pour fusionner les sections critiques de chaque translation.json vers common.json
// Usage : node scripts/merge_translations.js

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../public/locales');
const CRITICAL_SECTIONS = ['auth', 'dashboard', 'common'];

function mergeDeep(target, source) {
  for (const key of Object.keys(source)) {
    if (
      source[key] && typeof source[key] === 'object' &&
      !(Array.isArray(source[key]))
    ) {
      if (!target[key]) target[key] = {};
      mergeDeep(target[key], source[key]);
    } else {
      if (target[key] === undefined || target[key] === '' || target[key] === null) {
        target[key] = source[key];
      }
    }
  }
  return target;
}

function mergeCriticalSections(localeDir) {
  const translationPath = path.join(localeDir, 'translation.json');
  const commonPath = path.join(localeDir, 'common.json');

  if (!fs.existsSync(translationPath) || !fs.existsSync(commonPath)) {
    console.warn('Missing translation.json or common.json in', localeDir);
    return;
  }

  const translation = JSON.parse(fs.readFileSync(translationPath, 'utf8'));
  const common = JSON.parse(fs.readFileSync(commonPath, 'utf8'));

  let modified = false;

  for (const section of CRITICAL_SECTIONS) {
    if (translation[section]) {
      if (!common[section]) {
        common[section] = translation[section];
        modified = true;
      } else {
        // Fusion clé par clé
        const before = JSON.stringify(common[section]);
        mergeDeep(common[section], translation[section]);
        if (JSON.stringify(common[section]) !== before) {
          modified = true;
        }
      }
    }
  }

  if (modified) {
    fs.writeFileSync(commonPath, JSON.stringify(common, null, 2), 'utf8');
    console.log('Updated', commonPath);
  } else {
    console.log('No changes for', commonPath);
  }
}

function run() {
  const locales = fs.readdirSync(LOCALES_DIR).filter(f => fs.statSync(path.join(LOCALES_DIR, f)).isDirectory());
  for (const locale of locales) {
    const localeDir = path.join(LOCALES_DIR, locale);
    mergeCriticalSections(localeDir);
  }
}

run();
