import { anthropic } from "@ai-sdk/anthropic"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
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
  })

  return result.toDataStreamResponse()
}

