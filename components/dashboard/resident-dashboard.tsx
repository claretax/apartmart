"use client"

import { useState } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { useCart } from "@/components/providers/cart-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Search, User, LogOut, Home, Bell, Settings, Menu, X } from "lucide-react"
import { ProductGrid } from "@/components/products/product-grid"
import { CartSidebar } from "@/components/cart/cart-sidebar"
import { OrderHistory } from "@/components/orders/order-history"
import { DatabaseStatus } from "@/components/database-status"
import { AdminDashboard } from "./admin-dashboard"
import { AgentDashboard } from "./agent-dashboard"
import { motion } from "framer-motion"

const categories = [
  "All",
  "Stationery",
  "Household Essentials",
  "Groceries",
  "Personal Care",
  "Quick Snacks",
  "Basic Electronics",
]

function DashboardRouter() {
  const { user } = useAuth()

  if (!user) {
    return <div>Please log in</div>
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case "admin":
      return <AdminDashboard />
    case "agent":
      return <AgentDashboard />
    case "resident":
    default:
      return <ResidentDashboard />
  }
}

export function ResidentDashboard() {
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (!user) {
    return <div>Please log in</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <Home className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">
                ApartMart
              </h1>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <DatabaseStatus />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative bg-white/10 border-white/10 text-white hover:bg-white/20"
              >
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-pink-500 to-violet-500">
                    {totalItems}
                  </Badge>
                )}
              </Button>

              <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-xl">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="text-sm font-medium">{user.username}</span>
                  {user.apartmentDetails && (
                    <Badge variant="outline" className="ml-2 border-0 bg-emerald-500/20 text-emerald-300">
                      {user.apartmentDetails.tower}-{user.apartmentDetails.floor}-{user.apartmentDetails.flatNumber}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden py-4 border-t border-white/10"
            >
              <div className="flex flex-col space-y-4">
                <DatabaseStatus />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">{user.username}</span>
                    {user.apartmentDetails && (
                      <Badge variant="outline" className="border-0 bg-emerald-500/20 text-emerald-300">
                        {user.apartmentDetails.tower}-{user.apartmentDetails.floor}-{user.apartmentDetails.flatNumber}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCartOpen(true)}
                    className="relative bg-white/10 border-white/10 text-white hover:bg-white/20"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-pink-500 to-violet-500">
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                </div>
                <div className="flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Tabs defaultValue="shop" className="space-y-6">
            <TabsList className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-xl p-1">
              <TabsTrigger
                value="shop"
                className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
              >
                Shop
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
              >
                My Orders
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
              >
                Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="shop" className="space-y-6">
              {/* Search and Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-500 backdrop-blur-xl"
                  />
                </div>
              </motion.div>

              {/* Category Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap gap-2"
              >
                {categories.map((category, index) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Button
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={`
                        transition-all duration-200
                        ${
                          selectedCategory === category
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg shadow-emerald-500/20"
                            : "bg-white/10 border-white/10 text-white hover:bg-white/20"
                        }
                      `}
                    >
                      {category}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>

              {/* Products */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <ProductGrid
                  category={selectedCategory === "All" ? undefined : selectedCategory}
                  searchQuery={searchQuery}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="orders">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <OrderHistory />
              </motion.div>
            </TabsContent>

            <TabsContent value="profile">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="backdrop-blur-xl bg-white/10 border-white/10 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white">Profile Information</CardTitle>
                    <CardDescription className="text-white/60">Your account details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-white/70">Username</label>
                      <p className="text-sm text-white/90">{user.username}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-white/70">Email</label>
                      <p className="text-sm text-white/90">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-white/70">Role</label>
                      <Badge className="ml-2 bg-emerald-500/20 text-emerald-300 border-0">{user.role}</Badge>
                    </div>
                    {user.apartmentDetails && (
                      <div>
                        <label className="text-sm font-medium text-white/70">Apartment Details</label>
                        <p className="text-sm text-white/90">
                          Tower {user.apartmentDetails.tower}, Floor {user.apartmentDetails.floor}, Flat{" "}
                          {user.apartmentDetails.flatNumber}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}

export { DashboardRouter }
