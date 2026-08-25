import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

import { DashboardLayout } from './components/layout/DashboardLayout';
import { EnergyMonitoringOverview } from './features/dashboard/components/EnergyMonitoringOverview';
import ApplianceAnalytics from './pages/ApplianceAnalytics';
import Automations from './pages/Automations';
import Properties from './pages/Properties';
import { UsageForecasting } from './pages/UsageForecasting';
import { AlertsAnomalies } from './pages/AlertsAnomalies';
import { ManualOverrides } from './pages/ManualOverrides';
import { Schedules } from './pages/Schedules';
import { RecyclingFlows } from './pages/RecyclingFlows';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import { AdminRoute } from './components/auth/AdminRoute';
import { MobileCompanion } from './features/devices/MobileCompanion';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Protected Dashboard Routes */}
            <Route path="/" element={
              <>
                <SignedIn>
                  <DashboardLayout />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<EnergyMonitoringOverview />} />
              <Route path="analytics" element={<ApplianceAnalytics />} />
              <Route path="forecasting" element={<UsageForecasting />} />
              <Route path="alerts" element={<AlertsAnomalies />} />
              <Route path="controls" element={<ManualOverrides />} />
              <Route path="schedules" element={<Schedules />} />
              <Route path="automations" element={<Automations />} />
              <Route path="recycling" element={<RecyclingFlows />} />
              <Route path="properties" element={<Properties />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Admin Completely Separate Page Route */}
            <Route path="/admin" element={
              <>
                <SignedIn>
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            } />

            {/* Mobile Companion Route for Wi-Fi Devices / Galaxy S24 Ultra */}
            <Route path="/companion" element={<MobileCompanion />} />

            {/* Default Catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
