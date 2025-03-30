// This is a mock implementation - replace with your actual API implementation

export async function GET() {
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Return mock data
  return Response.json([
    {
      id: "doc-1",
      name: "Research Paper.pdf",
      size: 2500000,
      uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    },
    {
      id: "doc-2",
      name: "Financial Report 2023.pdf",
      size: 1800000,
      uploadedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
      id: "doc-3",
      name: "Product User Manual.pdf",
      size: 3200000,
      uploadedAt: new Date().toISOString(), // Today
    },
  ])
}

