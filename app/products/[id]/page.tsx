"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/providers/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, Heart, ChevronLeft, ChevronRight, ArrowLeft, Plus, Minus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import type { Product } from "@/components/products/product-grid"

export default function ProductDetailPage() {
  const params = useParams()
  const { addItem } = useCart()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)

      try {
        const response = await fetch(`/api/products/${params.id}`)
        const data = await response.json()

        if (data.success) {
          setProduct(data.product)
        } else {
          console.error("Failed to fetch product:", data.message)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      category: product.category,
      quantity,
    })

    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} has been added to your cart.`,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-white/10 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/10 h-96 rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-white/10 rounded w-3/4"></div>
                <div className="h-4 bg-white/10 rounded w-1/2"></div>
                <div className="h-32 bg-white/10 rounded"></div>
                <div className="h-8 bg-white/10 rounded w-1/4"></div>
                <div className="h-12 bg-white/10 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/dashboard" className="flex items-center text-white/70 hover:text-white mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="text-center py-12">
            <p className="text-white/80 text-xl">Product not found</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard" className="flex items-center text-white/70 hover:text-white mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="relative">
            <Card className="overflow-hidden backdrop-blur-xl bg-white/10 border-white/10 shadow-xl rounded-xl">
              <div className="relative aspect-square">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={product.images[currentImageIndex] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Image navigation buttons */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % product.images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>
            </Card>

            {/* Thumbnail navigation */}
            {product.images.length > 1 && (
              <div className="flex mt-4 space-x-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      index === currentImageIndex ? "border-emerald-500 scale-105" : "border-white/20"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2 bg-white/20 backdrop-blur-md text-white border-0 shadow-lg">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold text-white">{product.name}</h1>
              <p className="text-2xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <h2 className="text-lg font-medium text-white mb-2">Description</h2>
              <p className="text-white/80">{product.description}</p>
            </div>

            <div className="flex items-center space-x-2">
              <p className="text-white/70">Availability:</p>
              {product.stock > 0 ? (
                <Badge className="bg-emerald-500/20 text-emerald-300 border-0">In Stock ({product.stock} units)</Badge>
              ) : (
                <Badge className="bg-red-500/20 text-red-300 border-0">Out of Stock</Badge>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <p className="text-white/70">Quantity:</p>
                <div className="flex items-center">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 rounded-l-md bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <div className="h-8 px-4 flex items-center justify-center bg-white/10 border-y border-white/20 text-white">
                    {quantity}
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 rounded-r-md bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-lg shadow-emerald-500/20"
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
