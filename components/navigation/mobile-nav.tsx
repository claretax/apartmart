"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/providers/auth-provider"
import { useCart } from "@/components/providers/cart-provider"
import { CartSidebar } from "@/components/cart/cart-sidebar"
import { Menu, Home, ShoppingBag, User, Settings, LogOut, ShoppingCart, Heart, Package, BarChart3 } from "lucide-react"
import Link from "next/link"

export function MobileNav() {
  const { user, logout } = useAuth()
  const { items } = useCart()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
    router.push("/")
  }

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/products", label: "Products", icon: ShoppingBag },
    ...(user
      ? [
          { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
          ...(user.role === "agent" ? [{ href: "/agent", label: "Agent Panel", icon: Package }] : []),
          ...(user.role === "admin" ? [{ href: "/admin", label: "Admin Panel", icon: Settings }] : []),
        ]
      : []),
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-900/90 backdrop-blur-xl safe-area-top lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 backdrop-blur-xl bg-slate-900/90 border-white/10 text-white p-0">
              <div className="flex flex-col h-full">
                <SheetHeader className="p-6 border-b border-white/10">
                  <SheetTitle className="text-white text-left">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                        <ShoppingBag className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">ApartMart</h2>
                        {user && <p className="text-sm text-white/60">Welcome, {user.username}</p>}
                      </div>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex-1 p-6">
                  <div className="space-y-2">
                    {navItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors touch-target ${
                            isActive(item.href)
                              ? "bg-white/10 text-white"
                              : "text-white/70 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>

                  {user && (
                    <div className="mt-8 pt-6 border-t border-white/10">
                      <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start text-white/70 hover:text-white hover:bg-white/5 h-12"
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        Logout
                      </Button>
                    </div>
                  )}
                </nav>

                {!user && (
                  <div className="p-6 border-t border-white/10">
                    <div className="space-y-3">
                      <Button
                        onClick={() => {
                          setIsOpen(false)
                          router.push("/auth/login")
                        }}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 h-11"
                      >
                        Login
                      </Button>
                      <Button
                        onClick={() => {
                          setIsOpen(false)
                          router.push("/auth/signup")
                        }}
                        variant="outline"
                        className="w-full bg-white/10 border-white/10 text-white hover:bg-white/20 h-11"
                      >
                        Sign Up
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg">ApartMart</span>
          </Link>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 relative">
              <Heart className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 relative"
              onClick={() => setIsCartOpen(true)}
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
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 safe-area-bottom lg:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors touch-target ${
                  isActive(item.href) ? "text-emerald-400" : "text-white/60 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
          {user && (
            <Link
              href="/dashboard"
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors touch-target ${
                isActive("/dashboard") ? "text-emerald-400" : "text-white/60 hover:text-white"
              }`}
            >
              <User className="h-5 w-5" />
              <span className="text-xs font-medium">Profile</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
