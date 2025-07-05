"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import { ProductGrid } from "@/components/products/product-grid"
import { Search, ShoppingBag, Truck, Shield, Clock } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const categories = [
  { name: "Stationery", icon: "📝", count: "50+ items" },
  { name: "Household Essentials", icon: "🏠", count: "100+ items" },
  { name: "Groceries", icon: "🛒", count: "200+ items" },
  { name: "Personal Care", icon: "🧴", count: "75+ items" },
  { name: "Quick Snacks", icon: "🍿", count: "80+ items" },
  { name: "Basic Electronics", icon: "📱", count: "30+ items" },
]

const features = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Same-day delivery to your apartment door",
  },
  {
    icon: Shield,
    title: "Secure Shopping",
    description: "Safe and secure payment processing",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer assistance",
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <MainLayout>
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border-0 text-sm px-4 py-2">
                🎉 Welcome to ApartMart
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                Everything You Need,
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
                  Delivered to Your Door
                </span>
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                Shop from a wide range of products designed specifically for apartment living. From stationery to
                electronics, we've got you covered.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                <Input
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-white/10 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-500"
                />
              </div>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 h-12 px-8"
              >
                <Link href="/products">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Start Shopping
                </Link>
              </Button>
            </motion.div>

            {/* Featured Products */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Products</h2>
                  <p className="text-xl text-white/70">Discover our most popular items</p>
                </div>

                <ProductGrid limit={8} searchQuery={searchQuery} />

                <div className="text-center mt-12">
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="bg-white/10 border-white/10 text-white hover:bg-white/20"
                  >
                    <Link href="/products">View All Products</Link>
                  </Button>
                </div>
              </div>
            </section>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">500+</div>
                <div className="text-white/60">Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">1000+</div>
                <div className="text-white/60">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">24/7</div>
                <div className="text-white/60">Support</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Shop by Category</h2>
              <p className="text-xl text-white/70">Find everything you need for your apartment lifestyle</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={`/products?category=${encodeURIComponent(category.name)}`}>
                    <Card className="group cursor-pointer backdrop-blur-xl bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-3">{category.icon}</div>
                        <h3 className="font-semibold text-white mb-2 text-sm">{category.name}</h3>
                        <p className="text-white/60 text-xs">{category.count}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose ApartMart?</h2>
              <p className="text-xl text-white/70">We make apartment living easier with our premium services</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card className="backdrop-blur-xl bg-white/5 border-white/10 h-full">
                    <CardContent className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 mb-6">
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                      <p className="text-white/70">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Start Shopping?</h2>
              <p className="text-xl text-white/70 mb-8">
                Join thousands of satisfied customers who trust ApartMart for their daily needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0"
                >
                  <Link href="/auth/signup">Create Account</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white/10 text-white hover:bg-white/20"
                >
                  <Link href="/products">Browse Products</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
