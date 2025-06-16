"use client"

import { useDatabase } from "@/components/providers/database-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Wifi } from "lucide-react"
import { motion } from "framer-motion"

export function DatabaseStatus() {
  const { isDummyMode, connectionStatus } = useDatabase()

  if (connectionStatus === "checking") {
    return (
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Alert className="backdrop-blur-xl bg-white/10 border-white/10 text-white">
          <Wifi className="h-4 w-4 text-white/70" />
          <AlertDescription className="text-white/80">Checking database connection...</AlertDescription>
        </Alert>
      </motion.div>
    )
  }

  if (isDummyMode) {
    return (
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Alert className="backdrop-blur-xl bg-amber-500/10 border-amber-500/20 text-white">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <AlertDescription className="text-amber-200">
            <strong>Demo Mode Active</strong> - Using sample data. Login with username:{" "}
            <code className="bg-amber-400/20 px-1 rounded text-amber-300">demo</code> and password:{" "}
            <code className="bg-amber-400/20 px-1 rounded text-amber-300">demo123</code>
          </AlertDescription>
        </Alert>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Alert className="backdrop-blur-xl bg-emerald-500/10 border-emerald-500/20 text-white">
        <Wifi className="h-4 w-4 text-emerald-400" />
        <AlertDescription className="text-emerald-200">Connected to live database</AlertDescription>
      </Alert>
    </motion.div>
  )
}
