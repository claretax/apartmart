"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Truck, CheckCircle, Clock, ChevronRight, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

interface OrderItem {
  productId: string
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  deliveryAddress: string
  createdAt: string
  updatedAt: string
  agentId: string | null
}

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: AlertTriangle,
}

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)

      try {
        const response = await fetch("/api/orders")
        const data = await response.json()

        if (data.success) {
          setOrders(data.orders)
        } else {
          console.error("Failed to fetch orders:", data.message)
          setOrders([])
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse backdrop-blur-xl bg-white/10 border-white/10 shadow-xl">
            <CardHeader>
              <div className="bg-white/10 h-4 rounded w-1/4 mb-2"></div>
              <div className="bg-white/10 h-3 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="bg-white/10 h-20 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <Card className="backdrop-blur-xl bg-white/10 border-white/10 shadow-xl">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-white/30 mb-4" />
          <p className="text-white/60">No orders found</p>
          <p className="text-white/40 text-sm mt-2">Your order history will appear here</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {orders.map((order, index) => {
        const StatusIcon = statusIcons[order.status]

        return (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="backdrop-blur-xl bg-white/10 border-white/10 shadow-xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-white">Order {order.id}</CardTitle>
                    <CardDescription className="text-white/60">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge className={`bg-white/10 backdrop-blur-md text-white border-0 flex items-center gap-1`}>
                    <StatusIcon className="w-3 h-3" />
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-white/80 text-sm">Items:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm bg-white/5 p-2 rounded-lg">
                        <span className="text-white/80">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="text-white">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <div>
                    <p className="text-sm text-white/60">Delivery Address:</p>
                    <p className="text-sm font-medium text-white/80">{order.deliveryAddress}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/60">Total:</p>
                    <p className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
                      ₹{order.total.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {order.status === "shipped" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-white/10 border-white/10 text-white hover:bg-white/20"
                  >
                    Track Package
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
