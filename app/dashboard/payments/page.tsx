"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Payment {
  id: string
  bookingId: string
  venueName: string
  eventName: string
  amount: number
  status: "pending" | "paid" | "overdue" | "refunded"
  dueDate: string
  paidDate?: string
  method?: string
  invoiceUrl?: string
}

interface PaymentMethod {
  id: string
  type: "card" | "bank"
  last4: string
  brand?: string
  isDefault: boolean
}

const mockPayments: Payment[] = [
  {
    id: "1",
    bookingId: "1",
    venueName: "Blue Note Jazz Club",
    eventName: "Jazz Night Live",
    amount: 1200,
    status: "paid",
    dueDate: "2024-03-01",
    paidDate: "2024-02-28",
    method: "Visa ****4242",
    invoiceUrl: "#",
  },
  {
    id: "2",
    bookingId: "2",
    venueName: "The Apollo Theater",
    eventName: "Comedy Showcase",
    amount: 2800,
    status: "pending",
    dueDate: "2024-03-15",
    invoiceUrl: "#",
  },
  {
    id: "3",
    bookingId: "4",
    venueName: "Mercury Lounge",
    eventName: "Acoustic Session",
    amount: 800,
    status: "paid",
    dueDate: "2024-02-20",
    paidDate: "2024-02-18",
    method: "Mastercard ****8888",
  },
  {
    id: "4",
    bookingId: "5",
    venueName: "Webster Hall",
    eventName: "Electronic Night",
    amount: 1500,
    status: "overdue",
    dueDate: "2024-02-25",
    invoiceUrl: "#",
  },
]

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "card",
    last4: "4242",
    brand: "Visa",
    isDefault: true,
  },
  {
    id: "2",
    type: "card",
    last4: "8888",
    brand: "Mastercard",
    isDefault: false,
  },
  {
    id: "3",
    type: "bank",
    last4: "1234",
    isDefault: false,
  },
]

