import { getDatabase } from "../lib/mongodb"
import { hashPassword } from "../lib/auth"
import type { User } from "../lib/models/user"
import type { Product } from "../lib/models/product"

async function initializeDatabase() {
  try {
    const db = await getDatabase()

    // Create indexes
    await db.collection("users").createIndex({ username: 1 }, { unique: true })
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("products").createIndex({ name: 1 })
    await db.collection("products").createIndex({ category: 1 })
    await db.collection("orders").createIndex({ userId: 1 })
    await db.collection("orders").createIndex({ status: 1 })

    // Check if users already exist
    const userCount = await db.collection("users").countDocuments()
    if (userCount === 0) {
      // Create default users
      const now = new Date()
      const defaultUsers: Omit<User, "_id">[] = [
        {
          username: "admin",
          email: "admin@apartmart.com",
          password: await hashPassword("admin123"),
          role: "admin",
          status: "active",
          createdAt: now,
          updatedAt: now,
        },
        {
          username: "agent",
          email: "agent@apartmart.com",
          password: await hashPassword("agent123"),
          role: "agent",
          status: "active",
          createdAt: now,
          updatedAt: now,
        },
        {
          username: "demo",
          email: "demo@apartmart.com",
          password: await hashPassword("demo123"),
          role: "resident",
          status: "active",
          apartmentDetails: {
            tower: "A",
            floor: "5",
            flatNumber: "502",
          },
          createdAt: now,
          updatedAt: now,
        },
      ]

      await db.collection("users").insertMany(defaultUsers)
      console.log("Default users created")
    }

    // Check if products already exist
    const productCount = await db.collection("products").countDocuments()
    if (productCount === 0) {
      // Create default products
      const now = new Date()
      const defaultProducts: Omit<Product, "_id">[] = [
        {
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
          createdAt: now,
          updatedAt: now,
        },
        {
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
          createdAt: now,
          updatedAt: now,
        },
        {
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
          createdAt: now,
          updatedAt: now,
        },
        {
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
          createdAt: now,
          updatedAt: now,
        },
        {
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
          createdAt: now,
          updatedAt: now,
        },
        {
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
          createdAt: now,
          updatedAt: now,
        },
      ]

      await db.collection("products").insertMany(defaultProducts)
      console.log("Default products created")
    }

    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Database initialization error:", error)
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase()
}

export default initializeDatabase
