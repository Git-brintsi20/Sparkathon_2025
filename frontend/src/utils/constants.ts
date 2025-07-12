// Application constants including API endpoints, status codes, and configuration values

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  VERSION: 'v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  
  // Vendors
  VENDORS: {
    LIST: '/vendors',
    CREATE: '/vendors',
    GET: (id: string) => `/vendors/${id}`,
    UPDATE: (id: string) => `/vendors/${id}`,
    DELETE: (id: string) => `/vendors/${id}`,
    METRICS: (id: string) => `/vendors/${id}/metrics`,
    COMPLIANCE: (id: string) => `/vendors/${id}/compliance`,
    DOCUMENTS: (id: string) => `/vendors/${id}/documents`,
  },
  
  // Deliveries
  DELIVERIES: {
    LIST: '/deliveries',
    CREATE: '/deliveries',
    GET: (id: string) => `/deliveries/${id}`,
    UPDATE: (id: string) => `/deliveries/${id}`,
    DELETE: (id: string) => `/deliveries/${id}`,
    VERIFY: (id: string) => `/deliveries/${id}/verify`,
    TRACK: (id: string) => `/deliveries/${id}/track`,
    PHOTOS: (id: string) => `/deliveries/${id}/photos`,
  },
  
  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    COMPLIANCE: '/analytics/compliance',
    PERFORMANCE: '/analytics/performance',
    FRAUD: '/analytics/fraud',
    TRENDS: '/analytics/trends',
    REPORTS: '/analytics/reports',
    EXPORT: '/analytics/export',
  },
  
  // Blockchain
  BLOCKCHAIN: {
    VERIFY: '/blockchain/verify',
    SUBMIT: '/blockchain/submit',
    HISTORY: '/blockchain/history',
    STATUS: '/blockchain/status',
  },
  
  // File uploads
  UPLOADS: {
    SINGLE: '/uploads/single',
    MULTIPLE: '/uploads/multiple',
    DELETE: (id: string) => `/uploads/${id}`,
  },
  
  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: (id: string) => `/notifications/${id}`,
  },
};

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

/**
 * Application Status Values
 */
export const VENDOR_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
  UNDER_REVIEW: 'under_review',
};

export const DELIVERY_STATUS = {
  PENDING: 'pending',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  DELAYED: 'delayed',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
  FAILED: 'failed',
};

export const COMPLIANCE_STATUS = {
  COMPLIANT: 'compliant',
  NON_COMPLIANT: 'non_compliant',
  PENDING_REVIEW: 'pending_review',
  REQUIRES_ACTION: 'requires_action',
  EXEMPT: 'exempt',
};

export const RISK_LEVEL = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const NOTIFICATION_TYPE = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

/**
 * User Roles and Permissions
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  VIEWER: 'viewer',
  VENDOR: 'vendor',
};

export const PERMISSIONS = {
  // Vendor permissions
  VENDOR_CREATE: 'vendor:create',
  VENDOR_READ: 'vendor:read',
  VENDOR_UPDATE: 'vendor:update',
  VENDOR_DELETE: 'vendor:delete',
  
  // Delivery permissions
  DELIVERY_CREATE: 'delivery:create',
  DELIVERY_READ: 'delivery:read',
  DELIVERY_UPDATE: 'delivery:update',
  DELIVERY_DELETE: 'delivery:delete',
  DELIVERY_VERIFY: 'delivery:verify',
  
  // Analytics permissions
  ANALYTICS_READ: 'analytics:read',
  ANALYTICS_EXPORT: 'analytics:export',
  
  // Admin permissions
  USER_MANAGE: 'user:manage',
  SYSTEM_CONFIG: 'system:config',
  AUDIT_LOG: 'audit:log',
};

/**
 * File Upload Configuration
 */
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  ALLOWED_IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
  ],
  ALLOWED_ALL: [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv', 'text/plain', 'application/json',
  ],
};

/**
 * Pagination Configuration
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  SIZES: [10, 25, 50, 100],
};

/**
 * Theme Configuration
 */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

export const THEME_COLORS = {
  PRIMARY: ['blue', 'green', 'purple', 'red', 'orange', 'teal', 'pink', 'indigo'],
  VARIANTS: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
};

/**
 * Date and Time Configuration
 */