export default function PaymentsPage() {
  const [payments] = useState<Payment[]>(mockPayments)
  const [paymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-600"
      case "pending":
        return "bg-yellow-600"
      case "overdue":
        return "bg-red-600"
      case "refunded":
        return "bg-blue-600"
      default:
        return "bg-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return "✓"
      case "pending":
        return "⏳"
      case "overdue":
        return "⚠️"
      case "refunded":
        return "↩️"
      default:
        return "?"
    }
  }

  const totalPaid = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)
  const totalPending = payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)
  const totalOverdue = payments.filter((p) => p.status === "overdue").reduce((sum, p) => sum + p.amount, 0)

  const handlePayNow = (payment: Payment) => {
    // Handle payment processing
    console.log(`Processing payment for ${payment.id}`)
    alert(`Payment of $${payment.amount} processed successfully!`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Payments</h1>
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            onClick={() => setShowAddPaymentMethod(true)}
          >
            + Add Payment Method
          </Button>
        </div>

        {/* Payment Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <div className="text-2xl mb-2">💰</div>
              <div className="text-2xl font-bold text-white">${totalPaid.toLocaleString()}</div>
              <div className="text-white/70 text-sm">Total Paid</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <div className="text-2xl mb-2">⏳</div>
              <div className="text-2xl font-bold text-white">${totalPending.toLocaleString()}</div>
              <div className="text-white/70 text-sm">Pending</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <div className="text-2xl mb-2">⚠️</div>
              <div className="text-2xl font-bold text-white">${totalOverdue.toLocaleString()}</div>
              <div className="text-white/70 text-sm">Overdue</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-2xl font-bold text-white">{payments.length}</div>
              <div className="text-white/70 text-sm">Total Invoices</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20 text-white">
              Payment History
            </TabsTrigger>
            <TabsTrigger value="methods" className="data-[state=active]:bg-white/20 text-white">
              Payment Methods
            </TabsTrigger>
            <TabsTrigger value="invoices" className="data-[state=active]:bg-white/20 text-white">
              Invoices
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="space-y-4">
              {payments.map((payment) => (
                <Card
                  key={payment.id}
                  className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-white">{payment.eventName}</h3>
                          <Badge className={`${getStatusColor(payment.status)} text-white`}>
                            {getStatusIcon(payment.status)}{" "}
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </Badge>
                        </div>

                        <p className="text-white/70 mb-3">{payment.venueName}</p>

                        <div className="grid md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <span className="text-white/60 text-sm">Amount</span>
                            <p className="text-white font-semibold">${payment.amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-white/60 text-sm">Due Date</span>
                            <p className="text-white">{new Date(payment.dueDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="text-white/60 text-sm">Paid Date</span>
                            <p className="text-white">
                              {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : "—"}
                            </p>
                          </div>
                          <div>
                            <span className="text-white/60 text-sm">Method</span>
                            <p className="text-white">{payment.method || "—"}</p>
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          {payment.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => handlePayNow(payment)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Pay Now
                            </Button>
                          )}

                          {payment.status === "overdue" && (
                            <Button
                              size="sm"
                              onClick={() => handlePayNow(payment)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Pay Overdue
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                          >
                            View Invoice
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPayment(payment)}
                            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                          >
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="methods" className="mt-6">
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <Card key={method.id} className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
                          {method.type === "card" ? "💳" : "🏦"}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {method.brand ? `${method.brand} ****${method.last4}` : `Bank ****${method.last4}`}
                          </p>
                          <p className="text-white/60 text-sm">
                            {method.type === "card" ? "Credit Card" : "Bank Account"}
                          </p>
                        </div>
                        {method.isDefault && <Badge className="bg-purple-600 text-white">Default</Badge>}
                      </div>

                      <div className="flex space-x-2">
                        {!method.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                          >
                            Set Default
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="invoices" className="mt-6">
            <div className="space-y-4">
              {payments.map((payment) => (
                <Card key={payment.id} className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Invoice #{payment.id.padStart(4, "0")}</h3>
                        <p className="text-white/70 text-sm">
                          {payment.eventName} • {payment.venueName}
                        </p>
                        <p className="text-white/60 text-sm">Due: {new Date(payment.dueDate).toLocaleDateString()}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-white font-semibold">${payment.amount.toLocaleString()}</p>
                        <Badge className={`${getStatusColor(payment.status)} text-white mt-1`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          Download PDF
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          Send Email
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Payment Method Modal */}
        {showAddPaymentMethod && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Add Payment Method</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddPaymentMethod(false)}
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    ✕
                  </Button>
                </div>

                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="text-white">
                      Card Number
                    </Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry" className="text-white">
                        Expiry
                      </Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc" className="text-white">
                        CVC
                      </Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      Cardholder Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddPaymentMethod(false)}
                      className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      Add Card
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Payment Details Modal */}
        {selectedPayment && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl max-w-2xl w-full">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Payment Details</h2>
                    <p className="text-white/70">Invoice #{selectedPayment.id.padStart(4, "0")}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPayment(null)}
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-white/60">Event:</span>
                    <span className="text-white">{selectedPayment.eventName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Venue:</span>
                    <span className="text-white">{selectedPayment.venueName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Amount:</span>
                    <span className="text-white font-semibold">${selectedPayment.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Status:</span>
                    <Badge className={`${getStatusColor(selectedPayment.status)} text-white`}>
                      {getStatusIcon(selectedPayment.status)}{" "}
                      {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Due Date:</span>
                    <span className="text-white">{new Date(selectedPayment.dueDate).toLocaleDateString()}</span>
                  </div>
                  {selectedPayment.paidDate && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Paid Date:</span>
                      <span className="text-white">{new Date(selectedPayment.paidDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {selectedPayment.method && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Payment Method:</span>
                      <span className="text-white">{selectedPayment.method}</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedPayment(null)}
                    className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    Close
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    Download Invoice
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
