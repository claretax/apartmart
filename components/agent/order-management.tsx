"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Package, Truck, CheckCircle, Clock, AlertTriangle, Search, Filter, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

const statusColors = {
  pending: "bg-amber-500/20 text-amber-300",
  processing: "bg-blue-500/20 text-blue-300",
  shipped: "bg-purple-500/20 text-purple-300",
  delivered: "bg-emerald-500/20 text-emerald-300",
  cancelled: "bg-red-500/20 text-red-300",
}

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [processingOrder, setProcessingOrder] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchQuery, statusFilter])

  const fetchOrders = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/orders")

      if (response.status === 401) {
        // Redirect to login if unauthenticated
        window.location.href = "/auth/login"
        return
      }

      const data = await response.json()

      if (data.success) {
        setOrders(data.orders)
      } else {
        console.error("Failed to fetch orders:", data.message)
        toast({
          title: "Error",
          description: data.message || "Failed to fetch orders",
          variant: "destructive",
        })
        setOrders([])
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Error",
        description: "An error occurred while fetching orders",
        variant: "destructive",
      })
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = [...orders]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.deliveryAddress.toLowerCase().includes(query) ||
          order.items.some((item) => item.name.toLowerCase().includes(query)),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setProcessingOrder(orderId)

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (data.success) {
        // Update local state
        setOrders((prev) => prev.map((order) => (order.id === orderId ? data.order : order)))

        toast({
          title: "Order updated",
          description: `Order ${orderId} status changed to ${newStatus}`,
        })
      } else {
        toast({
          title: "Update failed",
          description: data.message || "Failed to update order status",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating order:", error)
      toast({
        title: "Update failed",
        description: "An error occurred while updating the order",
        variant: "destructive",
      })
    } finally {
      setProcessingOrder(null)
    }
  }

  return (
    <Card className="backdrop-blur-xl bg-white/10 border-white/10 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white">Order Management</CardTitle>
        <CardDescription className="text-white/60">Process and manage customer orders</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-white/10 border-white/10 text-white focus:border-cyan-500">
              <Filter className="h-4 w-4 mr-2 text-white/60" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/10 text-white">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <div className="rounded-xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="hover:bg-white/5 border-white/10">
                <TableHead className="text-white/60">Order ID</TableHead>
                <TableHead className="text-white/60">Items</TableHead>
                <TableHead className="text-white/60">Total</TableHead>
                <TableHead className="text-white/60">Status</TableHead>
                <TableHead className="text-white/60">Address</TableHead>
                <TableHead className="text-white/60">Date</TableHead>
                <TableHead className="text-right text-white/60">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-white/5 border-white/10">
                    <TableCell>
                      <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredOrders.length === 0 ? (
                <TableRow className="hover:bg-white/5 border-white/10">
                  <TableCell colSpan={7} className="text-center py-8 text-white/60">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => {
                  const StatusIcon = statusIcons[order.status]

                  return (
                    <TableRow key={order.id} className="hover:bg-white/5 border-white/10">
                      <TableCell className="font-medium text-white">{order.id}</TableCell>
                      <TableCell>
                        <div className="text-white/80">
                          {order.items.length} {order.items.length === 1 ? "item" : "items"}
                          <div className="text-xs text-white/60 truncate max-w-[150px]">
                            {order.items.map((item) => item.name).join(", ")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-white">₹{order.total.toLocaleString("en-IN")}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`border-0 ${statusColors[order.status]} flex items-center gap-1 w-fit`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white/80 max-w-[150px] truncate">{order.deliveryAddress}</TableCell>
                      <TableCell className="text-white/80">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {order.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, "processing")}
                              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0"
                              disabled={processingOrder === order.id}
                            >
                              {processingOrder === order.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Accept"}
                            </Button>
                          )}

                          {order.status === "processing" && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, "shipped")}
                              className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white border-0"
                              disabled={processingOrder === order.id}
                            >
                              {processingOrder === order.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Ship"}
                            </Button>
                          )}

                          {order.status === "shipped" && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, "delivered")}
                              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0"
                              disabled={processingOrder === order.id}
                            >
                              {processingOrder === order.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Deliver"}
                            </Button>
                          )}

                          {(order.status === "pending" || order.status === "processing") && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateOrderStatus(order.id, "cancelled")}
                              className="bg-white/10 border-white/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                              disabled={processingOrder === order.id}
                            >
                              {processingOrder === order.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Cancel"}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
