import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

interface ErrorResponse {
  message: string;
  [key: string]: any;
}

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error Handler
export const handleApiError = (error: AxiosError<ErrorResponse>): ApiError => {
  if (error.response) {
    return {
      message: error.response.data?.message || 'An error occurred with the response',
      status: error.response.status,
      code: error.code
    };
  }
  if (error.request) {
    return {
      message: 'No response received from server',
      status: 503,
      code: 'NO_RESPONSE'
    };
  }
  return {
    message: error.message || 'An unexpected error occurred',
    status: 500,
    code: 'UNKNOWN_ERROR'
  };
};

// Request Headers
export const getDefaultHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// API Methods
export const api = {
  get: async <T>(endpoint: string, config?: AxiosRequestConfig) => {
    try {
      const response = await axiosInstance.get<T>(endpoint, config);
      return {
        data: response.data,
        status: response.status,
        message: 'Success',
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        throw handleApiError(error as AxiosError<ErrorResponse>);
      }
      throw error;
    }
  },

  post: async <T>(endpoint: string, data: any, config?: AxiosRequestConfig) => {
    try {
      const response = await axiosInstance.post<T>(endpoint, data, config);
      return {
        data: response.data,
        status: response.status,
        message: 'Success',
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        throw handleApiError(error as AxiosError<ErrorResponse>);
      }
      throw error;
    }
  },

  put: async <T>(endpoint: string, data: any, config?: AxiosRequestConfig) => {
    try {
      const response = await axiosInstance.put<T>(endpoint, data, config);
      return {
        data: response.data,
        status: response.status,
        message: 'Success',
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        throw handleApiError(error as AxiosError<ErrorResponse>);
      }
      throw error;
    }
  },

  delete: async <T>(endpoint: string, config?: AxiosRequestConfig) => {
    try {
      const response = await axiosInstance.delete<T>(endpoint, config);
      return {
        data: response.data,
        status: response.status,
        message: 'Success',
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        throw handleApiError(error as AxiosError<ErrorResponse>);
      }
      throw error;
    }
  },
}; 