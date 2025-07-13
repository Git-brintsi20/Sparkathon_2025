/**
 * Application Configuration Constants
 * Centralized configuration for the Smart Vendor Compliance System
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000,
  VERSION: 'v1',
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_EMAIL: '/auth/verify-email',
      PROFILE: '/auth/profile',
    },
    // Vendors
    VENDORS: {
      LIST: '/vendors',
      DETAIL: '/vendors/:id',
      CREATE: '/vendors',
      UPDATE: '/vendors/:id',
      DELETE: '/vendors/:id',
      METRICS: '/vendors/:id/metrics',
      COMPLIANCE: '/vendors/:id/compliance',
      DOCUMENTS: '/vendors/:id/documents',
    },
    // Deliveries
    DELIVERIES: {
      LIST: '/deliveries',
      DETAIL: '/deliveries/:id',
      CREATE: '/deliveries',
      UPDATE: '/deliveries/:id',
      DELETE: '/deliveries/:id',
      VERIFY: '/deliveries/:id/verify',
      TRACK: '/deliveries/:id/track',
      DOCUMENTS: '/deliveries/:id/documents',
    },
    // Analytics
    ANALYTICS: {
      DASHBOARD: '/analytics/dashboard',
      COMPLIANCE: '/analytics/compliance',
      PERFORMANCE: '/analytics/performance',
      FRAUD: '/analytics/fraud',
      EXPORT: '/analytics/export',
      REPORTS: '/analytics/reports',
    },
    // Blockchain
    BLOCKCHAIN: {
      VERIFY: '/blockchain/verify',
      RECORD: '/blockchain/record',
      HISTORY: '/blockchain/history',
      STATUS: '/blockchain/status',
    },
    // File Upload
    UPLOAD: {
      SINGLE: '/upload/single',
      MULTIPLE: '/upload/multiple',
      DOCUMENTS: '/upload/documents',
      IMAGES: '/upload/images',
    },
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Application Settings
export const APP_CONFIG = {
  NAME: 'Smart Vendor Compliance',
  VERSION: '1.0.0',
  DESCRIPTION: 'AI-powered vendor compliance and fraud detection system',
  COMPANY: 'Compliance Solutions Inc.',
  SUPPORT_EMAIL: 'support@smartvendor.com',
  
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
    MAX_PAGE_SIZE: 100,
  },
  
  // Date & Time
  DATE_FORMAT: 'YYYY-MM-DD',
  TIME_FORMAT: 'HH:mm:ss',
  DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  TIMEZONE: 'UTC',
  
  // File Upload
  UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ],
    MAX_FILES_PER_UPLOAD: 10,
  },
  
  // Search & Filtering
  SEARCH: {
    MIN_SEARCH_LENGTH: 3,
    DEBOUNCE_DELAY: 300,
    MAX_RESULTS: 50,
  },
  
  // Notifications
  NOTIFICATIONS: {
    DURATION: 5000,
    MAX_NOTIFICATIONS: 5,
    POSITIONS: {
      TOP_RIGHT: 'top-right',
      TOP_LEFT: 'top-left',
      BOTTOM_RIGHT: 'bottom-right',
      BOTTOM_LEFT: 'bottom-left',
    },
  },
  
  // WebSocket
  WEBSOCKET: {
    RECONNECT_INTERVAL: 3000,
    MAX_RECONNECT_ATTEMPTS: 5,
    HEARTBEAT_INTERVAL: 30000,
  },
  
  // Cache
  CACHE: {
    DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
    LONG_TTL: 60 * 60 * 1000, // 1 hour
    SHORT_TTL: 1 * 60 * 1000, // 1 minute
  },
} as const;

// Compliance Status
export const COMPLIANCE_STATUS = {
  COMPLIANT: 'compliant',
  NON_COMPLIANT: 'non_compliant',
  PENDING: 'pending',
  REVIEW_REQUIRED: 'review_required',
  EXPIRED: 'expired',
} as const;

// Delivery Status
export const DELIVERY_STATUS = {
  PENDING: 'pending',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
} as const;

// Vendor Status
export const VENDOR_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING_APPROVAL: 'pending_approval',
  BLACKLISTED: 'blacklisted',
} as const;

// Risk Levels
export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  STORAGE_KEY: 'smart-vendor-theme',
  DEFAULT_THEME: 'light',
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PROFILE: 'user_profile',
  THEME: 'theme',
  LANGUAGE: 'language',
  PREFERENCES: 'preferences',
  FILTERS: 'filters',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
} as const;

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  VENDOR_ID: /^VEN-[0-9]{6}$/,
  DELIVERY_ID: /^DEL-[0-9]{8}$/,
  PO_NUMBER: /^PO-[0-9]{6}$/,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'An unexpected error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. You do not have permission.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  SERVER: 'Server error. Please try again later.',
  TIMEOUT: 'Request timeout. Please try again.',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit.',
  INVALID_FILE_TYPE: 'Invalid file type. Please select a supported file.',
  RATE_LIMIT: 'Too many requests. Please wait before trying again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Record created successfully.',
  UPDATED: 'Record updated successfully.',
  DELETED: 'Record deleted successfully.',
  SAVED: 'Changes saved successfully.',
  UPLOADED: 'File uploaded successfully.',
  VERIFIED: 'Verification completed successfully.',
  SENT: 'Message sent successfully.',
  EXPORTED: 'Data exported successfully.',
} as const;

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3B82F6',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#06B6D4',
  GRAY: '#6B7280',
  GRADIENT: {
    PRIMARY: ['#3B82F6', '#1D4ED8'],
    SUCCESS: ['#10B981', '#047857'],
    WARNING: ['#F59E0B', '#D97706'],
    ERROR: ['#EF4444', '#DC2626'],
  },
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 1000,
} as const;

// Breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Route Paths
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  VENDORS: '/vendors',
  VENDOR_DETAIL: '/vendors/:id',
  DELIVERIES: '/deliveries',
  DELIVERY_DETAIL: '/deliveries/:id',
  ANALYTICS: '/analytics',
  COMPLIANCE_REPORT: '/analytics/compliance',
  FRAUD_DETECTION: '/analytics/fraud',
  PERFORMANCE: '/analytics/performance',
  SETTINGS: '/settings',
  PROFILE: '/settings/profile',
  SYSTEM_CONFIG: '/settings/system',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  BLOCKCHAIN_ENABLED: import.meta.env.VITE_BLOCKCHAIN_ENABLED === 'true',
  ML_FRAUD_DETECTION: import.meta.env.VITE_ML_FRAUD_DETECTION === 'true',
  REAL_TIME_NOTIFICATIONS: import.meta.env.VITE_REAL_TIME_NOTIFICATIONS === 'true',
  ADVANCED_ANALYTICS: import.meta.env.VITE_ADVANCED_ANALYTICS === 'true',
  MULTI_LANGUAGE: import.meta.env.VITE_MULTI_LANGUAGE === 'true',
  DARK_MODE: import.meta.env.VITE_DARK_MODE === 'true',
  EXPORT_FUNCTIONALITY: import.meta.env.VITE_EXPORT_FUNCTIONALITY === 'true',
} as const;

// Export all constants
export default {
  API_CONFIG,
  HTTP_STATUS,
  APP_CONFIG,
  COMPLIANCE_STATUS,
  DELIVERY_STATUS,
  VENDOR_STATUS,
  RISK_LEVELS,
  PRIORITY_LEVELS,
  THEME_CONFIG,
  STORAGE_KEYS,
  REGEX_PATTERNS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  CHART_COLORS,
  ANIMATION_DURATION,
  BREAKPOINTS,
  ROUTES,
  FEATURE_FLAGS,
} as const;