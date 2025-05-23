import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Terminal } from './components/Terminal';
import { ScheduleDashboard } from './components/ScheduleDashboard';
import { MarketingCampaign } from './components/MarketingCampaign';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserDashboard } from './components/user/UserDashboard';
import { AdminRoute } from './components/admin/AdminRoute';
import { PrivateRoute } from './components/PrivateRoute';
import { ResetPassword } from './components/auth/ResetPassword';
import { UpdatePassword } from './components/auth/UpdatePassword';
import { AuthForm } from './components/auth/AuthForm';
import { useAuth, AuthProvider } from './hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

function AppRoutes() {
  const { user, isAdmin, isLoading } = useAuth();
  const [showSchedule, setShowSchedule] = useState(false);
  const [showCampaign, setShowCampaign] = useState(false);

  const handleShowCampaign = () => {
    setShowSchedule(false);
    setShowCampaign(true);
  };

  const handleShowSchedule = () => {
    setShowCampaign(false);
    setShowSchedule(true);
  };

  return (
    <div className="min-h-screen bg-terminal-black overflow-hidden">
      <Routes>
        {/* Auth Routes */}
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/login" element={<AuthForm />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* User Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        />

        {/* Main App Route */}
        <Route
          path="/"
          element={
            isLoading ? null : user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Terminal
                onShowSchedule={handleShowSchedule}
                onShowCampaign={handleShowCampaign}
                onShowAdmin={() => {}}
                isAdmin={isAdmin}
              />
            )
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <AnimatePresence mode="wait">
        {showSchedule && (
          <motion.div
            key="schedule-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20 }}
              className="h-full overflow-auto"
            >
              <ScheduleDashboard onBack={() => setShowSchedule(false)} />
            </motion.div>
          </motion.div>
        )}

        {showCampaign && (
          <motion.div
            key="campaign-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20 }}
              className="h-full overflow-auto"
            >
              <MarketingCampaign
                onClose={() => setShowCampaign(false)}
                onShowSchedule={() => {
                  setShowCampaign(false);
                  setTimeout(() => setShowSchedule(true), 300);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
