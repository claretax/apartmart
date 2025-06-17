"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "./product-card"
import { motion } from "framer-motion"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  stock: number
  status: string
}

interface ProductGridProps {
  category?: string
  searchQuery?: string
}

export function ProductGrid({ category, searchQuery }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)

      try {
        // Build query string
        const params = new URLSearchParams()
        if (category && category !== "All") {
          params.append("category", category)
        }
        if (searchQuery) {
          params.append("search", searchQuery)
        }

        const queryString = params.toString() ? `?${params.toString()}` : ""

        const response = await fetch(`/api/products${queryString}`)
        const data = await response.json()

        if (data.success) {
          setProducts(data.products)
        } else {
          console.error("Failed to fetch products:", data.message)
          setProducts([])
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category, searchQuery])

  if (loading) {
    return (
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white/5 backdrop-blur-xl rounded-xl shadow-lg p-3 sm:p-4 animate-pulse border border-white/10"
          >
            <div className="bg-white/10 h-40 sm:h-48 rounded-lg mb-3 sm:mb-4"></div>
            <div className="bg-white/10 h-3 sm:h-4 rounded mb-2"></div>
            <div className="bg-white/10 h-2 sm:h-3 rounded mb-3 sm:mb-4"></div>
            <div className="bg-white/10 h-5 sm:h-6 rounded w-16 sm:w-20"></div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <p className="text-white/80 text-sm sm:text-base">No products found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-0">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  )
}
