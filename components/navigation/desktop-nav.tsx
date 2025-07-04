"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/providers/auth-provider"
import { useCart } from "@/components/providers/cart-provider"
import { ShoppingBag, ShoppingCart, Heart, User, LogOut, Settings, Package, BarChart3, X } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DesktopNav() {
  const { user, logout } = useAuth()
  const { items, removeItem, updateQuantity, totalPrice } = useCart()
  const router = useRouter()
  const pathname = usePathname()
  const [isCartOpen, setIsCartOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    ...(user
      ? [
          { href: "/dashboard", label: "Dashboard" },
          ...(user.role === "agent" ? [{ href: "/agent", label: "Agent Panel" }] : []),
          ...(user.role === "admin" ? [{ href: "/admin", label: "Admin Panel" }] : []),
        ]
      : []),
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-900/90 backdrop-blur-xl hidden lg:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">ApartMart</h1>
              <p className="text-xs text-white/60">Your Apartment Shopping Hub</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-white ${
                  isActive(item.href) ? "text-emerald-400" : "text-white/70"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Button with Dropdown */}
            <DropdownMenu open={isCartOpen} onOpenChange={setIsCartOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {items.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center p-0">
                      {items.reduce((sum, item) => sum + item.quantity, 0)}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-slate-800 border-white/10 text-white p-4">
                {items.length === 0 ? (
                  <DropdownMenuItem className="text-center text-white/70">
                    Your cart is empty
                  </DropdownMenuItem>
                ) : (
                  <>
                    <div className="max-h-64 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 py-2 border-b border-white/10">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-white/60">{item.category}</p>
                            <p className="text-sm">${item.price.toFixed(2)} x {item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-6 w-6 p-0 text-white border-white/20"
                            >
                              -
                            </Button>
                            <span className="text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-6 w-6 p-0 text-white border-white/20"
                            >
                              +
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-400 hover:text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium">
                        Total: ${totalPrice.toFixed(2)}
                      </p>
                      <DropdownMenuSeparator className="bg-white/10 my-2" />
                      <DropdownMenuItem asChild className="p-0">
                        <Button
                          asChild
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                        >
                          <Link href="/cart">View Cart</Link>
                        </Button>
                      </DropdownMenuItem>
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wishlist Button */}
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Heart className="h-5 w-5" />
            </Button>

            {/* User Menu or Auth Buttons */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-white/10 flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-white/10 text-white">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "agent" && (
                    <DropdownMenuItem asChild>
                      <Link href="/agent" className="flex items-center">
                        <Package className="mr-2 h-4 w-4" />
                        Agent Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-white/creation" />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button asChild variant="ghost" className="text-white hover:bg-white/10">
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0"
                >
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}