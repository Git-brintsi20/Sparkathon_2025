// Route configuration with path constants and route protection logic
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Protected routes
  DASHBOARD: '/dashboard',
  VENDORS: '/vendors',
  VENDOR_DETAIL: '/vendors/:id',
  VENDOR_CREATE: '/vendors/create',
  VENDOR_EDIT: '/vendors/:id/edit',
  
  DELIVERIES: '/deliveries',
  DELIVERY_DETAIL: '/deliveries/:id',
  DELIVERY_CREATE: '/deliveries/create',
  DELIVERY_EDIT: '/deliveries/:id/edit',
  
  ANALYTICS: '/analytics',
  COMPLIANCE_REPORT: '/analytics/compliance',
  FRAUD_DETECTION: '/analytics/fraud',
  PERFORMANCE_METRICS: '/analytics/performance',
  
  SETTINGS: '/settings',
  PROFILE: '/settings/profile',
  THEME: '/settings/theme',
  SYSTEM: '/settings/system',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];

// Public routes that don't require authentication
export const PUBLIC_ROUTES: RoutePath[] = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
];

// Protected routes that require authentication
export const PROTECTED_ROUTES: RoutePath[] = [
  ROUTES.DASHBOARD,
  ROUTES.VENDORS,
  ROUTES.VENDOR_DETAIL,
  ROUTES.VENDOR_CREATE,
  ROUTES.VENDOR_EDIT,
  ROUTES.DELIVERIES,
  ROUTES.DELIVERY_DETAIL,
  ROUTES.DELIVERY_CREATE,
  ROUTES.DELIVERY_EDIT,
  ROUTES.ANALYTICS,
  ROUTES.COMPLIANCE_REPORT,
  ROUTES.FRAUD_DETECTION,
  ROUTES.PERFORMANCE_METRICS,
  ROUTES.SETTINGS,
  ROUTES.PROFILE,
  ROUTES.THEME,
  ROUTES.SYSTEM,
];

// Admin-only routes
export const ADMIN_ROUTES: RoutePath[] = [
  ROUTES.SYSTEM,
  ROUTES.FRAUD_DETECTION,
];

// Manager-level routes
export const MANAGER_ROUTES: RoutePath[] = [
  ROUTES.ANALYTICS,
  ROUTES.COMPLIANCE_REPORT,
  ROUTES.PERFORMANCE_METRICS,
];

// Route metadata for navigation
export interface RouteMetadata {
  path: RoutePath;
  title: string;
  description?: string;
  icon?: string;
  requiresAuth: boolean;
  allowedRoles?: string[];
  sidebar?: boolean;
  breadcrumb?: string;
}

export const ROUTE_METADATA: Record<string, RouteMetadata> = {
  [ROUTES.HOME]: {
    path: ROUTES.HOME,
    title: 'Home',
    description: 'Welcome to Smart Vendor Compliance',
    requiresAuth: false,
    sidebar: false,
  },
  [ROUTES.LOGIN]: {
    path: ROUTES.LOGIN,
    title: 'Login',
    description: 'Sign in to your account',
    requiresAuth: false,
    sidebar: false,
  },
  [ROUTES.REGISTER]: {
    path: ROUTES.REGISTER,
    title: 'Register',
    description: 'Create a new account',
    requiresAuth: false,
    sidebar: false,
  },
  [ROUTES.DASHBOARD]: {
    path: ROUTES.DASHBOARD,
    title: 'Dashboard',
    description: 'Overview of vendor compliance metrics',
    icon: 'LayoutDashboard',
    requiresAuth: true,
    sidebar: true,
    breadcrumb: 'Dashboard',
  },
  [ROUTES.VENDORS]: {
    path: ROUTES.VENDORS,
    title: 'Vendors',
    description: 'Manage vendor information and compliance',
    icon: 'Building2',
    requiresAuth: true,
    sidebar: true,
    breadcrumb: 'Vendors',
  },
  [ROUTES.VENDOR_DETAIL]: {
    path: ROUTES.VENDOR_DETAIL,
    title: 'Vendor Details',
    description: 'View vendor information and compliance history',
    requiresAuth: true,
    sidebar: false,
    breadcrumb: 'Vendor Details',
  },
  [ROUTES.DELIVERIES]: {
    path: ROUTES.DELIVERIES,
    title: 'Deliveries',
    description: 'Track and verify deliveries',
    icon: 'Package',
    requiresAuth: true,
    sidebar: true,
    breadcrumb: 'Deliveries',
  },
  [ROUTES.DELIVERY_DETAIL]: {
    path: ROUTES.DELIVERY_DETAIL,
    title: 'Delivery Details',
    description: 'View delivery information and verification status',
    requiresAuth: true,
    sidebar: false,
    breadcrumb: 'Delivery Details',
  },
  [ROUTES.ANALYTICS]: {
    path: ROUTES.ANALYTICS,
    title: 'Analytics',
    description: 'Compliance analytics and reports',
    icon: 'BarChart3',
    requiresAuth: true,
    allowedRoles: ['manager', 'admin'],
    sidebar: true,
    breadcrumb: 'Analytics',
  },
  [ROUTES.COMPLIANCE_REPORT]: {
    path: ROUTES.COMPLIANCE_REPORT,
    title: 'Compliance Reports',
    description: 'Detailed compliance reporting',
    requiresAuth: true,
    allowedRoles: ['manager', 'admin'],
    sidebar: false,
    breadcrumb: 'Compliance Reports',
  },
  [ROUTES.SETTINGS]: {
    path: ROUTES.SETTINGS,
    title: 'Settings',
    description: 'Application settings and preferences',
    icon: 'Settings',
    requiresAuth: true,
    sidebar: true,
    breadcrumb: 'Settings',
  },
};

// Helper functions for route management
export const isPublicRoute = (path: string): boolean => {
  return PUBLIC_ROUTES.some(route => {
    const routePattern = route.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(path);
  });
};

export const isProtectedRoute = (path: string): boolean => {
  return PROTECTED_ROUTES.some(route => {
    const routePattern = route.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(path);
  });
};

export const isAdminRoute = (path: string): boolean => {
  return ADMIN_ROUTES.some(route => {
    const routePattern = route.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(path);
  });
};

export const hasRouteAccess = (path: string, userRole?: string): boolean => {
  if (isPublicRoute(path)) return true;
  
  const metadata = Object.values(ROUTE_METADATA).find(meta => {
    const routePattern = meta.path.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(path);
  });
  
  if (!metadata) return false;
  if (!metadata.requiresAuth) return true;
  if (!userRole) return false;
  if (!metadata.allowedRoles) return true;
  
  return metadata.allowedRoles.includes(userRole);
};

export const getRouteMetadata = (path: string): RouteMetadata | undefined => {
  return Object.values(ROUTE_METADATA).find(meta => {
    const routePattern = meta.path.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(path);
  });
};

export const getSidebarRoutes = (userRole?: string): RouteMetadata[] => {
  return Object.values(ROUTE_METADATA).filter(meta => 
    meta.sidebar && 
    (!meta.allowedRoles || !userRole || meta.allowedRoles.includes(userRole))
  );
};

export const generatePath = (route: RoutePath, params?: Record<string, string>): string => {
  let path = route;
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, value) as RoutePath;
    });
  }
  
  return path;
};