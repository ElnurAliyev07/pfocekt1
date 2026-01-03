import { getAccessToken, getRefreshToken } from "@/lib/actions/token";

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ? process.env.NEXT_PUBLIC_API_BASE_URL : 'http://localhost:8000';

// HTTP method types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Supported languages
export const SUPPORTED_LOCALES = ['az', 'en', 'ru'] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];
export const DEFAULT_LOCALE: SupportedLocale = 'az';

// API Error class
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

// Request options interface
export interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | string[] | number[]>;
  locale?: SupportedLocale;
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
  credentials?: RequestCredentials;
  skipAuth?: boolean;
  skipRetry?: boolean; // Add this to prevent infinite retry loops
}

// Default request headers
const defaultHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

// Track if we're currently refreshing to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Refresh the access token using the refresh token
 */
async function refreshAccessToken(): Promise<boolean> {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      return false;
    }

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      console.error('Token refresh failed:', response.status);
      // If refresh fails, redirect to login or handle as needed
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
}

/**
 * Generic API client for making HTTP requests with automatic token refresh
 * Returns an object: { data, status }
 */
export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<{ data: T; status: number }> {
  const {
    method = 'GET',
    headers = {},
    body,
    params,
    locale = DEFAULT_LOCALE,
    cache,
    revalidate,
    tags,
    credentials = 'same-origin',
    skipAuth = false,
    skipRetry = false,
  } = options;

  // Build URL with query parameters
  const url = new URL(
    endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
  );
  
  // Add query parameters if provided
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== 'undefined' && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => url.searchParams.append(key, v.toString()));
        } else {
          url.searchParams.append(key, value.toString());
        }
      }
    });
  }

  // Prepare headers with authentication
  const requestHeaders: Record<string, string> = {
    ...defaultHeaders,
    'Accept-Language': locale,
    ...headers,
  };

  if (!skipAuth) {
    const token = await getAccessToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  // Prepare request options
  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
    credentials,
    // Add next.js specific caching options
    next: {
      ...(revalidate !== undefined ? { revalidate } : {}),
      ...(tags ? { tags } : {}),
    },
    ...(cache ? { cache } : {}),
  };

  // Add body for non-GET requests
  if (body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url.toString(), fetchOptions);
    
    // If we get a 401 and haven't already tried to refresh, attempt token refresh
    if (response.status === 401 && !skipAuth && !skipRetry) {
      // If we're already refreshing, wait for it to complete
      if (isRefreshing && refreshPromise) {
        const refreshSuccess = await refreshPromise;
        if (refreshSuccess) {
          // Retry the original request with skipRetry to prevent infinite loops
          return apiClient<T>(endpoint, { ...options, skipRetry: true });
        }
      } else if (!isRefreshing) {
        // Start the refresh process
        isRefreshing = true;
        refreshPromise = refreshAccessToken();
        
        const refreshSuccess = await refreshPromise;
        isRefreshing = false;
        refreshPromise = null;
        
        if (refreshSuccess) {
          // Retry the original request with skipRetry to prevent infinite loops
          return apiClient<T>(endpoint, { ...options, skipRetry: true });
        }
      }
    }
    
    if (!response.ok) {
      let errorData = null;
      try {
        errorData = await response.json();
      } catch (e) {
        
      }
      console.error(errorData);
      throw new ApiError(response.status, 'Request failed', errorData);
    }
    
    // Return both data and status
    let responseData: T = undefined as any;
    // Only try to parse JSON if there is content
    if (response.status !== 204) {
      responseData = await response.json();
    }
    return { data: responseData, status: response.status };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Convenience methods for different HTTP verbs
export const get = <T>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}): Promise<{ data: T; status: number }> => 
  apiClient<T>(endpoint, { 
    ...options, 
    method: 'GET',
  });

export const post = <T, D extends object>(endpoint: string, data: D, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<{ data: T; status: number }> => 
  apiClient<T>(endpoint, { 
    ...options, 
    method: 'POST', 
    body: data,
  });

export const put = <T, D extends object>(endpoint: string, data: D, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<{ data: T; status: number }> => 
  apiClient<T>(endpoint, { 
    ...options, 
    method: 'PUT', 
    body: data,
  });

export const patch = <T, D extends object>(endpoint: string, data: D, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<{ data: T; status: number }> => 
  apiClient<T>(endpoint, { 
    ...options, 
    method: 'PATCH', 
    body: data,
  });

export const del = <T>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}): Promise<{ data: T; status: number }> => 
  apiClient<T>(endpoint, { 
    ...options, 
    method: 'DELETE',
  });

// Export an object with all methods for more traditional usage
const api = {
  request: apiClient,
  get,
  post,
  put,
  patch,
  delete: del
};

export default api;