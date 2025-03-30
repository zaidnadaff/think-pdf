"use client";
import React, { createContext, useContext, useState } from "react";
import type { Document, Message } from "@/utils/api";
import { NextRequest, NextResponse } from "next/server";

export interface DocumentWithConversation extends Document {
  conversation: Message[];
  isLoading?: boolean;
}

interface ChatContextType {
  documents: DocumentWithConversation[];
  setDocuments: React.Dispatch<
    React.SetStateAction<DocumentWithConversation[]>
  >;
  activeDocument: DocumentWithConversation | null;
  setActiveDocument: (document: DocumentWithConversation | null) => void;
  addMessageToConversation: (
    documentId: string,
    question: string,
    answer: string
  ) => void;
  setDocumentLoading: (documentId: string, isLoading: boolean) => void;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType>({
  documents: [],
  setDocuments: () => {},
  activeDocument: null,
  setActiveDocument: () => {},
  addMessageToConversation: () => {},
  setDocumentLoading: () => {},
  isLoading: false,
});

export function ChatStateProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<DocumentWithConversation[]>([]);
  const [activeDocument, setActiveDocument] =
    useState<DocumentWithConversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addMessageToConversation = (
    documentId: string,
    question: string,
    answer: string
  ) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId
          ? {
              ...doc,
              conversation: [...doc.conversation, { question, answer }],
            }
          : doc
      )
    );
  };

  const setDocumentLoading = (documentId: string, loading: boolean) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId ? { ...doc, isLoading: loading } : doc
      )
    );
  };

  return (
    <ChatContext.Provider
      value={{
        documents,
        setDocuments,
        activeDocument,
        setActiveDocument,
        addMessageToConversation,
        setDocumentLoading,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatState() {
  return useContext(ChatContext);
}
