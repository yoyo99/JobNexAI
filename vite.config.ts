import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import viteCompression from 'vite-plugin-compression'

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

// Add Sentry plugin with the provided auth token
plugins.push(
  sentryVitePlugin({
    org: process.env.VITE_SENTRY_ORG,
    project: process.env.VITE_SENTRY_PROJECT,
    authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
    telemetry: false,
  })
)

export default defineConfig({
  plugins,
  optimizeDeps: {
    include: ['@tanstack/react-virtual'],
  },
  build: {
    sourcemap: true,
    target: 'esnext', // Set the build target to esnext to support top-level await
    rollupOptions: {
      external: ['pnpapi'],
      output: {
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