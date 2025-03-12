"use client";

// import type React from "react"

// import { useState } from "react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Loader2 } from "lucide-react"
// import { motion } from "framer-motion"
// import { AuthCard } from "@/components/auth/auth-card"

// export default function LoginPage() {
//   const router = useRouter()
//   const [isLoading, setIsLoading] = useState(false)
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState("")

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError("")
//     setIsLoading(true)

//     // Simulate login - in a real app, you would call your auth API
//     try {
//       // Mock successful login
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       // In a real app, you would store the auth token
//       // localStorage.setItem("token", "your-auth-token");

//       router.push("/chat")
//     } catch (err) {
//       setError("Invalid email or password. Please try again.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const formVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   }

//   const itemVariants = {
//     hidden: { opacity: 0, y: 10 },
//     visible: { opacity: 1, y: 0 },
//   }

//   return (
//     <AuthCard
//       title="Welcome back"
//       description="Enter your email and password to access your account"
//       footer={
//         <div className="text-sm text-center text-gray-500">
//           Don&apos;t have an account?{" "}
//           <Link href="/register" className="text-purple-600 hover:underline font-medium">
//             Sign up
//           </Link>
//         </div>
//       }
//     >
//       <motion.form
//         onSubmit={handleSubmit}
//         className="space-y-4"
//         variants={formVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         {error && (
//           <motion.div
//             className="p-3 text-sm bg-red-50 text-red-500 border border-red-200 rounded-md"
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//           >
//             {error}
//           </motion.div>
//         )}

//         <motion.div className="space-y-2" variants={itemVariants}>
//           <Label htmlFor="email">Email</Label>
//           <Input
//             id="email"
//             type="email"
//             placeholder="name@example.com"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="transition-all focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//           />
//         </motion.div>

//         <motion.div className="space-y-2" variants={itemVariants}>
//           <div className="flex items-center justify-between">
//             <Label htmlFor="password">Password</Label>
//             <Link href="/forgot-password" className="text-sm text-purple-600 hover:underline">
//               Forgot password?
//             </Link>
//           </div>
//           <Input
//             id="password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="transition-all focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//           />
//         </motion.div>

//         <motion.div variants={itemVariants}>
//           <Button
//             type="submit"
//             className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Signing in...
//               </>
//             ) : (
//               "Sign in"
//             )}
//           </Button>
//         </motion.div>
//       </motion.form>
//     </AuthCard>
//   )
// }

// app/login/page.tsx
// 'use client';

import { useState, FormEvent, JSX } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LoginCredentials } from "@/types/auth";

export default function LoginPage(): JSX.Element {
  const { login, isLoading } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");

    const result = await login(credentials);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
