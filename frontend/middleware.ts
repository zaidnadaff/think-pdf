// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Define paths that don't require authentication
  const publicPaths = ["/login", "/register", "/"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Get tokens from cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // If accessing a protected route without authentication
  if (!isPublicPath && !accessToken) {
    // If we have a refresh token, try to use it
    if (refreshToken) {
      // Redirect to the refresh endpoint
      return NextResponse.redirect(new URL("/api/auth/refresh", request.url));
    }

    // No tokens, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // For API routes that should check auth
  if (pathname.startsWith("/api/protected") && !accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

// Add the paths that should be affected by this middleware
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth/login|api/auth/register).*)",
  ],
};
