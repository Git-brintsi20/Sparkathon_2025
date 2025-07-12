// frontend/src/config/routes.ts
export interface RouteConfig {
  path: string;
  title: string;
  icon?: string;
  requiresAuth: boolean;
  roles?: string[];
  permissions?: string[];
  children?: RouteConfig[];
}

// Route paths constants
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  VENDORS: '/vendors',
  VENDOR_DETAIL: '/vendors/:id',
  VENDOR_CREATE: '/vendors/create',
  DELIVERIES: '/deliveries',
  DELIVERY_DETAIL: '/deliveries/:id',
  DELIVERY_CREATE: '/deliveries/create',
  ANALYTICS: '/analytics',
  COMPLIANCE_REPORT: '/analytics/compliance',
  FRAUD_DETECTION: '/analytics/fraud',
  PERFORMANCE_METRICS: '/analytics/performance',
  SETTINGS: '/settings',
  PROFILE: '/settings/profile',
  THEME: '/settings/theme',
  SYSTEM: '/settings/system',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '/404',
} as const;

// Route configurations
export const routeConfigs: RouteConfig[] = [
  {
    path: ROUTES.DASHBOARD,
    title: 'Dashboard',
    icon: 'LayoutDashboard',
    requiresAuth: true,
  },
  {
    path: ROUTES.VENDORS,
    title: 'Vendors',
    icon: 'Users',
    requiresAuth: true,
    children: [
      {
        path: ROUTES.VENDOR_DETAIL,
        title: 'Vendor Details',
        requiresAuth: true,
      },
      {
        path: ROUTES.VENDOR_CREATE,
        title: 'Create Vendor',
        requiresAuth: true,
        roles: ['admin', 'manager'],
      },
    ],
  },
  {
    path: ROUTES.DELIVERIES,
    title: 'Deliveries',
    icon: 'Package',
    requiresAuth: true,
    children: [
      {
        path: ROUTES.DELIVERY_DETAIL,
        title: 'Delivery Details',
        requiresAuth: true,
      },
      {
        path: ROUTES.DELIVERY_CREATE,
        title: 'Create Delivery',
        requiresAuth: true,
        roles: ['admin', 'manager', 'operator'],
      },
    ],
  },
  {
    path: ROUTES.ANALYTICS,
    title: 'Analytics',
    icon: 'BarChart3',
    requiresAuth: true,
    roles: ['admin', 'manager', 'analyst'],
    children: [
      {
        path: ROUTES.COMPLIANCE_REPORT,
        title: 'Compliance Report',
        requiresAuth: true,
        roles: ['admin', 'manager', 'analyst'],
      },
      {
        path: ROUTES.FRAUD_DETECTION,
        title: 'Fraud Detection',
        requiresAuth: true,
        roles: ['admin', 'manager'],
      },
      {
        path: ROUTES.PERFORMANCE_METRICS,
        title: 'Performance Metrics',
        requiresAuth: true,
        roles: ['admin', 'manager', 'analyst'],
      },
    ],
  },
  {
    path: ROUTES.SETTINGS,
    title: 'Settings',
    icon: 'Settings',
    requiresAuth: true,
    children: [
      {
        path: ROUTES.PROFILE,
        title: 'Profile',
        requiresAuth: true,
      },
      {
        path: ROUTES.THEME,
        title: 'Theme',
        requiresAuth: true,
      },
      {
        path: ROUTES.SYSTEM,
        title: 'System',
        requiresAuth: true,
        roles: ['admin'],
      },
    ],
  },
];

// Public routes (no authentication required)
export const publicRoutes = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.UNAUTHORIZED,
  ROUTES.NOT_FOUND,
];

// Protected routes helper
export const isProtectedRoute = (path: string): boolean => {
  return !publicRoutes.includes(path as any);
};

// Route matching helper
export const matchRoute = (currentPath: string, routePath: string): boolean => {
  // Convert route path to regex pattern
  const pattern = routePath.replace(/:\w+/g, '[^/]+');
  const regex = new RegExp(`^${pattern}$`);
  return regex.test(currentPath);
};

// Get route config by path
export const getRouteConfig = (path: string): RouteConfig | undefined => {
  const findRoute = (routes: RouteConfig[], targetPath: string): RouteConfig | undefined => {
    for (const route of routes) {
      if (matchRoute(targetPath, route.path)) {
        return route;
      }
      if (route.children) {
        const childRoute = findRoute(route.children, targetPath);
        if (childRoute) return childRoute;
      }
    }
    return undefined;
  };
  
  return findRoute(routeConfigs, path);
};

// Check if user has access to route
export const hasRouteAccess = (
  route: RouteConfig,
  userRole?: string,
  userPermissions?: string[]
): boolean => {
  if (!route.requiresAuth) return true;
  
  if (route.roles && route.roles.length > 0) {
    if (!userRole || !route.roles.includes(userRole)) {
      return false;
    }
  }
  
  if (route.permissions && route.permissions.length > 0) {
    if (!userPermissions || !route.permissions.some(p => userPermissions.includes(p))) {
      return false;
    }
  }
  
  return true;
};

// Navigation helper
export const getNavigationRoutes = (
  userRole?: string,
  userPermissions?: string[]
): RouteConfig[] => {
  return routeConfigs.filter(route => 
    hasRouteAccess(route, userRole, userPermissions)
  );
};

// Breadcrumb helper
export const getBreadcrumbs = (path: string): { title: string; path: string }[] => {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs: { title: string; path: string }[] = [];
  
  let currentPath = '';
  
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const route = getRouteConfig(currentPath);
    
    if (route) {
      breadcrumbs.push({
        title: route.title,
        path: currentPath,
      });
    } else {
      // Handle dynamic segments
      const routeWithParam = getRouteConfig(currentPath.replace(/\/[^/]+$/, '/:id'));
      if (routeWithParam) {
        breadcrumbs.push({
          title: `${routeWithParam.title} - ${segment}`,
          path: currentPath,
        });
      }
    }
  }
  
  return breadcrumbs;
};

// Default redirects
export const DEFAULT_REDIRECTS = {
  AUTHENTICATED: ROUTES.DASHBOARD,
  UNAUTHENTICATED: ROUTES.LOGIN,
  UNAUTHORIZED: ROUTES.UNAUTHORIZED,
  NOT_FOUND: ROUTES.NOT_FOUND,
} as const;