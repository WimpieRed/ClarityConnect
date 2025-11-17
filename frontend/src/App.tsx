import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { UserProvider } from './contexts/UserContext';
import { useBranding } from './hooks/useBranding';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import HomePage from './pages/HomePage';
import TermsPage from './pages/TermsPage';
import TermDetailPage from './pages/TermDetailPage';
import TermFormPage from './pages/TermFormPage';
import SearchPage from './pages/SearchPage';
import GovernancePage from './pages/GovernancePage';
import AnalyticsPage from './pages/AnalyticsPage';
import FavoritesPage from './pages/FavoritesPage';
import GapAnalysisPage from './pages/GapAnalysisPage';
import ClusterDashboardPage from './pages/ClusterDashboardPage';
import ComplianceDashboardPage from './pages/ComplianceDashboardPage';
import OnboardingPage from './pages/OnboardingPage';
import AccessRequestsPage from './pages/AccessRequestsPage';

function AppContent() {
  useKeyboardShortcuts();

  return (
    <Layout>
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/terms/new" element={<TermFormPage />} />
          <Route path="/terms/:id" element={<TermDetailPage />} />
          <Route path="/terms/:id/edit" element={<TermFormPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/governance" element={<GovernancePage />} />
          <Route path="/gap-analysis" element={<GapAnalysisPage />} />
          <Route path="/clusters" element={<ClusterDashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/compliance" element={<ComplianceDashboardPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/access-requests" element={<AccessRequestsPage />} />
      </Routes>
    </Layout>
  );
}

function App() {
  const { loading } = useBranding();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <div className="text-brand-dark">Loading...</div>
      </div>
    );
  }

  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}

export default App;
