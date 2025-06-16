"use client"

import { useState } from "react"
import { ProductGrid } from "@/components/products/product-grid"
import { CartSidebar } from "@/components/cart/cart-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/providers/cart-provider"
import { ShoppingCart, Search } from "lucide-react"
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

export default function PublicProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { totalItems } = useCart()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
                ApartMart
              </h1>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-0">Public Store</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsCartOpen(true)}
                className="relative bg-white/10 border-white/10 text-white hover:bg-white/20"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center p-0">
                    {totalItems}
                  </Badge>
                )}
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0"
              >
                <a href="/auth/login">Login</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          >
            Shop Everything You Need
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/80 mb-8"
          >
            From stationery to electronics, delivered right to your apartment
          </motion.p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0"
                    : "bg-white/10 border-white/10 text-white hover:bg-white/20"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <ProductGrid category={selectedCategory === "All" ? undefined : selectedCategory} searchQuery={searchQuery} />
      </div>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}
