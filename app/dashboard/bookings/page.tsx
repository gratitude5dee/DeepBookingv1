"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Booking {
  id: string
  venueName: string
  eventName: string
  eventDate: string
  eventTime: string
  status: "pending" | "confirmed" | "rejected" | "completed"
  price: string
  location: string
  capacity: number
  image: string
  offer?: {
    amount: string
    sentAt?: string
    respondedAt?: string
    counterOffer?: string
  }
  negotiationHistory?: Array<{
    date: string
    message: string
    sender: "venue" | "user"
    type: "offer" | "message" | "counter"
  }>
}

const mockBookings: Booking[] = [
  {
    id: "1",
    venueName: "Blue Note Jazz Club",
    eventName: "Jazz Night Live",
    eventDate: "2024-03-15",
    eventTime: "20:00",
    status: "confirmed",
    price: "$1,200",
    location: "Greenwich Village, NYC",
    capacity: 200,
    image: "/jazz-club-interior.png",
    offer: {
      amount: "$1,200",
      sentAt: "2024-02-15T10:00:00Z",
      respondedAt: "2024-02-16T14:30:00Z",
    },
    negotiationHistory: [
      { date: "2024-02-15", message: "Initial booking request for $1,200", sender: "user", type: "offer" },
      {
        date: "2024-02-16",
        message: "Confirmed! Looking forward to your performance.",
        sender: "venue",
        type: "message",
      },
    ],
  },
  {
    id: "2",
    venueName: "The Apollo Theater",
    eventName: "Comedy Showcase",
    eventDate: "2024-03-22",
    eventTime: "19:30",
    status: "pending",
    price: "$2,800",
    location: "Harlem, NYC",
    capacity: 1500,
    image: "/historic-theater-stage.png",
    offer: {
      amount: "$2,800",
      sentAt: "2024-02-20T09:15:00Z",
    },
    negotiationHistory: [
      { date: "2024-02-20", message: "Booking request for comedy showcase", sender: "user", type: "offer" },
      { date: "2024-02-21", message: "We can offer $2,400 for that date", sender: "venue", type: "counter" },
    ],
  },
  {
    id: "3",
    venueName: "Brooklyn Bowl",
    eventName: "Indie Rock Concert",
    eventDate: "2024-04-05",
    eventTime: "21:00",
    status: "rejected",
    price: "$1,800",
    location: "Williamsburg, Brooklyn",
    capacity: 600,
    image: "/placeholder-ef8yk.png",
    offer: {
      amount: "$1,800",
      sentAt: "2024-02-18T16:45:00Z",
      respondedAt: "2024-02-19T11:20:00Z",
    },
    negotiationHistory: [
      { date: "2024-02-18", message: "Booking request for indie rock concert", sender: "user", type: "offer" },
      { date: "2024-02-19", message: "Sorry, that date is already booked", sender: "venue", type: "message" },
    ],
  },
  {
    id: "4",
    venueName: "Mercury Lounge",
    eventName: "Acoustic Session",
    eventDate: "2024-02-28",
    eventTime: "20:30",
    status: "completed",
    price: "$800",
    location: "Lower East Side, NYC",
    capacity: 250,
    image: "/intimate-music-venue.png",
    offer: {
      amount: "$800",
      sentAt: "2024-01-15T12:00:00Z",
      respondedAt: "2024-01-16T09:30:00Z",
    },
  },
]

