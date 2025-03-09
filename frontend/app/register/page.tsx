"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { AuthCard } from "@/components/auth/auth-card"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate registration - in a real app, you would call your auth API
    try {
      // Mock successful registration
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would store the auth token
      // localStorage.setItem("token", "your-auth-token");

      router.push("/chat")
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <AuthCard
      title="Create an account"
      description="Enter your details to create your account"
      footer={
        <div className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-600 hover:underline font-medium">
            Sign in
          </Link>
        </div>
      }
    >
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        {error && (
          <motion.div
            className="p-3 text-sm bg-red-50 text-red-500 border border-red-200 rounded-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {error}
          </motion.div>
        )}

        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="transition-all focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="transition-all focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="transition-all focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
        </motion.div>

        <motion.div className="flex items-center space-x-2" variants={itemVariants}>
          <Checkbox id="terms" required />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{" "}
            <Link href="/terms" className="text-purple-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-purple-600 hover:underline">
              Privacy Policy
            </Link>
          </label>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </motion.div>
      </motion.form>
    </AuthCard>
  )
}

