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

// "use client";

// import type React from "react";

// import { NextRequest, NextResponse } from "next/server";

// import { useState, useRef, useEffect } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { User, LogOut, Upload, FileText } from "lucide-react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { motion } from "framer-motion";
// import { ChatInterface } from "@/components/chat/chat-interface";
// import { PDFTabs } from "@/components/chat/pdf-tabs";
// import {
//   ChatStateProvider,
//   useChatState,
// } from "@/components/chat/chat-state-provider";
// import { useToast } from "@/hooks/use-toast";
// import { uploadDocument } from "@/utils/api";
// import { Skeleton } from "@/components/ui/skeleton";
// import type { DocumentWithConversation } from "@/components/chat/chat-state-provider";

// // Main Chat Page Component
// export default function ChatPage() {
//   return (
//     <ChatStateProvider>
//       <ChatPageContent />
//     </ChatStateProvider>
//   );
// }

// // Chat Page Content Component (uses the ChatState context)
// function ChatPageContent() {
//   const { documents, setDocuments, setActiveDocument, isLoading } =
//     useChatState();
//   const { toast } = useToast();

//   const [isUploading, setIsUploading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Handle file upload
//   const handleFileUpload = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     if (event.target.files && event.target.files.length > 0) {
//       const file = event.target.files[0];

//       try {
//         setIsUploading(true);

//         // Upload the file to the server
//         const newDocument = await uploadDocument(file);

//         // Add the new document to the state with empty conversation
//         const docWithConversation: DocumentWithConversation = {
//           ...newDocument,
//           conversation: [],
//         };

//         setDocuments((prev) => [...prev, docWithConversation]);

//         // Set the new document as active
//         setActiveDocument(docWithConversation);

//         // Clear file input after upload
//         if (fileInputRef.current) {
//           fileInputRef.current.value = "";
//         }

//         // Add toast notification
//         toast({
//           title: "PDF uploaded successfully",
//           description: `"${file.name}" has been uploaded`,
//         });
//       } catch (error) {
//         toast({
//           title: "Upload failed",
//           description:
//             "There was an error uploading your PDF. Please try again.",
//           variant: "destructive",
//         });
//       } finally {
//         setIsUploading(false);
//       }
//     }
//   };

//   // Trigger file input click
//   const handleUploadClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   // Load documents on mount
//   useEffect(() => {
//     // Use a self-invoking async function to load documents
//     (async () => {
//       try {
//         const refreshResponse = await fetch(
//           new URL("/api/auth/refresh", request.url).toString(),
//           {
//             method: "GET",
//             headers: {
//               Cookie: request.headers.get("cookie") || "",
//             },
//           }
//         );
//         // Call the API directly here instead of using refreshDocuments
//         const response = await fetch("/api/list");
//         if (!response.ok) {
//           throw new Error("Failed to fetch documents");
//         }
//         const docs = await response.json();

//         // Convert to DocumentWithConversation
//         const docsWithConversation: DocumentWithConversation[] = docs.map(
//           (doc: any) => ({
//             ...doc,
//             conversation: [],
//           })
//         );

//         setDocuments(docsWithConversation);

//         // Set the first document as active if there is one
//         if (docsWithConversation.length > 0) {
//           setActiveDocument(docsWithConversation[0]);
//         }
//       } catch (error) {
//         console.error("Error loading documents:", error);
//         toast({
//           title: "Error loading documents",
//           description: "Failed to load your documents. Please try again.",
//           variant: "destructive",
//         });
//       }
//     })();
//   }, []);

//   return (
//     <motion.div
//       className="flex flex-col h-screen bg-gray-50"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       {/* Header */}
//       <motion.header
//         className="bg-white border-b border-gray-200 py-4 px-6"
//         initial={{ y: -50 }}
//         animate={{ y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div className="flex items-center justify-between">
//           <Link
//             href="/"
//             className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
//           >
//             PDF Chat AI
//           </Link>
//           <div className="flex items-center gap-4">
//             <Avatar className="h-8 w-8">
//               <AvatarImage
//                 src="/placeholder.svg?height=32&width=32"
//                 alt="User"
//               />
//               <AvatarFallback>
//                 <User className="h-4 w-4" />
//               </AvatarFallback>
//             </Avatar>
//             <Button variant="outline" size="sm" asChild>
//               <Link href="/login">
//                 <LogOut className="h-4 w-4 mr-2" />
//                 Sign Out
//               </Link>
//             </Button>
//           </div>
//         </div>
//       </motion.header>

//       {/* Loading state */}
//       {isLoading ? (
//         <div className="p-4">
//           <Skeleton className="h-10 w-full mb-4" />
//           <div className="flex-1 flex flex-col space-y-4 p-4">
//             <Skeleton className="h-20 w-3/4" />
//             <Skeleton className="h-20 w-3/4 ml-auto" />
//             <Skeleton className="h-20 w-3/4" />
//           </div>
//         </div>
//       ) : (
//         <>
//           {/* PDF Tabs */}
//           {documents && documents.length > 0 && (
//             <PDFTabs onUploadClick={handleUploadClick} />
//           )}

//           {/* Main Content */}
//           <div className="flex-1 flex flex-col overflow-hidden">
//             {!documents || documents.length === 0 ? (
//               <div className="flex-1 flex items-center justify-center p-4">
//                 <div className="max-w-md w-full mx-auto space-y-6 text-center">
//                   <motion.div
//                     initial={{ scale: 0.8, opacity: 0 }}
//                     animate={{ scale: 1, opacity: 1 }}
//                     transition={{ duration: 0.5, delay: 0.2 }}
//                   >
//                     <FileText className="h-16 w-16 mx-auto text-purple-600" />
//                   </motion.div>
//                   <h2 className="text-2xl font-bold">Upload a PDF Document</h2>
//                   <p className="text-gray-500">
//                     Upload a PDF file to chat with it. Our AI will analyze the
//                     content and answer your questions.
//                   </p>

//                   <motion.div
//                     className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-purple-500 transition-colors cursor-pointer"
//                     onClick={handleUploadClick}
//                     whileHover={{
//                       scale: 1.02,
//                       borderColor: "rgba(147, 51, 234, 0.5)",
//                     }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <Upload className="h-8 w-8 mx-auto text-gray-400 mb-4" />
//                     <p className="text-sm text-gray-500">
//                       Click to upload or drag and drop
//                     </p>
//                     <p className="text-xs text-gray-400 mt-1">
//                       PDF files up to 10MB
//                     </p>
//                   </motion.div>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex-1 flex flex-col overflow-hidden">
//                 <ChatInterface />
//               </div>
//             )}
//           </div>

//           {/* Mobile upload button (fixed at bottom) */}
//           {documents && documents.length > 0 && (
//             <div className="md:hidden fixed bottom-20 right-4">
//               <Button
//                 size="icon"
//                 className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-blue-500"
//                 onClick={handleUploadClick}
//                 disabled={isUploading}
//               >
//                 <Upload className="h-5 w-5 text-white" />
//               </Button>
//             </div>
//           )}
//         </>
//       )}

//       {/* Hidden file input */}
//       <input
//         type="file"
//         className="hidden"
//         onChange={handleFileUpload}
//         accept=".pdf"
//         ref={fileInputRef}
//       />
//     </motion.div>
//   );
// }
// app/chat/page.tsx
