import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Mock orders database (same as in the main orders route)
const orders = [
  {
    id: "order-1",
    userId: "user-1",
    items: [
      { productId: "prod-1", name: "Unicorn Stationery Set", quantity: 2, price: 899 },
      { productId: "prod-7", name: "Gel Pens Set", quantity: 1, price: 299 },
      { productId: "prod-5", name: "Office Essentials Kit", quantity: 1, price: 999 },
    ],
    total: 2299,
    status: "delivered",
    deliveryAddress: "Tower A, Floor 5, Flat 502",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-18",
    agentId: "user-2",
  },
  {
    id: "order-2",
    userId: "user-1",
    items: [
      { productId: "prod-2", name: "Executive Stationery Kit", quantity: 1, price: 1299 },
      { productId: "prod-7", name: "Gel Pens Set", quantity: 2, price: 299 },
    ],
    total: 1499,
    status: "shipped",
    deliveryAddress: "Tower A, Floor 5, Flat 502",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-21",
    agentId: "user-2",
  },
  {
    id: "order-3",
    userId: "user-4",
    items: [
      { productId: "prod-6", name: "Bluetooth Speaker", quantity: 1, price: 2499 },
      { productId: "prod-4", name: "Premium Notebook Set", quantity: 1, price: 799 },
    ],
    total: 3298,
    status: "pending",
    deliveryAddress: "Tower B, Floor 3, Flat 301",
    createdAt: "2024-01-22",
    updatedAt: "2024-01-22",
    agentId: null,
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

  // Mock user lookup
  const users = [
    { id: "user-1", role: "resident" },
    { id: "user-2", role: "agent" },
    { id: "user-3", role: "admin" },
    { id: "user-4", role: "resident" },
  ]

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

// GET a specific order
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const auth = await checkAuth()

  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: "Unauthenticated" }, { status: 401 })
  }

  const orderId = params.id
  const order = orders.find((o) => o.id === orderId)

  if (!order) {
    return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
  }

  // Check if user has access to this order
  if (auth.user.role === "resident" && order.userId !== auth.user.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
  }

  if (auth.user.role === "agent" && order.agentId !== auth.user.id && order.status !== "pending") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
  }

  return NextResponse.json({ success: true, order })
}

// PUT (update) an order status (agent or admin only)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const auth = await checkAuth(["agent", "admin"])

  if (!auth.authenticated || !auth.authorized) {
    return NextResponse.json(
      {
        success: false,
        message: !auth.authenticated ? "Unauthenticated" : "Unauthorized",
      },
      { status: !auth.authenticated ? 401 : 403 },
    )
  }

  const orderId = params.id
  const orderIndex = orders.findIndex((o) => o.id === orderId)

  if (orderIndex === -1) {
    return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
  }

  try {
    const body = await request.json()

    // Validate status
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid status",
        },
        { status: 400 },
      )
    }

    // Update order
    const updatedOrder = {
      ...orders[orderIndex],
      ...body,
      updatedAt: new Date().toISOString().split("T")[0],
    }

    // If agent is accepting the order, assign themselves
    if (auth.user.role === "agent" && body.status === "processing" && !updatedOrder.agentId) {
      updatedOrder.agentId = auth.user.id
    }

    // In a real app, you would update the database here
    orders[orderIndex] = updatedOrder

    return NextResponse.json({ success: true, order: updatedOrder })
  } catch (error) {
    console.error("Update order error:", error)
    return NextResponse.json({ success: false, message: "Failed to update order" }, { status: 500 })
  }
}
