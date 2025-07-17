import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../stores/auth';
import { LoadingFallback } from './LoadingFallback';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, initialized } = useAuth();
  const location = useLocation();

  if (!initialized) {
    // Affiche un écran de chargement pendant que l'état d'authentification est vérifié
    return <LoadingFallback message="Vérification de la session..." />;
  }

  if (user) {
    // Si l'utilisateur est connecté, le rediriger loin de la page publique (ex: login, register)
    // vers la page d'où il venait ou le dashboard par défaut.
    const from = location.state?.from?.pathname || '/app/dashboard';
    return <Navigate to={from} replace />;
  }

  // Si l'utilisateur n'est pas connecté, afficher la page publique demandée
  return <>{children}</>;
};
