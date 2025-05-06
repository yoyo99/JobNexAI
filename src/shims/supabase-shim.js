/**
 * Shim pour Supabase
 * 
 * Ce fichier fournit des polyfills et des adaptations pour que Supabase
 * fonctionne correctement dans l'environnement Netlify.
 */

// Polyfill pour global (nécessaire pour Supabase)
if (typeof window !== 'undefined') {
  window.global = window;
  window.process = window.process || {};
  window.process.env = window.process.env || {};
}

// Export des objets globaux
export const SupabaseShim = {
  isShimmed: true,
  environment: 'netlify'
};

export default SupabaseShim;
