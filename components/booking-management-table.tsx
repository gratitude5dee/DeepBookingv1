"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Mail,
  FileText,
  CreditCard,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  Phone,
  Send,
  Eye,
  CheckCircle,
  Clock,
} from "lucide-react"

interface BookingData {
  id: string
  queryNumber: string
  performanceType: string
  contactName: string
  phone: string
  email: string
  venue: string
  location: string
  showDate: string
  status: "new" | "negotiating" | "accepted" | "contracted" | "paid" | "completed"
  currentOffer: number
  acceptedOffer?: number
  introEmailSent: boolean
  contractGenerated: boolean
  paymentLinkSent: boolean
  invoiceGenerated: boolean
  signees?: string[]
  paymentStatus: "pending" | "paid" | "failed"
}

const sampleBookings: BookingData[] = [
  {
    id: "1",
    queryNumber: "BQ-1703123456-abc123def",
    performanceType: "Rock Concert",
    contactName: "John Smith",
    phone: "+1 (555) 123-4567",
    email: "john@rockband.com",
    venue: "The Fillmore",
    location: "San Francisco, CA",
    showDate: "2024-12-15T20:00:00",
    status: "negotiating",
    currentOffer: 2500,
    introEmailSent: true,
    contractGenerated: false,
    paymentLinkSent: false,
    invoiceGenerated: false,
    paymentStatus: "pending",
  },
  {
    id: "2",
    queryNumber: "BQ-1703123457-def456ghi",
    performanceType: "Jazz Performance",
    contactName: "Sarah Johnson",
    phone: "+1 (555) 234-5678",
    email: "sarah@jazzgroup.com",
    venue: "The Independent",
    location: "San Francisco, CA",
    showDate: "2024-12-18T21:00:00",
    status: "contracted",
    currentOffer: 1800,
    acceptedOffer: 1800,
    introEmailSent: true,
    contractGenerated: true,
    paymentLinkSent: true,
    invoiceGenerated: true,
    signees: ["Sarah Johnson", "Venue Manager"],
    paymentStatus: "pending",
  },
  {
    id: "3",
    queryNumber: "BQ-1703123458-ghi789jkl",
    performanceType: "Electronic Show",
    contactName: "Mike Davis",
    phone: "+1 (555) 345-6789",
    email: "mike@electrobeats.com",
    venue: "Fox Theater",
    location: "Oakland, CA",
    showDate: "2024-12-20T19:30:00",
    status: "paid",
    currentOffer: 3200,
    acceptedOffer: 3200,
    introEmailSent: true,
    contractGenerated: true,
    paymentLinkSent: true,
    invoiceGenerated: true,
    signees: ["Mike Davis", "Venue Manager"],
    paymentStatus: "paid",
  },
  {
    id: "4",
    queryNumber: "BQ-1703123459-jkl012mno",
    performanceType: "Indie Folk",
    contactName: "Emma Wilson",
    phone: "+1 (555) 456-7890",
    email: "emma@folkmusic.com",
    venue: "The Catalyst",
    location: "Santa Cruz, CA",
    showDate: "2024-12-22T20:30:00",
    status: "new",
    currentOffer: 2100,
    introEmailSent: false,
    contractGenerated: false,
    paymentLinkSent: false,
    invoiceGenerated: false,
    paymentStatus: "pending",
  },
]

interface EmailModalProps {
  booking: BookingData
  emailType: "intro" | "offer" | "invoice"
  onSend: (content: string) => void
}

