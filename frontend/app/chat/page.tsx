"use client";

import type React from "react";

import { NextRequest, NextResponse } from "next/server";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Upload, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChatInterface } from "@/components/chat/chat-interface";
import { PDFTabs } from "@/components/chat/pdf-tabs";
import {
  ChatStateProvider,
  useChatState,
} from "@/components/chat/chat-state-provider";
import { useToast } from "@/hooks/use-toast";
import { uploadDocument } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import type { DocumentWithConversation } from "@/components/chat/chat-state-provider";

// Main Chat Page Component
export default function ChatPage() {
  return (
    <ChatStateProvider>
      <ChatPageContent />
    </ChatStateProvider>
  );
}

// Chat Page Content Component (uses the ChatState context)
function ChatPageContent() {
  const { documents, setDocuments, setActiveDocument, isLoading } =
    useChatState();
  const { toast } = useToast();

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      try {
        setIsUploading(true);

        // Upload the file to the server
        const newDocument = await uploadDocument(file);

        // Add the new document to the state with empty conversation
        const docWithConversation: DocumentWithConversation = {
          ...newDocument,
          conversation: [],
        };

        setDocuments((prev) => [...prev, docWithConversation]);

        // Set the new document as active
        setActiveDocument(docWithConversation);

        // Clear file input after upload
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Add toast notification
        toast({
          title: "PDF uploaded successfully",
          description: `"${file.name}" has been uploaded`,
        });
      } catch (error) {
        toast({
          title: "Upload failed",
          description:
            "There was an error uploading your PDF. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Load documents on mount
  useEffect(() => {
    // Use a self-invoking async function to load documents
    (async () => {
      try {
        const refreshResponse = await fetch(
          new URL("/api/auth/refresh", request.url).toString(),
          {
            method: "GET",
            headers: {
              Cookie: request.headers.get("cookie") || "",
            },
          }
        );
        // Call the API directly here instead of using refreshDocuments
        const response = await fetch("/api/list");
        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }
        const docs = await response.json();

        // Convert to DocumentWithConversation
        const docsWithConversation: DocumentWithConversation[] = docs.map(
          (doc: any) => ({
            ...doc,
            conversation: [],
          })
        );

        setDocuments(docsWithConversation);

        // Set the first document as active if there is one
        if (docsWithConversation.length > 0) {
          setActiveDocument(docsWithConversation[0]);
        }
      } catch (error) {
        console.error("Error loading documents:", error);
        toast({
          title: "Error loading documents",
          description: "Failed to load your documents. Please try again.",
          variant: "destructive",
        });
      }
    })();
  }, []);

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

      {/* Loading state */}
      {isLoading ? (
        <div className="p-4">
          <Skeleton className="h-10 w-full mb-4" />
          <div className="flex-1 flex flex-col space-y-4 p-4">
            <Skeleton className="h-20 w-3/4" />
            <Skeleton className="h-20 w-3/4 ml-auto" />
            <Skeleton className="h-20 w-3/4" />
          </div>
        </div>
      ) : (
        <>
          {/* PDF Tabs */}
          {documents && documents.length > 0 && (
            <PDFTabs onUploadClick={handleUploadClick} />
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {!documents || documents.length === 0 ? (
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
              <div className="flex-1 flex flex-col overflow-hidden">
                <ChatInterface />
              </div>
            )}
          </div>

          {/* Mobile upload button (fixed at bottom) */}
          {documents && documents.length > 0 && (
            <div className="md:hidden fixed bottom-20 right-4">
              <Button
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-blue-500"
                onClick={handleUploadClick}
                disabled={isUploading}
              >
                <Upload className="h-5 w-5 text-white" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        accept=".pdf"
        ref={fileInputRef}
      />
    </motion.div>
  );
}
