import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { Layout } from './components/layout/Layout';
import { ROUTES } from './config/routes';

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'));
const VendorList = React.lazy(() => import('./pages/Vendors/VendorList'));
const VendorDetail = React.lazy(() => import('./pages/Vendors/VendorDetail'));
const DeliveryList = React.lazy(() => import('./pages/Deliveries/DeliveryList'));
const DeliveryDetail = React.lazy(() => import('./pages/Deliveries/DeliveryDetail'));
const Analytics = React.lazy(() => import('./pages/Analytics/Analytics'));
const ComplianceReport = React.lazy(() => import('./pages/Analytics/ComplianceReport'));
const Settings = React.lazy(() => import('./pages/Settings/Settings'));
const Login = React.lazy(() => import('./pages/Auth/Login'));
const Register = React.lazy(() => import('./pages/Auth/Register'));

// Loading component for route transitions
const RouteLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
);

// TEMPORARILY DISABLED PROTECTION - Set this to true to re-enable auth
const DISABLE_AUTH_FOR_DEVELOPMENT = true;

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresAuth = true, 
  allowedRoles 
}) => {
  const { state } = useAuth();
  const location = useLocation();
  
  // DEVELOPMENT MODE: Skip all auth checks
  if (DISABLE_AUTH_FOR_DEVELOPMENT) {
    return <>{children}</>;
  }
  
  // Show loading while checking auth
  if (state.isLoading) {
    return <RouteLoader />;
  }
  
  // Check if route requires authentication
  if (requiresAuth && !state.isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }
  
  // Check role-based access
  if (allowedRoles && state.user && !allowedRoles.includes(state.user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-4">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

// Public Route Component (redirects to dashboard if already authenticated)
interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { state } = useAuth();
  const location = useLocation();
  
  // DEVELOPMENT MODE: Skip auth redirect
  if (DISABLE_AUTH_FOR_DEVELOPMENT) {
    return <>{children}</>;
  }
  
  if (state.isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || ROUTES.DASHBOARD;
    return <Navigate to={from} replace />;
  }
  
  return <>{children}</>;
};

// Route Configuration Component
const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTES.REGISTER}
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        
        {/* Protected Routes with Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
             <Layout>
        {/* This empty fragment will be replaced by the matched child route */}
        <></>
      </Layout>
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.DASHBOARD.slice(1)} element={<Dashboard />} />
          
          {/* Vendors */}
          <Route path={ROUTES.VENDORS.slice(1)} element={<VendorList />} />
          <Route path={ROUTES.VENDOR_DETAIL.slice(1)} element={<VendorDetail />} />
          
          {/* Deliveries */}
          <Route path={ROUTES.DELIVERIES.slice(1)} element={<DeliveryList />} />
          <Route path={ROUTES.DELIVERY_DETAIL.slice(1)} element={<DeliveryDetail />} />
          
          {/* Analytics - Manager/Admin only */}
          <Route
            path={ROUTES.ANALYTICS.slice(1)}
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.COMPLIANCE_REPORT.slice(1)}
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <ComplianceReport />
              </ProtectedRoute>
            }
          />
          
          {/* Settings */}
          <Route path={ROUTES.SETTINGS.slice(1)} element={<Settings />} />
        </Route>
        
        {/* Catch all route */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
                <p className="text-muted-foreground mb-4">
                  The page you're looking for doesn't exist.
                </p>
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="default">
        <AuthProvider>
          
            <div className="min-h-screen bg-background font-sans antialiased">
              <AppRoutes />
            </div>
         
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;