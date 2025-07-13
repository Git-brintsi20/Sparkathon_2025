/**
 * Environment Configuration
 * Centralized environment variable handling and validation
 */

// Environment variable types
interface EnvironmentConfig {
  // API Configuration
  API_BASE_URL: string;
  API_TIMEOUT: number;
  
  // Authentication
  JWT_SECRET?: string;
  JWT_EXPIRY: string;
  
  // Database
  DATABASE_URL?: string;
  
  // External Services
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
  
  // Blockchain
  BLOCKCHAIN_NETWORK?: string;
  BLOCKCHAIN_RPC_URL?: string;
  BLOCKCHAIN_PRIVATE_KEY?: string;
  CONTRACT_ADDRESS?: string;
  
  // WebSocket
  WEBSOCKET_URL: string;
  
  // Email Service
  EMAIL_SERVICE?: string;
  EMAIL_FROM?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: number;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  
  // Storage
  STORAGE_TYPE?: 'local' | 'cloudinary' | 's3';
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AWS_REGION?: string;
  AWS_BUCKET?: string;
  
  // Analytics
  ANALYTICS_PROVIDER?: string;
  ANALYTICS_API_KEY?: string;
  
  // Feature Flags
  BLOCKCHAIN_ENABLED: boolean;
  ML_FRAUD_DETECTION: boolean;
  REAL_TIME_NOTIFICATIONS: boolean;
  ADVANCED_ANALYTICS: boolean;
  MULTI_LANGUAGE: boolean;
  DARK_MODE: boolean;
  EXPORT_FUNCTIONALITY: boolean;
  
  // Development
  NODE_ENV: 'development' | 'production' | 'test';
  DEBUG: boolean;
  
  // Application
  APP_NAME: string;
  APP_VERSION: string;
  APP_URL: string;
  
  // Security
  CORS_ORIGIN: string;
  RATE_LIMIT_WINDOW: number;
  RATE_LIMIT_MAX: number;
  
  // Logging
  LOG_LEVEL: 'error' | 'warn' | 'info' | 'debug';
  LOG_FORMAT: 'json' | 'combined' | 'common';
}

// Default values
const DEFAULT_CONFIG: Partial<EnvironmentConfig> = {
  API_BASE_URL: 'http://localhost:3000/api',
  API_TIMEOUT: 10000,
  JWT_EXPIRY: '7d',
  WEBSOCKET_URL: 'ws://localhost:3000',
  NODE_ENV: 'development',
  DEBUG: false,
  APP_NAME: 'Smart Vendor Compliance',
  APP_VERSION: '1.0.0',
  APP_URL: 'http://localhost:5173',
  CORS_ORIGIN: '*',
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: 100,
  LOG_LEVEL: 'info',
  LOG_FORMAT: 'combined',
  STORAGE_TYPE: 'local',
  BLOCKCHAIN_ENABLED: false,
  ML_FRAUD_DETECTION: false,
  REAL_TIME_NOTIFICATIONS: false,
  ADVANCED_ANALYTICS: false,
  MULTI_LANGUAGE: false,
  DARK_MODE: true,
  EXPORT_FUNCTIONALITY: true,
  SMTP_PORT: 587,
  AWS_REGION: 'us-east-1',
  ANALYTICS_PROVIDER: 'none',
  BLOCKCHAIN_NETWORK: 'localhost',
  EMAIL_SERVICE: 'smtp',
};

// Environment variable validation schema
const ENV_SCHEMA = {
  required: [
    'API_BASE_URL',
    'APP_NAME',
    'APP_VERSION',
    'NODE_ENV',
  ],
  optional: [
    'API_TIMEOUT',
    'JWT_SECRET',
    'JWT_EXPIRY',
    'DATABASE_URL',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'BLOCKCHAIN_NETWORK',
    'BLOCKCHAIN_RPC_URL',
    'BLOCKCHAIN_PRIVATE_KEY',
    'CONTRACT_ADDRESS',
    'WEBSOCKET_URL',
    'EMAIL_SERVICE',
    'EMAIL_FROM',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'STORAGE_TYPE',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_REGION',
    'AWS_BUCKET',
    'ANALYTICS_PROVIDER',
    'ANALYTICS_API_KEY',
    'BLOCKCHAIN_ENABLED',
    'ML_FRAUD_DETECTION',
    'REAL_TIME_NOTIFICATIONS',
    'ADVANCED_ANALYTICS',
    'MULTI_LANGUAGE',
    'DARK_MODE',
    'EXPORT_FUNCTIONALITY',
    'DEBUG',
    'APP_URL',
    'CORS_ORIGIN',
    'RATE_LIMIT_WINDOW',
    'RATE_LIMIT_MAX',
    'LOG_LEVEL',
    'LOG_FORMAT',
  ],
};

