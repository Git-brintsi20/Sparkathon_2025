// frontend/src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';

import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { WebSocketProvider } from './contexts/WebSocketContext';

import './index.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes('4')) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
    <div className="text-center p-8 max-w-md">
      <div className="mb-6">
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-error"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-4">
          {error.message || 'An unexpected error occurred'}
        </p>
      </div>
      <div className="space-y-3">
        <button
          onClick={resetErrorBoundary}
          className="btn btn-primary w-full"
        >
          Try again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-outline w-full"
        >
          Refresh page
        </button>
      </div>
    </div>
  </div>
);

// Main app initialization
const initializeApp = () => {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(error, errorInfo) => {
          console.error('Application error:', error);
          console.error('Error info:', errorInfo);
          
          // Log to external service in production
          if (import.meta.env.PROD) {
            // Send error to monitoring service
            console.error('Production error logged:', { error, errorInfo });
          }
        }}
      >
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ThemeProvider>
              <AuthProvider>
                <NotificationProvider>
                  <WebSocketProvider>
                    <App />
                  </WebSocketProvider>
                </NotificationProvider>
              </AuthProvider>
            </ThemeProvider>
          </BrowserRouter>
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>
  );
};

// Initialize app with error handling
try {
  initializeApp();
} catch (error) {
  console.error('Failed to initialize app:', error);
  
  // Fallback error display
  document.body.innerHTML = `
    <div style="
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: system-ui, -apple-system, sans-serif;
      background: #fafafa;
      color: #333;
    ">
      <div style="text-align: center; max-width: 400px; padding: 2rem;">
        <h1 style="color: #ef4444; margin-bottom: 1rem;">Application Error</h1>
        <p style="margin-bottom: 1rem; color: #666;">
          Failed to load the Smart Vendor Compliance System
        </p>
        <button 
          onclick="window.location.reload()"
          style="
            background: #3b82f6;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-size: 1rem;
          "
        >
          Reload Page
        </button>
      </div>
    </div>
  `;
}

// Performance monitoring
if (import.meta.env.DEV) {
  // Log performance metrics in development
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    console.log('App Performance Metrics:', {
      loadTime: perfData.loadEventEnd - perfData.fetchStart,
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
      firstPaint: performance.getEntriesByType('paint')[0]?.startTime,
      firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime,
    });
  });
}

// Service worker registration (for PWA support)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  // Log to external service in production
  if (import.meta.env.PROD) {
    console.error('Production error logged:', {
      message: event.error?.message,
      stack: event.error?.stack,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  }
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  // Log to external service in production
  if (import.meta.env.PROD) {
    console.error('Production promise rejection logged:', {
      reason: event.reason,
      stack: event.reason?.stack,
    });
  }
});

// Cleanup on app unmount
window.addEventListener('beforeunload', () => {
  queryClient.clear();
});

export default initializeApp;