import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { AuthResult, getCurrentUser } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { sanitizeOrder } from "@/lib/models/order"


// Helper function to check authentication and role
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
// GET a specific order
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const auth = await checkAuth()

  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: "Unauthenticated" }, { status: 401 })
  }

  const orderId = params.id
  let order = null
  try {
    const db = await getDatabase()
    order = await db.collection("orders").findOne({ _id: new ObjectId(orderId) })
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
    }
  } catch (e) {
    return NextResponse.json({ success: false, message: "Invalid order ID" }, { status: 400 })
  }

  // Check if user has access to this order
  if (auth.user.role === "resident" && order.userId !== auth.user.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
  }

  if (auth.user.role === "agent" && order.agentId !== auth.user.id && order.status !== "pending") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
  }

  return NextResponse.json({ success: true, order: sanitizeOrder(order) })
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
  let order = null
  try {
    const db = await getDatabase()
    order = await db.collection("orders").findOne({ _id: new ObjectId(orderId) })
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
    }

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

    // Prepare update
    const updateDoc: any = {
      ...body,
      updatedAt: new Date(),
    }
    // If agent is accepting the order, assign themselves
    if (auth.user.role === "agent" && body.status === "processing" && !order.agentId) {
      updateDoc.agentId = auth.user.id
    }

    await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      { $set: updateDoc }
    )

    // Fetch the updated order
    const updatedOrder = await db.collection("orders").findOne({ _id: new ObjectId(orderId) })
    return NextResponse.json({ success: true, order: sanitizeOrder(updatedOrder) })
  } catch (error) {
    console.error("Update order error:", error)
    return NextResponse.json({ success: false, message: "Failed to update order" }, { status: 500 })
  }
}
