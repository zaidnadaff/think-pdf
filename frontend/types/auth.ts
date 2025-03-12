// types/auth.ts
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  message?: string;
}

export interface RefreshResponse {
  accessToken: string;
  expiresIn: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<ApiResponse>;
  register: (credentials: RegisterCredentials) => Promise<ApiResponse>;
  logout: () => Promise<void>;
}
