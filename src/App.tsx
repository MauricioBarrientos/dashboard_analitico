import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { UIProvider } from './store/uiStore';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/templates/ProtectedRoute';
import DashboardTemplate from './components/templates/DashboardTemplate';
import ReportsTemplate from './components/templates/ReportsTemplate';
import SettingsTemplate from './components/templates/SettingsTemplate';
import LoginPage from './components/templates/LoginPage';

const App: React.FC = () => {
  return (
    <UIProvider>
      <NotificationProvider>
        <AuthProvider>
          <div className="App min-h-screen bg-gray-50 dark:bg-gray-900">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <DashboardTemplate />
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <ReportsTemplate />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsTemplate />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </AuthProvider>
      </NotificationProvider>
    </UIProvider>
  );
};

export default App;