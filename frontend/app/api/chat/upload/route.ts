import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/auth";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const formData = await request.formData();

    const response = await fetch(`${process.env.DOC_API_URL}/upload`, {
      method: "POST",
      body: formData,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Document upload failed");
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: data.message || "Document uploaded successfully",
      data: { documentId: data.id },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Document upload failed",
      },
      { status: 400 }
    );
  }
}
