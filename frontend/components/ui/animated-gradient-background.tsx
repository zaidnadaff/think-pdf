"use client"

import { motion } from "framer-motion"

export function AnimatedGradientBackground() {
  return (
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
  )
}

