"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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
          description: "Welcome back!",
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
        title: "Login failed",
        description: "An error occurred during login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/products" className="inline-flex items-center text-white/70 hover:text-white mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
            ApartMart
          </h1>
          <p className="text-white/60 mt-2">Sign in to your account</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="backdrop-blur-xl bg-white/10 border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Welcome Back</CardTitle>
              <CardDescription className="text-white/60">Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white/70">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="bg-white/10 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-500"
                    required
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
                      placeholder="Enter your password"
                      className="bg-white/10 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-500 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-white/40 hover:text-white/60"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="text-sm font-medium text-white/80 mb-3">Demo Credentials:</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Resident:</span>
                    <div className="flex space-x-2">
                      <Badge className="bg-blue-500/20 text-blue-300 border-0">demo / demo123</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Agent:</span>
                    <div className="flex space-x-2">
                      <Badge className="bg-purple-500/20 text-purple-300 border-0">agent / agent123</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Admin:</span>
                    <div className="flex space-x-2">
                      <Badge className="bg-red-500/20 text-red-300 border-0">admin / admin123</Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <span className="text-white/60">Don't have an account?</span>
                  <a href="/auth/signup" className="ml-2 text-emerald-300 hover:underline">Sign Up</a>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}