export default function BookingsPage() {
  const [bookings] = useState<Booking[]>(mockBookings)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-600"
      case "pending":
        return "bg-yellow-600"
      case "rejected":
        return "bg-red-600"
      case "completed":
        return "bg-blue-600"
      default:
        return "bg-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return "✓"
      case "pending":
        return "⏳"
      case "rejected":
        return "✗"
      case "completed":
        return "🎉"
      default:
        return "?"
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "all") return true
    return booking.status === activeTab
  })

  const handleSendCounterOffer = (bookingId: string, amount: string) => {
    // Handle counter offer logic
    console.log(`Sending counter offer for booking ${bookingId}: ${amount}`)
    alert(`Counter offer of ${amount} sent!`)
  }

  const handleAcceptOffer = (bookingId: string) => {
    // Handle accept offer logic
    console.log(`Accepting offer for booking ${bookingId}`)
    alert("Offer accepted!")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">My Bookings</h1>
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            onClick={() => (window.location.href = "/dashboard/search")}
          >
            + New Booking
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="all" className="data-[state=active]:bg-white/20 text-white">
              All ({bookings.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-white/20 text-white">
              Pending ({bookings.filter((b) => b.status === "pending").length})
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="data-[state=active]:bg-white/20 text-white">
              Confirmed ({bookings.filter((b) => b.status === "confirmed").length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-white/20 text-white">
              Completed ({bookings.filter((b) => b.status === "completed").length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-white/20 text-white">
              Rejected ({bookings.filter((b) => b.status === "rejected").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="grid gap-6">
              {filteredBookings.map((booking) => (
                <Card
                  key={booking.id}
                  className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-6">
                      <img
                        src={booking.image || "/placeholder.svg"}
                        alt={booking.venueName}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-1">{booking.eventName}</h3>
                            <p className="text-white/70">
                              {booking.venueName} • {booking.location}
                            </p>
                          </div>
                          <Badge className={`${getStatusColor(booking.status)} text-white`}>
                            {getStatusIcon(booking.status)}{" "}
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <span className="text-white/60 text-sm">Date & Time</span>
                            <p className="text-white">
                              {new Date(booking.eventDate).toLocaleDateString()} at {booking.eventTime}
                            </p>
                          </div>
                          <div>
                            <span className="text-white/60 text-sm">Capacity</span>
                            <p className="text-white">{booking.capacity} people</p>
                          </div>
                          <div>
                            <span className="text-white/60 text-sm">Price</span>
                            <p className="text-white font-semibold">{booking.price}</p>
                          </div>
                        </div>

                        {booking.status === "pending" && booking.negotiationHistory && (
                          <div className="bg-white/5 rounded-lg p-4 mb-4">
                            <h4 className="text-white font-medium mb-2">Latest Update</h4>
                            <p className="text-white/70 text-sm">
                              {booking.negotiationHistory[booking.negotiationHistory.length - 1]?.message}
                            </p>
                            {booking.negotiationHistory[booking.negotiationHistory.length - 1]?.type === "counter" && (
                              <div className="flex space-x-2 mt-3">
                                <Button
                                  size="sm"
                                  onClick={() => handleAcceptOffer(booking.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Accept $2,400
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSendCounterOffer(booking.id, "$2,600")}
                                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                                >
                                  Counter Offer
                                </Button>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBooking(booking)}
                            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                          >
                            View Details
                          </Button>

                          {booking.status === "confirmed" && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                              Manage Event
                            </Button>
                          )}

                          {booking.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 bg-transparent"
                            >
                              Follow Up
                            </Button>
                          )}

                          {booking.status === "rejected" && (
                            <Button
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                              onClick={() => (window.location.href = "/dashboard/search")}
                            >
                              Find Alternative
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedBooking.eventName}</h2>
                    <p className="text-white/70">
                      {selectedBooking.venueName} • {selectedBooking.location}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedBooking(null)}
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    ✕
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <img
                      src={selectedBooking.image || "/placeholder.svg"}
                      alt={selectedBooking.venueName}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/60">Status:</span>
                        <Badge className={`${getStatusColor(selectedBooking.status)} text-white`}>
                          {getStatusIcon(selectedBooking.status)}{" "}
                          {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Date:</span>
                        <span className="text-white">{new Date(selectedBooking.eventDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Time:</span>
                        <span className="text-white">{selectedBooking.eventTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Capacity:</span>
                        <span className="text-white">{selectedBooking.capacity} people</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Price:</span>
                        <span className="text-white font-semibold">{selectedBooking.price}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-4">Negotiation History</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {selectedBooking.negotiationHistory?.map((item, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${item.sender === "user" ? "bg-purple-500/20 ml-4" : "bg-white/10 mr-4"}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white/80 text-sm font-medium">
                              {item.sender === "user" ? "You" : selectedBooking.venueName}
                            </span>
                            <span className="text-white/60 text-xs">{item.date}</span>
                          </div>
                          <p className="text-white/90 text-sm">{item.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedBooking(null)}
                    className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    Close
                  </Button>
                  {selectedBooking.status === "confirmed" && (
                    <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      Manage Event
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
