"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/components/providers/cart-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Minus, Plus, Trash2, CreditCard, ShoppingCart, Loader2, LogIn } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, updateQuantity, removeItem, checkout, totalPrice } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState(
    user?.apartmentDetails
      ? `Tower ${user.apartmentDetails.tower}, Floor ${user.apartmentDetails.floor}, Flat ${user.apartmentDetails.flatNumber}`
      : "",
  )
  const [showAddressForm, setShowAddressForm] = useState(false)

  const handleLoginRedirect = () => {
    onClose()
    router.push("/auth/login")
  }

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to place your order. Your cart will be saved.",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoginRedirect}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Login
          </Button>
        ),
      })
      return
    }

    if (!deliveryAddress) {
      setShowAddressForm(true)
      return
    }

    setIsCheckingOut(true)

    try {
      const result = await checkout(deliveryAddress)

      if (result.success) {
        toast({
          title: "Order placed successfully!",
          description: `Your order of ₹${totalPrice.toLocaleString("en-IN")} has been placed and will be delivered to your apartment.`,
        })
        onClose()
      } else if (result.requiresLogin) {
        toast({
          title: "Login required",
          description: result.message || "Please login to place your order",
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoginRedirect}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Login
            </Button>
          ),
        })
      } else {
        toast({
          title: "Checkout failed",
          description: result.message || "An error occurred during checkout",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg backdrop-blur-xl bg-slate-900/90 border-white/10 text-white p-0 safe-area-top safe-area-bottom">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 sm:p-6 border-b border-white/10">
            <SheetTitle className="flex items-center justify-between text-white text-lg sm:text-xl">
              Shopping Cart
              <Badge variant="secondary" className="bg-white/10 text-white border-0 text-sm">
                {items.length} items
              </Badge>
            </SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-8 px-4">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 text-white/20" />
              </div>
              <p className="text-white/60 text-center text-base sm:text-lg">Your cart is empty</p>
              <p className="text-white/40 text-sm text-center mt-2">Add some products to your cart to see them here</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto mobile-scroll py-2 sm:py-4">
                <div className="space-y-3 px-4 sm:px-6">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                        className="group flex items-center space-x-3 p-3 sm:p-4 rounded-lg sm:rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="relative h-12 w-12 sm:h-16 sm:w-16 rounded-md overflow-hidden flex-shrink-0 bg-white/5">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 48px, 64px"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white truncate text-sm sm:text-base">{item.name}</h4>
                          <p className="text-xs sm:text-sm text-white/60">₹{item.price.toLocaleString("en-IN")}</p>

                          <div className="flex items-center space-x-2 mt-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 touch-target"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-6 sm:w-8 text-center">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 touch-target"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="text-right space-y-2 flex-shrink-0">
                          <p className="font-medium text-white text-sm sm:text-base">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </p>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeItem(item.id)}
                            className="h-7 w-7 rounded-full text-white/60 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity touch-target"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="border-t border-white/10 p-4 sm:p-6 space-y-4">
                {/* Login prompt for non-authenticated users */}
                {!user && (
                  <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                    <div className="flex items-center space-x-3">
                      <LogIn className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm sm:text-base">Ready to checkout?</p>
                        <p className="text-white/60 text-xs sm:text-sm">
                          Login to place your order - your cart will be saved!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Address form for authenticated users */}
                {user && showAddressForm && (
                  <div className="space-y-2 p-3 sm:p-4 rounded-lg bg-white/5">
                    <Label htmlFor="delivery-address" className="text-white/70 text-sm">
                      Delivery Address
                    </Label>
                    <Input
                      id="delivery-address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter your delivery address"
                      className="bg-white/10 border-white/10 text-white placeholder:text-white/30 h-10 sm:h-11"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/60">Subtotal</span>
                    <span className="text-white">₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/60">Delivery</span>
                    <span className="text-emerald-400">Free</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="text-base sm:text-lg font-semibold text-white">Total:</span>
                  <span className="text-base sm:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>

                <Button
                  onClick={user ? handleCheckout : handleLoginRedirect}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-lg shadow-emerald-500/20 h-11 sm:h-12 text-base font-medium touch-target"
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : user ? (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Checkout
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Login to Checkout
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
