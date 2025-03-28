//This is query page, not Analytics page!

"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Mail, Eye, Trash2, Search, Filter, ArrowUpDown } from "lucide-react"
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

// Sample message data
const initialMessages = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 9876543210",
    subject: "Product Information",
    message: "I would like to know more about your energy drinks. Do you have any sugar-free options available?",
    read: true,
    createdAt: "2023-08-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+91 8765432109",
    subject: "Business Opportunity",
    message:
      "I'm interested in becoming a distributor for your products in Mumbai. Could you please provide more information about your distribution program?",
    read: false,
    createdAt: "2023-08-20T14:45:00Z",
  },
  {
    id: 3,
    name: "Raj Patel",
    email: "raj.patel@example.com",
    phone: "+91 7654321098",
    subject: "Feedback",
    message:
      "I recently tried your imported chocolate cookies and they were amazing! The quality and taste are exceptional. Looking forward to trying more products from your collection.",
    read: false,
    createdAt: "2023-08-22T09:15:00Z",
  },
  {
    id: 4,
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 6543210987",
    subject: "General Inquiry",
    message:
      "Do you have a physical store where I can visit and see your products in person? I'm located in Delhi and would love to check out your collection.",
    read: true,
    createdAt: "2023-08-25T16:20:00Z",
  },
]

export default function MessagesPage() {
  const { toast } = useToast()
  const [messages, setMessages] = useState(initialMessages)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<(typeof initialMessages)[0] | null>(null)

  const filteredMessages = messages.filter(
    (message) =>
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleViewMessage = (message: (typeof initialMessages)[0]) => {
    setSelectedMessage(message)

    // Mark as read if not already
    if (!message.read) {
      setMessages((prev) => prev.map((m) => (m.id === message.id ? { ...m, read: true } : m)))
    }
  }

  const handleDeleteMessage = (id: number) => {
    setMessages((prev) => prev.filter((message) => message.id !== id))

    toast({
      title: "Message Deleted",
      description: "The message has been deleted successfully.",
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contact Messages</h1>
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
            {filteredMessages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No messages found.
                </TableCell>
              </TableRow>
            ) : (
              filteredMessages.map((message) => (
                <TableRow key={message.id} className={!message.read ? "bg-muted/30" : undefined}>
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
                        onClick={() => handleDeleteMessage(message.id)}
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

