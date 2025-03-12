// app/api/auth/login/route.ts
import { loginUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { LoginCredentials, ApiResponse } from "@/types/auth";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const credentials: LoginCredentials = await request.json();

    const { accessToken, refreshToken, expiresIn } = await loginUser(
      credentials
    );

    // Set cookies securely
    (
      await // Set cookies securely
      cookies()
    ).set({
      name: "accessToken",
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });

    (await cookies()).set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: parseInt(expiresIn) * 60, // Convert minutes to seconds
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Authentication failed",
      },
      { status: 401 }
    );
  }
}
