"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, FileText, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ChatMessage } from "./chat-message"
import { useChatState } from "./chat-state-provider"
import { useChat } from "@ai-sdk/react"

export function ChatInterface() {
  const { activePDF, activeConversation, updateConversationMessages, createNewConversation } = useChatState()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize chat with the active conversation's messages
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    initialMessages: activeConversation?.messages || [],
    onFinish: (message) => {
      // Update the conversation with the new messages
      if (activeConversation) {
        const updatedMessages = [...messages, message]
        updateConversationMessages(activeConversation.id, updatedMessages)
      }
    },
  })

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Handle form submission with files
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!activePDF) return

    // If there's no active conversation, create one
    if (!activeConversation) {
      const newConversation = createNewConversation(activePDF.id, activePDF.name)

      // If this is the first message, attach the PDF
      handleSubmit(e, {
        experimental_attachments: [activePDF.file],
      })
    } else {
      // If this is the first message in this conversation, attach the PDF
      const shouldAttachPDF = messages.length === 0

      handleSubmit(e, {
        experimental_attachments: shouldAttachPDF ? [activePDF.file] : undefined,
      })
    }

    // Scroll to bottom after sending message
    setTimeout(scrollToBottom, 100)
  }

  // Update messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      setMessages(activeConversation.messages)
    } else {
      setMessages([])
    }
  }, [activeConversation, setMessages])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4">
        {!activePDF ? (
          <motion.div
            className="flex items-center justify-center h-full text-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-md space-y-4">
              <AlertCircle className="h-12 w-12 mx-auto text-amber-500" />
              <h3 className="text-lg font-medium">No PDF Selected</h3>
              <p className="text-gray-500">Please upload a PDF document first to start chatting.</p>
            </div>
          </motion.div>
        ) : messages.length === 0 ? (
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
              <h3 className="text-lg font-medium">Start chatting with your PDF</h3>
              <p className="text-gray-500">
                You're now chatting with <strong>{activePDF.name}</strong>. Ask any question about its content.
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
                    Your PDF has been loaded. The AI will analyze it when you send your first message.
                  </AlertDescription>
                </Alert>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* First message indicator */}
            <motion.div
              className="flex justify-center mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">
                Chatting with: {activePDF.name}
              </div>
            </motion.div>

            {/* Chat messages */}
            {messages.map((message, index) => (
              <ChatMessage key={message.id} message={message} index={index} />
            ))}

            {/* Loading indicator */}
            <AnimatePresence>
              {isLoading && (
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
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
                        className="w-2 h-2 bg-purple-600 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [0.5, 1, 0.5] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                        className="w-2 h-2 bg-purple-600 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [0.5, 1, 0.5] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut", delay: 0.4 }}
                        className="w-2 h-2 bg-purple-600 rounded-full"
                      />
                    </div>
                    <span className="text-sm text-gray-500">AI is thinking...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area - fixed at the bottom */}
      <div className="border-t border-gray-200 bg-white p-4">
        <motion.form
          onSubmit={handleFormSubmit}
          className="flex items-end gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder={activePDF ? `Ask about ${activePDF.name}...` : "Upload a PDF first..."}
            className="flex-1 min-h-[60px] max-h-[120px] resize-none transition-all focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            rows={2}
            disabled={!activePDF || isLoading}
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim() || !activePDF}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  )
}

