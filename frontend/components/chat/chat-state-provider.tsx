"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Message } from "ai"

// Define a type for our PDF files
export interface PDFFile {
  id: string
  file: File
  name: string
  size: number
  uploadedAt: Date
}

// Define a type for our chat conversations
export interface ChatConversation {
  id: string
  pdfId: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

interface ChatContextType {
  uploadedPDFs: PDFFile[]
  activePDF: PDFFile | null
  conversations: ChatConversation[]
  activeConversation: ChatConversation | null
  setUploadedPDFs: React.Dispatch<React.SetStateAction<PDFFile[]>>
  setActivePDF: React.Dispatch<React.SetStateAction<PDFFile | null>>
  setConversations: React.Dispatch<React.SetStateAction<ChatConversation[]>>
  setActiveConversation: React.Dispatch<React.SetStateAction<ChatConversation | null>>
  createNewConversation: (pdfId: string, pdfName: string) => ChatConversation
  updateConversationMessages: (conversationId: string, messages: Message[]) => void
  getConversationsForPDF: (pdfId: string) => ChatConversation[]
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatStateProvider({ children }: { children: React.ReactNode }) {
  const [uploadedPDFs, setUploadedPDFs] = useState<PDFFile[]>([])
  const [activePDF, setActivePDF] = useState<PDFFile | null>(null)
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null)

  // Create a new conversation
  const createNewConversation = (pdfId: string, pdfName: string): ChatConversation => {
    const newConversation: ChatConversation = {
      id: Math.random().toString(36).substring(2, 9),
      pdfId,
      title: `Chat about ${pdfName}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setConversations((prev) => [...prev, newConversation])
    setActiveConversation(newConversation)
    return newConversation
  }

  // Update conversation messages
  const updateConversationMessages = (conversationId: string, messages: Message[]) => {
    setConversations((prev) =>
      prev.map((conv) => (conv.id === conversationId ? { ...conv, messages, updatedAt: new Date() } : conv)),
    )

    if (activeConversation?.id === conversationId) {
      setActiveConversation((prev) => (prev ? { ...prev, messages, updatedAt: new Date() } : null))
    }
  }

  // Get conversations for a specific PDF
  const getConversationsForPDF = (pdfId: string): ChatConversation[] => {
    return conversations.filter((conv) => conv.pdfId === pdfId)
  }

  // Update active conversation when messages change
  useEffect(() => {
    if (activeConversation) {
      const updatedConversation = conversations.find((c) => c.id === activeConversation.id)
      if (updatedConversation) {
        setActiveConversation(updatedConversation)
      }
    }
  }, [conversations, activeConversation])

  return (
    <ChatContext.Provider
      value={{
        uploadedPDFs,
        activePDF,
        conversations,
        activeConversation,
        setUploadedPDFs,
        setActivePDF,
        setConversations,
        setActiveConversation,
        createNewConversation,
        updateConversationMessages,
        getConversationsForPDF,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChatState() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChatState must be used within a ChatStateProvider")
  }
  return context
}

