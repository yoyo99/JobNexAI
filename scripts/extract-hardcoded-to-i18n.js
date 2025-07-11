const fs = require('fs');
const path = require('path');

const hardcoded = {};

function scanDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (/\.(tsx?|jsx?)$/.test(file)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const matches = [...content.matchAll(/>\s*([A-Za-zÀ-ÿ0-9 ,.'’“”«»!?-]{2,})\s*</g)];
      if (matches.length > 0) {
        hardcoded[fullPath] = matches.map(m => m[1].trim()).filter(Boolean);
      }
    }
  });
}

scanDir('./src');

const i18nObj = {};
Object.entries(hardcoded).forEach(([file, arr]) => {
  arr.forEach((txt, idx) => {
    const key = path.basename(file, path.extname(file)) + '.text' + idx;
    i18nObj[key] = txt;
  });
});

fs.writeFileSync('./scripts/hardcoded-i18n.json', JSON.stringify(i18nObj, null, 2), 'utf8');
console.log('Fichier ./scripts/hardcoded-i18n.json généré.');
