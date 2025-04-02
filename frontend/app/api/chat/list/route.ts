import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/auth";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  console.log("Fetching documents...");
  try {
    const body = await request.json();

    const response = await fetch(`${process.env.DOC_API_URL}/list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: body.userId }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch documents");
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: data.message || "Documents fetched successfully",
      data: { documents: data.Documents },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch documents",
      },
      { status: 400 }
    );
  }
}
