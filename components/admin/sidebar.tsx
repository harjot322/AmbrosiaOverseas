"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Tags,
  Layers,
  ImageIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

const adminRoutes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    color: "text-sky-500",
  },
  {
    label: "Products",
    icon: Package,
    href: "/admin/products",
    color: "text-violet-500",
  },
  {
    label: "Categories",
    icon: Layers,
    href: "/admin/categories",
    color: "text-pink-500",
  },
  {
    label: "Tags",
    icon: Tags,
    href: "/admin/tags",
    color: "text-orange-500",
  },
  {
    label: "Banners",
    icon: ImageIcon,
    href: "/admin/banners",
    color: "text-emerald-500",
  },
  {
    label: "Users",
    icon: Users,
    href: "/admin/users",
    color: "text-green-500",
  },
  {
    label: "Queries",
    icon: BarChart,
    href: "/admin/analytics",
    color: "text-yellow-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/admin/settings",
    color: "text-zinc-500",
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "relative h-screen border-r bg-card flex flex-col p-4 transition-all duration-300",
        isCollapsed ? "w-[80px]" : "w-[240px]",
      )}
    >
      <div className="flex items-center justify-between mb-8">
        {!isCollapsed && <Logo />}
        <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <div className="space-y-2 flex-1">
        {adminRoutes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-x-2 text-sm font-medium p-3 hover:bg-primary/10 rounded-lg transition-all",
              pathname === route.href ? "bg-primary/10 text-primary" : "text-muted-foreground",
            )}
          >
            <route.icon className={cn("h-5 w-5", route.color)} />
            {!isCollapsed && <span>{route.label}</span>}
          </Link>
        ))}
      </div>

      <div className="pt-4 border-t">
        <Link
          href="/login"
          className="flex items-center gap-x-2 text-sm font-medium p-3 hover:bg-destructive/10 rounded-lg transition-all text-muted-foreground"
        >
          <LogOut className="h-5 w-5 text-destructive" />
          {!isCollapsed && <span>Logout</span>}
        </Link>
      </div>
    </div>
  )
}

