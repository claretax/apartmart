import type { ObjectId } from "mongodb"

export interface OrderItem {
  productId: string
  name: string
  quantity: number
  price: number
}

export interface Order {
  _id?: ObjectId
  id?: string
  userId: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  deliveryAddress: string
  createdAt: Date
  updatedAt: Date
  agentId?: string
}

export interface PublicOrder {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  deliveryAddress: string
  createdAt: string
  updatedAt: string
  agentId?: string
}

export function sanitizeOrder(order: Order): PublicOrder {
  return {
    id: order._id?.toString() || order.id || "",
    userId: order.userId,
    items: order.items,
    total: order.total,
    status: order.status,
    deliveryAddress: order.deliveryAddress,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    agentId: order.agentId,
  }
}
