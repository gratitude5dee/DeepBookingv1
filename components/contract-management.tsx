"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Send, Eye, Edit, Plus, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Contract {
  id: string
  bookingId: string
  venueName: string
  artistName: string
  eventDate: string
  status: "draft" | "sent" | "signed" | "completed"
  amount: number
  createdAt: string
  signedAt?: string
  documentUrl?: string
}

const mockContracts: Contract[] = []

export default function ContractManagement() {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formBookingId, setFormBookingId] = useState("")
  const [formAmount, setFormAmount] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/contracts", { method: "GET" })
        const j = await res.json()
        const items = (j?.data || []) as any[]
        const mapped: Contract[] = items.map((r) => ({
          id: r.id,
          bookingId: r.booking_id,
          venueName: r.venue_name || "",
          artistName: r.artist_name || "",
          eventDate: r.performance_date || "",
          status: r.status,
          amount: Number(r.amount || 0),
          createdAt: r.created_at,
          signedAt: r.signed_at,
          documentUrl: r.document_url || undefined,
        }))
        setContracts(mapped)
      } catch {}
    })()
  }, [])

  const getStatusColor = (status: Contract["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "signed":
        return "bg-blue-500"
      case "sent":
        return "bg-yellow-500"
      case "draft":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: Contract["status"]) => {
    switch (status) {
      case "completed":
        return CheckCircle
      case "signed":
        return CheckCircle
      case "sent":
        return Clock
      case "draft":
        return AlertCircle
      default:
        return FileText
    }
  }

  const handleSendContract = async (contractId: string) => {
    const email = typeof window !== "undefined" ? window.prompt("Recipient email") : ""
    if (!email) return
    try {
      const res = await fetch("/api/contracts/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId, recipientEmail: email }),
      })
      if (!res.ok) throw new Error("send_failed")
      const list = await fetch("/api/contracts")
      const j = await list.json()
      const items = (j?.data || []) as any[]
      const mapped: Contract[] = items.map((r) => ({
        id: r.id,
        bookingId: r.booking_id,
        venueName: r.venue_name || "",
        artistName: r.artist_name || "",
        eventDate: r.performance_date || "",
        status: r.status,
        amount: Number(r.amount || 0),
        createdAt: r.created_at,
        signedAt: r.signed_at,
        documentUrl: r.document_url || undefined,
      }))
      setContracts(mapped)
      toast({ title: "Contract Sent", description: "The contract has been sent to the artist for signature." })
    } catch {
      toast({ title: "Failed to send", description: "Please try again.", variant: "destructive" as any })
    }
  }

  const handleGenerateContract = async () => {
    if (!formBookingId || !formAmount) {
      toast({ title: "Missing fields", description: "Booking ID and Amount are required.", variant: "destructive" as any })
      return
    }
    try {
      const res = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: formBookingId, amount: Number(formAmount) }),
      })
      if (!res.ok) throw new Error("create_failed")
      const list = await fetch("/api/contracts")
      const j = await list.json()
      const items = (j?.data || []) as any[]
      const mapped: Contract[] = items.map((r) => ({
        id: r.id,
        bookingId: r.booking_id,
        venueName: r.venue_name || "",
        artistName: r.artist_name || "",
        eventDate: r.performance_date || "",
        status: r.status,
        amount: Number(r.amount || 0),
        createdAt: r.created_at,
        signedAt: r.signed_at,
        documentUrl: r.document_url || undefined,
      }))
      setContracts(mapped)
      toast({ title: "Contract Generated", description: "A new contract has been created." })
      setIsDialogOpen(false)
      setFormBookingId("")
      setFormAmount("")
    } catch {
      toast({ title: "Failed to create", description: "Please try again.", variant: "destructive" as any })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Contract Management
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Contract
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-0 max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Generate New Contract</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Booking ID"
                    className="glass-panel border-0"
                    value={formBookingId}
                    onChange={(e: any) => setFormBookingId(e.target.value)}
                  />
                  <Input
                    placeholder="Contract Amount ($)"
                    className="glass-panel border-0"
                    value={formAmount}
                    onChange={(e: any) => setFormAmount(e.target.value)}
                  />
                  <Select>
                    <SelectTrigger className="glass-panel border-0">
                      <SelectValue placeholder="Contract Template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Performance Contract</SelectItem>
                      <SelectItem value="premium">Premium Venue Contract</SelectItem>
                      <SelectItem value="festival">Festival Performance Contract</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button onClick={handleGenerateContract} className="bg-primary hover:bg-primary/90">
                      Generate Contract
                    </Button>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{contracts.length}</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Signed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {contracts.filter((c) => c.status === "signed" || c.status === "completed").length}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{contracts.filter((c) => c.status === "sent").length}</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${contracts.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        {contracts.map((contract) => {
          const StatusIcon = getStatusIcon(contract.status)
          return (
            <Card key={contract.id} className="glass-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(contract.status)}`}
                    >
                      <StatusIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground">
                        {contract.bookingId} - {contract.venueName}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {contract.artistName} • {contract.eventDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">${contract.amount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Contract Value</div>
                    </div>
                    <Badge className={getStatusColor(contract.status)}>{contract.status}</Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="glass-card bg-transparent">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      {(contract.status === "draft" || contract.status === "sent") && (
                        <Button
                          size="sm"
                          onClick={() => handleSendContract(contract.id)}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send
                        </Button>
                      )}
                      {contract.documentUrl && (
                        <Button size="sm" variant="outline" className="glass-card bg-transparent">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="glass-card bg-transparent">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
