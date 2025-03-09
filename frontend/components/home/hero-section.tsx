"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, ChevronDown, MessageSquare, FileText, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedGradientBackground } from "@/components/ui/animated-gradient-background"

export function HeroSection({ scrollToFeatures }: { scrollToFeatures: () => void }) {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50 to-white -z-10"></div>

      {/* Animated background shapes */}
      <AnimatedGradientBackground />

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8">
          <motion.div
            className="md:w-1/2 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm font-medium mb-2">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center"
              >
                <Sparkles className="h-4 w-4 mr-1" /> AI-Powered PDF Chat
              </motion.span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Chat with your PDF documents
            </h1>
            <p className="text-xl text-gray-600">
              Upload your PDFs and get instant answers from our AI assistant. No more scrolling through pages to find
              information.
            </p>
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white border-0"
              >
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative">
              {/* Chat UI Mockup */}
              <div className="bg-white rounded-xl p-4 shadow-xl border border-gray-100 relative z-10">
                <div className="flex items-center justify-between border-b pb-3 mb-3">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm text-gray-500">PDF Chat</span>
                  </div>
                </div>

                <div className="space-y-3 mb-3">
                  <motion.div
                    className="flex justify-end"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="bg-purple-600 text-white rounded-lg rounded-tr-none p-3 max-w-[80%]">
                      What are the key findings in this research paper?
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <div className="bg-gray-100 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                      >
                        Based on the research paper, the key findings are:
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>73% improvement in data processing efficiency</li>
                          <li>Reduction in error rates by 42% compared to previous methods</li>
                          <li>Cost savings of approximately $1.2M annually</li>
                        </ul>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                <div className="flex items-center gap-2 border-t pt-3">
                  <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-400">
                    Ask another question...
                  </div>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full h-8 w-8 p-0">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-br from-purple-200 to-blue-200 rounded-xl -z-10"></div>
              <motion.div
                className="absolute -top-6 -left-6 w-12 h-12 bg-purple-100 rounded-lg z-20 flex items-center justify-center"
                animate={{
                  rotate: [0, 10, 0, -10, 0],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 5,
                  ease: "easeInOut",
                }}
              >
                <FileText className="h-6 w-6 text-purple-600" />
              </motion.div>
              <motion.div
                className="absolute -bottom-6 -right-6 w-12 h-12 bg-blue-100 rounded-lg z-20 flex items-center justify-center"
                animate={{
                  rotate: [0, -10, 0, 10, 0],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 5,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center text-gray-500 hover:text-purple-600 hover:bg-transparent"
            onClick={scrollToFeatures}
          >
            <span className="text-sm mb-1">Learn more</span>
            <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
              <ChevronDown className="h-5 w-5" />
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

