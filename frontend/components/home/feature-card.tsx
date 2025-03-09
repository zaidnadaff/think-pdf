"use client"

import type React from "react"

import { motion } from "framer-motion"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  delay: number
}

export function FeatureCard({ icon, title, description, color, delay }: FeatureCardProps) {
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

