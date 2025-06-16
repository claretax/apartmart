"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface DatabaseContextType {
  isDummyMode: boolean
  connectionStatus: "connected" | "disconnected" | "checking"
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined)

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [isDummyMode, setIsDummyMode] = useState(true) // Default to dummy mode for demo
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "checking">("checking")

  useEffect(() => {
    // Simulate database connection check
    const checkConnection = async () => {
      setConnectionStatus("checking")

      try {
        // Simulate connection attempt
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // For demo purposes, we'll stay in dummy mode
        // In real implementation, this would check actual database connectivity
        setIsDummyMode(true)
        setConnectionStatus("disconnected")
      } catch (error) {
        setIsDummyMode(true)
        setConnectionStatus("disconnected")
      }
    }

    checkConnection()
  }, [])

  return <DatabaseContext.Provider value={{ isDummyMode, connectionStatus }}>{children}</DatabaseContext.Provider>
}

export function useDatabase() {
  const context = useContext(DatabaseContext)
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider")
  }
  return context
}
