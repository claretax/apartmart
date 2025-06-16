import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  id?: string
  username: string
  email: string
  password: string
  role: "admin" | "agent" | "resident"
  status: "active" | "inactive"
  apartmentDetails?: {
    tower: string
    floor: string
    flatNumber: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface PublicUser {
  id: string
  username: string
  email: string
  role: "admin" | "agent" | "resident"
  status: "active" | "inactive"
  apartmentDetails?: {
    tower: string
    floor: string
    flatNumber: string
  }
  createdAt: string
  updatedAt: string
}

export function sanitizeUser(user: User): PublicUser {
  return {
    id: user._id?.toString() || user.id || "",
    username: user.username,
    email: user.email,
    role: user.role,
    status: user.status,
    apartmentDetails: user.apartmentDetails,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }
}
