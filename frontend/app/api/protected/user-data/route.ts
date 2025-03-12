// app/api/protected/user-data/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

interface UserDataResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export async function GET(): Promise<NextResponse<UserDataResponse>> {
  const accessToken = (await cookies()).get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // Call your backend API with the access token
    const response = await fetch(
      `${process.env.INTERNAL_API_URL}/api/user-data`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 }
    );
  }
}
