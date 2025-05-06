// Patch pour la configuration Vite pour résoudre les problèmes de déploiement Netlify
const fs = require('fs');
const path = require('path');

// Chemin vers le fichier de configuration Vite
const viteConfigPath = path.resolve(__dirname, 'vite.config.ts');

console.log('🔧 Application du patch pour vite.config.ts...');

// Vérifier si le fichier existe
if (!fs.existsSync(viteConfigPath)) {
  console.error('❌ Le fichier vite.config.ts n\'existe pas!');
  process.exit(1);
}

// Lire le contenu du fichier
let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');

// Vérifier quelle version de Vite est utilisée
const packageJsonPath = path.resolve(__dirname, 'package.json');
let viteVersion = "";
if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    viteVersion = packageJson.devDependencies?.vite || "";
    console.log(`Version de Vite détectée: ${viteVersion}`);
  } catch (error) {
    console.error('❌ Erreur lors de la lecture du package.json:', error);
  }
}

// Contenu à ajouter pour optimiser le build pour Netlify
const optimizationPatch = `
// Modification directe de la configuration pour Netlify sans utiliser mergeConfig
if (process.env.NETLIFY) {
  console.log('💶 Optimisations Netlify activées');
  
  // Paramètres de build
  config.build = config.build || {};
  config.build.minify = false; // Désactiver la minification pour éviter les problèmes
  config.build.chunkSizeWarningLimit = 1000; // Augmenter la limite d'avertissement
  
  // Configuration des rollupOptions
  config.build.rollupOptions = config.build.rollupOptions || {};
  config.build.rollupOptions.output = config.build.rollupOptions.output || {};
  config.build.rollupOptions.output.manualChunks = {
    'vendor-react': ['react', 'react-dom', 'react-router-dom'],
    'vendor-ui': ['framer-motion', '@headlessui/react', '@heroicons/react'],
    'vendor-i18n': ['i18next', 'react-i18next', 'i18next-http-backend', 'i18next-browser-languagedetector'],
    'vendor-stripe': ['@stripe/stripe-js', '@stripe/react-stripe-js'],
    'vendor-utils': ['zustand', '@tanstack/react-virtual', 'react-dropzone', 'react-beautiful-dnd', 'react-chartjs-2']
  };
  
  // Alias pour résoudre les problèmes d'importation
  config.resolve = config.resolve || {};
  config.resolve.alias = config.resolve.alias || {};
  
  // Ajouter les alias pour les dépendances problématiques
  Object.assign(config.resolve.alias, {
    'react-router-dom': path.resolve(__dirname, 'node_modules/react-router-dom/dist/index.js'),
    '@supabase/supabase-js': path.resolve(__dirname, 'node_modules/@supabase/supabase-js/dist/index.js')
  });
  
  // Déduplication des modules
  config.resolve.dedupe = ['react', 'react-dom', 'react-router-dom', 'i18next', 'react-i18next'];
}
`;

// Trouver l'endroit où insérer le patch (juste avant l'export)
if (viteConfig.includes('export default defineConfig')) {
  // Insérer avant l'export
  viteConfig = viteConfig.replace(
    'export default defineConfig',
    optimizationPatch + '\nexport default defineConfig'
  );
} else {
  console.log('⚠️ Pattern export default defineConfig non trouvé, essai avec export default');
  // Alternative si le pattern exact n'est pas trouvé
  viteConfig = viteConfig.replace(
    'export default',
    optimizationPatch + '\nexport default'
  );
}

// Ne pas ajouter d'import pour mergeConfig car nous n'utilisons plus cette fonction
// Au lieu de cela, nous nous assurons simplement que l'import de path est présent
if (!viteConfig.includes('import path from')) {
  if (viteConfig.includes('import')) {
    // Ajouter l'import de path à la ligne d'import existante
    viteConfig = viteConfig.replace(
      /import\s+([^;]+)\s+from\s+['|"]([^'|"]+)['|"]/,
      (match) => `import path from 'path';\n${match}`
    );
  } else {
    // Si aucun import n'est trouvé, ajouter une ligne complète
    viteConfig = `import path from 'path';\n` + viteConfig;
  }
}

// Écrire le fichier modifié
fs.writeFileSync(viteConfigPath, viteConfig);
console.log('✅ Patch appliqué avec succès à vite.config.ts');

// Bonus: Ajouter un indice visuel pour savoir si l'application fonctionne
console.log('📝 Ajout d\'un indicateur visuel au HTML...');
const indexHtmlPath = path.resolve(__dirname, 'index.html');

if (fs.existsSync(indexHtmlPath)) {
  let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  
  // Ajouter un élément visible même si React ne se charge pas
  if (!indexHtml.includes('app-loading-indicator')) {
    indexHtml = indexHtml.replace(
      '<div id="root"></div>',
      `<div id="root">
        <div id="app-loading-indicator" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #f9fafb; color: #111827; font-family: system-ui, -apple-system, sans-serif;">
          <h1 style="font-size: 24px; margin-bottom: 16px;">JobNexus</h1>
          <p>Loading application...</p>
        </div>
      </div>`
    );
    
    fs.writeFileSync(indexHtmlPath, indexHtml);
    console.log('✅ Indicateur de chargement ajouté à index.html');
  }
}
