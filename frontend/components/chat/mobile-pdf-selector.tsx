"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { FileText, Upload, ChevronDown, MessageSquare, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { useChatState } from "./chat-state-provider"

interface MobilePDFSelectorProps {
  onUploadClick: () => void
}

export function MobilePDFSelector({ onUploadClick }: MobilePDFSelectorProps) {
  const {
    uploadedPDFs,
    activePDF,
    setActivePDF,
    conversations,
    activeConversation,
    setActiveConversation,
    createNewConversation,
  } = useChatState()

  return (
    <motion.div
      className="md:hidden mb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {activePDF ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-purple-600" />
                <span className="truncate">{activePDF.name}</span>
              </div>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[280px]">
            <DropdownMenuItem
              onClick={() => {
                if (activePDF) {
                  createNewConversation(activePDF.id, activePDF.name)
                }
              }}
              className="cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span>New Chat with Current PDF</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <MessageSquare className="h-4 w-4 mr-2" />
                <span>Conversations</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {conversations
                    .filter((conv) => conv.pdfId === activePDF.id)
                    .map((conv) => (
                      <DropdownMenuItem
                        key={conv.id}
                        onClick={() => setActiveConversation(conv)}
                        className={`cursor-pointer ${activeConversation?.id === conv.id ? "bg-purple-50" : ""}`}
                      >
                        <div className="flex flex-col">
                          <span className="truncate">
                            {conv.messages.find((m) => m.role === "user")?.content.slice(0, 25) || conv.title}
                          </span>
                          <span className="text-xs text-gray-500">{new Date(conv.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <FileText className="h-4 w-4 mr-2" />
                <span>Your PDFs</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {uploadedPDFs.map((pdf) => (
                    <DropdownMenuItem
                      key={pdf.id}
                      onClick={() => {
                        setActivePDF(pdf)

                        // Set the most recent conversation for this PDF as active
                        const pdfConversations = conversations
                          .filter((conv) => conv.pdfId === pdf.id)
                          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

                        if (pdfConversations.length > 0) {
                          setActiveConversation(pdfConversations[0])
                        } else {
                          createNewConversation(pdf.id, pdf.name)
                        }
                      }}
                      className={`cursor-pointer ${activePDF.id === pdf.id ? "bg-purple-50" : ""}`}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      <span className="truncate">{pdf.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={onUploadClick} className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              <span>Upload New PDF</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="default"
          onClick={onUploadClick}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload PDF
        </Button>
      )}
    </motion.div>
  )
}

