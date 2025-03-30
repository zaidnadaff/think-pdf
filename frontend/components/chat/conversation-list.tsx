"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MessageSquare, Plus, ChevronDown, ChevronRight, Trash2 } from "lucide-react"
import { type ChatConversation, useChatState } from "./chat-state-provider"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"

interface ConversationListProps {
  pdfId: string
}

export function ConversationList({ pdfId }: ConversationListProps) {
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    createNewConversation,
    setConversations,
    activePDF,
  } = useChatState()
  const [isExpanded, setIsExpanded] = useState(true)
  const { toast } = useToast()

  const pdfConversations = conversations.filter((conv) => conv.pdfId === pdfId)

  const handleNewConversation = () => {
    if (activePDF) {
      createNewConversation(activePDF.id, activePDF.name)
    }
  }

  const handleDeleteConversation = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation()

    // Find the conversation to get its title for the toast
    const conversationToDelete = conversations.find((c) => c.id === conversationId)

    setConversations((prev) => prev.filter((c) => c.id !== conversationId))

    // If the active conversation is deleted, set the first available conversation as active
    if (activeConversation?.id === conversationId) {
      const remainingConversations = conversations.filter((c) => c.id !== conversationId && c.pdfId === pdfId)
      setActiveConversation(remainingConversations.length > 0 ? remainingConversations[0] : null)
    }

    // Add toast notification
    toast({
      title: "Conversation deleted",
      description: conversationToDelete
        ? `Deleted "${conversationToDelete.title}"`
        : "The conversation has been removed",
      variant: "destructive",
    })
  }

  return (
    <div className="mb-4">
      <div
        className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-100 rounded-md"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          {isExpanded ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
          <span className="text-sm font-medium">Conversations</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={(e) => {
            e.stopPropagation()
            handleNewConversation()
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-6 pr-2 space-y-1 mt-1 max-h-[200px] overflow-y-auto">
              {pdfConversations.length > 0 ? (
                pdfConversations.map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isActive={activeConversation?.id === conversation.id}
                    onSelect={() => setActiveConversation(conversation)}
                    onDelete={(e) => handleDeleteConversation(e, conversation.id)}
                  />
                ))
              ) : (
                <div className="text-xs text-gray-500 italic py-2">No conversations yet. Start a new chat.</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface ConversationItemProps {
  conversation: ChatConversation
  isActive: boolean
  onSelect: () => void
  onDelete: (e: React.MouseEvent) => void
}

function ConversationItem({ conversation, isActive, onSelect, onDelete }: ConversationItemProps) {
  // Get the first user message as the title, or use the default title
  const title = conversation.messages.find((m) => m.role === "user")?.content.slice(0, 30) || conversation.title

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className={`flex items-center justify-between p-2 rounded-md cursor-pointer group ${
        isActive ? "bg-purple-100" : "hover:bg-gray-100"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center overflow-hidden">
        <MessageSquare className={`h-3.5 w-3.5 mr-2 flex-shrink-0 ${isActive ? "text-purple-600" : "text-gray-500"}`} />
        <div className="overflow-hidden">
          <div className="text-sm truncate">{title}</div>
          <div className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onDelete}
      >
        <Trash2 className="h-3.5 w-3.5 text-gray-500 hover:text-red-500" />
      </Button>
    </motion.div>
  )
}

