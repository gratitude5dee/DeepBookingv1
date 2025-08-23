"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, AlertCircle, CheckCircle, Clock, Plus, Send, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PaymentLink {
  id: string
  bookingId: string
  venueName: string
  artistName: string
  amount: number
  status: "pending" | "paid" | "failed" | "expired"
  createdAt: string
  paidAt?: string
  paymentMethod?: string
  transactionId?: string
}

const mockPayments: PaymentLink[] = [
  {
    id: "1",
    bookingId: "BK001",
    venueName: "The Fillmore",
    artistName: "Electric Dreams",
    amount: 2500,
    status: "paid",
    createdAt: "2024-12-01",
    paidAt: "2024-12-02",
    paymentMethod: "Credit Card",
    transactionId: "txn_1234567890",
  },
  {
    id: "2",
    bookingId: "BK002",
    venueName: "Fox Theater",
    artistName: "Midnight Groove",
    amount: 3200,
    status: "pending",
    createdAt: "2024-12-05",
  },
  {
    id: "3",
    bookingId: "BK003",
    venueName: "The Independent",
    artistName: "Sonic Wave",
    amount: 1800,
    status: "failed",
    createdAt: "2024-12-08",
  },
]

export default function PaymentProcessing() {
  const [payments, setPayments] = useState<PaymentLink[]>(mockPayments)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const getStatusColor = (status: PaymentLink["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "failed":
        return "bg-red-500"
      case "expired":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: PaymentLink["status"]) => {
    switch (status) {
      case "paid":
        return CheckCircle
      case "pending":
        return Clock
      case "failed":
        return AlertCircle
      case "expired":
        return AlertCircle
      default:
        return CreditCard
    }
  }

  const handleCreatePaymentLink = () => {
    toast({
      title: "Payment Link Created",
      description: "A new payment link has been generated and sent to the artist.",
    })
    setIsDialogOpen(false)
  }

  const handleRetryPayment = (paymentId: string) => {
    setPayments((prev) =>
      prev.map((payment) => (payment.id === paymentId ? { ...payment, status: "pending" as const } : payment)),
    )

    toast({
      title: "Payment Retry Initiated",
      description: "A new payment attempt has been started.",
    })
  }

  const totalRevenue = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)
  const pendingAmount = payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)
  const failedAmount = payments.filter((p) => p.status === "failed").reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Processing
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Payment Link
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-0 max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Payment Link</DialogTitle>
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
                  <Input placeholder="Payment Amount ($)" className="glass-panel border-0" />
                  <Input placeholder="Payment Description" className="glass-panel border-0" />
                  <Select>
                    <SelectTrigger className="glass-panel border-0">
                      <SelectValue placeholder="Payment Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deposit">Deposit (50%)</SelectItem>
                      <SelectItem value="full">Full Payment</SelectItem>
                      <SelectItem value="balance">Balance Payment</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button onClick={handleCreatePaymentLink} className="bg-primary hover:bg-primary/90">
                      Create Payment Link
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

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${pendingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {payments.filter((p) => p.status === "pending").length} payments
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${failedAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {payments.filter((p) => p.status === "failed").length} failed
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {Math.round((payments.filter((p) => p.status === "paid").length / payments.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Payment success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Links List */}
      <div className="space-y-4">
        {payments.map((payment) => {
          const StatusIcon = getStatusIcon(payment.status)
          return (
            <Card key={payment.id} className="glass-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(payment.status)}`}
                    >
                      <StatusIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground">
                        {payment.bookingId} - {payment.venueName}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {payment.artistName} • Created {payment.createdAt}
                      </p>
                      {payment.transactionId && (
                        <p className="text-xs text-muted-foreground">Transaction: {payment.transactionId}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">${payment.amount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{payment.paymentMethod || "Payment Amount"}</div>
                    </div>
                    <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="glass-card bg-transparent">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      {payment.status === "failed" && (
                        <Button
                          size="sm"
                          onClick={() => handleRetryPayment(payment.id)}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Retry
                        </Button>
                      )}
                      {payment.status === "pending" && (
                        <Button size="sm" variant="outline" className="glass-card bg-transparent">
                          <Send className="w-4 h-4 mr-2" />
                          Resend Link
                        </Button>
                      )}
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
