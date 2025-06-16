"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Users, ShoppingBag, TrendingUp, DollarSign } from "lucide-react"
import { motion } from "framer-motion"

// Mock data for charts
const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 2780 },
  { name: "May", sales: 1890 },
  { name: "Jun", sales: 2390 },
  { name: "Jul", sales: 3490 },
]

const categoryData = [
  { name: "Stationery", value: 35 },
  { name: "Household", value: 25 },
  { name: "Groceries", value: 20 },
  { name: "Electronics", value: 10 },
  { name: "Personal Care", value: 10 },
]

const orderStatusData = [
  { name: "Pending", value: 5 },
  { name: "Processing", value: 10 },
  { name: "Shipped", value: 15 },
  { name: "Delivered", value: 70 },
]

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"]
const STATUS_COLORS = ["#ffc658", "#8884d8", "#82ca9d", "#0088FE"]

export function AdminDashboardOverview() {
  const [users, setUsers] = useState(0)
  const [products, setProducts] = useState(0)
  const [orders, setOrders] = useState(0)
  const [revenue, setRevenue] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // For now, we'll simulate loading and set mock data
    const fetchDashboardData = async () => {
      setLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setUsers(42)
      setProducts(156)
      setOrders(89)
      setRevenue(78450)

      setLoading(false)
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={users}
          description="Active users"
          icon={Users}
          loading={loading}
          color="from-purple-500 to-indigo-500"
        />
        <StatsCard
          title="Total Products"
          value={products}
          description="Available products"
          icon={ShoppingBag}
          loading={loading}
          color="from-cyan-500 to-blue-500"
        />
        <StatsCard
          title="Total Orders"
          value={orders}
          description="Processed orders"
          icon={TrendingUp}
          loading={loading}
          color="from-emerald-500 to-teal-500"
        />
        <StatsCard
          title="Total Revenue"
          value={`₹${revenue.toLocaleString("en-IN")}`}
          description="This month"
          icon={DollarSign}
          loading={loading}
          color="from-amber-500 to-orange-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/10 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Monthly Sales</CardTitle>
            <CardDescription className="text-white/60">Sales performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sales: {
                  label: "Sales",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="var(--color-sales)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/10 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Category Distribution</CardTitle>
            <CardDescription className="text-white/60">Sales by product category</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Order Status */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/10 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Order Status</CardTitle>
            <CardDescription className="text-white/60">Distribution of order statuses</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/10 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Top Products</CardTitle>
            <CardDescription className="text-white/60">Best selling products by units sold</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                units: {
                  label: "Units Sold",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Notebook Set", units: 120 },
                    { name: "Stationery Kit", units: 98 },
                    { name: "Bluetooth Speaker", units: 86 },
                    { name: "Office Essentials", units: 72 },
                    { name: "Gel Pens", units: 65 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="units" fill="var(--color-units)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface StatsCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ElementType
  loading: boolean
  color: string
}

function StatsCard({ title, value, description, icon: Icon, loading, color }: StatsCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="backdrop-blur-xl bg-white/10 border-white/10 shadow-xl overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5`}></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/60">{title}</p>
              {loading ? (
                <div className="h-8 w-24 bg-white/10 rounded animate-pulse mt-1"></div>
              ) : (
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
              )}
              <p className="text-xs text-white/40 mt-1">{description}</p>
            </div>
            <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
