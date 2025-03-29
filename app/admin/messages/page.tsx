"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Mail, Eye, Trash2, Search, Filter, ArrowUpDown, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function MessagesPage() {
  const { toast } = useToast()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMessage, setSelectedMessage] = useState(null)

  useEffect(() => {
    fetchMessages()

    // Set up auto-refresh every 5 minutes
    const refreshInterval = setInterval(
      () => {
        fetchMessages()
      },
      5 * 60 * 1000,
    )

    return () => clearInterval(refreshInterval)
  }, [])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/contact")
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchMessages()
    setRefreshing(false)

    toast({
      title: "Refreshed",
      description: "Messages have been refreshed",
    })
  }

  const handleViewMessage = async (message) => {
    setSelectedMessage(message)

    // Mark as read if not already
    if (!message.read) {
      try {
        const response = await fetch(`/api/contact/${message._id}`, {
          method: "PATCH",
        })

        if (response.ok) {
          // Update the message in the local state
          setMessages((prev) => prev.map((m) => (m._id === message._id ? { ...m, read: true } : m)))
        }
      } catch (error) {
        console.error("Error marking message as read:", error)
      }
    }
  }

  const handleDeleteMessage = async (id) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMessages((prev) => prev.filter((message) => message._id !== id))

        toast({
          title: "Message Deleted",
          description: "The message has been deleted successfully.",
        })
      } else {
        throw new Error("Failed to delete message")
      }
    } catch (error) {
      console.error("Error deleting message:", error)
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      })
    }
  }

  const filteredMessages = messages.filter(
    (message) =>
      message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contact Messages</h1>
        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Sort
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading messages...
                </TableCell>
              </TableRow>
            ) : filteredMessages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No messages found.
                </TableCell>
              </TableRow>
            ) : (
              filteredMessages.map((message) => (
                <TableRow key={message._id} className={!message.read ? "bg-muted/30" : undefined}>
                  <TableCell className="font-medium">{message.name}</TableCell>
                  <TableCell>{message.subject}</TableCell>
                  <TableCell className="hidden md:table-cell">{message.email}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(message.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-center">
                    {message.read ? (
                      <Badge variant="outline" className="bg-muted text-muted-foreground">
                        Read
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        New
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewMessage(message)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteMessage(message._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
            <DialogDescription>
              From: {selectedMessage?.name} ({selectedMessage?.email})
              {selectedMessage?.phone && ` • ${selectedMessage.phone}`}
              {selectedMessage?.createdAt && ` • ${format(new Date(selectedMessage.createdAt), "PPpp")}`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="whitespace-pre-line">{selectedMessage?.message}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedMessage(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setSelectedMessage(null)
                toast({
                  title: "Reply Sent",
                  description: "Your reply has been sent successfully.",
                })
              }}
            >
              <Mail className="mr-2 h-4 w-4" />
              Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

