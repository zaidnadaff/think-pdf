import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/auth";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const { documentId } = await request.json();

    if (!documentId) {
      throw new Error("Missing document ID");
    }

    const response = await fetch(
      `${process.env.DOC_API_URL}/get-conversation`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch conversation history"
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: "Conversation history fetched successfully",
      data: { conversation: data.conversation },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch conversation history",
      },
      { status: 400 }
    );
  }
}
