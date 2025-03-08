"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FileText,
  Send,
  Upload,
  User,
  LogOut,
  AlertCircle,
  ChevronDown,
  Bot,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import confetti from "canvas-confetti";

// Define a type for our PDF files
interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: number;
  uploadedAt: Date;
}

export default function ChatPage() {
  // State for uploaded PDFs
  const [uploadedPDFs, setUploadedPDFs] = useState<PDFFile[]>([]);
  const [activePDF, setActivePDF] = useState<PDFFile | null>(null);
  const [activeTab, setActiveTab] = useState("upload"); // Start with upload tab
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Reset chat when changing PDFs
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat();

  // Show scroll indicator when there are unread messages
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const checkScroll = () => {
      if (
        container.scrollHeight - container.scrollTop - container.clientHeight >
        50
      ) {
        setShowScrollIndicator(true);
      } else {
        setShowScrollIndicator(false);
      }
    };

    container.addEventListener("scroll", checkScroll);
    return () => container.removeEventListener("scroll", checkScroll);
  }, [messages]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollIndicator(false);
  };

  // Trigger confetti animation when a PDF is successfully uploaded
  const triggerSuccessAnimation = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Simulate upload progress
  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          triggerSuccessAnimation();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      simulateUpload();

      setTimeout(() => {
        const newPDFs: PDFFile[] = Array.from(event.target.files!).map(
          (file) => ({
            id: Math.random().toString(36).substring(2, 9),
            file,
            name: file.name,
            size: file.size,
            uploadedAt: new Date(),
          })
        );

        setUploadedPDFs((prev) => [...prev, ...newPDFs]);

        // Set the first uploaded PDF as active if none is active
        if (!activePDF) {
          setActivePDF(newPDFs[0]);
        }

        // Clear file input after upload
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 2000);
    }
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      simulateUpload();

      setTimeout(() => {
        const newPDFs: PDFFile[] = Array.from(e.dataTransfer.files).map(
          (file) => ({
            id: Math.random().toString(36).substring(2, 9),
            file,
            name: file.name,
            size: file.size,
            uploadedAt: new Date(),
          })
        );

        setUploadedPDFs((prev) => [...prev, ...newPDFs]);

        if (!activePDF) {
          setActivePDF(newPDFs[0]);
        }
      }, 2000);
    }
  };

  // Switch to active PDF
  const switchToPDF = (pdf: PDFFile) => {
    setActivePDF(pdf);
    // Clear chat messages when switching PDFs
    setMessages([]);
  };

  // Handle form submission with files
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!activePDF) {
      return;
    }

    // If this is the first message, attach the PDF
    const shouldAttachPDF = messages.length === 0;

    handleSubmit(e, {
      experimental_attachments: shouldAttachPDF ? [activePDF.file] : undefined,
    });

    // Scroll to bottom after sending message
    setTimeout(scrollToBottom, 100);
  };

  // Switch to chat tab after uploading a PDF
  useEffect(() => {
    if (activePDF && activeTab === "upload") {
      setActiveTab("chat");
    }
  }, [activePDF, activeTab]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-purple-50"
    >
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-purple-600 flex items-center group"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="mr-2"
            >
              <Bot className="h-6 w-6 text-purple-600" />
            </motion.div>
            <span className="group-hover:text-purple-700 transition-colors">
              PDF Chat AI
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-8 w-8 ring-2 ring-purple-200 transition-all hover:ring-purple-400">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="User"
                    />
                    <AvatarFallback className="bg-purple-100 text-purple-700">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>Your Profile</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              asChild
            >
              <Link href="/login">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="hidden md:block w-64 bg-white border-r border-gray-200 p-4 shadow-sm"
          >
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start hover:bg-purple-50 hover:text-purple-700 transition-all hover:shadow-sm"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload New PDF
              </Button>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-400" />
                  Your Documents
                </h3>
                {uploadedPDFs.length > 0 ? (
                  <motion.div
                    className="space-y-1"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.1,
                        },
                      },
                    }}
                  >
                    {uploadedPDFs.map((pdf) => (
                      <motion.div
                        key={pdf.id}
                        variants={{
                          hidden: { opacity: 0, y: 10 },
                          visible: { opacity: 1, y: 0 },
                        }}
                      >
                        <Button
                          variant={
                            activePDF?.id === pdf.id ? "secondary" : "ghost"
                          }
                          className="w-full justify-start text-left group"
                          onClick={() => switchToPDF(pdf)}
                        >
                          <FileText
                            className={`h-4 w-4 mr-2 ${
                              activePDF?.id === pdf.id
                                ? "text-purple-600"
                                : "text-gray-500 group-hover:text-purple-500"
                            } transition-colors`}
                          />
                          <span className="truncate text-sm">{pdf.name}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-sm text-gray-500 italic p-2 border border-dashed border-gray-200 rounded-md">
                    No documents yet
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <div className="px-4 pt-4 border-b border-gray-200 bg-white shadow-sm">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger
                  value="chat"
                  disabled={!activePDF}
                  className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center"
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    Chat
                  </motion.div>
                </TabsTrigger>
                <TabsTrigger
                  value="upload"
                  className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload PDF
                  </motion.div>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="chat"
              className="flex-1 flex flex-col p-4 overflow-hidden"
            >
              {/* Active PDF indicator for mobile */}
              {activePDF && (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="md:hidden mb-4"
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between group hover:bg-purple-50"
                      >
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-purple-600 group-hover:scale-110 transition-transform" />
                          <span className="truncate">{activePDF.name}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 ml-2 group-hover:translate-y-1 transition-transform" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[200px] animate-in slide-in-from-top-5">
                      {uploadedPDFs.map((pdf) => (
                        <DropdownMenuItem
                          key={pdf.id}
                          onClick={() => switchToPDF(pdf)}
                          className={`${
                            activePDF.id === pdf.id ? "bg-purple-50" : ""
                          } cursor-pointer hover:bg-purple-100 transition-colors`}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          <span className="truncate">{pdf.name}</span>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem
                        onClick={() => setActiveTab("upload")}
                        className="cursor-pointer hover:bg-purple-100 transition-colors"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload New PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              )}

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto mb-4 space-y-4 px-2 scroll-smooth"
                ref={messagesContainerRef}
              >
                {!activePDF ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center justify-center h-full text-center p-8"
                  >
                    <div className="max-w-md space-y-4">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      >
                        <AlertCircle className="h-12 w-12 mx-auto text-amber-500" />
                      </motion.div>
                      <h3 className="text-lg font-medium">No PDF Selected</h3>
                      <p className="text-gray-500">
                        Please upload a PDF document first to start chatting.
                      </p>
                      <Button
                        variant="default"
                        onClick={() => setActiveTab("upload")}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload PDF
                      </Button>
                    </div>
                  </motion.div>
                ) : messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center justify-center h-full text-center p-8"
                  >
                    <div className="max-w-md space-y-4">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      >
                        <FileText className="h-12 w-12 mx-auto text-purple-600" />
                      </motion.div>
                      <h3 className="text-lg font-medium">
                        Start chatting with your PDF
                      </h3>
                      <p className="text-gray-500">
                        You're now chatting with{" "}
                        <strong className="text-purple-700">
                          {activePDF.name}
                        </strong>
                        . Ask any question about its content.
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <Alert className="bg-purple-50 border-purple-200">
                          <AlertCircle className="h-4 w-4 text-purple-600" />
                          <AlertTitle className="text-purple-700">
                            PDF Loaded
                          </AlertTitle>
                          <AlertDescription className="text-purple-600">
                            Your PDF has been loaded. The AI will analyze it
                            when you send your first message.
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {/* First message indicator */}
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-center mb-4"
                    >
                      <Badge
                        variant="outline"
                        className="bg-purple-100 text-purple-800 border-purple-200 px-3 py-1 shadow-sm"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Chatting with: {activePDF.name}
                      </Badge>
                    </motion.div>

                    {/* Chat messages */}
                    <AnimatePresence>
                      {messages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className={`flex ${
                            message.role === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div className="flex items-start max-w-[80%]">
                            {message.role !== "user" && (
                              <Avatar className="h-8 w-8 mr-2 ring-2 ring-purple-100">
                                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-xs">
                                  AI
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <motion.div
                              whileHover={{ scale: 1.01 }}
                              transition={{ type: "spring", stiffness: 500 }}
                            >
                              <Card
                                className={`p-3 ${
                                  message.role === "user"
                                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                                    : "bg-white shadow-md border-gray-100"
                                }`}
                              >
                                <div className="whitespace-pre-wrap">
                                  {message.content}
                                </div>
                              </Card>
                            </motion.div>
                            {message.role === "user" && (
                              <Avatar className="h-8 w-8 ml-2 ring-2 ring-purple-100">
                                <AvatarFallback className="bg-gradient-to-br from-purple-200 to-purple-300 text-purple-700">
                                  <User className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />

                    {/* Scroll to bottom indicator */}
                    <AnimatePresence>
                      {showScrollIndicator && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          className="sticky bottom-2 flex justify-center"
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full bg-white shadow-md border-purple-200 text-purple-700 hover:bg-purple-50"
                            onClick={scrollToBottom}
                          >
                            <motion.div
                              animate={{ y: [0, 3, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <ChevronDown className="h-4 w-4 mr-1" />
                            </motion.div>
                            New messages
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>

              {/* Input */}
              <motion.form
                onSubmit={handleFormSubmit}
                className="flex items-end gap-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Textarea
                  value={input}
                  onChange={handleInputChange}
                  placeholder={
                    activePDF
                      ? `Ask about ${activePDF.name}...`
                      : "Upload a PDF first..."
                  }
                  className="flex-1 min-h-[60px] max-h-[200px] resize-none rounded-xl border-purple-100 focus:border-purple-300 focus:ring-purple-200 shadow-sm"
                  rows={2}
                  disabled={!activePDF}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          type="submit"
                          size="icon"
                          disabled={isLoading || !input.trim() || !activePDF}
                          className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md hover:shadow-lg transition-all disabled:opacity-50 h-10 w-10"
                        >
                          {isLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            </motion.div>
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>Send message</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.form>
            </TabsContent>

            <TabsContent
              value="upload"
              className="flex-1 flex flex-col items-center justify-center p-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="max-w-md w-full space-y-6 text-center"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <FileText className="h-16 w-16 mx-auto text-purple-600" />
                </motion.div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                  Upload a PDF Document
                </h2>
                <p className="text-gray-500">
                  Upload a PDF file to chat with it. Our AI will analyze the
                  content and answer your questions.
                </p>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
                    isDragging
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/50"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <motion.div
                    animate={isDragging ? { scale: [1, 1.05, 1] } : {}}
                    transition={{
                      duration: 0.5,
                      repeat: isDragging ? Infinity : 0,
                    }}
                  >
                    <Upload
                      className={`h-8 w-8 mx-auto mb-4 ${
                        isDragging ? "text-purple-600" : "text-gray-400"
                      }`}
                    />
                  </motion.div>
                  <p className="text-sm text-gray-500">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PDF files up to 10MB
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf"
                    ref={fileInputRef}
                    multiple
                  />
                </motion.div>

                {isUploading && (
                  <div className="space-y-2">
                    <p className="text-sm text-purple-600 font-medium">
                      Uploading...
                    </p>
                    <Progress
                      value={uploadProgress}
                      className="h-2 bg-purple-100"
                      // indica="bg-gradient-to-r from-purple-500 to-indigo-500"
                    />
                  </div>
                )}

                <AnimatePresence>
                  {uploadedPDFs.length > 0 && (
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="font-medium flex items-center justify-center text-purple-700">
                        <FileText className="h-4 w-4 mr-2" />
                        Your PDFs:
                      </h3>
                      <div className="max-h-[200px] overflow-y-auto space-y-2 pr-1">
                        <AnimatePresence>
                          {uploadedPDFs.map((pdf) => (
                            <motion.div
                              key={pdf.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.2 }}
                              className={`flex items-center p-2 rounded cursor-pointer ${
                                activePDF?.id === pdf.id
                                  ? "bg-purple-100 border border-purple-200 shadow-sm"
                                  : "bg-gray-50 hover:bg-purple-50 hover:shadow-sm transition-all"
                              }`}
                              onClick={() => switchToPDF(pdf)}
                            >
                              <FileText
                                className={`h-4 w-4 mr-2 ${
                                  activePDF?.id === pdf.id
                                    ? "text-purple-600"
                                    : "text-gray-500"
                                }`}
                              />
                              <span className="text-sm truncate flex-1">
                                {pdf.name}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-xs bg-white"
                              >
                                {(pdf.size / 1024 / 1024).toFixed(2)} MB
                              </Badge>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>

                      {activePDF && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
                            onClick={() => setActiveTab("chat")}
                          >
                            <Bot className="h-4 w-4 mr-2" />
                            Chat with{" "}
                            {activePDF.name.length > 20
                              ? `${activePDF.name.substring(0, 20)}...`
                              : activePDF.name}
                          </Button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
}