export const DATE_FORMATS = {
  SHORT: 'MMM d, yyyy',
  MEDIUM: 'MMM d, yyyy h:mm a',
  LONG: 'MMMM d, yyyy h:mm:ss a',
  ISO: 'yyyy-MM-dd',
  TIME: 'h:mm a',
  DATETIME: 'yyyy-MM-dd HH:mm:ss',
};

export const TIME_ZONES = {
  UTC: 'UTC',
  EST: 'America/New_York',
  PST: 'America/Los_Angeles',
  CST: 'America/Chicago',
  MST: 'America/Denver',
};

/**
 * Validation Rules
 */
export const VALIDATION_RULES = {
  EMAIL: {
    MAX_LENGTH: 255,
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
  PHONE: {
    REGEX: /^[\+]?[1-9][\d]{0,15}$/,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    REGEX: /^[a-zA-Z\s\-'\.]+$/,
  },
  VENDOR_CODE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    REGEX: /^[A-Z0-9\-]+$/,
  },
  DELIVERY_ID: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 50,
    REGEX: /^[A-Z0-9\-_]+$/,
  },
};

/**
 * Chart Configuration
 */
export const CHART_COLORS = {
  PRIMARY: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  SECONDARY: ['#93C5FD', '#6EE7B7', '#FCD34D', '#FCA5A5', '#C4B5FD'],
  RISK_LEVELS: {
    LOW: '#10B981',
    MEDIUM: '#F59E0B',
    HIGH: '#EF4444',
    CRITICAL: '#DC2626',
  },
};

/**
 * Animation Configuration
 */
export const ANIMATION = {
  DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    EASE_OUT: 'cubic-bezier(0.16, 1, 0.3, 1)',
    EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
    EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

/**
 * WebSocket Configuration
 */
export const WEBSOCKET = {
  RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY: 3000,
  HEARTBEAT_INTERVAL: 30000,
  MESSAGE_TYPES: {
    DELIVERY_UPDATE: 'delivery_update',
    COMPLIANCE_ALERT: 'compliance_alert',
    FRAUD_DETECTION: 'fraud_detection',
    SYSTEM_NOTIFICATION: 'system_notification',
  },
};

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'The requested resource was not found.',
  TIMEOUT: 'Request timeout. Please try again.',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit.',
  INVALID_FILE_TYPE: 'Invalid file type. Please select a supported file.',
};

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  VENDOR_CREATED: 'Vendor created successfully.',
  VENDOR_UPDATED: 'Vendor updated successfully.',
  VENDOR_DELETED: 'Vendor deleted successfully.',
  DELIVERY_CREATED: 'Delivery created successfully.',
  DELIVERY_UPDATED: 'Delivery updated successfully.',
  DELIVERY_VERIFIED: 'Delivery verified successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  SETTINGS_SAVED: 'Settings saved successfully.',
  FILE_UPLOADED: 'File uploaded successfully.',
  DATA_EXPORTED: 'Data exported successfully.',
};

/**
 * Application Limits
 */
export const LIMITS = {
  MAX_VENDORS: 10000,
  MAX_DELIVERIES_PER_DAY: 1000,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_EXPORT_RECORDS: 50000,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  RATE_LIMIT_REQUESTS: 100,
  RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute
};

/**
 * Feature Flags
 */
export const FEATURE_FLAGS = {
  BLOCKCHAIN_INTEGRATION: true,
  REAL_TIME_TRACKING: true,
  AI_FRAUD_DETECTION: true,
  MOBILE_APP: true,
  ADVANCED_ANALYTICS: true,
  MULTI_TENANT: false,
  DARK_MODE: true,
  EXPORT_FUNCTIONALITY: true,
};

/**
 * Compliance Standards
 */
export const COMPLIANCE_STANDARDS = {
  ISO_27001: 'ISO 27001',
  SOC2: 'SOC 2',
  GDPR: 'GDPR',
  HIPAA: 'HIPAA',
  PCI_DSS: 'PCI DSS',
  CUSTOM: 'Custom',
};

/**
 * Notification Settings
 */
export const NOTIFICATION_SETTINGS = {
  DEFAULT_DURATION: 5000,
  MAX_NOTIFICATIONS: 10,
  SOUND_ENABLED: true,
  DESKTOP_NOTIFICATIONS: true,
  EMAIL_NOTIFICATIONS: true,
  SMS_NOTIFICATIONS: false,
};