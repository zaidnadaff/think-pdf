"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { User } from "lucide-react"
import type { Message } from "ai"

interface ChatMessageProps {
  message: Message
  index: number
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="flex items-start max-w-[80%]">
        {!isUser && (
          <Avatar className="h-8 w-8 mr-2">
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
        )}
        <div>
          <Card className={`p-3 ${isUser ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white" : "bg-white"}`}>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </Card>
        </div>
        {isUser && (
          <Avatar className="h-8 w-8 ml-2">
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </motion.div>
  )
}

