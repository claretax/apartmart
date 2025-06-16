"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/providers/auth-provider"
import {
  LogOut,
  Menu,
  X,
  User,
  Settings,
  Bell,
  LayoutDashboard,
  ShoppingBag,
  FileText,
  PieChart,
  Home,
} from "lucide-react"
import { motion } from "framer-motion"
import { ProductManagement } from "@/components/agent/product-management"
import { OrderManagement } from "@/components/agent/order-management"

export function AgentDashboard() {
  const { user, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("orders")

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", value: "dashboard", active: activeTab === "dashboard" },
    { icon: FileText, label: "Orders", value: "orders", active: activeTab === "orders" },
    { icon: ShoppingBag, label: "Products", value: "products", active: activeTab === "products" },
    { icon: PieChart, label: "Analytics", value: "analytics", active: activeTab === "analytics" },
    { icon: Settings, label: "Settings", value: "settings", active: activeTab === "settings" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 text-white">
      {/* Sidebar */}
      <div className="flex">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: isSidebarOpen ? 0 : -280, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 left-0 h-full w-64 z-40"
        >
          <div className="h-full backdrop-blur-xl bg-white/10 border-r border-white/10 shadow-xl flex flex-col">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Home className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500">
                  ApartMart
                </h1>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto py-6 px-4">
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <motion.button
                    key={item.label}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                      item.active
                        ? "bg-gradient-to-r from-cyan-600/80 to-blue-600/80 text-white shadow-lg"
                        : "text-white/70 hover:bg-white/10"
                    }`}
                    onClick={() => setActiveTab(item.value)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.label}</span>
                    {item.active && (
                      <motion.div
                        layoutId="sidebar-active-pill"
                        className="ml-auto h-2 w-2 rounded-full bg-white"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.username}</p>
                  <p className="text-xs text-white/60">Agent</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto text-white/60 hover:text-white hover:bg-white/10"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}
        >
          {/* Header */}
          <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/5 border-b border-white/10">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-4 text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
                <h1 className="text-xl font-semibold">Agent Portal</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-cyan-500"></span>
                  </Button>
                </div>
                <div className="relative">
                  <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                    <Settings className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-xl p-1">
                <TabsTrigger
                  value="dashboard"
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
                >
                  Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="orders"
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
                >
                  Orders
                </TabsTrigger>
                <TabsTrigger
                  value="products"
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
                >
                  Products
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
                >
                  Analytics
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
                >
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <Card className="backdrop-blur-xl bg-white/10 border-white/10 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white">Agent Dashboard</CardTitle>
                    <CardDescription className="text-white/60">Welcome back, {user?.username}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/60">
                      This is your agent dashboard. Use the tabs above to manage orders and products.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders">
                <OrderManagement />
              </TabsContent>

              <TabsContent value="products">
                <ProductManagement />
              </TabsContent>

              <TabsContent value="analytics">
                <Card className="backdrop-blur-xl bg-white/10 border-white/10 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white">Analytics</CardTitle>
                    <CardDescription className="text-white/60">View sales and performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/60">Analytics dashboard would be implemented here.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card className="backdrop-blur-xl bg-white/10 border-white/10 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white">Settings</CardTitle>
                    <CardDescription className="text-white/60">Manage your account settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/60">Settings interface would be implemented here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </motion.div>
      </div>
    </div>
  )
}
