/**
 * Module de compatibilité pour react-router-dom
 * 
 * Ce fichier sert de couche de compatibilité pour assurer que les importations
 * de react-router-dom fonctionnent correctement dans tous les environnements.
 */

import * as ReactRouterDOM from 'react-router-dom';

// Réexporter tous les exports de react-router-dom
export const {
  BrowserRouter,
  HashRouter,
  Link,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Router,
  Routes,
  useHref,
  useInRouterContext,
  useLinkClickHandler,
  useLocation,
  useMatch,
  useNavigate,
  useNavigationType,
  useOutlet,
  useOutletContext,
  useParams,
  useResolvedPath,
  useRoutes,
  useSearchParams,
  // ... tout autre export que vous utilisez
} = ReactRouterDOM;

// Exporter également les alias courants
export const Router = ReactRouterDOM.BrowserRouter;

// Exporter le module entier comme défaut
export default ReactRouterDOM;
