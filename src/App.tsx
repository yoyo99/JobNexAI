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
const Pricing = React.lazy(() => import('./components/Pricing'));
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
  console.log('[App] Démarrage de l\'application...');
  console.log('[i18n-debug] Langue courante:', i18n.language, '| Ressources:', Object.keys(i18n.services.resourceStore.data), '| Namespaces:', i18n.options.ns);

  // Ajouter des gestionnaires d'événements globaux pour détecter les erreurs non capturées
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('[App] Erreur globale non capturée:', event.error || event.message);
      // Afficher une notification erreur si possible
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('[App] Promesse rejetée non gérée:', event.reason);
      // Afficher une notification erreur si possible
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return (
    <ErrorBoundary fallback={<div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="card max-w-lg mx-auto w-full bg-gradient-to-b from-background to-background/80 border-primary-500/20">
        <h2 className="text-2xl font-bold text-primary-400 mb-4">Un problème critique est survenu</h2>
        <p className="text-white/80 mb-6">L'application a rencontré une erreur et n'a pas pu charger correctement.</p>
        <button 
          onClick={() => window.location.reload()}
          className="btn-primary w-full"
        >
          Recharger l'application
        </button>
      </div>
    </div>}>
      <I18nextProvider i18n={i18n}>
        <Router>
          <AuthProvider>
            <Routes>
            <Route path="/" element={<LazyComponentWrapper><JobNexAILanding /></LazyComponentWrapper>} />
            <Route path="/login" element={<LazyComponentWrapper><Auth /></LazyComponentWrapper>} />
            <Route path="/pricing" element={<LazyComponentWrapper><Pricing /></LazyComponentWrapper>} />
            <Route path="/privacy" element={<LazyComponentWrapper><PrivacyPolicy /></LazyComponentWrapper>} />
            <Route path="/features" element={<LazyComponentWrapper><FeaturesPage /></LazyComponentWrapper>} />
            <Route path="/how-it-works" element={<LazyComponentWrapper><HowItWorksPage /></LazyComponentWrapper>} />
            <Route path="/testimonials" element={<LazyComponentWrapper><TestimonialsPage /></LazyComponentWrapper>} />
            <Route path="/auth/reset-password" element={<LazyComponentWrapper><ResetPassword /></LazyComponentWrapper>} />
            <Route path="/auth/callback" element={<LazyComponentWrapper><AuthCallback /></LazyComponentWrapper>} />
            <Route path="/checkout/success" element={<LazyComponentWrapper><StripeCheckoutStatus /></LazyComponentWrapper>} />
            <Route path="/user-type" element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            } />
            <Route element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<LazyComponentWrapper><Dashboard /></LazyComponentWrapper>} />
              <Route path="/profile" element={<LazyComponentWrapper><Profile /></LazyComponentWrapper>} />
              <Route path="/billing" element={<LazyComponentWrapper><Billing /></LazyComponentWrapper>} />
              <Route path="/jobs" element={
                <ProtectedRoute requiresSubscription>
                  <LazyComponentWrapper><JobSearch /></LazyComponentWrapper>
                </ProtectedRoute>
              } />
              <Route path="/applications" element={
                <ProtectedRoute requiresSubscription>
                  <LazyComponentWrapper><JobApplications /></LazyComponentWrapper>
                </ProtectedRoute>
              } />
              <Route path="/market-analysis" element={
                <ProtectedRoute requiresSubscription>
                  <LazyComponentWrapper><MarketAnalysis /></LazyComponentWrapper>
                </ProtectedRoute>
              } />
              <Route path="/cv-builder" element={
                <ProtectedRoute requiresSubscription>
                  <LazyComponentWrapper><CVBuilder /></LazyComponentWrapper>
                </ProtectedRoute>
              } />
              <Route path="/network" element={
                <ProtectedRoute requiresSubscription>
                  <LazyComponentWrapper><NetworkPage /></LazyComponentWrapper>
                </ProtectedRoute>
              } />
              <Route path="/market-trends" element={
                <ProtectedRoute requiresSubscription>
                  <LazyComponentWrapper><MarketTrendsPage /></LazyComponentWrapper>
                </ProtectedRoute>
              } />
              {/* Routes pour les freelances */}
              <Route path="/freelance/projects" element={
                <ProtectedRoute requiresSubscription>
                  <LazyComponentWrapper><FreelanceProjects /></LazyComponentWrapper>
                </ProtectedRoute>
              } />
              <Route path="/freelance/profile" element={
                <ProtectedRoute requiresSubscription>
                  <LazyComponentWrapper><FreelanceProfile /></LazyComponentWrapper>
                </ProtectedRoute>
              } />
              {/* Routes pour les recruteurs */}
              <Route path="/recruiter/dashboard" element={
                <ProtectedRoute requiresSubscription>
                  <LazyComponentWrapper><RecruiterDashboard /></LazyComponentWrapper>
                </ProtectedRoute>
              } />
              <Route path="/recruiter/candidates" element={
                <ProtectedRoute requiresSubscription>
                  <LazyComponentWrapper><CandidateSearch /></LazyComponentWrapper>
                </ProtectedRoute>
              } />
              <Route path="/recruiter/job-postings" element={
                <ProtectedRoute requiresSubscription>
                  <LazyComponentWrapper><JobPostings /></LazyComponentWrapper>
                </ProtectedRoute>
              } />
              <Route path="/recruiter/create-job" element={
                <ProtectedRoute requiresSubscription>
                  <LazyComponentWrapper><CreateJobPosting /></LazyComponentWrapper>
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
          <PrivacyConsent />
          <SecurityBadge />
          <SubscriptionBanner />
          <ToastContainer />
        </AuthProvider>
      </Router>
      </I18nextProvider>
    </ErrorBoundary>
  )
}

export default App