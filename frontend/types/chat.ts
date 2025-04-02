import { ApiResponse } from "./auth";

export interface uploadRequest {
  userId: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}
export interface ConversationMessage {
  question: string;
  answer: string;
  timestamp: string;
}

export interface AskQuestionRequest {
  documentId: string;
  question: string;
}

export interface GetConversationRequest {
  documentId: string;
}
export interface Document {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface DocumentListRequest {
  userId: string;
}
