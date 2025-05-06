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

// Contenu à ajouter pour optimiser le build pour Netlify
const optimizationPatch = `
// Configuration spécifique pour Netlify
const netlifyOptimizations = {
  build: {
    // Empêcher le minification qui peut causer des problèmes
    minify: process.env.NETLIFY ? false : 'esbuild',
    
    // Définir manuellement les chunks pour éviter les problèmes de résolution
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['framer-motion', '@headlessui/react', '@heroicons/react'],
          'vendor-i18n': ['i18next', 'react-i18next', 'i18next-http-backend', 'i18next-browser-languagedetector'],
          'vendor-stripe': ['@stripe/stripe-js', '@stripe/react-stripe-js'],
          'vendor-utils': ['zustand', '@tanstack/react-virtual', 'react-dropzone', 'react-beautiful-dnd', 'react-chartjs-2']
        }
      }
    },
    
    // Augmenter la limite d'avertissement pour la taille des chunks
    chunkSizeWarningLimit: 1000,
  },
  
  // Forcer la résolution des dépendances problématiques
  resolve: {
    alias: {
      // Forcer l'utilisation de versions spécifiques
      'react-router-dom': path.resolve(__dirname, 'node_modules/react-router-dom/dist/index.js'),
      '@supabase/supabase-js': path.resolve(__dirname, 'node_modules/@supabase/supabase-js/dist/index.js'),
    },
    dedupe: ['react', 'react-dom', 'react-router-dom', 'i18next', 'react-i18next']
  }
};

// Fusionner avec la configuration existante
if (process.env.NETLIFY) {
  console.log('📦 Optimisations Netlify activées');
  config = mergeConfig(config, netlifyOptimizations);
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

// Ajouter l'import de mergeConfig s'il n'existe pas déjà
if (!viteConfig.includes('mergeConfig')) {
  viteConfig = viteConfig.replace(
    'import { defineConfig }',
    'import { defineConfig, mergeConfig }'
  );
} else if (!viteConfig.includes('import')) {
  // Si aucun import n'est trouvé, ajouter une ligne complète
  viteConfig = `import { defineConfig, mergeConfig } from 'vite';\n` + viteConfig;
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
