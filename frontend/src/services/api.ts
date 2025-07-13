// frontend/src/services/api.ts
import type  { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import type { ApiResponse, ApiError, PaginationParams, PaginatedResponse } from '../types/common';

// 1. Declare a module augmentation for 'axios'
declare module 'axios' {
  // 2. Extend the AxiosRequestConfig interface
  export interface AxiosRequestConfig {
    metadata?: {
      startTime?: Date;
    };
    _retry?: boolean; // Add _retry property here as well
  }

  // 3. Extend InternalAxiosRequestConfig for interceptors if needed
  // This is often automatically handled if you extend AxiosRequestConfig,
  // but explicitly defining it can sometimes help with stricter TS setups.
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime?: Date;
    };
    _retry?: boolean;
  }
}

class ApiService {
  private client: AxiosInstance;
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - Add auth token and logging
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => { // Explicitly type config here
        // Add auth token if available
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }

        // Add timestamp for debugging
        // Now 'metadata' is recognized because we extended AxiosRequestConfig
        config.metadata = { startTime: new Date() };

        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle common responses and errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Access metadata from response.config, which is of type AxiosRequestConfig
        const duration = new Date().getTime() - (response.config.metadata?.startTime?.getTime() || 0);
        console.log(`✅ API Response: ${response.status} in ${duration}ms`);

        return response;
      },
      async (error) => {
        // originalRequest is of type AxiosRequestConfig, which now includes _retry
        const originalRequest = error.config as AxiosRequestConfig; // Cast to ensure correct type

        // Handle 401 unauthorized - token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshToken();
            return this.client(originalRequest);
          } catch (refreshError) {
            this.handleAuthError();
            return Promise.reject(refreshError);
          }
        }

        // Handle network errors
        if (!error.response) {
          console.error('❌ Network Error:', error.message);
          return Promise.reject(this.createApiError('NETWORK_ERROR', 'Network connection failed'));
        }

        // Handle API errors
        console.error(`❌ API Error: ${error.response.status} - ${error.response.data?.message || error.message}`);
        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  // Set authentication token
  public setAuthToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  // Remove authentication token
  public removeAuthToken(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  // Load token from storage
  public loadTokenFromStorage(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.token = token;
    }
  }

  // Refresh authentication token
  private async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${this.baseURL}/auth/refresh`, {
      refreshToken,
    });

    const { token, refreshToken: newRefreshToken } = response.data.data;
    this.setAuthToken(token);
    localStorage.setItem('refresh_token', newRefreshToken);
  }

  // Handle authentication errors
  private handleAuthError(): void {
    this.removeAuthToken();
    window.location.href = '/login';
  }

  // Create standardized API error
  private createApiError(code: string, message: string, details?: any): ApiError {
    return {
      success: false,
      error: {
        code,
        message,
        details,
      },
      timestamp: new Date().toISOString(),
    };
  }

  // Normalize error responses
  private normalizeError(error: any): ApiError {
    if (error.response?.data?.error) {
      return error.response.data;
    }

    return this.createApiError(
      error.response?.status?.toString() || 'UNKNOWN_ERROR',
      error.response?.data?.message || error.message || 'An unexpected error occurred',
      error.response?.data
    );
  }

  // Generic GET request
  public async get<T>(
    endpoint: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.get(endpoint, { params, ...config });
    return response.data;
  }

  // Generic POST request
  public async post<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.post(endpoint, data, config);
    return response.data;
  }

  // Generic PUT request
  public async put<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.put(endpoint, data, config);
    return response.data;
  }

  // Generic PATCH request
  public async patch<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.patch(endpoint, data, config);
    return response.data;
  }

  // Generic DELETE request
  public async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.delete(endpoint, config);
    return response.data;
  }

  // Paginated GET request
  public async getPaginated<T>(
    endpoint: string,
    params: PaginationParams & Record<string, any> = { page: 1, limit: 10 }
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    return this.get<PaginatedResponse<T>>(endpoint, params);
  }

  

  // File upload request
  public async uploadFile<T>(
    endpoint: string,
    files: File[],
    additionalData?: Record<string, any>,
    onUploadProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(progress);
        }
      },
    };

    const response = await this.client.post(endpoint, formData, config);
    return response.data;
  }

  // Download file
  public async downloadFile(
    endpoint: string,
    filename: string,
    params?: Record<string, any>
  ): Promise<void> {
    const response = await this.client.get(endpoint, {
      params,
      responseType: 'blob',
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  // Health check
  public async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.get('/health');
  }

  // Retry mechanism for failed requests
  public async retryRequest<T>(
    requestFn: () => Promise<T>,
    maxRetries = 3,
    delay = 1000
  ): Promise<T> {
    let lastError: any;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;

        if (i === maxRetries - 1) {
          break;
        }

        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }

    throw lastError;
  }
}

// Create singleton instance
const apiService = new ApiService();

// Initialize token from storage
apiService.loadTokenFromStorage();

export default apiService;
