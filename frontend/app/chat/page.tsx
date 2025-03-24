"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PDFSidebar } from "@/components/chat/pdf-sidebar";
import { UploadSection } from "@/components/chat/upload-section";
import { ChatInterface } from "@/components/chat/chat-interface";
import { MobilePDFSelector } from "@/components/chat/mobile-pdf-selector";
import {
  ChatStateProvider,
  useChatState,
} from "@/components/chat/chat-state-provider";
import { createDummyPDFs, createDummyConversations } from "@/utils/dummy-data";

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
  const {
    uploadedPDFs,
    setUploadedPDFs,
    activePDF,
    setActivePDF,
    setConversations,
  } = useChatState();

  const [activeTab, setActiveTab] = useState("chat"); // Start with chat tab
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newPDFs = Array.from(event.target.files).map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
        size: file.size,
        uploadedAt: new Date(),
      }));

      setUploadedPDFs((prev) => [...prev, ...newPDFs]);

      // Set the first uploaded PDF as active if none is active
      if (!activePDF) {
        setActivePDF(newPDFs[0]);
      }

      // Clear file input after upload
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Switch to chat tab after uploading a PDF
  useEffect(() => {
    if (activePDF && activeTab === "upload") {
      setActiveTab("chat");
    }
  }, [activePDF, activeTab]);

  // Load dummy data for demonstration
  useEffect(() => {
    if (uploadedPDFs.length === 0) {
      const dummyPDFs = createDummyPDFs();
      setUploadedPDFs(dummyPDFs);
      setActivePDF(dummyPDFs[0]);

      const dummyConversations = createDummyConversations(
        dummyPDFs.map((pdf) => pdf.id)
      );
      setConversations(dummyConversations);
    }
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
            think-pdf
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

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <PDFSidebar onUploadClick={handleUploadClick} />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="px-4 pt-4 border-b border-gray-200">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="chat" disabled={!activePDF}>
                  Chat
                </TabsTrigger>
                <TabsTrigger value="upload">Upload PDF</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="chat"
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* Mobile PDF selector */}
              {activePDF && (
                <MobilePDFSelector onUploadClick={handleUploadClick} />
              )}

              {/* Chat Interface */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <ChatInterface />
              </div>
            </TabsContent>

            <TabsContent value="upload" className="flex-1 overflow-auto">
              <UploadSection
                uploadedPDFs={uploadedPDFs}
                activePDF={activePDF}
                fileInputRef={fileInputRef}
                onPDFSelect={setActivePDF}
                onStartChat={() => setActiveTab("chat")}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        accept=".pdf"
        ref={fileInputRef}
        multiple
      />
    </motion.div>
  );
}
