// Data formatting utilities for dates, numbers, currency, percentages, and file sizes

/**
 * Date formatting utilities
 */
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTimeAgo = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);
  const diff = now.getTime() - past.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

export const formatRelativeDate = (date: string | Date): string => {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  if (d.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (d.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return formatDate(d);
  }
};

/**
 * Number formatting utilities
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatCompactNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
  }).format(num);
};

export const formatDecimal = (num: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
};

/**
 * Currency formatting utilities
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const formatCompactCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    notation: 'compact',
    compactDisplay: 'short'
  }).format(amount);
};

/**
 * Percentage formatting utilities
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

export const formatPercentageFromRatio = (numerator: number, denominator: number): string => {
  if (denominator === 0) return '0%';
  return formatPercentage(numerator / denominator);
};

export const formatChangePercentage = (value: number): string => {
  const formatted = formatPercentage(Math.abs(value));
  return value >= 0 ? `+${formatted}` : `-${formatted}`;
};

/**
 * File size formatting utilities
 */
export const formatFileSize = (bytes: number): string => {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 B';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  
  return `${size.toFixed(1)} ${sizes[i]}`;
};

/**
 * String formatting utilities
 */
export const formatCamelCase = (str: string): string => {
  return str.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

export const formatKebabCase = (str: string): string => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

export const formatSnakeCase = (str: string): string => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
};

export const formatTitleCase = (str: string): string => {
  return str.replace(/\w\S*/g, txt => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

export const formatTruncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
};

/**
 * Status and badge formatting utilities
 */
export const formatStatus = (status: string): string => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const formatBadgeColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    'active': 'green',
    'pending': 'yellow',
    'inactive': 'gray',
    'error': 'red',
    'success': 'green',
    'warning': 'yellow',
    'info': 'blue',
    'delivered': 'green',
    'in_transit': 'blue',
    'delayed': 'yellow',
    'cancelled': 'red'
  };
  return colorMap[status.toLowerCase()] || 'gray';
};

/**
 * Address formatting utilities
 */
export const formatAddress = (address: {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}): string => {
  const parts = [
    address.street,
    address.city,
    address.state && address.zip ? `${address.state} ${address.zip}` : address.state || address.zip,
    address.country
  ].filter(Boolean);
  
  return parts.join(', ');
};

/**
 * Phone number formatting utilities
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

/**
 * Array formatting utilities
 */
export const formatList = (items: string[], conjunction: string = 'and'): string => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  
  const last = items.pop();
  return `${items.join(', ')}, ${conjunction} ${last}`;
};

export const formatTags = (tags: string[]): string => {
  return tags.map(tag => `#${tag}`).join(' ');
};