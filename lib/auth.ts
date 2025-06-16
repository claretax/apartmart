import { cookies } from "next/headers"
import { getDatabase } from "./mongodb"
import { type User, sanitizeUser } from "./models/user"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface AuthResult {
  authenticated: boolean
  authorized?: boolean
  user?: any
  error?: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<AuthResult> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return { authenticated: false }
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return { authenticated: false }
    }

    const db = await getDatabase()
    const user = await db.collection<User>("users").findOne({ _id: new ObjectId(decoded.userId) })

    if (!user) {
      return { authenticated: false }
    }

    return {
      authenticated: true,
      authorized: true,
      user: sanitizeUser(user),
    }
  } catch (error) {
    console.error("Auth error:", error)
    return { authenticated: false, error: "Authentication failed" }
  }
}

export async function checkAuth(requiredRoles: string[] = []): Promise<AuthResult> {
  const authResult = await getCurrentUser()

  if (!authResult.authenticated) {
    return authResult
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(authResult.user.role)) {
    return {
      authenticated: true,
      authorized: false,
      user: authResult.user,
      error: "Insufficient permissions",
    }
  }

  return {
    authenticated: true,
    authorized: true,
    user: authResult.user,
  }
}
