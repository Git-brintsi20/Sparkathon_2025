import { useContext, useCallback, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import type { User, LoginCredentials } from '../types/common';

interface UseAuthReturn {
  // State
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  checkAuth: () => Promise<void>;
  
  // Permissions
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  
  // Computed values
  isAdmin: boolean;
  isManager: boolean;
  isUser: boolean;
  permissions: string[];
  role: string | undefined;
  userInitials: string;
  userDisplayName: string;
  
  // Utilities
  canAccessRoute: (routePermissions: string[]) => boolean;
  canPerformAction: (action: string) => boolean;
  isSessionValid: boolean;
  timeUntilExpiry: number | null;
}

export const useAuth = (): UseAuthReturn => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  const { state, login, logout, refreshToken, updateUser, checkAuth } = context;
  
  // Permission checking functions
  const hasPermission = useCallback((permission: string): boolean => {
    return state.user?.permissions?.includes(permission) || false;
  }, [state.user?.permissions]);
  
  const hasRole = useCallback((role: string): boolean => {
    return state.user?.role === role || false;
  }, [state.user?.role]);
  
  const hasAnyRole = useCallback((roles: string[]): boolean => {
    return roles.includes(state.user?.role || '');
  }, [state.user?.role]);
  
  // Route access checking
  const canAccessRoute = useCallback((routePermissions: string[]): boolean => {
    if (!state.isAuthenticated || !state.user) return false;
    if (routePermissions.length === 0) return true;
    
    return routePermissions.some(permission => 
      state.user?.permissions?.includes(permission)
    );
  }, [state.isAuthenticated, state.user]);
  
  // Action permission checking
  const canPerformAction = useCallback((action: string): boolean => {
    if (!state.isAuthenticated || !state.user) return false;
    
    // Define action-permission mappings
    const actionPermissions: Record<string, string[]> = {
      'create_vendor': ['vendor.create', 'admin'],
      'edit_vendor': ['vendor.edit', 'admin'],
      'delete_vendor': ['vendor.delete', 'admin'],
      'view_vendor': ['vendor.view', 'vendor.edit', 'admin'],
      'create_delivery': ['delivery.create', 'admin'],
      'edit_delivery': ['delivery.edit', 'admin'],
      'delete_delivery': ['delivery.delete', 'admin'],
      'view_delivery': ['delivery.view', 'delivery.edit', 'admin'],
      'view_analytics': ['analytics.view', 'admin'],
      'export_data': ['analytics.export', 'admin'],
      'manage_users': ['user.manage', 'admin'],
      'system_config': ['system.config', 'admin'],
    };
    
    const requiredPermissions = actionPermissions[action] || [];
    return requiredPermissions.some(permission => 
      state.user?.permissions?.includes(permission)
    );
  }, [state.isAuthenticated, state.user]);
  
  // Computed values
  const computedValues = useMemo(() => {
    const user = state.user;
    const role = user?.role;
    const permissions = user?.permissions || [];
    
    return {
      isAdmin: role === 'admin',
      isManager: role === 'manager',
      isUser: role === 'user',
      permissions,
      role,
      userInitials: user 
        ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
        : '',
      userDisplayName: user 
        ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'User'
        : 'Guest',
    };
  }, [state.user]);
  
  // Session validity checking
  const isSessionValid = useMemo(() => {
    if (!state.token || !state.isAuthenticated) return false;
    
    try {
      // Decode JWT token to check expiry (simplified check)
      const tokenData = JSON.parse(atob(state.token.split('.')[1]));
      const expiryTime = tokenData.exp * 1000;
      const currentTime = Date.now();
      
      return currentTime < expiryTime;
    } catch {
      return false;
    }
  }, [state.token, state.isAuthenticated]);
  
  // Time until token expiry
  const timeUntilExpiry = useMemo(() => {
    if (!state.token || !state.isAuthenticated) return null;
    
    try {
      const tokenData = JSON.parse(atob(state.token.split('.')[1]));
      const expiryTime = tokenData.exp * 1000;
      const currentTime = Date.now();
      
      return Math.max(0, expiryTime - currentTime);
    } catch {
      return null;
    }
  }, [state.token, state.isAuthenticated]);
  
  // Enhanced login with additional options
  const enhancedLogin = useCallback(async (
    credentials: LoginCredentials,
    options?: { rememberMe?: boolean; redirectTo?: string }
  ) => {
    try {
      await login(credentials);
      
      // Handle remember me option
      if (options?.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      // Store redirect URL for post-login navigation
      if (options?.redirectTo) {
        sessionStorage.setItem('redirectAfterLogin', options.redirectTo);
      }
    } catch (error) {
      throw error;
    }
  }, [login]);
  
  // Enhanced logout with cleanup
  const enhancedLogout = useCallback(() => {
    // Clear any stored redirect URLs
    sessionStorage.removeItem('redirectAfterLogin');
    localStorage.removeItem('rememberMe');
    
    // Call original logout
    logout();
  }, [logout]);
  
  // Update user profile with optimistic updates
  const updateUserProfile = useCallback((updates: Partial<User>) => {
    // Optimistically update the user
    updateUser(updates);
    
    // Here you would typically make an API call to update the user on the server
    // For now, we'll just update the local state
  }, [updateUser]);
  
  return {
    // State
    user: state.user,
    token: state.token,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    
    // Actions
    login: enhancedLogin,
    logout: enhancedLogout,
    refreshToken,
    updateUser: updateUserProfile,
    checkAuth,
    
    // Permissions
    hasPermission,
    hasRole,
    hasAnyRole,
    
    // Computed values
    ...computedValues,
    
    // Utilities
    canAccessRoute,
    canPerformAction,
    isSessionValid,
    timeUntilExpiry,
  };
};

// Hook for checking if user is authenticated (simplified version)
export const useIsAuthenticated = (): boolean => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

// Hook for getting user information
export const useUser = (): User | null => {
  const { user } = useAuth();
  return user;
};

// Hook for permission checking
export const usePermissions = () => {
  const { 
    hasPermission, 
    hasRole, 
    hasAnyRole, 
    permissions, 
    role,
    canAccessRoute,
    canPerformAction 
  } = useAuth();
  
  return {
    hasPermission,
    hasRole,
    hasAnyRole,
    permissions,
    role,
    canAccessRoute,
    canPerformAction,
  };
};

// Hook for user profile operations
export const useUserProfile = () => {
  const { 
    user, 
    updateUser, 
    userInitials, 
    userDisplayName,
    isLoading 
  } = useAuth();
  
  return {
    user,
    updateUser,
    userInitials,
    userDisplayName,
    isLoading,
  };
};

// Hook for session management
export const useSession = () => {
  const { 
    isSessionValid, 
    timeUntilExpiry, 
    refreshToken, 
    logout,
    isAuthenticated 
  } = useAuth();
  
  return {
    isSessionValid,
    timeUntilExpiry,
    refreshToken,
    logout,
    isAuthenticated,
  };
};