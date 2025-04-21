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
    org: "myself-0sq",
    project: "jobnexus-frontend",
    authToken: "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",
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