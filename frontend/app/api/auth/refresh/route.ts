// app/api/auth/refresh/route.ts
import { refreshAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/auth";

export async function GET(): Promise<NextResponse<ApiResponse>> {
  try {
    const refreshToken = (await cookies()).get("refreshToken")?.value;

    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    const newAccessToken = await refreshAccessToken(refreshToken);

    // Update the access token cookie
    (
      await // Update the access token cookie
      cookies()
    ).set({
      name: "accessToken",
      value: newAccessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: parseInt(process.env.JWT_EXPIRES_IN || "15") * 60, // Convert minutes to seconds
    });

    return NextResponse.json({
      success: true,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    // Clear cookies on error
    (
      await // Clear cookies on error
      cookies()
    ).delete("accessToken");
    (await cookies()).delete("refreshToken");

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to refresh token",
      },
      { status: 401 }
    );
  }
}
