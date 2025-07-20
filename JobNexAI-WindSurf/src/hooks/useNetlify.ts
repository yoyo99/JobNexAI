import { useCallback } from 'react';
import { api } from '../utils/api';
import { useAuth } from './useAuth';

/**
 * Hook pour faciliter l'accès aux fonctions Netlify
 * Fournit une interface unifiée pour les appels API avec authentification
 */
export function useNetlify() {
  const { session } = useAuth();
  
  // Méthode pour obtenir l'en-tête d'autorisation
  const getAuthHeaders = useCallback(() => {
    return {
      token: session?.access_token
    };
  }, [session]);
  
  // Appels GET avec authentification automatique
  const get = useCallback(<T = any>(endpoint: string, options = {}) => {
    return api.get<T>(endpoint, {
      ...options,
      ...getAuthHeaders()
    });
  }, [getAuthHeaders]);
  
  // Appels POST avec authentification automatique
  const post = useCallback(<T = any>(endpoint: string, body: any, options = {}) => {
    return api.post<T>(endpoint, body, {
      ...options,
      ...getAuthHeaders()
    });
  }, [getAuthHeaders]);
  
  // Appels PUT avec authentification automatique
  const put = useCallback(<T = any>(endpoint: string, body: any, options = {}) => {
    return api.put<T>(endpoint, body, {
      ...options,
      ...getAuthHeaders()
    });
  }, [getAuthHeaders]);
  
  // Appels DELETE avec authentification automatique
  const del = useCallback(<T = any>(endpoint: string, options = {}) => {
    return api.delete<T>(endpoint, {
      ...options,
      ...getAuthHeaders()
    });
  }, [getAuthHeaders]);
  
  // Appels PATCH avec authentification automatique
  const patch = useCallback(<T = any>(endpoint: string, body: any, options = {}) => {
    return api.patch<T>(endpoint, body, {
      ...options,
      ...getAuthHeaders()
    });
  }, [getAuthHeaders]);
  
  /**
   * Vérifier que l'authentification est valide avec Netlify Functions
   * Utile pour tester la configuration et les permissions
   */
  const checkAuth = useCallback(async () => {
    return await get('auth');
  }, [get]);
  
  return {
    get,
    post,
    put,
    delete: del, // 'delete' est un mot réservé en JS
    patch,
    checkAuth,
    isAuthenticated: !!session?.access_token,
  };
}
