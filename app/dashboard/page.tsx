"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { ResidentDashboard } from "@/components/dashboard/resident-dashboard"
import { MainLayout } from "@/components/layout/main-layout"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/auth/login")
      } else {
        // Redirect based on role
        switch (user.role) {
          case "admin":
            router.push("/admin")
            break
          case "agent":
            router.push("/agent")
            break
          case "resident":
            // Stay on dashboard for residents
            break
          default:
            router.push("/products")
        }
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400 mx-auto mb-4" />
            <p className="text-white/60">Loading...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!user || user.role !== "resident") {
    return null
  }

  return (
    <MainLayout>
      <ResidentDashboard />
    </MainLayout>
  )
}
