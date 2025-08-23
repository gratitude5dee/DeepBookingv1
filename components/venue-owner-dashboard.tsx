"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building2,
  Calendar,
  DollarSign,
  Star,
  Users,
  TrendingUp,
  Plus,
  Edit,
  Eye,
  MessageSquare,
  BarChart3,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { motion } from "framer-motion"

interface Venue {
  id: string
  name: string
  type: string
  capacity: number
  pricePerHour: number
  rating: number
  totalBookings: number
  revenue: number
  status: "active" | "pending" | "suspended"
  images: string[]
  location: string
}

interface Booking {
  id: string
  venueName: string
  eventType: string
  date: string
  time: string
  duration: number
  guestCount: number
  customerName: string
  customerEmail: string
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  paymentStatus: "unpaid" | "paid" | "refunded"
}

interface Review {
  id: string
  venueName: string
  customerName: string
  rating: number
  comment: string
  date: string
  responded: boolean
}

export function VenueOwnerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data - in real app, this would come from Supabase
  const venues: Venue[] = [
    {
      id: "1",
      name: "Grand Ballroom",
      type: "Wedding Venue",
      capacity: 300,
      pricePerHour: 500,
      rating: 4.8,
      totalBookings: 45,
      revenue: 67500,
      status: "active",
      images: ["/placeholder.svg?height=200&width=300&text=Grand+Ballroom"],
      location: "San Francisco, CA",
    },
    {
      id: "2",
      name: "Rooftop Terrace",
      type: "Corporate Event",
      capacity: 150,
      pricePerHour: 350,
      rating: 4.6,
      totalBookings: 28,
      revenue: 39200,
      status: "active",
      images: ["/placeholder.svg?height=200&width=300&text=Rooftop+Terrace"],
      location: "Oakland, CA",
    },
  ]

  const bookings: Booking[] = [
    {
      id: "1",
      venueName: "Grand Ballroom",
      eventType: "Wedding Reception",
      date: "2024-09-15",
      time: "18:00",
      duration: 6,
      guestCount: 200,
      customerName: "Sarah Johnson",
      customerEmail: "sarah@example.com",
      totalPrice: 3000,
      status: "confirmed",
      paymentStatus: "paid",
    },
    {
      id: "2",
      venueName: "Rooftop Terrace",
      eventType: "Corporate Meeting",
      date: "2024-09-20",
      time: "14:00",
      duration: 4,
      guestCount: 80,
      customerName: "Tech Corp",
      customerEmail: "events@techcorp.com",
      totalPrice: 1400,
      status: "pending",
      paymentStatus: "unpaid",
    },
  ]

  const reviews: Review[] = [
    {
      id: "1",
      venueName: "Grand Ballroom",
      customerName: "Emily Davis",
      rating: 5,
      comment: "Absolutely stunning venue! The staff was incredibly helpful and the space was perfect for our wedding.",
      date: "2024-08-15",
      responded: false,
    },
    {
      id: "2",
      venueName: "Rooftop Terrace",
      customerName: "Mark Wilson",
      rating: 4,
      comment: "Great location with amazing city views. Could use better sound system for presentations.",
      date: "2024-08-10",
      responded: true,
    },
  ]

  const totalRevenue = venues.reduce((sum, venue) => sum + venue.revenue, 0)
  const totalBookings = venues.reduce((sum, venue) => sum + venue.totalBookings, 0)
  const averageRating = venues.reduce((sum, venue) => sum + venue.rating, 0) / venues.length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "active":
      case "paid":
        return "bg-green-100 text-green-700 border-green-200"
      case "pending":
      case "unpaid":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "cancelled":
      case "suspended":
      case "refunded":
        return "bg-red-100 text-red-700 border-red-200"
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
      case "active":
      case "paid":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
      case "unpaid":
        return <Clock className="w-4 h-4" />
      case "cancelled":
      case "suspended":
      case "refunded":
        return <XCircle className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Bookings Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your venues, bookings, and grow your business</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add New Venue
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">+12.5% from last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-blue-600">{totalBookings}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-blue-600">+8.2% from last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-card border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-yellow-600">Based on {reviews.length} reviews</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="glass-card border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Venues</p>
                  <p className="text-2xl font-bold text-purple-600">{venues.length}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <Building2 className="w-4 h-4 text-purple-500 mr-1" />
                <span className="text-purple-600">All venues active</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white/50 backdrop-blur-sm border border-white/20">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="venues" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
            <Building2 className="w-4 h-4 mr-2" />
            My Venues
          </TabsTrigger>
          <TabsTrigger
            value="bookings"
            className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Bookings
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Reviews
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Bookings */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  Recent Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                      <div>
                        <p className="font-medium text-black">{booking.eventType}</p>
                        <p className="text-sm text-gray-600">
                          {booking.venueName} • {booking.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${booking.totalPrice}</p>
                        <Badge className={`text-xs ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1">{booking.status}</span>
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Booking Rate</span>
                    <span className="font-bold text-black">78%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Event Duration</span>
                    <span className="font-bold text-black">5.2 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Customer Satisfaction</span>
                    <span className="font-bold text-black">4.7/5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Repeat Customers</span>
                    <span className="font-bold text-black">32%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="venues" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <motion.div
                key={venue.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-purple-500" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-black">{venue.name}</h3>
                          <p className="text-sm text-gray-600">{venue.type}</p>
                        </div>
                        <Badge className={`${getStatusColor(venue.status)}`}>
                          {getStatusIcon(venue.status)}
                          <span className="ml-1">{venue.status}</span>
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{venue.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>Up to {venue.capacity} guests</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>${venue.pricePerHour}/hour</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>
                            {venue.rating} ({venue.totalBookings} bookings)
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-transparent border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-transparent border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-black">Booking Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Event</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date & Time</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Guests</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Revenue</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-gray-100 hover:bg-white/20">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-black">{booking.eventType}</p>
                            <p className="text-sm text-gray-600">{booking.venueName}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-black">{booking.customerName}</p>
                            <p className="text-sm text-gray-600">{booking.customerEmail}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-black">{booking.date}</p>
                            <p className="text-sm text-gray-600">
                              {booking.time} ({booking.duration}h)
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-black">{booking.guestCount}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-green-600">${booking.totalPrice}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <Badge className={`text-xs ${getStatusColor(booking.status)}`}>
                              {getStatusIcon(booking.status)}
                              <span className="ml-1">{booking.status}</span>
                            </Badge>
                            <Badge className={`text-xs ${getStatusColor(booking.paymentStatus)}`}>
                              {getStatusIcon(booking.paymentStatus)}
                              <span className="ml-1">{booking.paymentStatus}</span>
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-transparent border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-transparent border-green-200 text-green-700 hover:bg-green-50"
                            >
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="glass-card border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-black">{review.customerName}</h3>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {review.venueName} • {review.date}
                      </p>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                    <Badge
                      className={review.responded ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}
                    >
                      {review.responded ? "Responded" : "Pending"}
                    </Badge>
                  </div>

                  {!review.responded && (
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Write your response..."
                        className="bg-white/50 border-white/30 text-black placeholder:text-gray-600"
                      />
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Send Response
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-black">Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                    <p className="text-gray-600">Revenue chart visualization</p>
                    <p className="text-sm text-gray-500">Integration with charting library needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-black">Booking Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Calendar className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600">Booking patterns visualization</p>
                    <p className="text-sm text-gray-500">Shows peak booking times and seasons</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-black">AI Insights & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Pricing Optimization</h4>
                  <p className="text-blue-700 text-sm">
                    Consider increasing weekend rates by 15% based on demand patterns. Your venues are consistently
                    booked on weekends.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">Marketing Opportunity</h4>
                  <p className="text-green-700 text-sm">
                    Corporate events show 23% higher profit margins. Consider targeting more business clients with
                    specialized packages.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-900 mb-2">Seasonal Trends</h4>
                  <p className="text-purple-700 text-sm">
                    Spring bookings are up 40% this year. Prepare for increased demand in March-May period.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
