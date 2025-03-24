import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  console.log(pathname);

  // Define paths that don't require authentication
  const publicPaths = ["/login", "/register", "/", "/chat"];
  const isPublicPath = publicPaths.some((path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path)
  );

  console.log(isPublicPath);

  // Get tokens from cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // If accessing a protected route without authentication
  if (!isPublicPath) {
    try {
      const verifyToken = async (accessToken: string) => {
        const response = await fetch(
          `${request.nextUrl.origin}/api/auth/verify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: accessToken }),
          }
        );
        return response;
      };
      if (accessToken) {
        const response = await verifyToken(accessToken);
        if (response.ok) {
          return NextResponse.next();
        }
      }
      const refreshResponse = await fetch(
        new URL("/api/auth/refresh", request.url).toString(),
        {
          method: "GET",
          headers: {
            Cookie: request.headers.get("cookie") || "",
          },
        }
      );

      // If refresh failed, redirect to login
      if (!refreshResponse.ok) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch (err) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

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
