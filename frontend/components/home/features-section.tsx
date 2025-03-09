"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Upload, FileText, MessageSquare } from "lucide-react"
import { FeatureCard } from "./feature-card"

export function FeaturesSection({ featuresRef }: { featuresRef: React.RefObject<HTMLDivElement> }) {
  return (
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
  )
}

