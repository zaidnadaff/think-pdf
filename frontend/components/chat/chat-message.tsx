"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { User } from "lucide-react"

interface ChatMessageProps {
  question: string
  answer: string
  index: number
}

export function ChatMessage({ question, answer, index }: ChatMessageProps) {
  return (
    <>
      {/* User question */}
      <motion.div
        className="flex justify-end"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <div className="flex items-start max-w-[80%]">
          <div>
            <Card className="p-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white">
              <div className="whitespace-pre-wrap">{question}</div>
            </Card>
          </div>
          <Avatar className="h-8 w-8 ml-2">
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </motion.div>

      {/* AI answer */}
      <motion.div
        className="flex justify-start"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
      >
        <div className="flex items-start max-w-[80%]">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <Card className="p-3 bg-white">
              <div className="whitespace-pre-wrap">{answer}</div>
            </Card>
          </div>
        </div>
      </motion.div>
    </>
  )
}

