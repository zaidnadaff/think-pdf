import { anthropic } from "@ai-sdk/anthropic"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Check if user has sent a PDF
    const hasPDF = messages.some((message) =>
      message.experimental_attachments?.some((a) => a.contentType === "application/pdf"),
    )

    // If no PDF is attached, return an error
    if (!hasPDF) {
      return new Response(
        JSON.stringify({
          error: "Please upload a PDF document first",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      )
    }

    // Use Anthropic for PDFs since it has better PDF handling capabilities
    const result = streamText({
      model: anthropic("claude-3-5-sonnet-latest"),
      messages,
      temperature: 0.7, // Add some creativity to responses
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error processing chat request:", error)
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

