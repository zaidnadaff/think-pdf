"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedGradientBackground } from "@/components/ui/animated-gradient-background"

interface AuthCardProps {
  title: string
  description: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 relative">
      {/* Background */}
      <AnimatedGradientBackground />

      <div className="w-full max-w-md p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-none shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
              <CardDescription className="text-center">{description}</CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
            {footer && <CardFooter className="flex flex-col space-y-4">{footer}</CardFooter>}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

