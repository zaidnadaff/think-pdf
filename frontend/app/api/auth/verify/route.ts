// app/api/auth/register/route.ts
import { verifyAccessToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/auth";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json();
    const token: string = body.token;
    const result = await verifyAccessToken(token);

    return NextResponse.json({
      success: true,
      message: result.message || "Token Verified",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unauthorized Token",
      },
      { status: 400 }
    );
  }
}
