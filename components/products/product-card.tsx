"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/providers/cart-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import type { Product } from "./product-grid"
import { motion } from "framer-motion"
import Link from "next/link"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      category: product.category,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to add items to your wishlist",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    // Wishlist functionality would go here
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist.`,
    })
  }

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group relative overflow-hidden rounded-xl backdrop-blur-xl bg-white/10 border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer">
        {/* Glassmorphism effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/20 via-purple-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

        <div className="relative overflow-hidden rounded-t-xl">
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-white/20 backdrop-blur-md text-white border-0 shadow-lg">{product.category}</Badge>
          </div>

          {/* Image carousel */}
          <div className="relative h-56 w-full">
            {product.images.map((image, index) => (
              <motion.div
                key={index}
                initial={false}
                animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
                style={{ display: index === currentImageIndex ? "block" : "none" }}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover rounded-t-xl"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </motion.div>
            ))}

            {/* Image navigation buttons */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Image indicators */}
            {product.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 z-10">
                {product.images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentImageIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        <div className="p-5 space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg text-white group-hover:text-white/90 transition-colors line-clamp-1">
              {product.name}
            </h3>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="text-white/50 hover:text-pink-400 transition-colors"
              onClick={handleWishlistClick}
            >
              <Heart className="h-5 w-5" />
            </motion.button>
          </div>

          <p className="text-white/70 text-sm line-clamp-2 h-10">{product.description}</p>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <p className="text-xs text-white/50">Price</p>
              <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-xs text-white/50">Stock</p>
              <p className={`text-sm font-medium ${product.stock > 10 ? "text-emerald-400" : "text-amber-400"}`}>
                {product.stock} units
              </p>
            </div>
          </div>

          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleAddToCart()
              }}
              className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-lg shadow-emerald-500/20"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </motion.div>
        </div>
      </Card>
    </Link>
  )
}
