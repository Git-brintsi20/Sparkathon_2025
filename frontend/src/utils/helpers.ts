// Helper utility functions for data manipulation, array operations, and common tasks

import { 
  VENDOR_STATUS, 
  DELIVERY_STATUS, 
  COMPLIANCE_STATUS, 

  CHART_COLORS,
 
} from '../config/constants';
import  FILE_UPLOAD from '../config/constants';
import   VALIDATION_RULES from '../config/constants';
import     RISK_LEVEL from '../config/constants';

/**
 * Data Manipulation Utilities
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    groups[groupKey] = groups[groupKey] || [];
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const filterBy = <T>(array: T[], filters: Partial<Record<keyof T, any>>): T[] => {
  return array.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === '') return true;
      const itemValue = item[key as keyof T];
      
      if (typeof value === 'string') {
        return String(itemValue).toLowerCase().includes(value.toLowerCase());
      }
      return itemValue === value;
    });
  });
};

export const uniqueBy = <T>(array: T[], key: keyof T): T[] => {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

/**
 * Array Operations
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const flatten = <T>(array: T[][]): T[] => {
  return array.reduce((flat, item) => flat.concat(item), []);
};

export const countBy = <T>(array: T[], key: keyof T): Record<string, number> => {
  return array.reduce((counts, item) => {
    const value = String(item[key]);
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
};

/**
 * String Utilities
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const generateId = (prefix: string = ''): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}${prefix ? '-' : ''}${timestamp}-${random}`;
};

/**
 * Number Utilities
 */
export const formatNumber = (num: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Status Utilities
 */
export const getStatusColor = (status: string, type: 'vendor' | 'delivery' | 'compliance' | 'risk'): string => {
  const colorMap = {
    vendor: {
      [VENDOR_STATUS.ACTIVE]: 'text-green-600',
      [VENDOR_STATUS.INACTIVE]: 'text-gray-500',
      [VENDOR_STATUS.PENDING]: 'text-yellow-600',
      [VENDOR_STATUS.SUSPENDED]: 'text-red-600',
      [VENDOR_STATUS.UNDER_REVIEW]: 'text-blue-600',
    },
    delivery: {
      [DELIVERY_STATUS.PENDING]: 'text-yellow-600',
      [DELIVERY_STATUS.IN_TRANSIT]: 'text-blue-600',
      [DELIVERY_STATUS.DELIVERED]: 'text-green-600',
      [DELIVERY_STATUS.DELAYED]: 'text-orange-600',
      [DELIVERY_STATUS.CANCELLED]: 'text-red-600',
      [DELIVERY_STATUS.RETURNED]: 'text-purple-600',
      [DELIVERY_STATUS.FAILED]: 'text-red-700',
    },
    compliance: {
      [COMPLIANCE_STATUS.COMPLIANT]: 'text-green-600',
      [COMPLIANCE_STATUS.NON_COMPLIANT]: 'text-red-600',
      [COMPLIANCE_STATUS.PENDING_REVIEW]: 'text-yellow-600',
      [COMPLIANCE_STATUS.REQUIRES_ACTION]: 'text-orange-600',
      [COMPLIANCE_STATUS.EXEMPT]: 'text-gray-500',
    },
    risk: {
      [RISK_LEVEL.LOW]: 'text-green-600',
      [RISK_LEVEL.MEDIUM]: 'text-yellow-600',
      [RISK_LEVEL.HIGH]: 'text-orange-600',
      [RISK_LEVEL.CRITICAL]: 'text-red-600',
    },
  };

  return colorMap[type]?.[status] || 'text-gray-500';
};

export const getStatusBadgeColor = (status: string, type: 'vendor' | 'delivery' | 'compliance' | 'risk'): string => {
  const colorMap = {
    vendor: {
      [VENDOR_STATUS.ACTIVE]: 'bg-green-100 text-green-800',
      [VENDOR_STATUS.INACTIVE]: 'bg-gray-100 text-gray-800',
      [VENDOR_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
      [VENDOR_STATUS.SUSPENDED]: 'bg-red-100 text-red-800',
      [VENDOR_STATUS.UNDER_REVIEW]: 'bg-blue-100 text-blue-800',
    },
    delivery: {
      [DELIVERY_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
      [DELIVERY_STATUS.IN_TRANSIT]: 'bg-blue-100 text-blue-800',
      [DELIVERY_STATUS.DELIVERED]: 'bg-green-100 text-green-800',
      [DELIVERY_STATUS.DELAYED]: 'bg-orange-100 text-orange-800',
      [DELIVERY_STATUS.CANCELLED]: 'bg-red-100 text-red-800',
      [DELIVERY_STATUS.RETURNED]: 'bg-purple-100 text-purple-800',
      [DELIVERY_STATUS.FAILED]: 'bg-red-100 text-red-900',
    },
    compliance: {
      [COMPLIANCE_STATUS.COMPLIANT]: 'bg-green-100 text-green-800',
      [COMPLIANCE_STATUS.NON_COMPLIANT]: 'bg-red-100 text-red-800',
      [COMPLIANCE_STATUS.PENDING_REVIEW]: 'bg-yellow-100 text-yellow-800',
      [COMPLIANCE_STATUS.REQUIRES_ACTION]: 'bg-orange-100 text-orange-800',
      [COMPLIANCE_STATUS.EXEMPT]: 'bg-gray-100 text-gray-800',
    },
    risk: {
      [RISK_LEVEL.LOW]: 'bg-green-100 text-green-800',
      [RISK_LEVEL.MEDIUM]: 'bg-yellow-100 text-yellow-800',
      [RISK_LEVEL.HIGH]: 'bg-orange-100 text-orange-800',
      [RISK_LEVEL.CRITICAL]: 'bg-red-100 text-red-800',
    },
  };

  return colorMap[type]?.[status] || 'bg-gray-100 text-gray-800';
};

/**
 * File Utilities
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const isImageFile = (file: File): boolean => {
  return FILE_UPLOAD.ALLOWED_IMAGES.includes(file.type);
};

export const isDocumentFile = (file: File): boolean => {
  return FILE_UPLOAD.ALLOWED_DOCUMENTS.includes(file.type);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Validation Utilities
 */
export const validateEmail = (email: string): boolean => {
  return VALIDATION_RULES.EMAIL.REGEX.test(email) && email.length <= VALIDATION_RULES.EMAIL.MAX_LENGTH;
};

export const validatePassword = (password: string): boolean => {
  return password.length >= VALIDATION_RULES.PASSWORD.MIN_LENGTH &&
         password.length <= VALIDATION_RULES.PASSWORD.MAX_LENGTH &&
         VALIDATION_RULES.PASSWORD.REGEX.test(password);
};

export const validatePhone = (phone: string): boolean => {
  return VALIDATION_RULES.PHONE.REGEX.test(phone);
};

/**
 * Chart Utilities
 */
export const getChartColor = (index: number): string => {
  return CHART_COLORS.PRIMARY[index % CHART_COLORS.PRIMARY.length];
};

export const generateChartData = (data: any[], xKey: string, yKey: string) => {
  return data.map(item => ({
    x: item[xKey],
    y: item[yKey],
  }));
};

/**
 * Debounce Utility
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Local Storage Utilities
 */
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Handle storage quota exceeded
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Handle errors
    }
  },
};

/**
 * Deep Clone Utility
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (typeof obj === 'object') {
    const cloned: any = {};
    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone((obj as any)[key]);
    });
    return cloned;
  }
  return obj;
};