import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { type Order, sanitizeOrder } from "@/lib/models/order"
import { checkAuth } from "@/lib/auth"

// GET orders (filtered by role)
export async function GET(request: Request) {
  try {
    const auth = await checkAuth()

    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: "Unauthenticated" }, { status: 401 })
    }

    const db = await getDatabase()
    const query: any = {}

    // Filter orders based on user role
    switch (auth.user.role) {
      case "resident":
        // Residents can only see their own orders
        query.userId = auth.user.id
        break
      case "agent":
        // Agents can see orders assigned to them and pending orders
        query.$or = [{ agentId: auth.user.id }, { status: "pending" }, { status: "processing" }]
        break
      case "admin":
        // Admins can see all orders
        break
      default:
        return NextResponse.json({ success: false, message: "Invalid role" }, { status: 403 })
    }

    const orders = await db.collection<Order>("orders").find(query).sort({ createdAt: -1 }).toArray()

    const sanitizedOrders = orders.map(sanitizeOrder)

    return NextResponse.json({ success: true, orders: sanitizedOrders })
  } catch (error) {
    console.error("Get orders error:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch orders" }, { status: 500 })
  }
}

// POST a new order (residents only)
export async function POST(request: Request) {
  try {
    const auth = await checkAuth(["resident"])

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
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ success: false, message: "Order must contain items" }, { status: 400 })
    }

    if (!body.total || !body.deliveryAddress) {
      return NextResponse.json({ success: false, message: "Total and delivery address are required" }, { status: 400 })
    }

    const db = await getDatabase()
    const now = new Date()

    const newOrder: Omit<Order, "_id"> = {
      userId: auth.user.id,
      items: body.items,
      total: body.total,
      status: "pending",
      deliveryAddress: body.deliveryAddress,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection<Order>("orders").insertOne(newOrder)
    const createdOrder = await db.collection<Order>("orders").findOne({ _id: result.insertedId })

    if (!createdOrder) {
      return NextResponse.json({ success: false, message: "Failed to create order" }, { status: 500 })
    }

    return NextResponse.json({ success: true, order: sanitizeOrder(createdOrder) })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json({ success: false, message: "Failed to create order" }, { status: 500 })
  }
}
