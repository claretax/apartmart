import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { type User, sanitizeUser } from "@/lib/models/user"
import { verifyPassword, generateToken, getCurrentUser } from "@/lib/auth"

// GET - Check authentication status
export async function GET() {
  try {
    const authResult = await getCurrentUser()

    if (!authResult.authenticated) {
      return NextResponse.json({ success: true, authenticated: false })
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: authResult.user,
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ success: false, message: "Authentication check failed" }, { status: 500 })
  }
}

// POST - Login
export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ success: false, message: "Username and password are required" }, { status: 400 })
    }

    const db = await getDatabase()
    const user = await db.collection<User>("users").findOne({ username })

    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid username or password" }, { status: 401 })
    }

    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ success: false, message: "Invalid username or password" }, { status: 401 })
    }

    if (user.status !== "active") {
      return NextResponse.json({ success: false, message: "Account is inactive" }, { status: 401 })
    }

    // Generate JWT token
    const token = generateToken(user._id!.toString())

    // Set cookie
    const response = NextResponse.json({
      success: true,
      user: sanitizeUser(user),
    })

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Login failed" }, { status: 500 })
  }
}

// DELETE - Logout
export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete("auth_token")
  return response
}
