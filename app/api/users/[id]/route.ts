import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Mock users database (same as in the main users route)
const users = [
  {
    id: "user-1",
    username: "demo",
    email: "demo@apartmart.com",
    password: "demo123", // In a real app, this would be hashed
    role: "resident",
    apartmentDetails: {
      tower: "A",
      floor: "5",
      flatNumber: "502",
    },
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "user-2",
    username: "agent",
    email: "agent@apartmart.com",
    password: "agent123",
    role: "agent",
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "user-3",
    username: "admin",
    email: "admin@apartmart.com",
    password: "admin123",
    role: "admin",
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "user-4",
    username: "john",
    email: "john@example.com",
    password: "john123",
    role: "resident",
    apartmentDetails: {
      tower: "B",
      floor: "3",
      flatNumber: "301",
    },
    status: "active",
    createdAt: "2024-01-05",
  },
]

// Helper function to check authentication and role
async function checkAuth(requiredRoles: string[] = []) {
  const authToken = cookies().get("auth_token")?.value

  if (!authToken) {
    return { authenticated: false }
  }

  // In a real app, you would verify the token with your auth system
  const userId = authToken.replace("token_", "")

  const user = users.find((u) => u.id === userId)

  if (!user) {
    return { authenticated: false }
  }

  // Check if user has required role
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return { authenticated: true, authorized: false, user }
  }

  return { authenticated: true, authorized: true, user }
}

// GET a specific user (admin or self)
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const auth = await checkAuth()

  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: "Unauthenticated" }, { status: 401 })
  }

  const userId = params.id

  // Only allow admins or the user themselves to access user details
  if (auth.user.role !== "admin" && auth.user.id !== userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
  }

  const user = users.find((u) => u.id === userId)

  if (!user) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
  }

  // Return user without password
  const { password, ...userWithoutPassword } = user

  return NextResponse.json({ success: true, user: userWithoutPassword })
}

// PUT (update) a user (admin only, or self for limited fields)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const auth = await checkAuth()

  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: "Unauthenticated" }, { status: 401 })
  }

  const userId = params.id
  const userIndex = users.findIndex((u) => u.id === userId)

  if (userIndex === -1) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
  }

  // Only allow admins or the user themselves to update user details
  if (auth.user.role !== "admin" && auth.user.id !== userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
  }

  try {
    const body = await request.json()

    // Non-admins can only update certain fields
    if (auth.user.role !== "admin") {
      const allowedFields = ["password", "apartmentDetails"]
      Object.keys(body).forEach((key) => {
        if (!allowedFields.includes(key)) {
          delete body[key]
        }
      })
    }

    // Update user
    const updatedUser = {
      ...users[userIndex],
      ...body,
    }

    // In a real app, you would update the database here
    users[userIndex] = updatedUser

    // Return user without password
    const { password, ...userWithoutPassword } = updatedUser

    return NextResponse.json({ success: true, user: userWithoutPassword })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ success: false, message: "Failed to update user" }, { status: 500 })
  }
}

// DELETE a user (admin only)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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

  const userId = params.id
  const userIndex = users.findIndex((u) => u.id === userId)

  if (userIndex === -1) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
  }

  // In a real app, you might soft delete instead
  const deletedUser = users.splice(userIndex, 1)[0]

  // Return user without password
  const { password, ...userWithoutPassword } = deletedUser

  return NextResponse.json({ success: true, user: userWithoutPassword })
}
