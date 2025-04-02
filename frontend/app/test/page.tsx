"use client";

import { useEffect, useState, useRef } from "react";
import { Document, ConversationMessage } from "@/types/chat";
import {
  useUser,
  useDocumentList,
  useConversation,
  useDocumentUpload,
} from "@/hooks/useChat";

// Step 1: Create User Hook

export default function ChatPage() {
  // State and hooks
  const { userId, isLoading: isLoadingUser } = useUser();
  const {
    documents,
    isLoading: isLoadingDocs,
    fetchDocuments,
  } = useDocumentList();
  const { uploadDocument, isUploading } = useDocumentUpload();
  const {
    history,
    setHistory,
    isLoadingHistory,
    isAskingQuestion,
    fetchConversationHistory,
    askQuestion,
  } = useConversation();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );
  const [question, setQuestion] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (userId) {
      fetchDocuments(userId);
    }
  }, [userId]);

  // Fetch conversation history when document is selected
  useEffect(() => {
    if (selectedDocumentId) {
      fetchConversationHistory(selectedDocumentId);
    }
  }, [selectedDocumentId]);

  // Scroll to bottom of chat when history changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [history]);

  // Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !userId) return;

    const result = await uploadDocument(selectedFile, userId);
    if (result.success) {
      // Refresh document list
      fetchDocuments(userId);
      setSelectedFile(null);

      // Select the newly uploaded document
      if (result.documentId) {
        setSelectedDocumentId(result.documentId);
      }
    }
  };

  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocumentId(documentId);
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocumentId || !question.trim() || isAskingQuestion) return;

    // Optimistically add question to UI
    const tempMessage: ConversationMessage = {
      question: question,
      answer: "...",
      timestamp: new Date().toISOString(),
    };

    setHistory((prev) => [...prev, tempMessage]);
    const currentQuestion = question;
    setQuestion("");

    const result = await askQuestion(selectedDocumentId, currentQuestion);
    if (result.success) {
      // Refresh conversation history
      fetchConversationHistory(selectedDocumentId);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    // <div></div>
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-500 text-white rounded-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? "×" : "≡"}
      </button>

      {/* Document Sidebar */}
      <div
        className={`w-80 bg-white shadow-md overflow-auto transition-all ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static h-full z-40`}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold mb-4">Documents</h2>

          {/* Upload Form */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold mb-2">Upload New Document</h3>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="mb-2 text-sm w-full"
            />
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full px-3 py-1.5 bg-blue-500 text-white text-sm rounded disabled:bg-gray-300"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {/* Document List */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Your Documents</h3>
            {isLoadingDocs ? (
              <p className="text-center text-gray-500 text-sm py-4">
                Loading documents...
              </p>
            ) : documents.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-4">
                No documents found
              </p>
            ) : (
              <ul className="space-y-2">
                {documents.map((doc) => (
                  <li
                    key={doc.id}
                    onClick={() => handleDocumentSelect(doc.id)}
                    className={`p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                      selectedDocumentId === doc.id ? "bg-blue-100" : ""
                    }`}
                  >
                    <p className="font-medium truncate">{doc.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Document Title */}
        <div className="bg-white p-4 shadow-sm">
          <h1 className="text-xl font-bold">
            {selectedDocumentId
              ? documents.find((d) => d.id === selectedDocumentId)?.title ||
                "Chat"
              : "Select a document to start chatting"}
          </h1>
        </div>

        {/* Chat Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-auto p-4 bg-gray-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, #f9fafb 0%, #f3f4f6 100%)",
          }}
        >
          {!selectedDocumentId ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">
                Select a document from the sidebar to start a conversation
              </p>
            </div>
          ) : isLoadingHistory ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((message, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-end">
                    <div className="bg-blue-500 text-white p-3 rounded-lg max-w-[80%]">
                      <p>{message.question}</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
                      <p className="whitespace-pre-line">{message.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 border-t">
          <form onSubmit={handleQuestionSubmit} className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={
                selectedDocumentId
                  ? "Ask a question about the document..."
                  : "Select a document first"
              }
              disabled={!selectedDocumentId || isAskingQuestion}
              className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={
                !selectedDocumentId || !question.trim() || isAskingQuestion
              }
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              {isAskingQuestion ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
