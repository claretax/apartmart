"use client"

import type { ReactNode } from "react"
import { MobileNav } from "@/components/navigation/mobile-nav"
import { DesktopNav } from "@/components/navigation/desktop-nav"
import { Footer } from "@/components/layout/footer"

interface MainLayoutProps {
  children: ReactNode
  showFooter?: boolean
  className?: string
}

export function MainLayout({ children, showFooter = true, className = "" }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex flex-col">
      {/* Mobile Navigation */}
      <MobileNav />

      {/* Desktop Navigation */}
      <DesktopNav />

      {/* Main Content */}
      <main className={`flex-1 ${className}`}>{children}</main>

      {/* Footer */}
      {showFooter && <Footer />}

      {/* Mobile Bottom Navigation Spacer */}
      <div className="h-16 lg:hidden" />
    </div>
  )
}
