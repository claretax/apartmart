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

import { checkAuth } from "@/lib/auth";

import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { sanitizeProduct } from "@/lib/models/product";

// GET a specific product
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase();
    const product = await db.collection("products").findOne({ _id: new ObjectId(params.id), status: "active" });
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product: sanitizeProduct(product) });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Invalid product ID" }, { status: 400 });
  }
}

// PUT (update) a product (agent or admin only)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const auth = await checkAuth(["agent", "admin"]);

  if (!auth.authenticated || !auth.authorized) {
    return NextResponse.json(
      {
        success: false,
        message: !auth.authenticated ? "Unauthenticated" : "Unauthorized",
      },
      { status: !auth.authenticated ? 401 : 403 },
    );
  }

  try {
    const db = await getDatabase();
    const body = await request.json();
    // Only allow certain fields to be updated
    const allowedFields = ["name", "description", "price", "images", "category", "stock", "status"];
    const update: any = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        update[key] = body[key];
      }
    }
    update.updatedAt = new Date();

    // Debug info
    console.log("[PUT /api/products/[id]] params.id:", params.id);
    let objectId;
    try {
      objectId = new ObjectId(params.id);
    } catch (e) {
      console.error("Invalid ObjectId conversion:", params.id, e);
      return NextResponse.json({ success: false, message: "Invalid product ID format" }, { status: 400 });
    }
    const result = await db.collection("products").findOneAndUpdate(
      { _id: objectId },
      { $set: update },
      { returnDocument: "after" }
    );
    console.log("[PUT /api/products/[id]] update result:", result);
    if (!result._id) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product: sanitizeProduct(result) });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ success: false, message: "Failed to update product" }, { status: 500 });
  }
}

// DELETE a product (agent or admin only)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const auth = await checkAuth(["agent", "admin"]);

  if (!auth.authenticated || !auth.authorized) {
    return NextResponse.json(
      {
        success: false,
        message: !auth.authenticated ? "Unauthenticated" : "Unauthorized",
      },
      { status: !auth.authenticated ? 401 : 403 },
    );
  }

  try {
    const db = await getDatabase();
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(params.id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete product" }, { status: 500 });
  }
}
