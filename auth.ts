import { apiRequest } from "./queryClient";
import { User, LoginCredentials, RegisterData } from "@shared/schema";

export interface AuthResponse {
  user: User;
  token: string;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Login failed");
  }
  
  return response.json();
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await apiRequest("POST", "/api/auth/register", data);
  return response.json();
}

export async function logout(): Promise<void> {
  await apiRequest("POST", "/api/auth/logout");
  localStorage.removeItem("token");
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiRequest("/api/auth/me", "GET");
  return response.json();
}

export function getAuthToken(): string | null {
  return localStorage.getItem("token");
}

export function setAuthToken(token: string): void {
  localStorage.setItem("token", token);
}

export function clearAuthToken(): void {
  localStorage.removeItem("token");
}

export function isAuthenticated(): boolean {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isValid = payload.exp * 1000 > Date.now();
    
    // If token is expired, clear it automatically
    if (!isValid) {
      clearAuthToken();
    }
    
    return isValid;
  } catch {
    clearAuthToken();
    return false;
  }
}
