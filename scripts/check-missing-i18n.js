const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const usedKeys = new Set();
function scanDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (/\.(tsx?|jsx?)$/.test(file)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      // Cherche t('clé') ou t("clé")
      const matches = [...content.matchAll(/t\(['"]([a-zA-Z0-9_.\[\]0-9]+)['"]/g)];
      matches.forEach(m => usedKeys.add(m[1]));
    }
  });
}
scanDir('./src');

// Lis les fichiers de traduction
const langs = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());
langs.forEach(lang => {
  const file = path.join(localesDir, lang, 'translation.json');
  if (!fs.existsSync(file)) return;
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  const flatten = (obj, prefix = '') =>
    Object.entries(obj).reduce((acc, [k, v]) => {
      const pre = prefix ? prefix + '.' + k : k;
      if (typeof v === 'object' && v !== null && !Array.isArray(v)) Object.assign(acc, flatten(v, pre));
      else acc[pre] = v;
      return acc;
    }, {});
  const keys = flatten(json);
  const missing = [];
  usedKeys.forEach(key => {
    if (!keys[key]) missing.push(key);
  });
  if (missing.length) {
    console.log(`Clés manquantes pour la langue ${lang}:`);
    missing.forEach(k => console.log('  ' + k));
  } else {
    console.log(`Aucune clé manquante pour la langue ${lang}.`);
  }
});
