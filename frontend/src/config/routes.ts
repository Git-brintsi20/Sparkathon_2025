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
  VENDOR_ACTIVE: '/vendors/active',
  VENDOR_PENDING: '/vendors/pending',
  VENDOR_SUSPENDED: '/vendors/suspended',
  VENDOR_DETAIL: '/vendors/:id',
  VENDOR_CREATE: '/vendors/create',
  VENDOR_EDIT: '/vendors/:id/edit',
  
  DELIVERIES: '/deliveries',
  DELIVERY_ACTIVE: '/deliveries/active',
  DELIVERY_COMPLETED: '/deliveries/completed',
  DELIVERY_VERIFICATION: '/deliveries/verification-queue',
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

// User role definitions
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
  VENDOR: 'vendor',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Route metadata for navigation
export interface RouteMetadata {
  path: RoutePath;
  title: string;
  description?: string;
  icon?: string;
  requiresAuth: boolean;
  allowedRoles?: UserRole[];
  sidebar?: boolean;
  breadcrumb?: string;
  parent?: RoutePath;
  children?: RoutePath[];
  badge?: string;
  exact?: boolean;
}

export const ROUTE_METADATA: Record<string, RouteMetadata> = {
  [ROUTES.HOME]: {
    path: ROUTES.HOME,
    title: 'Home',
    description: 'Welcome to Smart Vendor Compliance',
    requiresAuth: false,
    sidebar: false,
    exact: true,
  },
  [ROUTES.LOGIN]: {
    path: ROUTES.LOGIN,
    title: 'Login',
    description: 'Sign in to your account',
    requiresAuth: false,
    sidebar: false,
    exact: true,
  },
  [ROUTES.REGISTER]: {
    path: ROUTES.REGISTER,
    title: 'Register',
    description: 'Create a new account',
    requiresAuth: false,
    sidebar: false,
    exact: true,
  },
  [ROUTES.FORGOT_PASSWORD]: {
    path: ROUTES.FORGOT_PASSWORD,
    title: 'Forgot Password',
    description: 'Reset your password',
    requiresAuth: false,
    sidebar: false,
    exact: true,
  },
  [ROUTES.DASHBOARD]: {
    path: ROUTES.DASHBOARD,
    title: 'Dashboard',
    description: 'Overview of vendor compliance metrics',
    icon: 'LayoutDashboard',
    requiresAuth: true,
    sidebar: true,
    breadcrumb: 'Dashboard',
    exact: true,
  },
[ROUTES.VENDORS]: {
  path: ROUTES.VENDORS,
  title: 'Vendors',
  description: 'Manage vendor information and compliance',
  icon: 'Building2',
  requiresAuth: true,
  sidebar: true,
  breadcrumb: 'Vendors',
  exact: true,
  children: [
    ROUTES.VENDOR_ACTIVE,
    ROUTES.VENDOR_PENDING,
    ROUTES.VENDOR_SUSPENDED,
    ROUTES.VENDOR_DETAIL,
    ROUTES.VENDOR_CREATE,
    ROUTES.VENDOR_EDIT
  ],
},
  [ROUTES.VENDOR_DETAIL]: {
    path: ROUTES.VENDOR_DETAIL,
    title: 'Vendor Details',
    description: 'View vendor information and compliance history',
    requiresAuth: true,
    sidebar: false,
    breadcrumb: 'Vendor Details',
    parent: ROUTES.VENDORS,
    exact: true,
  },
  [ROUTES.VENDOR_CREATE]: {
    path: ROUTES.VENDOR_CREATE,
    title: 'Create Vendor',
    description: 'Add a new vendor to the system',
    requiresAuth: true,
    sidebar: false,
    breadcrumb: 'Create Vendor',
    parent: ROUTES.VENDORS,
    allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
    exact: true,
  },
  [ROUTES.VENDOR_EDIT]: {
    path: ROUTES.VENDOR_EDIT,
    title: 'Edit Vendor',
    description: 'Update vendor information',
    requiresAuth: true,
    sidebar: false,
    breadcrumb: 'Edit Vendor',
    parent: ROUTES.VENDORS,
    allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
    exact: true,
  },

  [ROUTES.VENDOR_ACTIVE]: {
  path: ROUTES.VENDOR_ACTIVE,
  title: 'Active Vendors',
  description: 'View active vendors',
  requiresAuth: true,
  sidebar: false,
  breadcrumb: 'Active Vendors',
  parent: ROUTES.VENDORS,
  exact: true,
},
[ROUTES.VENDOR_PENDING]: {
  path: ROUTES.VENDOR_PENDING,
  title: 'Pending Vendors',
  description: 'Vendors awaiting approval',
  requiresAuth: true,
  sidebar: false,
  breadcrumb: 'Pending Vendors',
  parent: ROUTES.VENDORS,
  allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
  exact: true,
},
[ROUTES.VENDOR_SUSPENDED]: {
  path: ROUTES.VENDOR_SUSPENDED,
  title: 'Suspended Vendors',
  description: 'Suspended or blocked vendors',
  requiresAuth: true,
  sidebar: false,
  breadcrumb: 'Suspended Vendors',
  parent: ROUTES.VENDORS,
  allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
  exact: true,
},
[ROUTES.DELIVERIES]: {
  path: ROUTES.DELIVERIES,
  title: 'Deliveries',
  description: 'Track and verify deliveries',
  icon: 'Package',
  requiresAuth: true,
  sidebar: true,
  breadcrumb: 'Deliveries',
  exact: true,
  children: [
    ROUTES.DELIVERY_ACTIVE,
    ROUTES.DELIVERY_COMPLETED,
    ROUTES.DELIVERY_VERIFICATION,
    ROUTES.DELIVERY_DETAIL,
    ROUTES.DELIVERY_CREATE,
    ROUTES.DELIVERY_EDIT
  ],
},
  [ROUTES.DELIVERY_DETAIL]: {
    path: ROUTES.DELIVERY_DETAIL,
    title: 'Delivery Details',
    description: 'View delivery information and verification status',
    requiresAuth: true,
    sidebar: false,
    breadcrumb: 'Delivery Details',
    parent: ROUTES.DELIVERIES,
    exact: true,
  },
  [ROUTES.DELIVERY_CREATE]: {
    path: ROUTES.DELIVERY_CREATE,
    title: 'Create Delivery',
    description: 'Record a new delivery',
    requiresAuth: true,
    sidebar: false,
    breadcrumb: 'Create Delivery',
    parent: ROUTES.DELIVERIES,
    exact: true,
  },
  [ROUTES.DELIVERY_EDIT]: {
    path: ROUTES.DELIVERY_EDIT,
    title: 'Edit Delivery',
    description: 'Update delivery information',
    requiresAuth: true,
    sidebar: false,
    breadcrumb: 'Edit Delivery',
    parent: ROUTES.DELIVERIES,
    allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
    exact: true,
  },

  [ROUTES.DELIVERY_ACTIVE]: {
    path: ROUTES.DELIVERY_ACTIVE,
    title: 'Active Deliveries',
    description: 'View currently active deliveries',
    requiresAuth: true,
    sidebar: false,
    breadcrumb: 'Active Deliveries',
    parent: ROUTES.DELIVERIES,
    exact: true,
  },
  [ROUTES.DELIVERY_COMPLETED]: {
    path: ROUTES.DELIVERY_COMPLETED,
    title: 'Completed Deliveries',
    description: 'View completed deliveries',
    requiresAuth: true,
    sidebar: false,
    breadcrumb: 'Completed Deliveries',
    parent: ROUTES.DELIVERIES,
    exact: true,
  },
  [ROUTES.DELIVERY_VERIFICATION]: {
    path: ROUTES.DELIVERY_VERIFICATION,
    title: 'Verification Queue',
    description: 'Deliveries pending verification',
    requiresAuth: true,
    sidebar: false,
    breadcrumb: 'Verification Queue',
    parent: ROUTES.DELIVERIES,
    exact: true,
  },

  [ROUTES.ANALYTICS]: {
    path: ROUTES.ANALYTICS,
    title: 'Analytics',
    description: 'Compliance analytics and reports',
    icon: 'BarChart3',
    requiresAuth: true,
    allowedRoles: [USER_ROLES.MANAGER, USER_ROLES.ADMIN],
    sidebar: true,
    breadcrumb: 'Analytics',
    exact: true,
    children: [ROUTES.COMPLIANCE_REPORT, ROUTES.FRAUD_DETECTION, ROUTES.PERFORMANCE_METRICS],
  },
  [ROUTES.COMPLIANCE_REPORT]: {
    path: ROUTES.COMPLIANCE_REPORT,
    title: 'Compliance Reports',
    description: 'Detailed compliance reporting',
    requiresAuth: true,
    allowedRoles: [USER_ROLES.MANAGER, USER_ROLES.ADMIN],
    sidebar: false,
    breadcrumb: 'Compliance Reports',
    parent: ROUTES.ANALYTICS,
    exact: true,
  },
  [ROUTES.FRAUD_DETECTION]: {
    path: ROUTES.FRAUD_DETECTION,
    title: 'Fraud Detection',
    description: 'AI-powered fraud detection analytics',
    requiresAuth: true,
    allowedRoles: [USER_ROLES.ADMIN],
    sidebar: false,
    breadcrumb: 'Fraud Detection',
    parent: ROUTES.ANALYTICS,
    badge: 'Admin',
    exact: true,
  },
  [ROUTES.PERFORMANCE_METRICS]: {
    path: ROUTES.PERFORMANCE_METRICS,
    title: 'Performance Metrics',
    description: 'Vendor performance analytics',
    requiresAuth: true,
    allowedRoles: [USER_ROLES.MANAGER, USER_ROLES.ADMIN],
    sidebar: false,
    breadcrumb: 'Performance Metrics',
    parent: ROUTES.ANALYTICS,
    exact: true,
  },
  [ROUTES.SETTINGS]: {
    path: ROUTES.SETTINGS,
    title: 'Settings',
    description: 'Application settings and preferences',
    icon: 'Settings',
    requiresAuth: true,
    sidebar: true,
    breadcrumb: 'Settings',
    exact: true,
    children: [ROUTES.PROFILE, ROUTES.THEME, ROUTES.SYSTEM],
  },
  [ROUTES.PROFILE]: {
    path: ROUTES.PROFILE,
    title: 'Profile',
    description: 'Manage your user profile',
    requiresAuth: true,
    sidebar: false,
    breadcrumb: 'Profile',
    parent: ROUTES.SETTINGS,
    exact: true,
  },
  [ROUTES.THEME]: {
    path: ROUTES.THEME,
    title: 'Theme Settings',
    description: 'Customize application appearance',
    requiresAuth: true,
    sidebar: false,
    breadcrumb: 'Theme Settings',
    parent: ROUTES.SETTINGS,
    exact: true,
  },
  [ROUTES.SYSTEM]: {
    path: ROUTES.SYSTEM,
    title: 'System Settings',
    description: 'System configuration and management',
    requiresAuth: true,
    allowedRoles: [USER_ROLES.ADMIN],
    sidebar: false,
    breadcrumb: 'System Settings',
    parent: ROUTES.SETTINGS,
    badge: 'Admin',
    exact: true,
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

export const isManagerRoute = (path: string): boolean => {
  return MANAGER_ROUTES.some(route => {
    const routePattern = route.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(path);
  });
};

export const hasRouteAccess = (path: string, userRole?: UserRole): boolean => {
  if (isPublicRoute(path)) return true;
  
  const metadata = getRouteMetadata(path);
  
  if (!metadata) return false;
  if (!metadata.requiresAuth) return true;
  if (!userRole) return false;
  if (!metadata.allowedRoles) return true;
  
  return metadata.allowedRoles.includes(userRole);
};

export const getRouteMetadata = (path: string): RouteMetadata | undefined => {
  return Object.values(ROUTE_METADATA).find(meta => {
    if (meta.exact) {
      return meta.path === path;
    } else {
      const routePattern = meta.path.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(path);
    }
  });
};

export const getSidebarRoutes = (userRole?: UserRole): RouteMetadata[] => {
  return Object.values(ROUTE_METADATA).filter(meta => 
    meta.sidebar && 
    (!meta.allowedRoles || !userRole || meta.allowedRoles.includes(userRole))
  );
};

export const getBreadcrumbPath = (path: string): RouteMetadata[] => {
  const metadata = getRouteMetadata(path);
  if (!metadata) return [];
  
  const breadcrumbs: RouteMetadata[] = [];
  let current: RouteMetadata | undefined = metadata;
  
  while (current) {
    breadcrumbs.unshift(current);
    if (current.parent) {
      current = getRouteMetadata(current.parent);
    } else {
      current = undefined; // Explicitly set to undefined to exit loop
    }
  }
  
  return breadcrumbs;
};

export const getChildRoutes = (parentPath: RoutePath): RouteMetadata[] => {
  const parent = getRouteMetadata(parentPath);
  if (!parent || !parent.children) return [];
  
  return parent.children
    .map(childPath => getRouteMetadata(childPath))
    .filter((meta): meta is RouteMetadata => meta !== undefined);
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

export const extractParams = (route: RoutePath, path: string): Record<string, string> => {
  const routeParts = route.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);
  const params: Record<string, string> = {};
  
  routeParts.forEach((part, index) => {
    if (part.startsWith(':')) {
      const paramName = part.slice(1);
      params[paramName] = pathParts[index] || '';
    }
  });
  
  return params;
};

export const matchesRoute = (route: RoutePath, path: string): boolean => {
  const routePattern = route.replace(/:[^/]+/g, '[^/]+');
  const regex = new RegExp(`^${routePattern}$`);
  return regex.test(path);
};

export const isActiveRoute = (route: RoutePath, currentPath: string, exact = false): boolean => {
  if (exact) {
    return route === currentPath;
  }
  
  // For non-exact matching, check if current path starts with route
  if (route === '/') {
    return currentPath === '/';
  }
  
  return currentPath.startsWith(route);
};

// Route validation helpers
export const validateRoute = (path: string): boolean => {
  return Object.values(ROUTES).includes(path as RoutePath);
};

export const sanitizeRoute = (path: string): string => {
  // Remove double slashes, trailing slashes (except root), and ensure proper format
  return path.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
};

// Navigation helpers
export const getDefaultRouteForRole = (role: UserRole): RoutePath => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return ROUTES.DASHBOARD;
    case USER_ROLES.MANAGER:
      return ROUTES.ANALYTICS;
    case USER_ROLES.VENDOR:
      return ROUTES.DELIVERIES;
    default:
      return ROUTES.DASHBOARD;
  }
};

export const getAllowedRoutesForRole = (role: UserRole): RoutePath[] => {
  return Object.values(ROUTE_METADATA)
    .filter(meta => !meta.allowedRoles || meta.allowedRoles.includes(role))
    .map(meta => meta.path);
};

// Export for use in other modules
export default {
  ROUTES,
  ROUTE_METADATA,
  PUBLIC_ROUTES,
  PROTECTED_ROUTES,
  ADMIN_ROUTES,
  MANAGER_ROUTES,
  USER_ROLES,
  isPublicRoute,
  isProtectedRoute,
  isAdminRoute,
  isManagerRoute,
  hasRouteAccess,
  getRouteMetadata,
  getSidebarRoutes,
  getBreadcrumbPath,
  getChildRoutes,
  generatePath,
  extractParams,
  matchesRoute,
  isActiveRoute,
  validateRoute,
  sanitizeRoute,
  getDefaultRouteForRole,
  getAllowedRoutesForRole,
};