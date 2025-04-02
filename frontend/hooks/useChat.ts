import { useState, useEffect } from "react";
import { Document, ConversationMessage } from "@/types/chat";
import { set } from "date-fns";

export function useUser() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/getuser", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Authentication failed");
        }

        const data = await response.json();
        setUserId(data.data.userId);
        console.log("User ID:", data.data.userId);
      } catch (error) {
        console.error("Failed to get user:", error);
        // Redirect to login if not authenticated
        // window.location.href = "/login";
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { userId, isLoading };
}

// Step 2: Document List Hook
export function useDocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDocuments = async (userId: string) => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/chat/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }

      const result = await response.json();
      setDocuments(result.data.documents || []);
      console.log("Documents:", result.data.documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { documents, isLoading, fetchDocuments };
}

// Step 3: Document Upload Hook
export function useDocumentUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadDocument = async (file: File, userId: string) => {
    if (!file || !userId) return { success: false };

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);

      const response = await fetch("/api/chat/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      return { success: true, documentId: result.data.documentId };
    } catch (error) {
      console.error("Error uploading document:", error);
      return { success: false };
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadDocument, isUploading };
}

// Step 4: Conversation Hooks
export function useConversation() {
  const [history, setHistory] = useState<ConversationMessage[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);

  const fetchConversationHistory = async (documentId: string) => {
    if (!documentId) return;

    setIsLoadingHistory(true);
    try {
      const response = await fetch("/api/chat/getconversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch conversation history");
      }

      const result = await response.json();
      setHistory(result.data.conversation || []);
      console.log("Conversation history:", result.data.conversation);
    } catch (error) {
      console.error("Error fetching conversation:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const askQuestion = async (documentId: string, question: string) => {
    if (!documentId || !question.trim()) return { success: false };

    setIsAskingQuestion(true);
    try {
      const response = await fetch("/api/chat/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, question }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to get answer");
      }

      const result = await response.json();
      return { success: true, answer: result.data.response };
    } catch (error) {
      console.error("Error asking question:", error);
      return { success: false };
    } finally {
      setIsAskingQuestion(false);
    }
  };

  return {
    history,
    setHistory,
    isLoadingHistory,
    isAskingQuestion,
    fetchConversationHistory,
    askQuestion,
  };
}
