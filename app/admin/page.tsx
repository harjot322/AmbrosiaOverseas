"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Package, Users, Eye, TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface Analytics {
  pageViewsByMonth: { _id: { month: number; year: number }; count: number }[]
  pageViewsByPage: { _id: string; count: number }[]
  topProducts: { _id: string; name: string; views: number; price: number }[]
}

interface Stats {
  products: { count: number; change: number }
  users: { count: number; change: number }
  pageViews: { count: number; change: number }
  interactions: { count: number; change: number }
}

export default function AdminDashboard() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [period, setPeriod] = useState("last_month")
  const [analytics, setAnalytics] = useState<Analytics>({
    pageViewsByMonth: [],
    pageViewsByPage: [],
    topProducts: [],
  })
  const [stats, setStats] = useState<Stats>({
    products: { count: 0, change: 0 },
    users: { count: 0, change: 0 },
    pageViews: { count: 0, change: 0 },
    interactions: { count: 0, change: 0 },
  })

  useEffect(() => {
    fetchAnalytics()
    fetchStats()

    // Set up auto-refresh every 5 minutes
    const refreshInterval = setInterval(
      () => {
        fetchAnalytics()
        fetchStats()
      },
      5 * 60 * 1000,
    )

    return () => clearInterval(refreshInterval)
  }, [period])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics?period=${period}`)
      const data = await response.json()

      if (data) {
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/analytics?type=stats&period=${period}`)
      const data = await response.json()

      if (data) {
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
      toast({
        title: "Error",
        description: "Failed to load stats data",
        variant: "destructive",
      })
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await Promise.all([fetchAnalytics(), fetchStats()])
    setRefreshing(false)

    toast({
      title: "Refreshed",
      description: "Dashboard data has been refreshed",
    })
  }

  // Format data for charts
  const formatMonthlyViewsData = () => {
    if (!analytics.pageViewsByMonth || analytics.pageViewsByMonth.length === 0) {
      return []
    }

    return analytics.pageViewsByMonth.map((item) => {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const monthName = monthNames[item._id.month - 1]
      return {
        date: `${monthName} ${item._id.year}`,
        views: item.count,
      }
    })
  }

  const formatTopProductsData = () => {
    if (!analytics.topProducts || analytics.topProducts.length === 0) {
      return []
    }

    return analytics.topProducts.map((item) => ({
      name: item.name.length > 20 ? item.name.substring(0, 20) + "..." : item.name,
      views: item.views,
      price: item.price,
    }))
  }

  // Sample data for charts (would be replaced by real data in production)
  const categoryData = [
    { name: "Beverages", value: 35 },
    { name: "Snacks", value: 25 },
    { name: "Cookies", value: 15 },
    { name: "Cereals", value: 10 },
    { name: "Protein", value: 10 },
    { name: "Other", value: 5 },
  ]

  const COLORS = ["#d4af37", "#1f2937", "#4b5563", "#6b7280", "#9ca3af", "#d1d5db"]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="last_3_months">Last 3 Months</SelectItem>
              <SelectItem value="last_6_months">Last 6 Months</SelectItem>
              <SelectItem value="last_year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">Total Products</p>
              <Package className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.products.count}</div>
              <div
                className={`flex items-center text-sm ${stats.products.change >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {stats.products.change >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {Math.abs(stats.products.change)}%
              </div>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              {stats.products.change >= 0 ? "+" : ""}
              {Math.round((stats.products.count * stats.products.change) / 100)} from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">Registered Users</p>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.users.count}</div>
              <div
                className={`flex items-center text-sm ${stats.users.change >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {stats.users.change >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {Math.abs(stats.users.change)}%
              </div>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              {stats.users.change >= 0 ? "+" : ""}
              {Math.round((stats.users.count * stats.users.change) / 100)} from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">Total Page Views</p>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.pageViews.count}</div>
              <div
                className={`flex items-center text-sm ${stats.pageViews.change >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {stats.pageViews.change >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {Math.abs(stats.pageViews.change)}%
              </div>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              {stats.pageViews.change >= 0 ? "+" : ""}
              {Math.round((stats.pageViews.count * stats.pageViews.change) / 100)} from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">Product Interactions</p>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.interactions.count}</div>
              <div
                className={`flex items-center text-sm ${stats.interactions.change >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {stats.interactions.change >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {Math.abs(stats.interactions.change)}%
              </div>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              {stats.interactions.change >= 0 ? "+" : ""}
              {Math.round((stats.interactions.count * stats.interactions.change) / 100)} from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Website Visits by Month</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={formatMonthlyViewsData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="views" stroke="#d4af37" strokeWidth={2} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Product Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Products by Views</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={formatTopProductsData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#d4af37" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-muted-foreground">Loading analytics data...</p>
                </div>
              ) : analytics.pageViewsByMonth.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-muted-foreground">No analytics data available for the selected period.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Page Views Over Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={formatMonthlyViewsData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="views" stroke="#d4af37" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Top Products by Views</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={formatTopProductsData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="views" fill="#d4af37" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Top Products by Views</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={formatTopProductsData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="views" fill="#d4af37" name="Views" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Product Categories Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}