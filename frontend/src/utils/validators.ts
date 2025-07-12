// Form validation utilities with comprehensive validation rules and error messages

/**
 * Basic validation functions
 */
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

export const isEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const isUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isNumeric = (value: string): boolean => {
  return !isNaN(Number(value)) && isFinite(Number(value));
};

export const isInteger = (value: string): boolean => {
  return Number.isInteger(Number(value));
};

export const isDecimal = (value: string): boolean => {
  const decimalRegex = /^\d*\.?\d+$/;
  return decimalRegex.test(value);
};

/**
 * String validation functions
 */
export const minLength = (value: string, min: number): boolean => {
  return value.length >= min;
};

export const maxLength = (value: string, max: number): boolean => {
  return value.length <= max;
};

export const isAlpha = (value: string): boolean => {
  const alphaRegex = /^[a-zA-Z]+$/;
  return alphaRegex.test(value);
};

export const isAlphanumeric = (value: string): boolean => {
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  return alphanumericRegex.test(value);
};

export const isPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const isStrongPassword = (password: string): boolean => {
  // At least 12 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
  return strongPasswordRegex.test(password);
};

/**
 * Date validation functions
 */
export const isValidDate = (date: string): boolean => {
  const d = new Date(date);
  return !isNaN(d.getTime());
};

export const isDateInPast = (date: string): boolean => {
  const d = new Date(date);
  const now = new Date();
  return d < now;
};

export const isDateInFuture = (date: string): boolean => {
  const d = new Date(date);
  const now = new Date();
  return d > now;
};

export const isDateInRange = (date: string, start: string, end: string): boolean => {
  const d = new Date(date);
  const startDate = new Date(start);
  const endDate = new Date(end);
  return d >= startDate && d <= endDate;
};

export const isAge = (birthDate: string, minAge: number): boolean => {
  const birth = new Date(birthDate);
  const now = new Date();
  const age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    return age - 1 >= minAge;
  }
  return age >= minAge;
};

/**
 * Number validation functions
 */
export const isPositive = (value: number): boolean => {
  return value > 0;
};

export const isNegative = (value: number): boolean => {
  return value < 0;
};

export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

export const isPercentage = (value: number): boolean => {
  return value >= 0 && value <= 100;
};

export const isDecimalPlaces = (value: number, places: number): boolean => {
  const decimalPlaces = (value.toString().split('.')[1] || '').length;
  return decimalPlaces <= places;
};

/**
 * File validation functions
 */
export const isValidFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const isImageFile = (file: File): boolean => {
  const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return imageTypes.includes(file.type);
};

export const isDocumentFile = (file: File): boolean => {
  const documentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  return documentTypes.includes(file.type);
};

/**
 * Validation error messages
 */
export const getValidationMessage = (field: string, rule: string, value?: any): string => {
  const messages: Record<string, string> = {
    required: `${field} is required`,
    email: `${field} must be a valid email address`,
    phone: `${field} must be a valid phone number`,
    url: `${field} must be a valid URL`,
    numeric: `${field} must be a number`,
    integer: `${field} must be an integer`,
    decimal: `${field} must be a decimal number`,
    alpha: `${field} must contain only letters`,
    alphanumeric: `${field} must contain only letters and numbers`,
    password: `${field} must be at least 8 characters with uppercase, lowercase, number, and special character`,
    strongPassword: `${field} must be at least 12 characters with uppercase, lowercase, number, and special character`,
    date: `${field} must be a valid date`,
    dateInPast: `${field} must be a date in the past`,
    dateInFuture: `${field} must be a date in the future`,
    positive: `${field} must be a positive number`,
    negative: `${field} must be a negative number`,
    percentage: `${field} must be between 0 and 100`,
    minLength: `${field} must be at least ${value} characters`,
    maxLength: `${field} must be no more than ${value} characters`,
    minValue: `${field} must be at least ${value}`,
    maxValue: `${field} must be no more than ${value}`,
    fileSize: `${field} must be smaller than ${value}MB`,
    fileType: `${field} must be a valid file type`,
    image: `${field} must be a valid image file`,
    document: `${field} must be a valid document file`
  };
  
  return messages[rule] || `${field} is invalid`;
};

/**
 * Composite validation functions
 */
export const validateEmail = (email: string): string | null => {
  if (!isRequired(email)) return getValidationMessage('Email', 'required');
  if (!isEmail(email)) return getValidationMessage('Email', 'email');
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!isRequired(password)) return getValidationMessage('Password', 'required');
  if (!isPassword(password)) return getValidationMessage('Password', 'password');
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!isRequired(phone)) return getValidationMessage('Phone', 'required');
  if (!isPhone(phone)) return getValidationMessage('Phone', 'phone');
  return null;
};

export const validateUrl = (url: string): string | null => {
  if (!isRequired(url)) return getValidationMessage('URL', 'required');
  if (!isUrl(url)) return getValidationMessage('URL', 'url');
  return null;
};

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (!isRequired(value)) return getValidationMessage(fieldName, 'required');
  return null;
};

export const validateLength = (value: string, min: number, max: number, fieldName: string): string | null => {
  if (!isRequired(value)) return getValidationMessage(fieldName, 'required');
  if (!minLength(value, min)) return getValidationMessage(fieldName, 'minLength', min);
  if (!maxLength(value, max)) return getValidationMessage(fieldName, 'maxLength', max);
  return null;
};

export const validateNumber = (value: string, fieldName: string): string | null => {
  if (!isRequired(value)) return getValidationMessage(fieldName, 'required');
  if (!isNumeric(value)) return getValidationMessage(fieldName, 'numeric');
  return null;
};

export const validateRange = (value: number, min: number, max: number, fieldName: string): string | null => {
  if (!isRequired(value)) return getValidationMessage(fieldName, 'required');
  if (!isInRange(value, min, max)) return `${fieldName} must be between ${min} and ${max}`;
  return null;
};

export const validateFile = (file: File, maxSizeInMB: number, allowedTypes: string[]): string | null => {
  if (!isValidFileSize(file, maxSizeInMB)) return getValidationMessage('File', 'fileSize', maxSizeInMB);
  if (!isValidFileType(file, allowedTypes)) return getValidationMessage('File', 'fileType');
  return null;
};

/**
 * Form validation helper
 */
export const validateForm = (values: Record<string, any>, rules: Record<string, any>): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  Object.keys(rules).forEach(field => {
    const value = values[field];
    const fieldRules = rules[field];
    
    if (fieldRules.required && !isRequired(value)) {
      errors[field] = getValidationMessage(field, 'required');
      return;
    }
    
    if (value && fieldRules.email && !isEmail(value)) {
      errors[field] = getValidationMessage(field, 'email');
      return;
    }
    
    if (value && fieldRules.phone && !isPhone(value)) {
      errors[field] = getValidationMessage(field, 'phone');
      return;
    }
    
    if (value && fieldRules.minLength && !minLength(value, fieldRules.minLength)) {
      errors[field] = getValidationMessage(field, 'minLength', fieldRules.minLength);
      return;
    }
    
    if (value && fieldRules.maxLength && !maxLength(value, fieldRules.maxLength)) {
      errors[field] = getValidationMessage(field, 'maxLength', fieldRules.maxLength);
      return;
    }
    
    if (value && fieldRules.custom && typeof fieldRules.custom === 'function') {
      const customError = fieldRules.custom(value);
      if (customError) {
        errors[field] = customError;
        return;
      }
    }
  });
  
  return errors;
};