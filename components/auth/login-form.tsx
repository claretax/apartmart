"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(username, password)
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome to ApartMart!",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-2">
        <Label htmlFor="username" className="text-white/70">
          Username
        </Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="Enter your username"
          className="bg-white/10 border-white/10 text-white placeholder:text-white/30 focus:border-pink-500 backdrop-blur-xl"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-white/70">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            className="bg-white/10 border-white/10 text-white placeholder:text-white/30 focus:border-pink-500 backdrop-blur-xl pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 text-white/50 hover:text-white hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white border-0 shadow-lg shadow-pink-500/20"
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign In
      </Button>

      <motion.div
        className="text-sm text-white/60 space-y-1 p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <p className="font-medium text-white/80">
          <strong>Demo Accounts:</strong>
        </p>
        <p>
          Resident: <code className="bg-white/10 px-1 rounded text-emerald-300">demo</code> /{" "}
          <code className="bg-white/10 px-1 rounded text-emerald-300">demo123</code>
        </p>
        <p>
          Agent: <code className="bg-white/10 px-1 rounded text-cyan-300">agent</code> /{" "}
          <code className="bg-white/10 px-1 rounded text-cyan-300">agent123</code>
        </p>
        <p>
          Admin: <code className="bg-white/10 px-1 rounded text-violet-300">admin</code> /{" "}
          <code className="bg-white/10 px-1 rounded text-violet-300">admin123</code>
        </p>
      </motion.div>
    </motion.form>
  )
}
