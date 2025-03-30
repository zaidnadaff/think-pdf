// app/api/auth/login/route.ts
import { getUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getUserRequest, getUserResponse } from "@/types/auth";

export async function POST(
  request: NextRequest
): Promise<NextResponse<getUserResponse>> {
  try {
    const userRequest: getUserRequest = await request.json();

    const { userId } = await getUser(userRequest.refreshToken);

    return NextResponse.json({
      userId: userId,
    });
  } catch (error) {
    return NextResponse.json({}, { status: 401 });
  }
}
