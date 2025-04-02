import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/auth";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  console.log("refresh token route");
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
      console.log("Refresh token not found");
      return NextResponse.json(
        {
          success: false,
          message: "Refresh token not found",
        },
        { status: 401 }
      );
    }

    const response = await fetch(`${process.env.AUTH_API_URL}/auth/get-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refreshToken }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "User does not exist");
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: data.message || "UserId fetched successfully",
      data: { userId: data.userId },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch userId",
      },
      { status: 400 }
    );
  }
}
