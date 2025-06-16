"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Search, Filter, Loader2, UserPlus } from "lucide-react"

interface UserManagementUser {
  id: string
  username: string
  email: string
  role: "admin" | "agent" | "resident"
  status: string
  createdAt: string
  apartmentDetails?: {
    tower: string
    floor: string
    flatNumber: string
  }
}

export function UserManagement() {
  const [users, setUsers] = useState<UserManagementUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserManagementUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserManagementUser | null>(null)
  const [processingUser, setProcessingUser] = useState<string | null>(null)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "resident",
    tower: "",
    floor: "",
    flatNumber: "",
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchQuery, roleFilter])

  const fetchUsers = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/users")
      const data = await response.json()

      if (data.success) {
        setUsers(data.users)
      } else {
        console.error("Failed to fetch users:", data.message)
        setUsers([])
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = [...users]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (user) => user.username.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
      )
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }

  const handleAddUser = async () => {
    if (!formData.username || !formData.email || !formData.password || !formData.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Validate resident details
    if (formData.role === "resident" && (!formData.tower || !formData.floor || !formData.flatNumber)) {
      toast({
        title: "Error",
        description: "Please fill in all apartment details for resident",
        variant: "destructive",
      })
      return
    }

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        ...(formData.role === "resident"
          ? {
              apartmentDetails: {
                tower: formData.tower,
                floor: formData.floor,
                flatNumber: formData.flatNumber,
              },
            }
          : {}),
      }

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (data.success) {
        setUsers((prev) => [...prev, data.user])
        setIsAddUserOpen(false)
        resetForm()

        toast({
          title: "Success",
          description: "User added successfully",
        })
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to add user",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Add user error:", error)
      toast({
        title: "Error",
        description: "An error occurred while adding the user",
        variant: "destructive",
      })
    }
  }

  const handleEditUser = async () => {
    if (!editingUser) return

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        ...(formData.password ? { password: formData.password } : {}),
        role: formData.role,
        ...(formData.role === "resident"
          ? {
              apartmentDetails: {
                tower: formData.tower,
                floor: formData.floor,
                flatNumber: formData.flatNumber,
              },
            }
          : {}),
      }

      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (data.success) {
        setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? data.user : u)))
        setEditingUser(null)
        resetForm()

        toast({
          title: "Success",
          description: "User updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update user",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Update user error:", error)
      toast({
        title: "Error",
        description: "An error occurred while updating the user",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    setProcessingUser(userId)

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId))

        toast({
          title: "Success",
          description: "User deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete user",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Delete user error:", error)
      toast({
        title: "Error",
        description: "An error occurred while deleting the user",
        variant: "destructive",
      })
    } finally {
      setProcessingUser(null)
    }
  }

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "resident",
      tower: "",
      floor: "",
      flatNumber: "",
    })
  }

  const openEditDialog = (user: UserManagementUser) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      password: "", // Don't set password for editing
      role: user.role,
      tower: user.apartmentDetails?.tower || "",
      floor: user.apartmentDetails?.floor || "",
      flatNumber: user.apartmentDetails?.flatNumber || "",
    })
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/20 text-purple-300"
      case "agent":
        return "bg-cyan-500/20 text-cyan-300"
      case "resident":
        return "bg-emerald-500/20 text-emerald-300"
      default:
        return "bg-white/10 text-white"
    }
  }

  return (
    <>
      <Card className="backdrop-blur-xl bg-white/10 border-white/10 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">User Management</CardTitle>
            <CardDescription className="text-white/60">Manage users and their roles</CardDescription>
          </div>
          <Button
            onClick={() => {
              resetForm()
              setIsAddUserOpen(true)
            }}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-0"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white/10 border-white/10 text-white focus:border-purple-500">
                <Filter className="h-4 w-4 mr-2 text-white/60" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/10 text-white">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="resident">Resident</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className="rounded-xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="hover:bg-white/5 border-white/10">
                  <TableHead className="text-white/60">User</TableHead>
                  <TableHead className="text-white/60">Role</TableHead>
                  <TableHead className="text-white/60">Apartment</TableHead>
                  <TableHead className="text-white/60">Joined</TableHead>
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
                ) : filteredUsers.length === 0 ? (
                  <TableRow className="hover:bg-white/5 border-white/10">
                    <TableCell colSpan={5} className="text-center py-8 text-white/60">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-white/5 border-white/10">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                            <UserPlus className="h-5 w-5 text-white/60" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{user.username}</p>
                            <p className="text-xs text-white/60">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getRoleBadgeColor(user.role)} border-0`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.apartmentDetails ? (
                          <span className="text-white/80">
                            Tower {user.apartmentDetails.tower}, Floor {user.apartmentDetails.floor}, Flat{" "}
                            {user.apartmentDetails.flatNumber}
                          </span>
                        ) : (
                          <span className="text-white/40">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-white/80">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(user)}
                            className="bg-white/10 border-white/10 text-white hover:bg-white/20"
                          >
                            <UserPlus className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-white/10 border-white/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                            disabled={processingUser === user.id}
                          >
                            {processingUser === user.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <UserPlus className="h-3.5 w-3.5" />
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

      {/* Add/Edit User Dialog */}
      <Dialog
        open={isAddUserOpen || editingUser !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddUserOpen(false)
            setEditingUser(null)
          }
        }}
      >
        <DialogContent className="backdrop-blur-xl bg-slate-900/90 border-white/10 text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-white">{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
            <DialogDescription className="text-white/60">
              {editingUser ? "Update the user details below." : "Fill in the user details below."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white/70">
                  Username
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Username"
                  className="bg-white/10 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-white/70">
                  Role
                </Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger id="role" className="bg-white/10 border-white/10 text-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10 text-white">
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="resident">Resident</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/70">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email address"
                className="bg-white/10 border-white/10 text-white placeholder:text-white/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/70">
                {editingUser ? "Password (leave blank to keep current)" : "Password"}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Password"
                className="bg-white/10 border-white/10 text-white placeholder:text-white/30"
                required={!editingUser}
              />
            </div>

            {formData.role === "resident" && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-white/70">Apartment Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tower" className="text-white/70">
                      Tower
                    </Label>
                    <Input
                      id="tower"
                      value={formData.tower}
                      onChange={(e) => setFormData({ ...formData, tower: e.target.value })}
                      placeholder="A"
                      className="bg-white/10 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="floor" className="text-white/70">
                      Floor
                    </Label>
                    <Input
                      id="floor"
                      value={formData.floor}
                      onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                      placeholder="5"
                      className="bg-white/10 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="flatNumber" className="text-white/70">
                      Flat No.
                    </Label>
                    <Input
                      id="flatNumber"
                      value={formData.flatNumber}
                      onChange={(e) => setFormData({ ...formData, flatNumber: e.target.value })}
                      placeholder="502"
                      className="bg-white/10 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddUserOpen(false)
                setEditingUser(null)
              }}
              className="bg-white/10 border-white/10 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button
              onClick={editingUser ? handleEditUser : handleAddUser}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-0"
            >
              {editingUser ? "Update User" : "Add User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
