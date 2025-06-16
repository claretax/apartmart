import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/providers/auth-provider"
import { CartProvider } from "@/components/providers/cart-provider"
import { DatabaseProvider } from "@/components/providers/database-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ApartMart - Your Apartment Shopping Hub",
  description: "Complete e-commerce solution for apartment residents",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DatabaseProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </DatabaseProvider>
      </body>
    </html>
  )
}
