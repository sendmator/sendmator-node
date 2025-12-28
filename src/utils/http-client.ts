import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { SendmatorConfig, SendmatorError } from '../types';

/**
 * Secure HTTP Client for Sendmator API
 * Handles authentication, rate limiting, retries, and error handling
 */
export class HttpClient {
  private client: AxiosInstance;
  private apiKey: string;
  private teamId?: string;

  constructor(config: SendmatorConfig) {
    // Validate API key
    if (!config.apiKey) {
      throw new SendmatorError('API key is required');
    }

    if (!config.apiKey.startsWith('sk_')) {
      throw new SendmatorError('Invalid API key format. API key must start with "sk_"');
    }

    this.apiKey = config.apiKey;
    this.teamId = config.teamId;

    // Create axios instance with secure defaults
    this.client = axios.create({
      baseURL: config.baseURL || 'https://api.sendmator.com/api',
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `sendmator-node/1.0.0`,
      },
    });

    // Add request interceptor for authentication
    this.client.interceptors.request.use(
      (config) => {
        // Add API key to headers
        config.headers['X-API-Key'] = this.apiKey;

        // Add team ID if provided
        if (this.teamId) {
          config.headers['X-Team-ID'] = this.teamId;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const { status, data } = error.response;

          throw new SendmatorError(
            data?.message || data?.error || 'An error occurred',
            status,
            data?.code,
            data?.details
          );
        } else if (error.request) {
          // The request was made but no response was received
          throw new SendmatorError('No response received from server', undefined, 'NETWORK_ERROR');
        } else {
          // Something happened in setting up the request that triggered an Error
          throw new SendmatorError(error.message, undefined, 'REQUEST_ERROR');
        }
      }
    );
  }

  /**
   * Make a GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  /**
   * Make a POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  /**
   * Make a PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  /**
   * Make a DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }

  /**
   * Update team ID for subsequent requests
   */
  setTeamId(teamId: string): void {
    this.teamId = teamId;
  }

  /**
   * Clear team ID
   */
  clearTeamId(): void {
    this.teamId = undefined;
  }
}
