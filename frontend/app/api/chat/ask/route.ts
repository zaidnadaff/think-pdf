import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/auth";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const { documentId, question } = await request.json();

    if (!documentId || !question) {
      throw new Error("Missing required fields");
    }

    const response = await fetch(`${process.env.DOC_API_URL}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId, question }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get answer");
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: "Answer generated successfully",
      data: { response: data.response },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to get answer",
      },
      { status: 400 }
    );
  }
}
