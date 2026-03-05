import React, { createContext, useContext, useReducer, useEffect} from 'react';
import type { ReactNode } from 'react';
import type { User, AuthState, LoginCredentials } from '../types/common';
import apiService from '../services/api';

// CORRECTED: The interface syntax is now valid.
interface AuthContextValue {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  checkAuth: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'REFRESH_TOKEN_SUCCESS'; payload: { token: string } }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
      };
    case 'REFRESH_TOKEN_SUCCESS':
      return {
        ...state,
        token: action.payload.token,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await apiService.post<{ user: User; token: { token: string; refreshToken: string; expiresIn: string } }>('/auth/login', credentials);
      const { user, token: tokenData } = response.data!;

      // Store tokens
      apiService.setAuthToken(tokenData.token);
      localStorage.setItem('authToken', tokenData.token);
      localStorage.setItem('refreshToken', tokenData.refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user, token: tokenData.token } 
      });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    apiService.removeAuthToken();
    
    dispatch({ type: 'LOGOUT' });
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (!storedRefreshToken) {
        throw new Error('No refresh token');
      }

      const response = await apiService.post<{ token: string; refreshToken: string }>('/auth/refresh-token', { refreshToken: storedRefreshToken });
      const { token, refreshToken: newRefreshToken } = response.data!;

      apiService.setAuthToken(token);
      localStorage.setItem('authToken', token);
      if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
      dispatch({ 
        type: 'REFRESH_TOKEN_SUCCESS', 
        payload: { token } 
      });
    } catch (error) {
      logout();
      throw error;
    }
  };

  const updateUser = (userUpdates: Partial<User>): void => {
    dispatch({ 
      type: 'UPDATE_USER', 
      payload: userUpdates 
    });
    
    // Update localStorage
    if (state.user) {
      const updatedUser = { ...state.user, ...userUpdates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const checkAuth = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const token = localStorage.getItem('authToken');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      // Set token on the apiService so subsequent calls are authenticated
      apiService.setAuthToken(token);
      const user = JSON.parse(userStr);

      try {
        // Verify token with backend
        await apiService.get('/auth/me');
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { user, token } 
        });
      } catch {
        // Token invalid, try to refresh
        await refreshToken();
      }
    } catch {
      logout();
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Auto-refresh token before expiration
  useEffect(() => {
    if (state.token && state.isAuthenticated) {
      const interval = setInterval(() => {
        refreshToken().catch(() => {
          // Token refresh failed, user will be logged out
        });
      }, 30 * 60 * 1000); // Refresh every 30 minutes

      return () => clearInterval(interval);
    }
  }, [state.token, state.isAuthenticated]);

  const value: AuthContextValue = {
    state,
    login,
    logout,
    refreshToken,
    updateUser,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protected routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const { state } = useAuth();
    
    if (state.isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (!state.isAuthenticated) {
      // Redirect to login or show login component
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground">Please log in to access this page.</p>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
};

// Hook for checking permissions
export const usePermissions = () => {
  const { state } = useAuth();
  
  const hasPermission = (permission: string): boolean => {
    return state.user?.permissions.includes(permission) || false;
  };
  
  const hasRole = (role: string): boolean => {
    return state.user?.role === role || false;
  };
  
  const hasAnyRole = (roles: string[]): boolean => {
    return roles.includes(state.user?.role || '');
  };
  
  return {
    hasPermission,
    hasRole,
    hasAnyRole,
    permissions: state.user?.permissions || [],
    role: state.user?.role,
  };
};