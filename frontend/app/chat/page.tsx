"use client";

import { useEffect, useState, useRef } from "react";
import { Document, ConversationMessage } from "@/types/chat";
import {
  useUser,
  useDocumentList,
  useConversation,
  useDocumentUpload,
} from "@/hooks/useChat";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Upload,
  User,
  Send,
  Plus,
  LogOut,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

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

  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  // Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    // fileInputRef.current?.click();
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
    const tempMessage = {
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

  const createNewConversation = (documentId: string, documentName: string) => {
    setSelectedDocumentId(documentId);
    setHistory([]);
  };

  const isLoading = isLoadingUser || isLoadingDocs;
  const activeDocument = documents.find((doc) => doc.id === selectedDocumentId);

  // Chat Message Component
  const ChatMessage = ({
    question,
    answer,
    index,
  }: {
    question: string;
    answer: string;
    index: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="space-y-2"
    >
      <div className="flex justify-end">
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-3 rounded-lg max-w-[80%]">
          <p>{question}</p>
        </div>
      </div>
      <div className="flex justify-start">
        <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
          <p className="whitespace-pre-line">{answer}</p>
        </div>
      </div>
    </motion.div>
  );

  if (isLoadingUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.header
        className="bg-white border-b border-gray-200 py-4 px-6"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
          >
            PDF Chat AI
          </Link>
          <div className="flex items-center gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="/placeholder.svg?height=32&width=32"
                alt="User"
              />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Link>
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="flex flex-1 overflow-hidden">
        {/* Document Sidebar */}
        <motion.div
          className={`hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200 p-4 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:relative h-full z-40`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold mb-2">
                Upload New Document
              </h3>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="mb-2 text-sm w-full"
              />
              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="w-full px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded disabled:bg-gray-300"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            <div className="space-y-2 flex-1 overflow-hidden flex flex-col">
              <h3 className="text-sm font-medium text-gray-500">
                Your Documents
              </h3>
              <div className="flex-1 overflow-y-auto">
                {isLoadingDocs ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : documents.length > 0 ? (
                  <div className="space-y-1">
                    {documents.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <div className="space-y-1">
                          <Button
                            variant={
                              selectedDocumentId === doc.id
                                ? "secondary"
                                : "ghost"
                            }
                            className="w-full justify-start text-left"
                            onClick={() => handleDocumentSelect(doc.id)}
                          >
                            <FileText
                              className={`h-4 w-4 mr-2 ${
                                selectedDocumentId === doc.id
                                  ? "text-purple-600"
                                  : "text-gray-500"
                              }`}
                            />
                            <span className="truncate text-sm">
                              {doc.title}
                            </span>
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    No documents yet
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200 mt-4">
            <Button
              variant="outline"
              className="w-full justify-center text-purple-600 border-purple-200 hover:bg-purple-50"
              onClick={() => {
                if (selectedDocumentId) {
                  createNewConversation(
                    selectedDocumentId,
                    documents.find((d) => d.id === selectedDocumentId)?.title ||
                      ""
                  );
                }
              }}
              disabled={!selectedDocumentId}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
        </motion.div>

        {/* Mobile sidebar toggle */}
        <button
          className="md:hidden fixed top-20 left-4 z-50 p-2 bg-purple-500 text-white rounded-md shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "×" : "≡"}
        </button>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {isLoading ? (
            <div className="p-4">
              <Skeleton className="h-10 w-full mb-4" />
              <div className="flex-1 flex flex-col space-y-4 p-4">
                <Skeleton className="h-20 w-3/4" />
                <Skeleton className="h-20 w-3/4 ml-auto" />
                <Skeleton className="h-20 w-3/4" />
              </div>
            </div>
          ) : !documents || documents.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="max-w-md w-full mx-auto space-y-6 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <FileText className="h-16 w-16 mx-auto text-purple-600" />
                </motion.div>
                <h2 className="text-2xl font-bold">Upload a PDF Document</h2>
                <p className="text-gray-500">
                  Upload a PDF file to chat with it. Our AI will analyze the
                  content and answer your questions.
                </p>

                <motion.div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-purple-500 transition-colors cursor-pointer"
                  onClick={handleUploadClick}
                  whileHover={{
                    scale: 1.02,
                    borderColor: "rgba(147, 51, 234, 0.5)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-500">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PDF files up to 10MB
                  </p>
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Messages area */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4">
                {!selectedDocumentId ? (
                  <motion.div
                    className="flex items-center justify-center h-full text-center p-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="max-w-md space-y-4">
                      <AlertCircle className="h-12 w-12 mx-auto text-amber-500" />
                      <h3 className="text-lg font-medium">
                        No Document Selected
                      </h3>
                      <p className="text-gray-500">
                        Please select a PDF document from the sidebar to start
                        chatting.
                      </p>
                    </div>
                  </motion.div>
                ) : isLoadingHistory ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                ) : history.length === 0 ? (
                  <motion.div
                    className="flex items-center justify-center h-full text-center p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="max-w-md space-y-4">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <FileText className="h-12 w-12 mx-auto text-purple-600" />
                      </motion.div>
                      <h3 className="text-lg font-medium">
                        Start chatting with your PDF
                      </h3>
                      <p className="text-gray-500">
                        You're now chatting with{" "}
                        <strong>
                          {
                            documents.find((d) => d.id === selectedDocumentId)
                              ?.title
                          }
                        </strong>
                        . Ask any question about its content.
                      </p>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>PDF Loaded</AlertTitle>
                          <AlertDescription>
                            Your PDF has been loaded. Ask a question to start
                            the conversation.
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {/* Document indicator */}
                    <motion.div
                      className="flex justify-center mb-4"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">
                        Chatting with:{" "}
                        {
                          documents.find((d) => d.id === selectedDocumentId)
                            ?.title
                        }
                      </div>
                    </motion.div>

                    {/* Chat messages */}
                    {history.map((message, index) => (
                      <ChatMessage
                        key={index}
                        question={message.question}
                        answer={message.answer}
                        index={index}
                      />
                    ))}

                    {/* Loading indicator */}
                    <AnimatePresence>
                      {isAskingQuestion && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex justify-start"
                        >
                          <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                            <div className="flex space-x-1">
                              <motion.div
                                animate={{ scale: [0.5, 1, 0.5] }}
                                transition={{
                                  repeat: Number.POSITIVE_INFINITY,
                                  duration: 1.5,
                                  ease: "easeInOut",
                                }}
                                className="w-2 h-2 bg-purple-600 rounded-full"
                              />
                              <motion.div
                                animate={{ scale: [0.5, 1, 0.5] }}
                                transition={{
                                  repeat: Number.POSITIVE_INFINITY,
                                  duration: 1.5,
                                  ease: "easeInOut",
                                  delay: 0.2,
                                }}
                                className="w-2 h-2 bg-purple-600 rounded-full"
                              />
                              <motion.div
                                animate={{ scale: [0.5, 1, 0.5] }}
                                transition={{
                                  repeat: Number.POSITIVE_INFINITY,
                                  duration: 1.5,
                                  ease: "easeInOut",
                                  delay: 0.4,
                                }}
                                className="w-2 h-2 bg-purple-600 rounded-full"
                              />
                            </div>
                            <span className="text-sm text-gray-500">
                              AI is thinking...
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input area - fixed at the bottom */}
              <div className="border-t border-gray-200 bg-white p-4 mt-auto">
                <motion.form
                  onSubmit={handleQuestionSubmit}
                  className="flex items-end gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={
                      selectedDocumentId
                        ? `Ask about ${
                            documents.find((d) => d.id === selectedDocumentId)
                              ?.title
                          }...`
                        : "Select a PDF first..."
                    }
                    className="flex-1 min-h-[60px] max-h-[120px] resize-none transition-all focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    rows={2}
                    disabled={!selectedDocumentId || isAskingQuestion}
                  />
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="submit"
                      size="icon"
                      disabled={
                        isAskingQuestion ||
                        !question.trim() ||
                        !selectedDocumentId
                      }
                      className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </motion.form>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
