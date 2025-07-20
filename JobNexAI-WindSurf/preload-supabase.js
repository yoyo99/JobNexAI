/**
 * Script de préchargement de Supabase
 * 
 * Ce script permet de charger dynamiquement la bibliothèque Supabase avant
 * le démarrage de l'application et de l'exposer globalement à window.supabase
 * pour contourner les problèmes d'importation sur Netlify.
 */

(function() {
  console.log('🔄 Préchargement de Supabase...');
  
  // Fonction pour injecter un script dans le document
  function injectScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = callback;
    script.onerror = function() {
      console.warn('❌ Impossible de charger Supabase depuis CDN');
      // En cas d'échec, nous définissons un stub pour éviter les erreurs
      window.supabase = {
        createClient: function(url, key) {
          console.warn('⚠️ Utilisation du client Supabase de secours');
          return {
            auth: {
              getUser: () => Promise.resolve({ data: { user: null }, error: null }),
              getSession: () => Promise.resolve({ data: { session: null }, error: null }),
              signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Service indisponible' } }),
              signUp: () => Promise.resolve({ data: null, error: { message: 'Service indisponible' } }),
              signOut: () => Promise.resolve({ error: null })
            },
            from: () => ({
              select: () => ({
                eq: () => ({
                  single: () => Promise.resolve({ data: null, error: null }),
                  then: (fn) => Promise.resolve({ data: [], error: null }).then(fn)
                }),
                then: (fn) => Promise.resolve({ data: [], error: null }).then(fn)
              }),
              insert: () => Promise.resolve({ data: null, error: null }),
              update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
              delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) })
            }),
            storage: {
              from: () => ({
                upload: () => Promise.resolve({ data: null, error: null }),
                getPublicUrl: () => ({ data: { publicUrl: '' } })
              })
            }
          };
        }
      };
      if (typeof window.__SUPABASE_LOADED_CALLBACK === 'function') {
        window.__SUPABASE_LOADED_CALLBACK();
      }
    };
    document.head.appendChild(script);
  }
  
  // Charger Supabase depuis CDN
  injectScript('https://unpkg.com/@supabase/supabase-js@2', function() {
    console.log('✅ Supabase chargé avec succès depuis CDN');
    // Exposer supabase globalement
    window.supabase = supabase;
    
    // Notifier l'application que Supabase est chargé
    if (typeof window.__SUPABASE_LOADED_CALLBACK === 'function') {
      window.__SUPABASE_LOADED_CALLBACK();
    }
  });
  
  // Définir un timeout pour continuer le chargement même si Supabase échoue
  setTimeout(function() {
    if (typeof window.__SUPABASE_LOADED_CALLBACK === 'function' && !window.supabase) {
      console.warn('⚠️ Timeout pendant le chargement de Supabase, continuons sans...');
      window.__SUPABASE_LOADED_CALLBACK();
    }
  }, 5000);
})();
