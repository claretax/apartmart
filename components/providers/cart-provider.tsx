"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-provider"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  category: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  checkout: (deliveryAddress: string) => Promise<{ success: boolean; orderId?: string; message?: string }>
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { user } = useAuth()

  useEffect(() => {
    const savedCart = localStorage.getItem("apartmart_cart")
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("apartmart_cart", JSON.stringify(items))
  }, [items])

  const addItem = (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === newItem.id)
      if (existingItem) {
        return prev.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + (newItem.quantity || 1) } : item,
        )
      }
      return [...prev, { ...newItem, quantity: newItem.quantity || 1 }]
    })
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const checkout = async (deliveryAddress: string) => {
    if (!user) {
      return { success: false, message: "You must be logged in to checkout" }
    }

    if (items.length === 0) {
      return { success: false, message: "Your cart is empty" }
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total: totalPrice,
          deliveryAddress,
        }),
      })

      const data = await response.json()

      if (data.success) {
        clearCart()
        return { success: true, orderId: data.order.id }
      } else {
        return { success: false, message: data.message || "Failed to place order" }
      }
    } catch (error) {
      console.error("Checkout error:", error)
      return { success: false, message: "An error occurred during checkout" }
    }
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        checkout,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