function EmailModal({ booking, emailType, onSend }: EmailModalProps) {
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")

  const generateEmailContent = () => {
    switch (emailType) {
      case "intro":
        setSubject(`Booking Inquiry - ${booking.performanceType}`)
        setBody(`Dear ${booking.contactName},

Thank you for your interest in booking ${booking.venue} for your ${booking.performanceType} performance.

We have received your inquiry and are excited to work with you. Our team will review your requirements and get back to you shortly with available dates and pricing options.

Performance Details:
- Type: ${booking.performanceType}
- Venue: ${booking.venue}
- Location: ${booking.location}
- Preferred Date: ${new Date(booking.showDate).toLocaleDateString()}

We look forward to making your event a success!

Best regards,
DeepBooking Team`)
        break
      case "offer":
        setSubject(`Booking Offer - ${booking.venue}`)
        setBody(`Dear ${booking.contactName},

We are pleased to present you with an offer for your ${booking.performanceType} performance at ${booking.venue}.

Offer Details:
- Venue: ${booking.venue}
- Date: ${new Date(booking.showDate).toLocaleDateString()}
- Time: ${new Date(booking.showDate).toLocaleTimeString()}
- Offer Amount: $${booking.currentOffer.toLocaleString()}

This offer includes:
- Full venue access
- Sound system and lighting
- Basic technical support
- Security services

Please review the terms and let us know if you would like to proceed or if you have any questions.

Best regards,
DeepBooking Team`)
        break
      case "invoice":
        setSubject(`Invoice - ${booking.queryNumber}`)
        setBody(`Dear ${booking.contactName},

Please find attached your invoice for the upcoming performance at ${booking.venue}.

Invoice Details:
- Invoice Number: INV-${booking.queryNumber}
- Amount: $${booking.acceptedOffer?.toLocaleString() || booking.currentOffer.toLocaleString()}
- Due Date: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}

Payment can be made through the secure link provided in this email.

Thank you for choosing DeepBooking!

Best regards,
DeepBooking Team`)
        break
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="glass-card bg-transparent" onClick={generateEmailContent}>
          <Mail className="w-3 h-3 mr-1" />
          {emailType === "intro" ? "Intro" : emailType === "offer" ? "Offer" : "Invoice"}
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-0 max-w-2xl">
        <DialogHeader>
          <DialogTitle>Generate {emailType.charAt(0).toUpperCase() + emailType.slice(1)} Email</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="glass-card border-0"
            />
          </div>
          <div>
            <Label htmlFor="body">Email Body</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="glass-card border-0 min-h-[300px]"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => onSend(body)} className="flex-1">
              <Send className="w-4 h-4 mr-2" />
              Send Email
            </Button>
            <Button variant="outline" className="glass-card bg-transparent">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function BookingManagementTable() {
  const [bookings, setBookings] = useState(sampleBookings)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.queryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.performanceType.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500"
      case "negotiating":
        return "bg-orange-500"
      case "accepted":
        return "bg-green-500"
      case "contracted":
        return "bg-purple-500"
      case "paid":
        return "bg-emerald-500"
      case "completed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleEmailSent = (bookingId: string, emailType: string) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              introEmailSent: emailType === "intro" ? true : booking.introEmailSent,
              invoiceGenerated: emailType === "invoice" ? true : booking.invoiceGenerated,
            }
          : booking,
      ),
    )
  }

  const handleGenerateContract = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId ? { ...booking, contractGenerated: true, status: "contracted" as const } : booking,
      ),
    )
  }

  const handleGeneratePaymentLink = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === bookingId ? { ...booking, paymentLinkSent: true } : booking)),
    )
  }

  const statusOptions = [
    { value: "all", label: "All", count: bookings.length },
    { value: "new", label: "New", count: bookings.filter((b) => b.status === "new").length },
    { value: "negotiating", label: "Negotiating", count: bookings.filter((b) => b.status === "negotiating").length },
    { value: "accepted", label: "Accepted", count: bookings.filter((b) => b.status === "accepted").length },
    { value: "contracted", label: "Contracted", count: bookings.filter((b) => b.status === "contracted").length },
    { value: "paid", label: "Paid", count: bookings.filter((b) => b.status === "paid").length },
  ]

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="glass-panel border-0">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-card border-0"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(({ value, label, count }) => (
              <Badge
                key={value}
                variant={statusFilter === value ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  statusFilter === value
                    ? "bg-primary text-primary-foreground"
                    : "glass-card bg-transparent hover:bg-white/20"
                }`}
                onClick={() => setStatusFilter(value)}
              >
                {label} ({count})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Booking Table */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Booking Management ({filteredBookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-4 glass-panel rounded-lg mb-4 text-sm font-medium text-muted-foreground">
                <div className="col-span-2">Query Details</div>
                <div className="col-span-2">Contact Info</div>
                <div className="col-span-2">Venue & Date</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Offer</div>
                <div className="col-span-2">Email Actions</div>
                <div className="col-span-2">Contract & Payment</div>
              </div>

              {/* Table Rows */}
              <div className="space-y-3">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="grid grid-cols-12 gap-4 p-4 glass-panel rounded-lg hover:bg-white/10 transition-all"
                  >
                    {/* Query Details */}
                    <div className="col-span-2">
                      <p className="font-medium text-card-foreground text-sm">{booking.queryNumber}</p>
                      <p className="text-xs text-muted-foreground">{booking.performanceType}</p>
                    </div>

                    {/* Contact Info */}
                    <div className="col-span-2">
                      <p className="font-medium text-card-foreground text-sm">{booking.contactName}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {booking.phone}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {booking.email}
                      </p>
                    </div>

                    {/* Venue & Date */}
                    <div className="col-span-2">
                      <p className="font-medium text-card-foreground text-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {booking.venue}
                      </p>
                      <p className="text-xs text-muted-foreground">{booking.location}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(booking.showDate).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="col-span-1">
                      <Badge className={`${getStatusColor(booking.status)} text-white border-0 text-xs`}>
                        {booking.status}
                      </Badge>
                    </div>

                    {/* Offer */}
                    <div className="col-span-1">
                      <p className="font-medium text-primary text-sm">${booking.currentOffer.toLocaleString()}</p>
                      {booking.acceptedOffer && (
                        <p className="text-xs text-green-600">Accepted: ${booking.acceptedOffer.toLocaleString()}</p>
                      )}
                    </div>

                    {/* Email Actions */}
                    <div className="col-span-2">
                      <div className="flex flex-wrap gap-1">
                        <div className="flex items-center gap-1">
                          {booking.introEmailSent ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <Clock className="w-3 h-3 text-orange-500" />
                          )}
                          <EmailModal
                            booking={booking}
                            emailType="intro"
                            onSend={() => handleEmailSent(booking.id, "intro")}
                          />
                        </div>
                        <EmailModal
                          booking={booking}
                          emailType="offer"
                          onSend={() => handleEmailSent(booking.id, "offer")}
                        />
                        <div className="flex items-center gap-1">
                          {booking.invoiceGenerated ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <Clock className="w-3 h-3 text-orange-500" />
                          )}
                          <EmailModal
                            booking={booking}
                            emailType="invoice"
                            onSend={() => handleEmailSent(booking.id, "invoice")}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contract & Payment */}
                    <div className="col-span-2">
                      <div className="flex flex-wrap gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="glass-card bg-transparent text-xs"
                          onClick={() => handleGenerateContract(booking.id)}
                          disabled={booking.contractGenerated}
                        >
                          {booking.contractGenerated ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                              Contract
                            </>
                          ) : (
                            <>
                              <FileText className="w-3 h-3 mr-1" />
                              Generate
                            </>
                          )}
                        </Button>

                        {booking.signees && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-green-600">{booking.signees.length} signed</span>
                          </div>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          className="glass-card bg-transparent text-xs"
                          onClick={() => handleGeneratePaymentLink(booking.id)}
                          disabled={booking.paymentLinkSent}
                        >
                          {booking.paymentLinkSent ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                              Payment
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-3 h-3 mr-1" />
                              Payment
                            </>
                          )}
                        </Button>

                        {booking.paymentStatus === "paid" && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-green-600">Paid</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No bookings found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
