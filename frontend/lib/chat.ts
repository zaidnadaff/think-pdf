import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  RefreshResponse,
  ApiResponse,
} from "@/types/auth";

const API_URL = process.env.CHAT_API_URL || "http://localhost:3001";

export async function loginUser(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData: ApiResponse = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    return (await response.json()) as AuthResponse;
  } catch (error) {
    console.error(
      "Login error:",
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
}

export async function registerUser(
  credentials: RegisterCredentials
): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData: ApiResponse = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    return (await response.json()) as ApiResponse;
  } catch (error) {
    console.error(
      "Registration error:",
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
}

export async function verifyAccessToken(token: string): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/token/verify-token`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        response.status === 401
          ? "Token expired or invalid"
          : "Failed to verify token"
      );
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error(
      "Token verification error:",
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = (await response.json()) as RefreshResponse;
    return data.accessToken;
  } catch (error) {
    console.error(
      "Token refresh error:",
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
}

export async function logoutUser(refreshToken: string): Promise<void> {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
  } catch (error) {
    console.error(
      "Logout error:",
      error instanceof Error ? error.message : String(error)
    );
  }
}
