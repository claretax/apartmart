"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface DatabaseContextType {
  isDummyMode: boolean
  connectionStatus: "connected" | "disconnected" | "checking"
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined)

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  // Demo mode disabled: always use real mode
  const [isDummyMode] = useState(false)
  const [connectionStatus] = useState<"connected" | "disconnected" | "checking">("connected")

  return <DatabaseContext.Provider value={{ isDummyMode, connectionStatus }}>{children}</DatabaseContext.Provider>
}

export function useDatabase() {
  const context = useContext(DatabaseContext)
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider")
  }
  return context
}
