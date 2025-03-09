"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { FileText, Upload } from "lucide-react"

interface PDFFile {
  id: string
  file: File
  name: string
  size: number
  uploadedAt: Date
}

interface UploadSectionProps {
  uploadedPDFs: PDFFile[]
  activePDF: PDFFile | null
  fileInputRef: React.RefObject<HTMLInputElement>
  onPDFSelect: (pdf: PDFFile) => void
  onStartChat: () => void
}

export function UploadSection({ uploadedPDFs, activePDF, fileInputRef, onPDFSelect, onStartChat }: UploadSectionProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <motion.div
        className="max-w-md w-full space-y-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FileText className="h-16 w-16 mx-auto text-purple-600" />
        </motion.div>
        <h2 className="text-2xl font-bold">Upload a PDF Document</h2>
        <p className="text-gray-500">
          Upload a PDF file to chat with it. Our AI will analyze the content and answer your questions.
        </p>

        <motion.div
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-purple-500 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          whileHover={{ scale: 1.02, borderColor: "rgba(147, 51, 234, 0.5)" }}
          whileTap={{ scale: 0.98 }}
        >
          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-4" />
          <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-400 mt-1">PDF files up to 10MB</p>
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              /* handled in parent component */
            }}
            accept=".pdf"
            ref={fileInputRef}
            multiple
          />
        </motion.div>

        {uploadedPDFs.length > 0 && (
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-medium">Your PDFs:</h3>
            <div className="max-h-[200px] overflow-y-auto space-y-2">
              {uploadedPDFs.map((pdf, index) => (
                <motion.div
                  key={pdf.id}
                  className={`flex items-center p-2 rounded cursor-pointer ${
                    activePDF?.id === pdf.id ? "bg-purple-100 border border-purple-200" : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => onPDFSelect(pdf)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                >
                  <FileText
                    className={`h-4 w-4 mr-2 ${activePDF?.id === pdf.id ? "text-purple-600" : "text-gray-500"}`}
                  />
                  <span className="text-sm truncate flex-1">{pdf.name}</span>
                  <span className="text-xs text-gray-500">{(pdf.size / 1024 / 1024).toFixed(2)} MB</span>
                </motion.div>
              ))}
            </div>

            {activePDF && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <Button
                  className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
                  onClick={onStartChat}
                >
                  Chat with {activePDF.name.length > 20 ? `${activePDF.name.substring(0, 20)}...` : activePDF.name}
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

