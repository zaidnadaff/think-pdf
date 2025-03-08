"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, MessageSquare, Upload, Sparkles, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const featuresRef = useRef<HTMLDivElement>(null)

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Scroll to features section
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Sticky Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              PDF Chat AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" className="hidden md:inline-flex">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white border-0"
            >
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50 to-white -z-10"></div>

        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-200 opacity-20 blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, 20, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 8,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-blue-200 opacity-20 blur-3xl"
            animate={{
              x: [0, -40, 0],
              y: [0, -30, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 10,
              ease: "easeInOut",
            }}
          />
        </div>

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

      {/* Features Section */}
      <section ref={featuresRef} className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get answers from your documents in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <FeatureCard
              icon={<Upload className="h-10 w-10 text-white" />}
              title="Upload Your PDFs"
              description="Simply upload your PDF documents to our secure platform. We support files up to 50MB."
              color="from-purple-500 to-purple-600"
              delay={0}
            />
            <FeatureCard
              icon={<FileText className="h-10 w-10 text-white" />}
              title="AI Processes Content"
              description="Our advanced AI reads and understands the content of your documents within seconds."
              color="from-blue-500 to-blue-600"
              delay={0.2}
            />
            <FeatureCard
              icon={<MessageSquare className="h-10 w-10 text-white" />}
              title="Chat & Get Answers"
              description="Ask questions in natural language and get accurate answers based on your documents."
              color="from-purple-600 to-blue-500"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">See it in action</h2>
              <p className="text-lg text-gray-600 mb-8">
                Upload any PDF document and start asking questions. Our AI understands context, can summarize content,
                and extract specific information from your documents.
              </p>
              <ul className="space-y-4">
                {[
                  "Extract key information without reading the entire document",
                  "Get summaries of long research papers or reports",
                  "Find specific data points or statistics quickly",
                  "Compare information across multiple documents",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                  >
                    <div className="mr-3 mt-1 h-5 w-5 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white text-xs">
                      ✓
                    </div>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <img src="/placeholder.svg?height=400&width=600" alt="PDF Chat Demo" className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Interactive Demo</h3>
                    <p className="mb-4">See how our AI analyzes and responds to questions about your documents</p>
                    <Button className="bg-white text-purple-600 hover:bg-gray-100">Watch Demo</Button>
                  </div>
                </div>

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[16px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What our users say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of professionals who save time with PDF Chat AI
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "This tool has completely transformed how I review research papers. What used to take hours now takes minutes.",
                author: "Sarah J.",
                role: "Research Scientist",
              },
              {
                quote:
                  "As a lawyer, I deal with hundreds of pages of documents daily. PDF Chat AI helps me find exactly what I need instantly.",
                author: "Michael T.",
                role: "Corporate Attorney",
              },
              {
                quote:
                  "The accuracy is impressive. It understands context and provides relevant information from even the most complex documents.",
                author: "Priya K.",
                role: "Data Analyst",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="mb-4 text-purple-500">{"★".repeat(5)}</div>
                <p className="mb-6 text-gray-700">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 mr-3"></div>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already saving time by chatting with their documents.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <Link href="/register">
                  Create Free Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">PDF Chat AI</h3>
              <p className="text-gray-400">AI-powered document analysis and chat interface for all your PDF needs.</p>
            </div>

            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2">
                {["Features", "Pricing", "Use Cases", "Security"].map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                {["About", "Blog", "Careers", "Contact"].map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2">
                {["Privacy", "Terms", "Cookie Policy", "Compliance"].map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© {new Date().getFullYear()} PDF Chat AI. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {["Twitter", "LinkedIn", "GitHub", "YouTube"].map((platform, i) => (
                <Link key={i} href="#" className="text-gray-400 hover:text-white transition-colors">
                  {platform}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  color,
  delay,
}: {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  delay: number
}) {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 z-10 relative h-full">
        <div
          className={`h-16 w-16 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl transform rotate-1 -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </motion.div>
  )
}

