"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ProductGrid } from "@/components/products/product-grid"
import { CartSidebar } from "@/components/cart/cart-sidebar"
import { MobileNav } from "@/components/navigation/mobile-nav"
import { useAuth } from "@/components/providers/auth-provider"
import { useCart } from "@/components/providers/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { Search, ShoppingCart, Package, Truck, Shield, Clock, Filter } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const categories = [
  "All",
  "Stationery",
  "Household Essentials",
  "Groceries",
  "Personal Care",
  "Quick Snacks",
  "Basic Electronics",
]

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "Free delivery to your apartment",
  },
  {
    icon: Clock,
    title: "Quick Service",
    description: "Same day delivery available",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure transactions",
  },
  {
    icon: Package,
    title: "Quality Products",
    description: "Curated products for residents",
  },
]

export default function HomePage() {
  const { user } = useAuth()
  const { items } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <MobileNav />

      {/* Desktop Navigation - Hidden on mobile */}
      <nav className="hidden lg:flex sticky top-0 z-40 w-full border-b border-white/10 bg-slate-900/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-white text-xl">ApartMart</span>
            </Link>

            <div className="flex items-center space-x-6">
              <Link href="/products" className="text-white/70 hover:text-white transition-colors">
                Products
              </Link>
              {user && (
                <Link href="/dashboard" className="text-white/70 hover:text-white transition-colors">
                  Dashboard
                </Link>
              )}
              <Button
                onClick={() => setIsCartOpen(true)}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {items.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center p-0">
                    {items.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-purple-500/10 to-blue-500/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
                Your Apartment
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
                  {" "}
                  Shopping Hub
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                Everything you need, delivered right to your door. Shop from curated products designed for apartment
                living.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto mb-8 sm:mb-12 px-4"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl sm:rounded-2xl backdrop-blur-xl focus:border-emerald-500 text-base sm:text-lg h-12 sm:h-14"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 rounded-lg sm:rounded-xl h-8 sm:h-10 px-4 sm:px-6"
                >
                  <Search className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Search</span>
                </Button>
              </div>
            </motion.form>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card
                    key={index}
                    className="backdrop-blur-xl bg-white/5 border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <CardContent className="p-4 sm:p-6 text-center">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-white text-sm sm:text-base mb-1 sm:mb-2">{feature.title}</h3>
                      <p className="text-white/60 text-xs sm:text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories and Products */}
      <section className="pb-16 sm:pb-20 lg:pb-24">
        <div className="container mx-auto px-4">
          {/* Categories */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Shop by Category</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="text-white/70 hover:text-white lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={`text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full transition-colors ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0"
                        : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <ProductGrid category={selectedCategory} searchQuery={searchQuery} />
          </motion.div>
        </div>
      </section>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Cart Button */}
      <Button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-lg shadow-emerald-500/20 lg:hidden"
      >
        <ShoppingCart className="h-6 w-6" />
        {items.length > 0 && (
          <Badge className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
            {items.length}
          </Badge>
        )}
      </Button>
    </div>
  )
}
