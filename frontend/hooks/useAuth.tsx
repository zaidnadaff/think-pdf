// hooks/useAuth.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  JSX,
} from "react";
import { useRouter } from "next/navigation";
import {
  LoginCredentials,
  RegisterCredentials,
  ApiResponse,
  AuthContextType,
} from "@/types/auth";

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated on mount
    // const checkAuth = async (): Promise<void> => {
    //   try {
    //     const response = await fetch("/api/auth/check", {
    //       method: "GET",
    //       credentials: "include",
    //     });
    //     setIsAuthenticated(response.ok);
    //   } catch (error) {
    setIsAuthenticated(false);
    // } finally {
    setIsLoading(false);
    // }
    // };
    // checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<ApiResponse> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login failed");
      }

      setIsAuthenticated(true);
      router.push("/chat");
      return { success: true, message: "Login successful" };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    credentials: RegisterCredentials
  ): Promise<ApiResponse> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Registration failed");
      }

      router.push("/login"); // Redirect to login
      return { success: true, message: "Registration successful" };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Registration failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setIsAuthenticated(false);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
