"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { AgentDashboard } from "@/components/dashboard/agent-dashboard"
import { Loader2 } from "lucide-react"

export default function AgentPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/auth/login")
      } else if (user.role !== "agent") {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400 mx-auto mb-4" />
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "agent") {
    return null
  }

  return <AgentDashboard />
}
