const fs = require('fs');
const path = require('path');

function scanDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (/\.(tsx?|jsx?)$/.test(file)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      // Simple regex: strings in JSX tags, not props (improve as needed)
      const matches = [...content.matchAll(/>\s*([A-Za-zÀ-ÿ0-9 ,.'’“”«»!?-]{2,})\s*</g)];
      if (matches.length > 0) {
        console.log(`\n${fullPath}:`);
        matches.forEach(m => console.log(`  Hardcoded: "${m[1].trim()}"`));
      }
    }
  });
}

scanDir('./src');
