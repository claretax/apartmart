"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Cloudinary constants
const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dvyursf9f/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "products"; // unsigned preset

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Search, Filter, Loader2, ImageIcon, X } from "lucide-react"
import Image from "next/image"

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  stock: number
  status: string
}

const categories = [
  "Stationery",
  "Household Essentials",
  "Groceries",
  "Personal Care",
  "Quick Snacks",
  "Basic Electronics",
]

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [processingProduct, setProcessingProduct] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState("") // Added state for image URL
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "Stationery",
    images: ["/placeholder.svg?height=200&width=200"],
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchQuery, categoryFilter])

  const fetchProducts = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/products")
      const data = await response.json()

      if (data.success) {
        setProducts(data.products)
      } else {
        console.error("Failed to fetch products:", data.message)
        setProducts([])
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = [...products]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (product) => product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query),
      )
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((product) => product.category === categoryFilter)
    }

    setFilteredProducts(filtered)
  }

  const handleAddProduct = async () => {
    if (!formData.name || !formData.description || !formData.price || !formData.stock) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          stock: Number(formData.stock),
          category: formData.category,
          images: formData.images,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setProducts((prev) => [...prev, data.product])
        setIsAddProductOpen(false)
        resetForm()

        toast({
          title: "Success",
          description: "Product added successfully",
        })
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to add product",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Add product error:", error)
      toast({
        title: "Error",
        description: "An error occurred while adding the product",
        variant: "destructive",
      })
    }
  }

  const handleEditProduct = async () => {
    if (!editingProduct) return

    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          stock: Number(formData.stock),
          category: formData.category,
          images: formData.images,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? data.product : p)))
        setEditingProduct(null)
        resetForm()

        toast({
          title: "Success",
          description: "Product updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update product",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Update product error:", error)
      toast({
        title: "Error",
        description: "An error occurred while updating the product",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    setProcessingProduct(productId)

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId))

        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete product",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Delete product error:", error)
      toast({
        title: "Error",
        description: "An error occurred while deleting the product",
        variant: "destructive",
      })
    } finally {
      setProcessingProduct(null)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "Stationery",
      images: ["/placeholder.svg?height=200&width=200"],
    })
    setImageUrl("") // Reset image URL
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      images: product.images,
    })
  }

  // Handles file selection and upload to Cloudinary
  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formDataCloud = new FormData()
    formDataCloud.append("file", file)
    formDataCloud.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
    try {
      const res = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formDataCloud,
      })
      const data = await res.json()
      if (data.secure_url) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, data.secure_url],
        }))
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        })
      } else {
        throw new Error("Cloudinary upload failed")
      }
    } catch (err) {
      console.error("Cloudinary upload failed", err)
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      // Reset the file input value so the same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // Handles adding image via URL
  const handleAddImageByUrl = () => {
    if (!imageUrl) {
      toast({
        title: "Error",
        description: "Please enter an image URL",
        variant: "destructive",
      })
      return
    }

    try {
      // Validate URL
      new URL(imageUrl)

      // Add the URL to the images array
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }))
      toast({
        title: "Success",
        description: "Image URL added successfully",
      })
      setImageUrl("") // Clear the URL input
    } catch (err) {
      console.error("Invalid URL:", err)
      toast({
        title: "Error",
        description: "Please enter a valid image URL",
        variant: "destructive",
      })
    }
  }

  // Handles removing an image
  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  // Triggers file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  return (
    <>
      <Card className="backdrop-blur-xl bg-white/10 border-white/10 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Product Management</CardTitle>
            <CardDescription className="text-white/60">Manage your product inventory</CardDescription>
          </div>
          <Button
            onClick={() => {
              resetForm()
              setIsAddProductOpen(true)
            }}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white/10 border-white/10 text-white focus:border-cyan-500">
                <Filter className="h-4 w-4 mr-2 text-white/60" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/10 text-white">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Products Table */}
          <div className="rounded-xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="hover:bg-white/5 border-white/10">
                  <TableHead className="text-white/60">Product</TableHead>
                  <TableHead className="text-white/60">Category</TableHead>
                  <TableHead className="text-white/60">Price</TableHead>
                  <TableHead className="text-white/60">Stock</TableHead>
                  <TableHead className="text-right text-white/60">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i} className="hover:bg-white/5 border-white/10">
                      <TableCell>
                        <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredProducts.length === 0 ? (
                  <TableRow className="hover:bg-white/5 border-white/10">
                    <TableCell colSpan={5} className="text-center py-8 text-white/60">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-white/5 border-white/10">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="relative h-10 w-10 rounded-md overflow-hidden bg-white/5">
                            <Image
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-white">{product.name}</p>
                            <p className="text-xs text-white/60 line-clamp-1 max-w-[200px]">{product.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-white/10 text-white border-0">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="font-medium text-white">₹{product.price.toLocaleString("en-IN")}</TableCell>
                      <TableCell>
                        <span className={`${product.stock > 10 ? "text-emerald-400" : "text-amber-400"}`}>
                          {product.stock} units
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(product)}
                            className="bg-white/10 border-white/10 text-white hover:bg-white/20"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="bg-white/10 border-white/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                            disabled={processingProduct === product.id}
                          >
                            {processingProduct === product.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Product Dialog */}
      <Dialog
        open={isAddProductOpen || editingProduct !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddProductOpen(false)
            setEditingProduct(null)
            setImageUrl("") // Reset image URL when closing dialog
          }
        }}
      >
        <DialogContent className="backdrop-blur-xl bg-slate-900/90 border-white/10 text-white sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-white">{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription className="text-white/60">
              {editingProduct ? "Update the product details below." : "Fill in the product details below."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white/70">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Product name"
                  className="bg-white/10 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-white/70">
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category" className="bg-white/10 border-white/10 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10 text-white">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white/70">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Product description"
                className="bg-white/10 border-white/10 text-white placeholder:text-white/30 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-white/70">
                  Price (₹)
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className="bg-white/10 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-white/70">
                  Stock
                </Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                  className="bg-white/10 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/70">Images</Label>
              <div className="flex flex-wrap gap-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative h-20 w-20 rounded-md overflow-hidden bg-white/5 group">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Product image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleAddImage}
                    />
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="h-20 w-20 rounded-md border-2 border-dashed border-white/20 flex items-center justify-center text-white/40 hover:text-white/60 hover:border-white/30 transition-colors"
                    >
                      <ImageIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Paste image URL"
                      className="bg-white/10 border-white/10 text-white placeholder:text-white/30 text-sm h-8"
                    />
                    <Button
                      type="button"
                      onClick={handleAddImageByUrl}
                      size="sm"
                      className="bg-cyan-600 hover:bg-cyan-700 text-white h-8"
                    >
                      Add URL
                    </Button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-white/40 mt-1">Upload images or add image URLs for the product.</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddProductOpen(false)
                setEditingProduct(null)
                setImageUrl("")
              }}
              className="bg-white/10 border-white/10 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button
              onClick={editingProduct ? handleEditProduct : handleAddProduct}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0"
            >
              {editingProduct ? "Update Product" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}