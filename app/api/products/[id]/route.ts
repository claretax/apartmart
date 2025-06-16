import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Mock product database (same as in the main products route)
const products = [
  {
    id: "prod-1",
    name: "Unicorn Stationery Set",
    description: "Magical unicorn-themed pencil case with stickers and accessories",
    price: 899,
    images: [
      "/images/unicorn-stationery-set.png",
      "/placeholder.svg?height=200&width=200",
      "/placeholder.svg?height=200&width=200",
    ],
    category: "Stationery",
    stock: 50,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "prod-2",
    name: "Executive Stationery Kit",
    description: "Complete office stationery kit for professionals",
    price: 1299,
    images: [
      "/images/executive-kit.png",
      "/placeholder.svg?height=200&width=200",
      "/placeholder.svg?height=200&width=200",
    ],
    category: "Household Essentials",
    stock: 30,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "prod-3",
    name: "Premium Notebook Set",
    description: "High-quality notebooks with premium paper and binding",
    price: 499,
    images: [
      "/images/notebook-blue.png",
      "/placeholder.svg?height=200&width=200",
      "/placeholder.svg?height=200&width=200",
    ],
    category: "Stationery",
    stock: 100,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "prod-4",
    name: "Paperlla Stationery Bundle",
    description: "Elegant stationery bundle with premium quality items",
    price: 799,
    images: [
      "/images/paperlla-stationery.png",
      "/placeholder.svg?height=200&width=200",
      "/placeholder.svg?height=200&width=200",
    ],
    category: "Personal Care",
    stock: 25,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "prod-5",
    name: "Office Essentials Kit",
    description: "Complete set of essential stationery items for your office",
    price: 999,
    images: [
      "/images/office-stationery.png",
      "/placeholder.svg?height=200&width=200",
      "/placeholder.svg?height=200&width=200",
    ],
    category: "Quick Snacks",
    stock: 40,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "prod-6",
    name: "Bluetooth Speaker",
    description: "Portable wireless speaker with great sound",
    price: 2499,
    images: [
      "/placeholder.svg?height=200&width=200",
      "/placeholder.svg?height=200&width=200",
      "/placeholder.svg?height=200&width=200",
    ],
    category: "Basic Electronics",
    stock: 15,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
]

// Helper function to check authentication and role
async function checkAuth(requiredRoles: string[] = []) {
  const authToken = cookies().get("auth_token")?.value

  if (!authToken) {
    return { authenticated: false }
  }

  // In a real app, you would verify the token with your auth system
  const userId = authToken.replace("token_", "")

  // Mock user lookup
  const users = [
    { id: "user-1", role: "resident" },
    { id: "user-2", role: "agent" },
    { id: "user-3", role: "admin" },
    { id: "user-4", role: "resident" },
  ]

  const user = users.find((u) => u.id === userId)

  if (!user) {
    return { authenticated: false }
  }

  // Check if user has required role
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return { authenticated: true, authorized: false, user }
  }

  return { authenticated: true, authorized: true, user }
}

// GET a specific product
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const productId = params.id
  const product = products.find((p) => p.id === productId)

  if (!product) {
    return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true, product })
}

// PUT (update) a product (agent or admin only)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const auth = await checkAuth(["agent", "admin"])

  if (!auth.authenticated || !auth.authorized) {
    return NextResponse.json(
      {
        success: false,
        message: !auth.authenticated ? "Unauthenticated" : "Unauthorized",
      },
      { status: !auth.authenticated ? 401 : 403 },
    )
  }

  const productId = params.id
  const productIndex = products.findIndex((p) => p.id === productId)

  if (productIndex === -1) {
    return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
  }

  try {
    const body = await request.json()

    // Update product
    const updatedProduct = {
      ...products[productIndex],
      ...body,
      updatedAt: new Date().toISOString().split("T")[0],
    }

    // In a real app, you would update the database here
    products[productIndex] = updatedProduct

    return NextResponse.json({ success: true, product: updatedProduct })
  } catch (error) {
    console.error("Update product error:", error)
    return NextResponse.json({ success: false, message: "Failed to update product" }, { status: 500 })
  }
}

// DELETE a product (agent or admin only)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const auth = await checkAuth(["agent", "admin"])

  if (!auth.authenticated || !auth.authorized) {
    return NextResponse.json(
      {
        success: false,
        message: !auth.authenticated ? "Unauthenticated" : "Unauthorized",
      },
      { status: !auth.authenticated ? 401 : 403 },
    )
  }

  const productId = params.id
  const productIndex = products.findIndex((p) => p.id === productId)

  if (productIndex === -1) {
    return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
  }

  // In a real app, you would delete from the database or mark as deleted
  const deletedProduct = products.splice(productIndex, 1)[0]

  return NextResponse.json({ success: true, product: deletedProduct })
}
