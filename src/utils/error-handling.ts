/**
 * Utilitaires pour la gestion centralisée des erreurs
 */

// Codes d'erreurs spécifiques à l'application
export enum ErrorCode {
  // Erreurs d'authentification
  AUTH_INVALID_CREDENTIALS = 'auth/invalid-credentials',
  AUTH_EMAIL_IN_USE = 'auth/email-in-use',
  AUTH_WEAK_PASSWORD = 'auth/weak-password',
  AUTH_USER_NOT_FOUND = 'auth/user-not-found',
  AUTH_SESSION_EXPIRED = 'auth/session-expired',
  
  // Erreurs API
  API_NETWORK_ERROR = 'api/network-error',
  API_SERVER_ERROR = 'api/server-error',
  API_VALIDATION_ERROR = 'api/validation-error',
  API_NOT_FOUND = 'api/not-found',
  API_RATE_LIMIT = 'api/rate-limit',
  
  // Erreurs liées aux ressources
  RESOURCE_NOT_FOUND = 'resource/not-found',
  RESOURCE_ALREADY_EXISTS = 'resource/already-exists',
  RESOURCE_FORBIDDEN = 'resource/forbidden',
  
  // Erreurs génériques
  UNKNOWN_ERROR = 'error/unknown',
}

// Structure d'erreur unifiée
export interface AppError {
  code: ErrorCode | string;
  message: string;
  details?: any;
  originalError?: any;
}

// Mapper les erreurs Supabase vers nos codes d'erreur
export function mapSupabaseError(error: any): AppError {
  // Messages d'erreur courants de Supabase Auth
  if (error?.message?.includes('Invalid login credentials')) {
    return {
      code: ErrorCode.AUTH_INVALID_CREDENTIALS,
      message: 'Email ou mot de passe incorrect',
      originalError: error,
    };
  }
  
  if (error?.message?.includes('User already registered')) {
    return {
      code: ErrorCode.AUTH_EMAIL_IN_USE,
      message: 'Cette adresse email est déjà utilisée',
      originalError: error,
    };
  }
  
  if (error?.message?.includes('Password should be')) {
    return {
      code: ErrorCode.AUTH_WEAK_PASSWORD,
      message: 'Le mot de passe est trop faible',
      originalError: error,
    };
  }
  
  // Erreur non spécifique
  return {
    code: ErrorCode.UNKNOWN_ERROR,
    message: error?.message || 'Une erreur inattendue est survenue',
    originalError: error,
  };
}

// Mapper les erreurs API vers nos codes d'erreur
export function mapApiError(error: any, status?: number): AppError {
  if (!status || status === 0) {
    return {
      code: ErrorCode.API_NETWORK_ERROR,
      message: 'Problème de connexion au serveur',
      originalError: error,
    };
  }
  
  if (status >= 500) {
    return {
      code: ErrorCode.API_SERVER_ERROR,
      message: 'Erreur serveur, veuillez réessayer plus tard',
      originalError: error,
    };
  }
  
  if (status === 404) {
    return {
      code: ErrorCode.API_NOT_FOUND,
      message: 'Ressource introuvable',
      originalError: error,
    };
  }
  
  if (status === 422) {
    return {
      code: ErrorCode.API_VALIDATION_ERROR,
      message: 'Données invalides',
      details: error?.details || error?.validation || null,
      originalError: error,
    };
  }
  
  if (status === 429) {
    return {
      code: ErrorCode.API_RATE_LIMIT,
      message: 'Trop de requêtes, veuillez réessayer plus tard',
      originalError: error,
    };
  }
  
  // Erreur par défaut
  return {
    code: ErrorCode.UNKNOWN_ERROR,
    message: error?.message || 'Une erreur est survenue',
    originalError: error,
  };
}

// Logger d'erreur centralisé
export function logError(error: AppError | any, context?: string): void {
  const errorToLog = (error as AppError).code 
    ? error 
    : { code: ErrorCode.UNKNOWN_ERROR, message: String(error), originalError: error };
  
  console.error(
    `[${context || 'ERROR'}]`,
    `${errorToLog.code}: ${errorToLog.message}`,
    errorToLog.details || '',
    errorToLog.originalError || ''
  );
  
  // Ici on pourrait ajouter l'intégration avec Sentry ou autre service
  // if (import.meta.env.PROD) {
  //   Sentry.captureException(errorToLog);
  // }
}
