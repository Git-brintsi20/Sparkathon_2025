// frontend/src/services/authService.ts
import apiService from './api';
import type { 
  ApiResponse, 
  User, 
  LoginCredentials, 
  AuthToken, 
  AuthState 
} from '../types/common';

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'manager' | 'viewer';
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private authListeners: ((user: User | null) => void)[] = [];

  private constructor() {
    this.initializeAuth();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Initialize authentication state
  private initializeAuth(): void {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      try {
        this.currentUser = JSON.parse(userData);
        apiService.setAuthToken(token);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        this.clearAuthData();
      }
    }
  }

  // Clear authentication data
  private clearAuthData(): void {
    this.currentUser = null;
    apiService.removeAuthToken();
    localStorage.removeItem('user_data');
    this.notifyAuthListeners();
  }

  // Notify auth state listeners
  private notifyAuthListeners(): void {
    this.authListeners.forEach(listener => listener(this.currentUser));
  }

  // Add auth state listener
  public addAuthListener(listener: (user: User | null) => void): () => void {
    this.authListeners.push(listener);
    
    // Return cleanup function
    return () => {
      const index = this.authListeners.indexOf(listener);
      if (index > -1) {
        this.authListeners.splice(index, 1);
      }
    };
  }

  // Login user
  public async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: AuthToken }>> {
    try {
      const response = await apiService.post<{ user: User; token: AuthToken }>('/auth/login', credentials);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Store authentication data
        this.currentUser = user;
        apiService.setAuthToken(token.token);
        localStorage.setItem('user_data', JSON.stringify(user));
        localStorage.setItem('refresh_token', token.refreshToken);
        
        // Notify listeners
        this.notifyAuthListeners();
        
        // Log user activity
        console.log(`✅ User ${user.email} logged in successfully`);
      }
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Register new user
  public async register(credentials: RegisterCredentials): Promise<ApiResponse<{ user: User; token: AuthToken }>> {
    try {
      const response = await apiService.post<{ user: User; token: AuthToken }>('/auth/register', credentials);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Store authentication data
        this.currentUser = user;
        apiService.setAuthToken(token.token);
        localStorage.setItem('user_data', JSON.stringify(user));
        localStorage.setItem('refresh_token', token.refreshToken);
        
        // Notify listeners
        this.notifyAuthListeners();
        
        console.log(`✅ User ${user.email} registered successfully`);
      }
      
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  // Logout user
  public async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate token on server
      await apiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // Clear local data regardless of server response
      this.clearAuthData();
      console.log('✅ User logged out successfully');
    }
  }

  // Get current user
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Check if user is authenticated
  public isAuthenticated(): boolean {
    return this.currentUser !== null && localStorage.getItem('auth_token') !== null;
  }

  // Check if user has permission
  public hasPermission(permission: string): boolean {
    return this.currentUser?.permissions?.includes(permission) || false;
  }

  // Check if user has role
  public hasRole(role: 'admin' | 'manager' | 'viewer'): boolean {
    return this.currentUser?.role === role;
  }

  // Get user permissions
  public getUserPermissions(): string[] {
    return this.currentUser?.permissions || [];
  }

  // Refresh user data
  public async refreshUserData(): Promise<ApiResponse<User>> {
    try {
      const response = await apiService.get<User>('/auth/me');
      
      if (response.success && response.data) {
        this.currentUser = response.data;
        localStorage.setItem('user_data', JSON.stringify(response.data));
        this.notifyAuthListeners();
      }
      
      return response;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      throw error;
    }
  }

  // Update user profile
  public async updateProfile(data: UpdateProfileData): Promise<ApiResponse<User>> {
    try {
      const response = await apiService.patch<User>('/auth/profile', data);
      
      if (response.success && response.data) {
        this.currentUser = response.data;
        localStorage.setItem('user_data', JSON.stringify(response.data));
        this.notifyAuthListeners();
      }
      
      return response;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }

  // Change password
  public async changePassword(data: ChangePasswordData): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await apiService.patch<{ message: string }>('/auth/password', data);
      return response;
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  }

  // Request password reset
  public async requestPasswordReset(data: PasswordResetRequest): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await apiService.post<{ message: string }>('/auth/password/reset', data);
      return response;
    } catch (error) {
      console.error('Failed to request password reset:', error);
      throw error;
    }
  }

  // Confirm password reset
  public async confirmPasswordReset(data: PasswordResetConfirm): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await apiService.post<{ message: string }>('/auth/password/confirm', data);
      return response;
    } catch (error) {
      console.error('Failed to confirm password reset:', error);
      throw error;
    }
  }

  // Upload user avatar
  public async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    try {
      const response = await apiService.uploadFile<{ avatarUrl: string }>('/auth/avatar', [file]);
      
      if (response.success && response.data && this.currentUser) {
        this.currentUser.avatar = response.data.avatarUrl;
        localStorage.setItem('user_data', JSON.stringify(this.currentUser));
        this.notifyAuthListeners();
      }
      
      return response;
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      throw error;
    }
  }

  // Verify email
  public async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await apiService.post<{ message: string }>('/auth/verify-email', { token });
      return response;
    } catch (error) {
      console.error('Failed to verify email:', error);
      throw error;
    }
  }

  // Resend verification email
  public async resendVerificationEmail(): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await apiService.post<{ message: string }>('/auth/resend-verification');
      return response;
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      throw error;
    }
  }

  // Get auth state
  public getAuthState(): AuthState {
    return {
      user: this.currentUser,
      token: localStorage.getItem('auth_token'),
      isLoading: false,
      isAuthenticated: this.isAuthenticated(),
    };
  }

  // Token validation
  public async validateToken(): Promise<boolean> {
    try {
      const response = await apiService.get('/auth/validate');
      return response.success;
    } catch (error) {
      console.error('Token validation failed:', error);
      this.clearAuthData();
      return false;
    }
  }

  // Session management
  public async extendSession(): Promise<ApiResponse<{ expiresAt: string }>> {
    try {
      const response = await apiService.post<{ expiresAt: string }>('/auth/extend-session');
      return response;
    } catch (error) {
      console.error('Failed to extend session:', error);
      throw error;
    }
  }

  // Get user activity logs
  public async getUserActivityLogs(params?: { page?: number; limit?: number }): Promise<ApiResponse<any>> {
    try {
      const response = await apiService.get('/auth/activity-logs', params);
      return response;
    } catch (error) {
      console.error('Failed to get activity logs:', error);
      throw error;
    }
  }

  // Enable/disable two-factor authentication
  public async toggleTwoFactorAuth(enable: boolean): Promise<ApiResponse<{ qrCode?: string; backupCodes?: string[] }>> {
    try {
      const response = await apiService.post<{ qrCode?: string; backupCodes?: string[] }>('/auth/2fa/toggle', { enable });
      return response;
    } catch (error) {
      console.error('Failed to toggle 2FA:', error);
      throw error;
    }
  }

  // Verify two-factor authentication code
  public async verifyTwoFactorCode(code: string): Promise<ApiResponse<{ verified: boolean }>> {
    try {
      const response = await apiService.post<{ verified: boolean }>('/auth/2fa/verify', { code });
      return response;
    } catch (error) {
      console.error('Failed to verify 2FA code:', error);
      throw error;
    }
  }
}

// Export singleton instance
const authService = AuthService.getInstance();
export default authService;