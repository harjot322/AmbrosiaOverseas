"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function TaxSettings() {
  const { toast } = useToast()
  const [enableGST, setEnableGST] = useState(true)
  const [gstRate, setGstRate] = useState(18) // Default GST rate in India
  const [pricesIncludeGST, setPricesIncludeGST] = useState(false)

  const handleSave = () => {
    // In a real app, this would save to the database
    toast({
      title: "Tax Settings Updated",
      description: "Your tax settings have been updated successfully.",
    })
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
          <Switch id="enable-gst" checked={enableGST} onCheckedChange={setEnableGST} />
        </div>

        {enableGST && (
          <>
            <div className="space-y-2">
              <Label htmlFor="gst-rate">GST Rate (%)</Label>
              <Input
                id="gst-rate"
                type="number"
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
                min={0}
                max={100}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="prices-include-gst">Prices Include GST</Label>
                <p className="text-sm text-muted-foreground">Toggle if product prices already include GST</p>
              </div>
              <Switch id="prices-include-gst" checked={pricesIncludeGST} onCheckedChange={setPricesIncludeGST} />
            </div>
          </>
        )}

        <Button onClick={handleSave} className="w-full">
          Save Settings
        </Button>
      </CardContent>
    </Card>
  )
}

