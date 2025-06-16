import type { ObjectId } from "mongodb"

export interface Product {
  _id?: ObjectId
  id?: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  stock: number
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
  createdBy?: string // Agent/Admin ID
}

export interface PublicProduct {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  stock: number
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
  createdBy?: string
}

export function sanitizeProduct(product: Product): PublicProduct {
  return {
    id: product._id?.toString() || product.id || "",
    name: product.name,
    description: product.description,
    price: product.price,
    images: product.images,
    category: product.category,
    stock: product.stock,
    status: product.status,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    createdBy: product.createdBy,
  }
}
