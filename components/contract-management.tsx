"use client"

import { useState } from "react"
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

const mockContracts: Contract[] = [
  {
    id: "1",
    bookingId: "BK001",
    venueName: "The Fillmore",
    artistName: "Electric Dreams",
    eventDate: "2024-12-15",
    status: "signed",
    amount: 2500,
    createdAt: "2024-12-01",
    signedAt: "2024-12-03",
    documentUrl: "/contracts/contract-001.pdf",
  },
  {
    id: "2",
    bookingId: "BK002",
    venueName: "Fox Theater",
    artistName: "Midnight Groove",
    eventDate: "2024-12-18",
    status: "sent",
    amount: 3200,
    createdAt: "2024-12-05",
  },
  {
    id: "3",
    bookingId: "BK003",
    venueName: "The Independent",
    artistName: "Sonic Wave",
    eventDate: "2024-12-22",
    status: "draft",
    amount: 1800,
    createdAt: "2024-12-08",
  },
]

export default function ContractManagement() {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

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

  const handleSendContract = (contractId: string) => {
    setContracts((prev) =>
      prev.map((contract) => (contract.id === contractId ? { ...contract, status: "sent" as const } : contract)),
    )

    toast({
      title: "Contract Sent",
      description: "The contract has been sent to the artist for signature.",
    })
  }

  const handleGenerateContract = () => {
    toast({
      title: "Contract Generated",
      description: "A new contract has been created and is ready for review.",
    })
    setIsDialogOpen(false)
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
                  <Select>
                    <SelectTrigger className="glass-panel border-0">
                      <SelectValue placeholder="Select Booking" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BK004">BK004 - The Warfield - Rock Band X</SelectItem>
                      <SelectItem value="BK005">BK005 - Great American Music Hall - Jazz Trio</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Contract Amount ($)" className="glass-panel border-0" />
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
                      {contract.status === "draft" && (
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
