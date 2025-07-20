// fusion-i18n.js
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'public', 'locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

function deepMerge(target, source) {
  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      key in target &&
      typeof target[key] === 'object'
    ) {
      deepMerge(target[key], source[key]);
    } else if (!(key in target)) {
      target[key] = source[key];
    }
    // Si tu veux forcer l'écrasement, remplace le else if par else
  }
}

languages.forEach((lang) => {
  const langDir = path.join(localesDir, lang);
  const commonPath = path.join(langDir, 'common.json');
  const translationPath = path.join(langDir, 'translation.json');

  if (!fs.existsSync(commonPath)) {
    console.warn(`Pas de common.json pour ${lang}, création...`);
    fs.writeFileSync(commonPath, '{}', 'utf8');
  }
  const common = JSON.parse(fs.readFileSync(commonPath, 'utf8'));
  if (fs.existsSync(translationPath)) {
    const translation = JSON.parse(fs.readFileSync(translationPath, 'utf8'));
    deepMerge(common, translation);
    fs.writeFileSync(commonPath, JSON.stringify(common, null, 2), 'utf8');
    // Vide le translation.json
    fs.writeFileSync(translationPath, '{}', 'utf8');
    console.log(`Fusionné translation.json dans common.json pour ${lang}`);
  } else {
    console.log(`Aucun translation.json pour ${lang}`);
  }
});

console.log('Fusion terminée !');
