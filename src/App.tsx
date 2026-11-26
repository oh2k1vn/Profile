import { lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthGuard from './components/auth/AuthGuard';
import WorkspaceLayout from './components/layout/WorkspaceLayout';
import { AuthProvider } from './contexts/AuthContext';
import { SheetConnectionProvider } from './contexts/SheetConnectionContext';

const HubPage = lazy(() => import('./pages/HubPage'));
const FinancePage = lazy(() => import('./pages/FinancePage'));
const DatabasePage = lazy(() => import('./pages/DatabasePage'));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthGuard>
          <SheetConnectionProvider>
            <Routes>
              <Route element={<WorkspaceLayout />}>
                <Route index element={<HubPage />} />
                <Route
                  path="/finance"
                  element={
                    <AuthGuard requiredPermission="finance">
                      <FinancePage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/database"
                  element={
                    <AuthGuard requiredPermission="database">
                      <DatabasePage />
                    </AuthGuard>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </SheetConnectionProvider>
        </AuthGuard>
      </AuthProvider>
    </BrowserRouter>
  );
}
