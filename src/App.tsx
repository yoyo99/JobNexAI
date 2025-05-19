import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense, useState, useEffect } from 'react';
import ToastContainer from './ToastContainer';

// Importer les styles CSS ici, avant tout autre import
import './index.css';
import './App.css';

// Import immédiat des composants critiques pour la navigation
import { DashboardLayout } from './components/DashboardLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './components/AuthProvider'
import { PrivacyConsent } from './components/PrivacyConsent'
import { SecurityBadge } from './components/SecurityBadge'
import { SubscriptionBanner } from './components/SubscriptionBanner'
import { ErrorBoundary } from './components/ErrorBoundary'

// Composant de chargement amélioré avec timeout pour détecter les blocages
const LoadingFallback = ({ message = 'Chargement de la page...' }) => {
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    // Après 10 secondes, considérer que le chargement est bloqué
    const timer = setTimeout(() => {
      setIsStuck(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[200px] bg-background">
      <div className="w-12 h-12 mb-4 rounded-full border-4 border-white/10 border-t-primary-600 animate-spin"></div>
      <div className="text-white font-medium">{message}</div>
      
      {isStuck && (
        <div className="mt-6 text-secondary-300">
          <p>Le chargement semble prendre plus de temps que prévu.</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary mt-4"
          >
            Recharger la page
          </button>
        </div>
      )}
    </div>
  );
};

// Wrapper pour les composants lazy-loaded avec ErrorBoundary spécifique
const LazyComponentWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary fallback={<div className="card m-8 text-center bg-background/80 backdrop-blur-lg">
      <h2 className="text-xl font-semibold text-primary-400 mb-4">Un problème est survenu lors du chargement de cette page</h2>
      <p className="text-white/80 mb-6">Nous nous excusons pour cet inconvénient. L'équipe technique a été informée du problème.</p>
      <button 
        onClick={() => window.location.reload()}
        className="btn-primary"
      >
        Essayer de recharger
      </button>
    </div>}>
      <Suspense fallback={<LoadingFallback />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

// Code splitting (React.lazy) pour les pages principales
const JobNexAILanding = React.lazy(() => 
  import('./components/JobNexAILanding').then(module => ({
    default: module.LandingPage
  }))
)
const Auth = React.lazy(() => import('./components/Auth'));
const Pricing = React.lazy(() => import('./pages/PricingPage')); 
const PrivacyPolicy = React.lazy(() => import('./components/PrivacyPolicy'));
const FeaturesPage = React.lazy(() => import('./components/pages/FeaturesPage'));
const HowItWorksPage = React.lazy(() => import('./components/pages/HowItWorksPage'));
const TestimonialsPage = React.lazy(() => import('./components/pages/TestimonialsPage'));
const ResetPassword = React.lazy(() => import('./components/ResetPassword'));
const AuthCallback = React.lazy(() => import('./components/AuthCallback'));
const StripeCheckoutStatus = React.lazy(() => import('./components/StripeCheckoutStatus'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Profile = React.lazy(() => import('./components/Profile'));
const Billing = React.lazy(() => import('./components/Billing'));
const JobSearch = React.lazy(() => import('./components/JobSearch'));
const JobApplications = React.lazy(() => import('./components/JobApplications'));
const MarketAnalysis = React.lazy(() => import('./components/MarketAnalysis'));
const CVBuilder = React.lazy(() => import('./components/cv/CVBuilder'));
const Settings = React.lazy(() => import('./components/Settings').then(module => ({ default: module.Settings }))); // AJOUTÉ POUR LA PAGE SETTINGS
const NetworkPage = React.lazy(() => import('./components/NetworkPage'));
const MarketTrendsPage = React.lazy(() => import('./components/pages/MarketTrendsPage'));
const FreelanceProjects = React.lazy(() => import('./components/freelance/FreelanceProjects'));
const FreelanceProfile = React.lazy(() => import('./components/freelance/FreelanceProfile'));
const RecruiterDashboard = React.lazy(() => import('./components/recruiter/RecruiterDashboard'));
const CandidateSearch = React.lazy(() => import('./components/recruiter/CandidateSearch'));
const JobPostings = React.lazy(() => import('./components/recruiter/JobPostings'));
const CreateJobPosting = React.lazy(() => import('./components/recruiter/CreateJobPosting'));
const UserTypeSelection = React.lazy(() => import('./components/UserTypeSelection'));

import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
function App() {
  const version = 'APP_MINIMAL_TEST_V3';
  console.log(`--- ${version} --- App.tsx minimal est déployé ! ---`);
  return (
    <div style={{ padding: '50px', textAlign: 'center', fontSize: '24px', color: 'white', background: 'green' }}>
      {version} - Test de déploiement minimal (CORRIGÉ).
      Si vous voyez ceci, le NOUVEAU App.tsx est en ligne.
    </div>
  );
}
export default App;