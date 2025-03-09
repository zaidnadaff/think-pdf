"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { FileText, Upload, Plus } from "lucide-react"
import { useChatState, type PDFFile } from "./chat-state-provider"
import { ConversationList } from "./conversation-list"
import { useEffect } from "react"

interface PDFSidebarProps {
  onUploadClick: () => void
}

export function PDFSidebar({ onUploadClick }: PDFSidebarProps) {
  const {
    uploadedPDFs,
    activePDF,
    setActivePDF,
    createNewConversation,
    getConversationsForPDF,
    setActiveConversation,
  } = useChatState()

  const handlePDFSelect = (pdf: PDFFile) => {
    setActivePDF(pdf)
  }

  useEffect(() => {
    if (activePDF) {
      const pdfConversations = getConversationsForPDF(activePDF.id)
      if (pdfConversations.length === 0) {
        createNewConversation(activePDF.id, activePDF.name)
      } else {
        const mostRecent = pdfConversations.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )[0]
        setActiveConversation(mostRecent)
      }
    }
  }, [activePDF, createNewConversation, getConversationsForPDF, setActiveConversation])

  return (
    <motion.div
      className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200 p-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
        <Button variant="outline" className="w-full justify-start" onClick={onUploadClick}>
          <Upload className="h-4 w-4 mr-2" />
          Upload New PDF
        </Button>

        <div className="space-y-2 flex-1 overflow-hidden flex flex-col">
          <h3 className="text-sm font-medium text-gray-500">Your Documents</h3>
          <div className="flex-1 overflow-y-auto">
            {uploadedPDFs.length > 0 ? (
              <div className="space-y-1">
                {uploadedPDFs.map((pdf, index) => (
                  <motion.div
                    key={pdf.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <div className="space-y-1">
                      <Button
                        variant={activePDF?.id === pdf.id ? "secondary" : "ghost"}
                        className="w-full justify-start text-left"
                        onClick={() => handlePDFSelect(pdf)}
                      >
                        <FileText
                          className={`h-4 w-4 mr-2 ${activePDF?.id === pdf.id ? "text-purple-600" : "text-gray-500"}`}
                        />
                        <span className="truncate text-sm">{pdf.name}</span>
                      </Button>

                      {/* Show conversations for this PDF if it's active */}
                      {activePDF?.id === pdf.id && <ConversationList pdfId={pdf.id} />}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic">No documents yet</div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 mt-4">
        <Button
          variant="outline"
          className="w-full justify-center text-purple-600 border-purple-200 hover:bg-purple-50"
          onClick={() => {
            if (activePDF) {
              createNewConversation(activePDF.id, activePDF.name)
            }
          }}
          disabled={!activePDF}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>
    </motion.div>
  )
}

