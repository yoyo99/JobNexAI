const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const hardcodedPath = path.join(__dirname, 'hardcoded-i18n.json');

if (!fs.existsSync(localesDir)) throw new Error('Locales dir not found');
if (!fs.existsSync(hardcodedPath)) throw new Error('Run extract-hardcoded-to-i18n.js first');

const hardcoded = JSON.parse(fs.readFileSync(hardcodedPath, 'utf8'));
const langs = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

langs.forEach(lang => {
  const file = path.join(localesDir, lang, 'translation.json');
  if (!fs.existsSync(file)) throw new Error(`translation.json missing for ${lang}`);
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  Object.entries(hardcoded).forEach(([key, value]) => {
    if (!json[key]) json[key] = value;
  });
  fs.writeFileSync(file, JSON.stringify(json, null, 2), 'utf8');
  console.log(`Mise à jour: ${file}`);
});

console.log('Migration automatique terminée.');
