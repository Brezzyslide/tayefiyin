/**
 * Enhanced API Client with Authentication and Global Toast Integration
 */

import { handleApiError } from "./global-toast";

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Record<string, string>;
  skipToast?: boolean;
}

export const apiClient = async (url: string, options: ApiRequestOptions = {}) => {
  const {
    method = "GET",
    body,
    headers = {},
    skipToast = false
  } = options;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include", // Always include cookies for authentication
  };

  if (body && method !== "GET") {
    config.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: `HTTP ${response.status}: ${response.statusText}` 
      }));
      
      const error = new Error(errorData.error || `HTTP ${response.status}`);
      (error as any).response = response;
      (error as any).status = response.status;
      throw error;
    }

    return response.json();
  } catch (error: any) {
    if (!skipToast) {
      if (error.status === 401) {
        handleApiError(error, "authenticationRequired");
      } else if (error.status === 403) {
        handleApiError(error, "accessDenied");
      } else if (error.status >= 500) {
        handleApiError(error, "serverError");
      } else if (error.status === 400) {
        handleApiError(error, "validationFailed");
      } else {
        handleApiError(error, "networkError");
      }
    }
    throw error;
  }
};

// Convenience methods
export const get = (url: string, options?: Omit<ApiRequestOptions, "method">) =>
  apiClient(url, { ...options, method: "GET" });

export const post = (url: string, body?: any, options?: Omit<ApiRequestOptions, "method" | "body">) =>
  apiClient(url, { ...options, method: "POST", body });

export const put = (url: string, body?: any, options?: Omit<ApiRequestOptions, "method" | "body">) =>
  apiClient(url, { ...options, method: "PUT", body });

export const del = (url: string, options?: Omit<ApiRequestOptions, "method">) =>
  apiClient(url, { ...options, method: "DELETE" });

export const patch = (url: string, body?: any, options?: Omit<ApiRequestOptions, "method" | "body">) =>
  apiClient(url, { ...options, method: "PATCH", body });