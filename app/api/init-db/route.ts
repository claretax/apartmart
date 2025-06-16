import { NextResponse } from "next/server"
import initializeDatabase from "@/scripts/init-db"

export async function POST() {
  try {
    await initializeDatabase()
    return NextResponse.json({ success: true, message: "Database initialized successfully" })
  } catch (error) {
    console.error("Database initialization error:", error)
    return NextResponse.json({ success: false, message: "Failed to initialize database" }, { status: 500 })
  }
}
