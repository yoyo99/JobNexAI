/**
 * Configuration spécifique pour Netlify
 * Ce fichier aide à résoudre les problèmes de déploiement
 */

module.exports = {
  // Préciser explicitement que c'est un projet React et non Vue.js
  framework: "react",
  
  // Configuration pour le build
  build: {
    environment: {
      VITE_FRAMEWORK: "react",
      NODE_OPTIONS: "--max-old-space-size=4096"
    },
    
    // Ignorer certaines erreurs non critiques
    ignore: [
      "Error: ENOENT: no such file or directory, open '**/Nav.vue'",
      "Warning: Vite"
    ]
  }
};
