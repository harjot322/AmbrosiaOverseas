"use client"

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function TaxSettings() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const [taxSettings, setTaxSettings] = useState({
    enableGST: true,
    gstRate: 18, // Default GST rate in India
    pricesIncludeGST: false,
  })

  useEffect(() => {
    fetchTaxSettings()
  }, [])

  const fetchTaxSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/config?type=tax")
      const data = await response.json()

      if (data && Object.keys(data).length > 0) {
        setTaxSettings({
          ...taxSettings,
          ...data,
        })
      }
    } catch (error) {
      console.error("Error fetching tax settings:", error)
      toast({
        title: "Error",
        description: "Failed to load tax settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setInitialLoad(false)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/config?type=tax", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taxSettings),
      })

      if (!response.ok) {
        throw new Error("Failed to save tax settings")
      }

      toast({
        title: "Success",
        description: "Tax settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving tax settings:", error)
      toast({
        title: "Error",
        description: "Failed to save tax settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoad) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tax Settings</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enable-gst">Enable GST</Label>
            <p className="text-sm text-muted-foreground">Apply GST to all product prices</p>
          </div>
          <Switch
            id="enable-gst"
            checked={taxSettings.enableGST}
            onCheckedChange={(checked) => setTaxSettings((prev) => ({ ...prev, enableGST: checked }))}
          />
        </div>

        {taxSettings.enableGST && (
          <>
            <div className="space-y-2">
              <Label htmlFor="gst-rate">GST Rate (%)</Label>
              <Input
                id="gst-rate"
                type="number"
                value={taxSettings.gstRate}
                onChange={(e) => setTaxSettings((prev) => ({ ...prev, gstRate: Number(e.target.value) }))}
                min={0}
                max={100}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="prices-include-gst">Prices Include GST</Label>
                <p className="text-sm text-muted-foreground">Toggle if product prices already include GST</p>
              </div>
              <Switch
                id="prices-include-gst"
                checked={taxSettings.pricesIncludeGST}
                onCheckedChange={(checked) => setTaxSettings((prev) => ({ ...prev, pricesIncludeGST: checked }))}
              />
            </div>
          </>
        )}

        <Button onClick={handleSave} className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

