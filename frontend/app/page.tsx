"use client"

import { useRef } from "react"
import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturesSection } from "@/components/home/features-section"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  const featuresRef = useRef<HTMLDivElement>(null)

  // Scroll to features section
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />
      <HeroSection scrollToFeatures={scrollToFeatures} />
      <FeaturesSection featuresRef={featuresRef} />

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

