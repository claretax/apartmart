import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { type User, sanitizeUser } from "@/lib/models/user"
import { checkAuth, hashPassword } from "@/lib/auth"

// GET all users (admin only)
export async function GET(request: Request) {
  try {
    const auth = await checkAuth(["admin"])

    if (!auth.authenticated || !auth.authorized) {
      return NextResponse.json(
        {
          success: false,
          message: !auth.authenticated ? "Unauthenticated" : "Unauthorized",
        },
        { status: !auth.authenticated ? 401 : 403 },
      )
    }

    const db = await getDatabase()
    const users = await db.collection<User>("users").find({}).sort({ createdAt: -1 }).toArray()

    const sanitizedUsers = users.map(sanitizeUser)

    return NextResponse.json({ success: true, users: sanitizedUsers })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch users" }, { status: 500 })
  }
}

// POST a new user (admin only)
export async function POST(request: Request) {
  try {
    const auth = await checkAuth(["admin"])

    if (!auth.authenticated || !auth.authorized) {
      return NextResponse.json(
        {
          success: false,
          message: !auth.authenticated ? "Unauthenticated" : "Unauthorized",
        },
        { status: !auth.authenticated ? 401 : 403 },
      )
    }

    const body = await request.json()

    // Validate required fields
    const requiredFields = ["username", "email", "password", "role"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, message: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const db = await getDatabase()

    // Check if username or email already exists
    const existingUser = await db.collection<User>("users").findOne({
      $or: [{ username: body.username }, { email: body.email }],
    })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: existingUser.username === body.username ? "Username already exists" : "Email already exists",
        },
        { status: 400 },
      )
    }

    const now = new Date()
    const hashedPassword = await hashPassword(body.password)

    const newUser: Omit<User, "_id"> = {
      username: body.username,
      email: body.email,
      password: hashedPassword,
      role: body.role,
      status: "active",
      apartmentDetails: body.role === "resident" ? body.apartmentDetails : undefined,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection<User>("users").insertOne(newUser)
    const createdUser = await db.collection<User>("users").findOne({ _id: result.insertedId })

    if (!createdUser) {
      return NextResponse.json({ success: false, message: "Failed to create user" }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: sanitizeUser(createdUser) })
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json({ success: false, message: "Failed to create user" }, { status: 500 })
  }
}
