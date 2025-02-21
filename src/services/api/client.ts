import { api } from '@/lib/api';

export interface ApiClientConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export class ApiClient {
  private readonly config: ApiClientConfig;

  constructor(config: ApiClientConfig = {}) {
    this.config = {
      baseURL: config.baseURL || process.env.NEXT_PUBLIC_API_URL,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      timeout: config.timeout || 10000,
    };
  }

  async get<T>(endpoint: string, params?: Record<string, any>) {
    return api.get<T>(endpoint, {
      params,
      ...this.config,
    });
  }

  async post<T>(endpoint: string, data: any) {
    return api.post<T>(endpoint, data, this.config);
  }

  async put<T>(endpoint: string, data: any) {
    return api.put<T>(endpoint, data, this.config);
  }

  async delete<T>(endpoint: string) {
    return api.delete<T>(endpoint, this.config);
  }

  setHeader(key: string, value: string) {
    if (!this.config.headers) {
      this.config.headers = {};
    }
    this.config.headers[key] = value;
  }

  setAuthToken(token: string) {
    this.setHeader('Authorization', `Bearer ${token}`);
  }

  removeAuthToken() {
    if (this.config.headers) {
      delete this.config.headers['Authorization'];
    }
  }
}

export const apiClient = new ApiClient(); 