import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { DashboardLayout } from './components/DashboardLayout'
import { JobSearch } from './components/JobSearch'
import { MarketAnalysis } from './components/MarketAnalysis'
import { Dashboard } from './components/Dashboard'
import { JobApplications } from './components/JobApplications'
import { Auth } from './components/Auth'
import { Pricing } from './components/Pricing'
import { Profile } from './components/Profile'
import { PrivacyPolicy } from './components/PrivacyPolicy'
import { PrivacyConsent } from './components/PrivacyConsent'
import { SecurityBadge } from './components/SecurityBadge'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './components/AuthProvider'
import { CVBuilder } from './components/cv/CVBuilder'
import { NetworkPage } from './components/NetworkPage'
import { LandingPage } from './components/LandingPage'
import FeaturesPage from './components/pages/FeaturesPage'
import { HowItWorksPage } from './components/pages/HowItWorksPage'
import { TestimonialsPage } from './components/pages/TestimonialsPage'
import { ResetPassword } from './components/ResetPassword'
import { AuthCallback } from './components/AuthCallback'
import { FreelanceProjects } from './components/freelance/FreelanceProjects'
import { FreelanceProfile } from './components/freelance/FreelanceProfile'
import MarketTrendsPage from './components/pages/MarketTrendsPage'
import { RecruiterDashboard } from './components/recruiter/RecruiterDashboard'
import { CandidateSearch } from './components/recruiter/CandidateSearch'
import { JobPostings } from './components/recruiter/JobPostings'
import { CreateJobPosting } from './components/recruiter/CreateJobPosting'
import { UserTypeSelection } from './components/UserTypeSelection'
import { ErrorBoundary } from './components/ErrorBoundary'
import { StripeCheckoutStatus } from './components/StripeCheckoutStatus'
import { Billing } from './components/Billing'
import { SubscriptionBanner } from './components/SubscriptionBanner'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
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
                <UserTypeSelection />
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
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App