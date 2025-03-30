// API utility functions for PDF chat application

export interface Document {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
}

export interface Message {
  question: string;
  answer: string;
}

export async function listDocuments(): Promise<Document[]> {
  try {
    const response = await fetch("/api/list");
    if (!response.ok) {
      throw new Error("Failed to fetch documents");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
}

export async function uploadDocument(file: File): Promise<Document> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload document");
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
}

export async function askQuestion(
  documentId: string,
  question: string
): Promise<string> {
  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documentId,
        question,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get answer");
    }

    const data = await response.json();
    return data.answer;
  } catch (error) {
    console.error("Error asking question:", error);
    throw error;
  }
}

export async function getConversation(documentId: string): Promise<Message[]> {
  try {
    const response = await fetch(
      `/api/getConversation?documentId=${documentId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch conversation");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching conversation:", error);
    throw error;
  }
}
