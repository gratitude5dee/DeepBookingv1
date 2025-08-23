"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, DollarSign, Mail, BarChart3, Bell, FileText, Menu, X } from "lucide-react"
import InteractiveMap from "@/components/interactive-map"
import VenueGrid from "@/components/venue-grid"
import BookingManagementTable from "@/components/booking-management-table"
import AnalyticsDashboard from "@/components/analytics-dashboard"
import ContractManagement from "@/components/contract-management"
import PaymentProcessing from "@/components/payment-processing"
import EmailWorkflowSystem from "@/components/email-workflow-system"
import BookyPage from "@/components/booky-page"
import { useToast } from "@/hooks/use-toast"

export default function BookingDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { toast } = useToast()

  const handleNewBooking = () => {
    toast({
      title: "New Booking Created",
      description: "Your booking request has been submitted successfully.",
    })
  }

  const handleMessagesClick = () => {
    toast({
      title: "Messages",
      description: "You have 3 new messages from venue managers.",
    })
  }

  const navigationItems = [
    { id: "overview", label: "Overview", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "venues", label: "Venues", icon: MapPin },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "contracts", label: "Contracts", icon: FileText },
    { id: "payments", label: "Payments", icon: DollarSign },
    { id: "emails", label: "Emails", icon: Mail },
    { id: "booky", label: "Booky", icon: MapPin },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 lg:w-72
        glass-panel border-r border-white/20
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full p-4 lg:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-primary">DeepBooking</h1>
              <p className="text-xs text-muted-foreground">Booking Platform</p>
            </div>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navigationItems.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={activeTab === id ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setActiveTab(id)
                  setSidebarOpen(false)
                }}
                className={`w-full justify-start text-sm ${
                  activeTab === id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "hover:bg-white/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4 mr-3" />
                {label}
                {id === "booky" && <Badge className="ml-auto bg-cyan-500 text-white text-xs">NEW</Badge>}
              </Button>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="space-y-3 mt-6">
            <Button
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleNewBooking}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Quick Book
            </Button>
            <Button
              variant="outline"
              className="w-full glass-card bg-white/10 hover:bg-white/20 border-white/20 text-white font-medium py-2 px-4 rounded-xl backdrop-blur-xl transition-all duration-300"
              onClick={handleMessagesClick}
            >
              <Mail className="w-4 h-4 mr-2" />
              Messages
              <Badge className="ml-auto bg-red-500 text-white text-xs">3</Badge>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden glass-panel border-b border-white/20 p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold text-primary">DeepBooking</h1>
            <Button variant="ghost" size="sm">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 lg:gap-8">
              {/* Stats Cards */}
              <div className="xl:col-span-2 space-y-4 lg:space-y-6">
                <Card className="stats-card border-0 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl shadow-2xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium uppercase tracking-wide text-black">
                      Active Bookings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-4xl lg:text-5xl font-bold mb-2 text-shadow-lg text-black">24</div>
                    <p className="text-sm text-emerald-300 font-medium">+12% from last month</p>
                  </CardContent>
                </Card>

                <Card className="stats-card border-0 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl shadow-2xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium uppercase tracking-wide text-black">
                      Total Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-4xl lg:text-5xl font-bold mb-2 text-shadow-lg text-black">$45,231</div>
                    <p className="text-sm text-emerald-300 font-medium">+8% from last month</p>
                  </CardContent>
                </Card>

                <Card className="stats-card border-0 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl shadow-2xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium uppercase tracking-wide text-black">
                      Partner Venues
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-4xl lg:text-5xl font-bold mb-2 text-shadow-lg text-black">12</div>
                    <p className="text-sm text-cyan-300 font-medium">4 new this month</p>
                  </CardContent>
                </Card>

                <Card className="stats-card border-0 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl shadow-2xl">
                  <CardHeader className="pb-3 text-black">
                    <CardTitle className="text-sm font-medium uppercase tracking-wide text-black">
                      Conversion Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-4xl lg:text-5xl font-bold mb-2 text-shadow-lg text-black">68%</div>
                    <p className="text-sm text-emerald-300 font-medium">+5% from last month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Bookings */}
              <div className="xl:col-span-3">
                <Card className="glass-card border-0">
                  <CardHeader className="pb-4 lg:pb-6">
                    <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                      <Calendar className="w-5 h-5 lg:w-6 lg:h-6" />
                      Recent Bookings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { venue: "The Fillmore", date: "Dec 15, 2024", status: "confirmed", amount: "$2,500" },
                        { venue: "Fox Theater", date: "Dec 18, 2024", status: "pending", amount: "$3,200" },
                        { venue: "The Independent", date: "Dec 22, 2024", status: "negotiating", amount: "$1,800" },
                      ].map((booking, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 glass-panel rounded-xl hover:bg-white/10 transition-all duration-300"
                        >
                          <div className="flex items-center gap-3 lg:gap-4">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                              <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-card-foreground">{booking.venue}</p>
                              <p className="text-sm text-muted-foreground">{booking.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 lg:gap-4">
                            <Badge
                              variant={booking.status === "confirmed" ? "default" : "secondary"}
                              className={booking.status === "confirmed" ? "bg-accent" : ""}
                            >
                              {booking.status}
                            </Badge>
                            <span className="font-medium text-primary">{booking.amount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "analytics" && <AnalyticsDashboard />}

          {activeTab === "venues" && (
            <div className="space-y-6">
              {/* Map Section */}
              <Card className="glass-card border-0">
                <CardHeader className="pb-4 lg:pb-6">
                  <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                    <MapPin className="w-5 h-5 lg:w-6 lg:h-6" />
                    Venue Map
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <InteractiveMap onVenueSelect={(venue) => console.log("Selected venue:", venue)} />
                </CardContent>
              </Card>

              {/* Venue Cards Section */}
              <Card className="glass-card border-0">
                <CardHeader className="pb-4 lg:pb-6">
                  <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                    <Calendar className="w-5 h-5 lg:w-6 lg:h-6" />
                    Venue Cards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VenueGrid
                    onVenueAction={(action, venueId, data) => console.log("Venue action:", action, venueId, data)}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "bookings" && <BookingManagementTable />}

          {activeTab === "contracts" && <ContractManagement />}

          {activeTab === "payments" && <PaymentProcessing />}

          {activeTab === "emails" && <EmailWorkflowSystem />}

          {activeTab === "booky" && <BookyPage />}
        </div>
      </main>
    </div>
  )
}
