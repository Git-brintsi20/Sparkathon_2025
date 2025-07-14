import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LayoutProvider } from './contexts/LayoutContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import Layout from './components/layout/Layout';
import { PageTransition, FadeTransition, withPageTransition } from './components/common/PageTransition';
import { ROUTES } from './config/routes';

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'));

// Vendors
const VendorList = React.lazy(() => import('./pages/Vendors/VendorList'));
const VendorDetail = React.lazy(() => import('./pages/Vendors/VendorDetail'));
const CreateVendor = React.lazy(() => import('./pages/Vendors/CreateVendor'));
const EditVendor = React.lazy(() => import('./pages/Vendors/EditVendor'));

// Deliveries
const DeliveryList = React.lazy(() => import('./pages/Deliveries/DeliveryList'));
const DeliveryDetail = React.lazy(() => import('./pages/Deliveries/DeliveryDetail'));
const CreateDelivery = React.lazy(() => import('./pages/Deliveries/CreateDelivery'));
const EditDelivery = React.lazy(() => import('./pages/Deliveries/EditDelivery'));

// Analytics
const Analytics = React.lazy(() => import('./pages/Analytics/Analytics'));
const ComplianceReport = React.lazy(() => import('./pages/Analytics/ComplianceReport'));
const FraudDetection = React.lazy(() => import('./pages/Analytics/FraudDetection'));
const PerformanceMetrics = React.lazy(() => import('./pages/Analytics/PerformanceMetrics'));

// Settings
const Settings = React.lazy(() => import('./pages/Settings/Settings'));
const UserProfile = React.lazy(() => import('./pages/Settings/UserProfile'));
const ThemeSettings = React.lazy(() => import('./pages/Settings/ThemeSettings'));
const SystemConfig = React.lazy(() => import('./pages/Settings/SystemConfig'));

// Auth
const Login = React.lazy(() => import('./pages/Auth/Login'));
const Register = React.lazy(() => import('./pages/Auth/Register'));
const ForgotPassword = React.lazy(() => import('./pages/Auth/ForgotPassword'));

// Wrap lazy-loaded components with page transitions
const DashboardWithTransition = withPageTransition(Dashboard, PageTransition);
const VendorListWithTransition = withPageTransition(VendorList, PageTransition);
const VendorDetailWithTransition = withPageTransition(VendorDetail, PageTransition);
const CreateVendorWithTransition = withPageTransition(CreateVendor, PageTransition);
const EditVendorWithTransition = withPageTransition(EditVendor, PageTransition);

const DeliveryListWithTransition = withPageTransition(DeliveryList, PageTransition);
const DeliveryDetailWithTransition = withPageTransition(DeliveryDetail, PageTransition);
const CreateDeliveryWithTransition = withPageTransition(CreateDelivery, PageTransition);
const EditDeliveryWithTransition = withPageTransition(EditDelivery, PageTransition);

const AnalyticsWithTransition = withPageTransition(Analytics, PageTransition);
const ComplianceReportWithTransition = withPageTransition(ComplianceReport, PageTransition);
const FraudDetectionWithTransition = withPageTransition(FraudDetection, PageTransition);
const PerformanceMetricsWithTransition = withPageTransition(PerformanceMetrics, PageTransition);

const SettingsWithTransition = withPageTransition(Settings, PageTransition);
const UserProfileWithTransition = withPageTransition(UserProfile, PageTransition);
const ThemeSettingsWithTransition = withPageTransition(ThemeSettings, PageTransition);
const SystemConfigWithTransition = withPageTransition(SystemConfig, PageTransition);

// Auth pages use fade transition for a cleaner look
const LoginWithTransition = withPageTransition(Login, FadeTransition);
const RegisterWithTransition = withPageTransition(Register, FadeTransition);
const ForgotPasswordWithTransition = withPageTransition(ForgotPassword, FadeTransition);

// Loading component for route transitions
const RouteLoader: React.FC = () => (
  <FadeTransition>
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" />
    </div>
  </FadeTransition>
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
      <FadeTransition>
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
      </FadeTransition>
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

// Animated Routes wrapper
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicRoute>
              <LoginWithTransition />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTES.REGISTER}
          element={
            <PublicRoute>
              <RegisterWithTransition />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTES.FORGOT_PASSWORD}
          element={
            <PublicRoute>
              <ForgotPasswordWithTransition />
            </PublicRoute>
          }
        />
        
        {/* Protected Routes with Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path="dashboard" element={<DashboardWithTransition />} />
          
          {/* Vendors */}
          <Route path="vendors" element={<VendorListWithTransition />} />
          <Route path="vendors/:id" element={<VendorDetailWithTransition />} />
          <Route 
            path="vendors/create" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <CreateVendorWithTransition />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="vendors/:id/edit" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <EditVendorWithTransition />
              </ProtectedRoute>
            } 
          />
          
          {/* Deliveries */}
          <Route path="deliveries" element={<DeliveryListWithTransition />} />
          <Route path="deliveries/:id" element={<DeliveryDetailWithTransition />} />
          <Route path="deliveries/create" element={<CreateDeliveryWithTransition />} />
          <Route 
            path="deliveries/:id/edit" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <EditDeliveryWithTransition />
              </ProtectedRoute>
            } 
          />
          
          {/* Analytics - Manager/Admin only */}
          <Route
            path="analytics"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <AnalyticsWithTransition />
              </ProtectedRoute>
            }
          />
          <Route
            path="analytics/compliance"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <ComplianceReportWithTransition />
              </ProtectedRoute>
            }
          />
          <Route
            path="analytics/fraud"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <FraudDetectionWithTransition />
              </ProtectedRoute>
            }
          />
          <Route
            path="analytics/performance"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <PerformanceMetricsWithTransition />
              </ProtectedRoute>
            }
          />
          
          {/* Settings */}
          <Route path="settings" element={<SettingsWithTransition />} />
          <Route path="settings/profile" element={<UserProfileWithTransition />} />
          <Route path="settings/theme" element={<ThemeSettingsWithTransition />} />
          <Route
            path="settings/system"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SystemConfigWithTransition />
              </ProtectedRoute>
            }
          />
        </Route>
        
        {/* Catch all route */}
        <Route
          path="*"
          element={
            <FadeTransition>
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
            </FadeTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="default">
        <AuthProvider>
          <LayoutProvider>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Suspense fallback={<RouteLoader />}>
                <AnimatedRoutes />
              </Suspense>
            </div>
          </LayoutProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;