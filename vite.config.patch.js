/**
 * Script de correction pour vite.config.ts
 * 
 * Ce script remplace complètement le fichier vite.config.ts par une version optimisée
 * qui fonctionne correctement dans l'environnement Netlify.
 */

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

// Lire le contenu du fichier original
let originalConfig = fs.readFileSync(viteConfigPath, 'utf8');

// Créer une nouvelle configuration Vite complète
const newViteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import viteCompression from 'vite-plugin-compression'
import path from 'path'

// Compatibilité avec les fichiers Nav.vue requis par Netlify
const emptyPlugin = { name: 'empty-plugin' }

// Create plugins array with required plugins
const plugins = [
  react(),
  viteCompression({
    algorithm: 'gzip',
    ext: '.gz',
  }),
  viteCompression({
    algorithm: 'brotliCompress',
    ext: '.br',
  }),
]

// Conditionally add Sentry plugin only if auth token is available
if (process.env.VITE_SENTRY_AUTH_TOKEN) {
  plugins.push(
    sentryVitePlugin({
      org: process.env.VITE_SENTRY_ORG,
      project: process.env.VITE_SENTRY_PROJECT,
      authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
      telemetry: false,
    })
  )
}

export default defineConfig({
  plugins,
  optimizeDeps: {
    include: ['@tanstack/react-virtual'],
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'src': path.resolve(__dirname, 'src'),
      // Ajouter les alias pour les dépendances problématiques
      'react-router-dom': path.resolve(__dirname, 'node_modules/react-router-dom/dist/index.js'),
      '@supabase/supabase-js': path.resolve(__dirname, 'node_modules/@supabase/supabase-js/dist/index.js')
    },
    preserveSymlinks: true,
    mainFields: ['module', 'jsnext:main', 'jsnext', 'browser', 'main'],
    dedupe: ['react', 'react-dom', 'react-router-dom', 'i18next', 'react-i18next']
  },
  build: {
    emptyOutDir: true,
    sourcemap: true,
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    copyPublicDir: true,
    // Configuration spécifique pour Netlify
    ...(process.env.NETLIFY ? {
      minify: false, // Désactiver la minification pour éviter les problèmes
      chunkSizeWarningLimit: 1000, // Augmenter la limite d'avertissement
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
      }
    } : {})
  }
});
`;

// Sauvegarder la configuration originale
console.log('💾 Sauvegarde de la configuration originale...');
fs.writeFileSync(viteConfigPath + '.backup', originalConfig);

// Écrire la nouvelle configuration
console.log('✏️ Écriture de la nouvelle configuration Vite...');
fs.writeFileSync(viteConfigPath, newViteConfig);

console.log('✅ Configuration Vite mise à jour avec succès!');

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
