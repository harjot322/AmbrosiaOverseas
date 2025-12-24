"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Edit, Trash2, Search, Filter, ArrowUpDown, MoreHorizontal, Eye, UserCog } from "lucide-react"
import { User } from "@/types/types" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"

export default function UsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all")
  const [sortKey, setSortKey] = useState<"newest" | "oldest" | "name">("newest")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "role" | null>(null)
  const [editUser, setEditUser] = useState({ name: "", email: "", phone: "", role: "user" as "user" | "admin" })
  const [newUser  , setNewUser  ] = useState<User>({
    _id: "",
    name: "",
    email: "",
    password: "",
    role: "user",
    phone: "",
    createdAt: undefined,
    updatedAt: undefined,
  })

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/users")
      const data = await response.json()
      const normalized = Array.isArray(data)
        ? data.map((user) => ({ ...user, _id: String(user._id || "") }))
        : []
      setUsers(normalized)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleCreateUser   = async () => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          password: newUser.password,
          role: newUser.role,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create user")
      }

      toast({
        title: "Success",
        description: "User   created successfully",
      })

      // Reset form and refresh users
      setNewUser  ({
        _id: "",
        name: "",
        email: "",
        password: "",
        role: "user",
        phone: "",
        createdAt: undefined,
        updatedAt: undefined,
      })

      fetchUsers()
    } catch (error) {
      console.error("Error creating user:", error)
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser   = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete user")
      }

      toast({
        title: "Success",
        description: "User   deleted successfully",
      })

      // Refresh users
      fetchUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = roleFilter === "all" ? true : user.role === roleFilter
      return matchesSearch && matchesRole
    })
    .sort((a, b) => {
      if (sortKey === "name") {
        return (a.name || "").localeCompare(b.name || "")
      }
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return sortKey === "newest" ? bTime - aTime : aTime - bTime
    })

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  value={newUser  .name}
                  onChange={(e) => setNewUser  ({ ...newUser  , name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={newUser  .email}
                  onChange={(e) => setNewUser  ({ ...newUser  , email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  value={newUser  .phone}
                  onChange={(e) => setNewUser  ({ ...newUser  , phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={newUser  .password}
                  onChange={(e) => setNewUser  ({ ...newUser  , password: e.target.value })}
                  placeholder="Enter password"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">
                  Role
                </label>
                <Select value={newUser  .role} onValueChange={(value: "admin" | "user") => setNewUser  ({ ...newUser  , role: value })}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User  </SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() =>
                  setNewUser  ({
                    _id: "",
                    name: "",
                    email: "",
                    password: "",
                    role: "user",
                    phone: "",
                    createdAt: undefined,
                    updatedAt: undefined,
                  })
                }
              >
                Cancel
              </Button>
              <Button onClick={handleCreateUser  }>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={roleFilter} onValueChange={(value: "all" | "admin" | "user") => setRoleFilter(value)}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="user">Users</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortKey} onValueChange={(value: "newest" | "oldest" | "name") => setSortKey(value)}>
            <SelectTrigger className="w-[160px]">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="name">Name (A–Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "default" : "outline"}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>{user.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy") : "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user)
                            setEditUser({
                              name: user.name || "",
                              email: user.email || "",
                              phone: user.phone || "",
                              role: user.role || "user",
                            })
                            setDialogMode("view")
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user)
                            setEditUser({
                              name: user.name || "",
                              email: user.email || "",
                              phone: user.phone || "",
                              role: user.role || "user",
                            })
                            setDialogMode("edit")
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user)
                            setEditUser({
                              name: user.name || "",
                              email: user.email || "",
                              phone: user.phone || "",
                              role: user.role || "user",
                            })
                            setDialogMode("role")
                          }}
                        >
                        <UserCog className="mr-2 h-4 w-4" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser  (user._id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!dialogMode} onOpenChange={() => setDialogMode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "view" && "User Details"}
              {dialogMode === "edit" && "Edit User"}
              {dialogMode === "role" && "Change Role"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "view" && "View user information."}
              {dialogMode === "edit" && "Update name or phone."}
              {dialogMode === "role" && "Update the user's role."}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={editUser.name}
                  onChange={(e) => setEditUser((prev) => ({ ...prev, name: e.target.value }))}
                  disabled={dialogMode === "view" || dialogMode === "role"}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input value={editUser.email} disabled readOnly />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={editUser.phone}
                  onChange={(e) => setEditUser((prev) => ({ ...prev, phone: e.target.value }))}
                  disabled={dialogMode === "view" || dialogMode === "role"}
                />
              </div>
              {dialogMode === "role" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Select
                    value={editUser.role}
                    onValueChange={(value: "admin" | "user") =>
                      setEditUser((prev) => ({ ...prev, role: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
          {dialogMode !== "view" && selectedUser && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogMode(null)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (!selectedUser) return
                  if (!selectedUser._id) {
                    toast({
                      title: "Error",
                      description: "Missing user id.",
                      variant: "destructive",
                    })
                    return
                  }
                  const payload =
                    dialogMode === "role"
                      ? { role: editUser.role }
                      : { name: editUser.name, phone: editUser.phone }
                  const response = await fetch(`/api/users/${selectedUser._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  })
                  if (!response.ok) {
                    toast({
                      title: "Error",
                      description: "Failed to update user.",
                      variant: "destructive",
                    })
                    return
                  }
                  toast({
                    title: "Updated",
                    description: "User updated successfully.",
                  })
                  setDialogMode(null)
                  fetchUsers()
                }}
              >
                Save
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