// Utility functions for environment variable handling
const getEnvVar = (key: string, defaultValue?: any): string => {
  const value = import.meta.env[`VITE_${key}`] || process.env[key];
  return value !== undefined ? value : defaultValue;
};

const getBooleanEnvVar = (key: string, defaultValue: boolean = false): boolean => {
  const value = getEnvVar(key);
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1' || value === 'yes';
};

const getNumberEnvVar = (key: string, defaultValue: number = 0): number => {
  const value = getEnvVar(key);
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Environment configuration loader
const loadEnvironmentConfig = (): EnvironmentConfig => {
  const config: EnvironmentConfig = {
    // API Configuration
    API_BASE_URL: getEnvVar('API_BASE_URL', DEFAULT_CONFIG.API_BASE_URL),
    API_TIMEOUT: getNumberEnvVar('API_TIMEOUT', DEFAULT_CONFIG.API_TIMEOUT),
    
    // Authentication
    JWT_SECRET: getEnvVar('JWT_SECRET'),
    JWT_EXPIRY: getEnvVar('JWT_EXPIRY', DEFAULT_CONFIG.JWT_EXPIRY),
    
    // Database
    DATABASE_URL: getEnvVar('DATABASE_URL'),
    
    // External Services
    CLOUDINARY_CLOUD_NAME: getEnvVar('CLOUDINARY_CLOUD_NAME'),
    CLOUDINARY_API_KEY: getEnvVar('CLOUDINARY_API_KEY'),
    CLOUDINARY_API_SECRET: getEnvVar('CLOUDINARY_API_SECRET'),
    
    // Blockchain
    BLOCKCHAIN_NETWORK: getEnvVar('BLOCKCHAIN_NETWORK', DEFAULT_CONFIG.BLOCKCHAIN_NETWORK),
    BLOCKCHAIN_RPC_URL: getEnvVar('BLOCKCHAIN_RPC_URL'),
    BLOCKCHAIN_PRIVATE_KEY: getEnvVar('BLOCKCHAIN_PRIVATE_KEY'),
    CONTRACT_ADDRESS: getEnvVar('CONTRACT_ADDRESS'),
    
    // WebSocket
    WEBSOCKET_URL: getEnvVar('WEBSOCKET_URL', DEFAULT_CONFIG.WEBSOCKET_URL),
    
    // Email Service
    EMAIL_SERVICE: getEnvVar('EMAIL_SERVICE', DEFAULT_CONFIG.EMAIL_SERVICE),
    EMAIL_FROM: getEnvVar('EMAIL_FROM'),
    SMTP_HOST: getEnvVar('SMTP_HOST'),
    SMTP_PORT: getNumberEnvVar('SMTP_PORT', DEFAULT_CONFIG.SMTP_PORT),
    SMTP_USER: getEnvVar('SMTP_USER'),
    SMTP_PASS: getEnvVar('SMTP_PASS'),
    
    // Storage
    STORAGE_TYPE: getEnvVar('STORAGE_TYPE', DEFAULT_CONFIG.STORAGE_TYPE) as 'local' | 'cloudinary' | 's3',
    AWS_ACCESS_KEY_ID: getEnvVar('AWS_ACCESS_KEY_ID'),
    AWS_SECRET_ACCESS_KEY: getEnvVar('AWS_SECRET_ACCESS_KEY'),
    AWS_REGION: getEnvVar('AWS_REGION', DEFAULT_CONFIG.AWS_REGION),
    AWS_BUCKET: getEnvVar('AWS_BUCKET'),
    
    // Analytics
    ANALYTICS_PROVIDER: getEnvVar('ANALYTICS_PROVIDER', DEFAULT_CONFIG.ANALYTICS_PROVIDER),
    ANALYTICS_API_KEY: getEnvVar('ANALYTICS_API_KEY'),
    
    // Feature Flags
    BLOCKCHAIN_ENABLED: getBooleanEnvVar('BLOCKCHAIN_ENABLED', DEFAULT_CONFIG.BLOCKCHAIN_ENABLED),
    ML_FRAUD_DETECTION: getBooleanEnvVar('ML_FRAUD_DETECTION', DEFAULT_CONFIG.ML_FRAUD_DETECTION),
    REAL_TIME_NOTIFICATIONS: getBooleanEnvVar('REAL_TIME_NOTIFICATIONS', DEFAULT_CONFIG.REAL_TIME_NOTIFICATIONS),
    ADVANCED_ANALYTICS: getBooleanEnvVar('ADVANCED_ANALYTICS', DEFAULT_CONFIG.ADVANCED_ANALYTICS),
    MULTI_LANGUAGE: getBooleanEnvVar('MULTI_LANGUAGE', DEFAULT_CONFIG.MULTI_LANGUAGE),
    DARK_MODE: getBooleanEnvVar('DARK_MODE', DEFAULT_CONFIG.DARK_MODE),
    EXPORT_FUNCTIONALITY: getBooleanEnvVar('EXPORT_FUNCTIONALITY', DEFAULT_CONFIG.EXPORT_FUNCTIONALITY),
    
    // Development
    NODE_ENV: getEnvVar('NODE_ENV', DEFAULT_CONFIG.NODE_ENV) as 'development' | 'production' | 'test',
    DEBUG: getBooleanEnvVar('DEBUG', DEFAULT_CONFIG.DEBUG),
    
    // Application
    APP_NAME: getEnvVar('APP_NAME', DEFAULT_CONFIG.APP_NAME),
    APP_VERSION: getEnvVar('APP_VERSION', DEFAULT_CONFIG.APP_VERSION),
    APP_URL: getEnvVar('APP_URL', DEFAULT_CONFIG.APP_URL),
    
    // Security
    CORS_ORIGIN: getEnvVar('CORS_ORIGIN', DEFAULT_CONFIG.CORS_ORIGIN),
    RATE_LIMIT_WINDOW: getNumberEnvVar('RATE_LIMIT_WINDOW', DEFAULT_CONFIG.RATE_LIMIT_WINDOW),
    RATE_LIMIT_MAX: getNumberEnvVar('RATE_LIMIT_MAX', DEFAULT_CONFIG.RATE_LIMIT_MAX),
    
    // Logging
    LOG_LEVEL: getEnvVar('LOG_LEVEL', DEFAULT_CONFIG.LOG_LEVEL) as 'error' | 'warn' | 'info' | 'debug',
    LOG_FORMAT: getEnvVar('LOG_FORMAT', DEFAULT_CONFIG.LOG_FORMAT) as 'json' | 'combined' | 'common',
  };
  
  return config;
};

// Environment validation
const validateEnvironment = (config: EnvironmentConfig): void => {
  const errors: string[] = [];
  
  // Check required variables
  ENV_SCHEMA.required.forEach(key => {
    if (!(key in config) || config[key as keyof EnvironmentConfig] === undefined) {
      errors.push(`Required environment variable ${key} is missing`);
    }
  });
  
  // Validate specific configurations
  if (config.NODE_ENV && !['development', 'production', 'test'].includes(config.NODE_ENV)) {
    errors.push('NODE_ENV must be one of: development, production, test');
  }
  
  if (config.LOG_LEVEL && !['error', 'warn', 'info', 'debug'].includes(config.LOG_LEVEL)) {
    errors.push('LOG_LEVEL must be one of: error, warn, info, debug');
  }
  
  if (config.STORAGE_TYPE && !['local', 'cloudinary', 's3'].includes(config.STORAGE_TYPE)) {
    errors.push('STORAGE_TYPE must be one of: local, cloudinary, s3');
  }
  
  // Validate dependent configurations
  if (config.BLOCKCHAIN_ENABLED && !config.BLOCKCHAIN_RPC_URL) {
    errors.push('BLOCKCHAIN_RPC_URL is required when BLOCKCHAIN_ENABLED is true');
  }
  
  if (config.STORAGE_TYPE === 'cloudinary' && (!config.CLOUDINARY_CLOUD_NAME || !config.CLOUDINARY_API_KEY)) {
    errors.push('Cloudinary credentials are required when STORAGE_TYPE is cloudinary');
  }
  
  if (config.STORAGE_TYPE === 's3' && (!config.AWS_ACCESS_KEY_ID || !config.AWS_SECRET_ACCESS_KEY || !config.AWS_BUCKET)) {
    errors.push('AWS credentials are required when STORAGE_TYPE is s3');
  }
  
  if (config.EMAIL_SERVICE === 'smtp' && (!config.SMTP_HOST || !config.SMTP_USER || !config.SMTP_PASS)) {
    errors.push('SMTP credentials are required when EMAIL_SERVICE is smtp');
  }
  
  if (errors.length > 0) {
    console.error('Environment validation failed:');
    errors.forEach(error => console.error(`  - ${error}`));
    throw new Error('Environment validation failed');
  }
};

// Configuration helpers
export const isDevelopment = (): boolean => env.NODE_ENV === 'development';
export const isProduction = (): boolean => env.NODE_ENV === 'production';
export const isTest = (): boolean => env.NODE_ENV === 'test';
export const isDebugMode = (): boolean => env.DEBUG;

// Feature flag helpers
export const isFeatureEnabled = (feature: keyof Pick<EnvironmentConfig, 
  'BLOCKCHAIN_ENABLED' | 'ML_FRAUD_DETECTION' | 'REAL_TIME_NOTIFICATIONS' | 
  'ADVANCED_ANALYTICS' | 'MULTI_LANGUAGE' | 'DARK_MODE' | 'EXPORT_FUNCTIONALITY'>): boolean => {
  return env[feature];
};

// API URL builder
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = env.API_BASE_URL.replace(/\/$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

// WebSocket URL builder
export const buildWebSocketUrl = (path: string = ''): string => {
  const baseUrl = env.WEBSOCKET_URL.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

// Load and validate environment configuration
const env = loadEnvironmentConfig();

// Validate environment in development and production
if (env.NODE_ENV !== 'test') {
  try {
    validateEnvironment(env);
    console.log('✅ Environment configuration loaded successfully');
  } catch (error) {
    console.error('❌ Environment configuration failed:', error);
    process.exit(1);
  }
}

// Export the configuration
export default env;
export { type EnvironmentConfig };

// Export individual configuration groups
export const apiConfig = {
  baseUrl: env.API_BASE_URL,
  timeout: env.API_TIMEOUT,
  websocketUrl: env.WEBSOCKET_URL,
};

export const authConfig = {
  jwtSecret: env.JWT_SECRET,
  jwtExpiry: env.JWT_EXPIRY,
};

export const storageConfig = {
  type: env.STORAGE_TYPE,
  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
  },
  aws: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    region: env.AWS_REGION,
    bucket: env.AWS_BUCKET,
  },
};

export const blockchainConfig = {
  enabled: env.BLOCKCHAIN_ENABLED,
  network: env.BLOCKCHAIN_NETWORK,
  rpcUrl: env.BLOCKCHAIN_RPC_URL,
  privateKey: env.BLOCKCHAIN_PRIVATE_KEY,
  contractAddress: env.CONTRACT_ADDRESS,
};

export const emailConfig = {
  service: env.EMAIL_SERVICE,
  from: env.EMAIL_FROM,
  smtp: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
};

export const featureFlags = {
  blockchain: env.BLOCKCHAIN_ENABLED,
  mlFraudDetection: env.ML_FRAUD_DETECTION,
  realTimeNotifications: env.REAL_TIME_NOTIFICATIONS,
  advancedAnalytics: env.ADVANCED_ANALYTICS,
  multiLanguage: env.MULTI_LANGUAGE,
  darkMode: env.DARK_MODE,
  exportFunctionality: env.EXPORT_FUNCTIONALITY,
};c