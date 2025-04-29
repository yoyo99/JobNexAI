import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense } from 'react';
import ToastContainer from './ToastContainer';

import { DashboardLayout } from './components/DashboardLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './components/AuthProvider'
import { PrivacyConsent } from './components/PrivacyConsent'
import { SecurityBadge } from './components/SecurityBadge'
import { SubscriptionBanner } from './components/SubscriptionBanner'
import { ErrorBoundary } from './components/ErrorBoundary'

// Code splitting (React.lazy) pour les pages principales
const JobNexAILanding = React.lazy(() => import('./components/JobNexAILanding'));
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

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<JobNexAILanding />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/checkout/success" element={<StripeCheckoutStatus />} />
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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/jobs" element={
                <ProtectedRoute requiresSubscription>
                  <JobSearch />
                </ProtectedRoute>
              } />
              <Route path="/applications" element={
                <ProtectedRoute requiresSubscription>
                  <JobApplications />
                </ProtectedRoute>
              } />
              <Route path="/market-analysis" element={
                <ProtectedRoute requiresSubscription>
                  <MarketAnalysis />
                </ProtectedRoute>
              } />
              <Route path="/cv-builder" element={
                <ProtectedRoute requiresSubscription>
                  <CVBuilder />
                </ProtectedRoute>
              } />
              <Route path="/network" element={
                <ProtectedRoute requiresSubscription>
                  <NetworkPage />
                </ProtectedRoute>
              } />
              <Route path="/market-trends" element={
                <ProtectedRoute requiresSubscription>
                  <MarketTrendsPage />
                </ProtectedRoute>
              } />
              {/* Routes pour les freelances */}
              <Route path="/freelance/projects" element={
                <ProtectedRoute requiresSubscription>
                  <FreelanceProjects />
                </ProtectedRoute>
              } />
              <Route path="/freelance/profile" element={
                <ProtectedRoute requiresSubscription>
                  <FreelanceProfile />
                </ProtectedRoute>
              } />
              {/* Routes pour les recruteurs */}
              <Route path="/recruiter/dashboard" element={
                <ProtectedRoute requiresSubscription>
                  <RecruiterDashboard />
                </ProtectedRoute>
              } />
              <Route path="/recruiter/candidates" element={
                <ProtectedRoute requiresSubscription>
                  <CandidateSearch />
                </ProtectedRoute>
              } />
              <Route path="/recruiter/job-postings" element={
                <ProtectedRoute requiresSubscription>
                  <JobPostings />
                </ProtectedRoute>
              } />
              <Route path="/recruiter/create-job" element={
                <ProtectedRoute requiresSubscription>
                  <CreateJobPosting />
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
    </ErrorBoundary>
  )
}

export default App