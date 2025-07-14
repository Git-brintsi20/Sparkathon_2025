import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

// Simple navigation hook
export const useAppNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateTo = useCallback((path: string, replace = false) => {
    navigate(path, { replace });
  }, [navigate]);

  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  return {
    navigateTo,
    goBack,
    currentPath: location.pathname,
    location,
  };
};

// Navigation delay helper (for smooth transitions)
export const delayedNavigation = (navigate: (path: string) => void, path: string, delay = 150) => {
  setTimeout(() => {
    navigate(path);
  }, delay);
};

// Route transition presets
export const transitions = {
  fast: { duration: 0.2, ease: 'easeInOut' },
  normal: { duration: 0.4, ease: 'anticipate' },
  smooth: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  spring: { type: 'spring', stiffness: 300, damping: 25 },
} as const;

// Check if navigation is between similar routes
export const isSimilarRoute = (from: string, to: string): boolean => {
  const getBaseRoute = (path: string) => path.split('/')[1] || '';
  return getBaseRoute(from) === getBaseRoute(to);
};