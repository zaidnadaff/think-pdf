"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { FileText, Upload } from "lucide-react"
import { useChatState } from "./chat-state-provider"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"

interface PDFTabsProps {
  onUploadClick: () => void
}

export function PDFTabs({ onUploadClick }: PDFTabsProps) {
  const { documents, activeDocument, setActiveDocument } = useChatState()
  const { toast } = useToast()

  const handleDocumentSelect = (docId: string) => {
    const doc = documents.find((d) => d.id === docId)
    if (doc) {
      setActiveDocument(doc)
      toast({
        title: "Document selected",
        description: `Now viewing "${doc.name}"`,
      })
    }
  }

  if (!documents || documents.length === 0) {
    return null
  }

  return (
    <div className="border-b border-gray-200 bg-white">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex items-center p-2">
          {documents.map((doc) => (
            <motion.div key={doc.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mr-2">
              <Button
                variant={activeDocument?.id === doc.id ? "secondary" : "outline"}
                className={`h-9 px-3 flex items-center gap-2 ${
                  activeDocument?.id === doc.id ? "bg-purple-100 text-purple-700 border-purple-200" : ""
                }`}
                onClick={() => handleDocumentSelect(doc.id)}
              >
                <FileText className="h-4 w-4" />
                <span className="max-w-[120px] truncate">{doc.name}</span>
                <span className="text-xs text-gray-500 ml-1">
                  {formatDistanceToNow(new Date(doc.uploadedAt), { addSuffix: true })}
                </span>
              </Button>
            </motion.div>
          ))}
          <Button variant="ghost" size="sm" className="h-9 px-3 flex-shrink-0" onClick={onUploadClick}>
            <Upload className="h-4 w-4 mr-2" />
            Upload PDF
          </Button>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

