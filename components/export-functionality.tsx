"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Download, FileText, BarChart3, Calendar, DollarSign, Loader2 } from "lucide-react"

interface ExportOptions {
  format: "csv" | "pdf" | "excel"
  dateRange: "7d" | "30d" | "90d" | "1y" | "all"
  includeFields: string[]
  reportType: "bookings" | "revenue" | "venues" | "analytics"
}

const availableFields = [
  { id: "query_number", label: "Query Number" },
  { id: "contact_name", label: "Contact Name" },
  { id: "venue_name", label: "Venue Name" },
  { id: "performance_type", label: "Performance Type" },
  { id: "show_date", label: "Show Date" },
  { id: "status", label: "Status" },
  { id: "current_offer", label: "Current Offer" },
  { id: "accepted_offer", label: "Accepted Offer" },
  { id: "created_at", label: "Created Date" },
  { id: "updated_at", label: "Updated Date" },
]

export default function ExportFunctionality() {
  const [isExporting, setIsExporting] = useState(false)
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "csv",
    dateRange: "30d",
    includeFields: ["query_number", "contact_name", "venue_name", "status", "current_offer"],
    reportType: "bookings",
  })
  const { toast } = useToast()

  const handleExport = async () => {
    setIsExporting(true)

    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real implementation, this would call your export API
      console.log("[v0] Exporting with options:", exportOptions)

      toast({
        title: "Export Completed",
        description: `Your ${exportOptions.reportType} report has been generated and downloaded.`,
      })

      // Simulate file download
      const filename = `${exportOptions.reportType}_report_${new Date().toISOString().split("T")[0]}.${exportOptions.format}`
      const link = document.createElement("a")
      link.href = "#" // In real implementation, this would be the file URL
      link.download = filename
      link.click()
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleFieldToggle = (fieldId: string, checked: boolean) => {
    setExportOptions((prev) => ({
      ...prev,
      includeFields: checked ? [...prev.includeFields, fieldId] : prev.includeFields.filter((id) => id !== fieldId),
    }))
  }

  const getReportIcon = (type: string) => {
    switch (type) {
      case "bookings":
        return Calendar
      case "revenue":
        return DollarSign
      case "venues":
        return BarChart3
      case "analytics":
        return BarChart3
      default:
        return FileText
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="glass-card bg-transparent">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-0 max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Type Selection */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "bookings", label: "Bookings Report", icon: Calendar },
              { id: "revenue", label: "Revenue Report", icon: DollarSign },
              { id: "venues", label: "Venue Performance", icon: BarChart3 },
              { id: "analytics", label: "Analytics Summary", icon: BarChart3 },
            ].map(({ id, label, icon: Icon }) => (
              <Card
                key={id}
                className={`cursor-pointer transition-all ${
                  exportOptions.reportType === id
                    ? "glass-card border-primary bg-primary/10"
                    : "glass-panel hover:bg-white/10"
                }`}
                onClick={() => setExportOptions((prev) => ({ ...prev, reportType: id as any }))}
              >
                <CardContent className="p-4 text-center">
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Export Format */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Export Format</Label>
            <Select
              value={exportOptions.format}
              onValueChange={(value) => setExportOptions((prev) => ({ ...prev, format: value as any }))}
            >
              <SelectTrigger className="glass-card border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-0">
                <SelectItem value="csv">CSV (.csv)</SelectItem>
                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                <SelectItem value="pdf">PDF (.pdf)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Date Range</Label>
            <Select
              value={exportOptions.dateRange}
              onValueChange={(value) => setExportOptions((prev) => ({ ...prev, dateRange: value as any }))}
            >
              <SelectTrigger className="glass-card border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-0">
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Field Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Include Fields</Label>
            <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
              {availableFields.map((field) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.id}
                    checked={exportOptions.includeFields.includes(field.id)}
                    onCheckedChange={(checked) => handleFieldToggle(field.id, checked as boolean)}
                  />
                  <Label htmlFor={field.id} className="text-sm cursor-pointer">
                    {field.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Export Summary */}
          <Card className="glass-panel border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Export Summary</span>
                <Badge variant="outline" className="glass-panel bg-transparent">
                  {exportOptions.includeFields.length} fields
                </Badge>
              </div>
              <p className="text-sm">
                Exporting <strong>{exportOptions.reportType}</strong> data for the{" "}
                <strong>
                  {exportOptions.dateRange === "all" ? "entire period" : `last ${exportOptions.dateRange}`}
                </strong>{" "}
                in <strong>{exportOptions.format.toUpperCase()}</strong> format.
              </p>
            </CardContent>
          </Card>

          {/* Export Button */}
          <Button
            onClick={handleExport}
            disabled={isExporting || exportOptions.includeFields.length === 0}
            className="w-full"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Export...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export {exportOptions.reportType.charAt(0).toUpperCase() + exportOptions.reportType.slice(1)} Data
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
