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
      handleLoginRedirect()
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
      <SheetContent className="w-full sm:max-w-lg backdrop-blur-xl bg-slate-900/90 border-white/10 text-white">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between text-white">
            Shopping Cart
            <Badge variant="secondary" className="bg-white/10 text-white border-0">
              {items.length} items
            </Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <ShoppingCart className="h-12 w-12 text-white/20" />
              </div>
              <p className="text-white/60 text-center">Your cart is empty</p>
              <p className="text-white/40 text-sm text-center mt-2">Add some products to your cart to see them here</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-6 space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="group flex items-center space-x-4 p-4 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">{item.name}</h4>
                        <p className="text-sm text-white/60">₹{item.price.toLocaleString("en-IN")}</p>

                        <div className="flex items-center space-x-2 mt-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-right space-y-2">
                        <p className="font-medium text-white">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeItem(item.id)}
                          className="h-7 w-7 rounded-full text-white/60 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="border-t border-white/10 pt-6 space-y-4">
                {/* Login prompt for non-authenticated users */}
                {!user && (
                  <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                    <div className="flex items-center space-x-3">
                      <LogIn className="h-5 w-5 text-emerald-400" />
                      <div>
                        <p className="text-white font-medium">Login Required</p>
                        <p className="text-white/60 text-sm">Please login to place your order</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Address form for authenticated users */}
                {user && showAddressForm && (
                  <div className="space-y-2 p-4 rounded-lg bg-white/5">
                    <Label htmlFor="delivery-address" className="text-white/70">
                      Delivery Address
                    </Label>
                    <Input
                      id="delivery-address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter your delivery address"
                      className="bg-white/10 border-white/10 text-white placeholder:text-white/30"
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
                  <span className="text-lg font-semibold text-white">Total:</span>
                  <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>

                <Button
                  onClick={user ? handleCheckout : handleLoginRedirect}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-lg shadow-emerald-500/20"
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
