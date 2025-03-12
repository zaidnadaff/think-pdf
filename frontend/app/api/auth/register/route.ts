// app/api/auth/register/route.ts
import { registerUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { RegisterCredentials, ApiResponse } from "@/types/auth";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const credentials: RegisterCredentials = await request.json();

    const result = await registerUser(credentials);

    return NextResponse.json({
      success: true,
      message: result.message || "Registration successful",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Registration failed",
      },
      { status: 400 }
    );
  }
}
