import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import viteCompression from 'vite-plugin-compression'
// Compatibilité avec les fichiers Nav.vue requis par Netlify
// Remarque : cette ligne ne sera pas utilisée par l'application React principale
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
  // Améliorer la résolution des modules
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    // Pas d'alias pour rester cohérent avec les pratiques d'import du projet
  },
  build: {
    emptyOutDir: true,
    sourcemap: true,
    target: 'esnext', // Set the build target to esnext to support top-level await
    rollupOptions: {
      // Exclure les modules problématiques pour Netlify
      external: ['pnpapi', 'node_modules', /^puppeteer($|\/.*$)/],
      output: {
        // Optimisation des chunks pour une meilleure performance
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@headlessui/react', '@heroicons/react'],
          i18n: ['i18next', 'react-i18next'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})