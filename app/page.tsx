"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to public products page
    router.replace("/products")
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400 mx-auto mb-4" />
        <p className="text-white/60">Redirecting to products...</p>
      </div>
    </div>
  )
}
