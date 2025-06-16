import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { type Product, sanitizeProduct } from "@/lib/models/product"
import { checkAuth } from "@/lib/auth"

// GET all products (public)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const skip = Number.parseInt(searchParams.get("skip") || "0")

    const db = await getDatabase()
    const query: any = { status: "active" }

    // Apply filters
    if (category) {
      query.category = category
    }

    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    const products = await db
      .collection<Product>("products")
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .toArray()

    const sanitizedProducts = products.map(sanitizeProduct)

    return NextResponse.json({ success: true, products: sanitizedProducts })
  } catch (error) {
    console.error("Get products error:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch products" }, { status: 500 })
  }
}

// POST a new product (agent or admin only)
export async function POST(request: Request) {
  try {
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

    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "description", "price", "category", "stock"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, message: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const db = await getDatabase()
    const now = new Date()

    const newProduct: Omit<Product, "_id"> = {
      name: body.name,
      description: body.description,
      price: Number(body.price),
      images: body.images || ["/placeholder.svg?height=200&width=200"],
      category: body.category,
      stock: Number(body.stock),
      status: "active",
      createdAt: now,
      updatedAt: now,
      createdBy: auth.user.id,
    }

    const result = await db.collection<Product>("products").insertOne(newProduct)
    const createdProduct = await db.collection<Product>("products").findOne({ _id: result.insertedId })

    if (!createdProduct) {
      return NextResponse.json({ success: false, message: "Failed to create product" }, { status: 500 })
    }

    return NextResponse.json({ success: true, product: sanitizeProduct(createdProduct) })
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json({ success: false, message: "Failed to create product" }, { status: 500 })
  }
}
