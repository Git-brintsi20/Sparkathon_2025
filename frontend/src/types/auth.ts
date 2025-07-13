// Authentication types and interfaces
import { ApiResponse } from './common';

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  department?: string;
  jobTitle?: string;
  permissions: Permission[];
  settings: UserSettings;
  preferences: UserPreferences;
  metadata: UserMetadata;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  lastActiveAt?: string;
}

export type UserRole = 'admin' | 'manager' | 'supervisor' | 'operator' | 'viewer';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending' | 'locked';

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  security: SecuritySettings;
  privacy: PrivacySettings;
}

export interface UserPreferences {
  dashboard: {
    layout: 'grid' | 'list';
    defaultView: string;
    refreshInterval: number;
    showAnimations: boolean;
  };
  tables: {
    pageSize: number;
    defaultSort: string;
    showFilters: boolean;
  };
  charts: {
    defaultType: string;
    colorScheme: string;
    animate: boolean;
  };
}

export interface UserMetadata {
  loginCount: number;
  failedLoginAttempts: number;
  lastFailedLogin?: string;
  passwordChangedAt?: string;
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  termsAcceptedAt?: string;
  privacyAcceptedAt?: string;
}

export interface NotificationSettings {
  email: {
    enabled: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
    types: string[];
  };
  push: {
    enabled: boolean;
    types: string[];
  };
  sms: {
    enabled: boolean;
    types: string[];
  };
  inApp: {
    enabled: boolean;
    types: string[];
  };
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  loginAlerts: boolean;
  deviceTracking: boolean;
  ipWhitelist: string[];
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'team';
  activityTracking: boolean;
  analytics: boolean;
  marketing: boolean;
  dataRetention: number;
}

// Authentication credentials
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  deviceId?: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  department?: string;
  jobTitle?: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  department?: string;
  jobTitle?: string;
  avatar?: string;
}

// Authentication tokens
export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresAt: string;
  refreshExpiresAt: string;
  scope: string[];
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  permissions: string[];
  sessionId: string;
  deviceId?: string;
  iat: number;
  exp: number;
}

// Authentication responses
export interface LoginResponse extends ApiResponse<{
  user: User;
  tokens: AuthToken;
  session: UserSession;
}> {}

export interface RegisterResponse extends ApiResponse<{
  user: User;
  tokens: AuthToken;
  verificationRequired: boolean;
}> {}

export interface RefreshTokenResponse extends ApiResponse<{
  tokens: AuthToken;
}> {}

export interface ForgotPasswordResponse extends ApiResponse<{
  message: string;
  resetTokenExpiry: string;
}> {}

export interface ResetPasswordResponse extends ApiResponse<{
  message: string;
  user: User;
}> {}

export interface VerifyEmailResponse extends ApiResponse<{
  message: string;
  user: User;
}> {}

// Session management
export interface UserSession {
  id: string;
  userId: string;
  deviceId?: string;
  deviceInfo: DeviceInfo;
  ipAddress: string;
  userAgent: string;
  location?: GeoLocation;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
  isActive: boolean;
}

export interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet';
  os: string;
  browser: string;
  version: string;
  isTrusted: boolean;
}

export interface GeoLocation {
  country: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

// Two-factor authentication
export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface TwoFactorVerification {
  token: string;
  backupCode?: string;
}

export interface TwoFactorResponse extends ApiResponse<{
  verified: boolean;
  user: User;
  tokens?: AuthToken;
}> {}

// Authentication state
export interface AuthState {
  user: User | null;
  tokens: AuthToken | null;
  session: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  enableTwoFactor: () => Promise<TwoFactorSetup>;
  verifyTwoFactor: (data: TwoFactorVerification) => Promise<void>;
  disableTwoFactor: (password: string) => Promise<void>;
  clearError: () => void;
}

// Authorization helpers
export interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  roles?: UserRole[];
  permissions?: string[];
  requireAll?: boolean;
  redirect?: string;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
  permissions?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

// Authentication hooks
export interface UseAuthOptions {
  redirectTo?: string;
  redirectIfAuthenticated?: boolean;
  middleware?: 'auth' | 'guest';
}

export interface UseAuthReturn extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllRoles: (roles: UserRole[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

// Password validation
export interface PasswordValidation {
  isValid: boolean;
  score: number;
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSymbols: boolean;
    noCommonWords: boolean;
  };
  suggestions: string[];
}

// Account security
export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  description: string;
  ipAddress: string;
  userAgent: string;
  location?: GeoLocation;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
}

export type SecurityEventType = 
  | 'login_success'
  | 'login_failure'
  | 'password_change'
  | 'profile_update'
  | 'two_factor_enabled'
  | 'two_factor_disabled'
  | 'session_expired'
  | 'suspicious_activity'
  | 'account_locked'
  | 'password_reset';

export interface SecuritySettings {
  requireTwoFactor: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  passwordExpiry: number;
  requirePasswordChange: boolean;
  allowedIpRanges: string[];
  trustedDevices: string[];
}

// Form validation
export interface AuthFormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  message?: string;
}

export interface FormValidation {
  [key: string]: ValidationRule[];
}

// API error types
export interface AuthError {
  code: string;
  message: string;
  field?: string;
  details?: any;
}

export interface AuthApiError extends ApiResponse<never> {
  error: AuthError;
}

// Storage types
export interface AuthStorage {
  getTokens: () => AuthToken | null;
  setTokens: (tokens: AuthToken) => void;
  removeTokens: () => void;
  getUser: () => User | null;
  setUser: (user: User) => void;
  removeUser: () => void;
  clear: () => void;
}

// Middleware types
export interface AuthMiddleware {
  before?: (request: any) => Promise<any>;
  after?: (response: any) => Promise<any>;
  error?: (error: any) => Promise<any>;
}

export interface RequestWithAuth extends Request {
  user?: User;
  tokens?: AuthToken;
  session?: UserSession;
}