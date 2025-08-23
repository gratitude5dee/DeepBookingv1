"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Calendar, Users, MapPin, Download, Filter } from "lucide-react"

const revenueData = [
  { month: "Jan", revenue: 12500, bookings: 8 },
  { month: "Feb", revenue: 18200, bookings: 12 },
  { month: "Mar", revenue: 15800, bookings: 10 },
  { month: "Apr", revenue: 22400, bookings: 15 },
  { month: "May", revenue: 28900, bookings: 18 },
  { month: "Jun", revenue: 31200, bookings: 20 },
]

const venuePerformance = [
  { venue: "The Fillmore", bookings: 24, revenue: 48000 },
  { venue: "Fox Theater", bookings: 18, revenue: 42000 },
  { venue: "The Independent", bookings: 15, revenue: 28500 },
  { venue: "Great American Music Hall", bookings: 12, revenue: 22800 },
]

const statusDistribution = [
  { name: "Completed", value: 35, color: "#10b981" },
  { name: "Paid", value: 28, color: "#06b6d4" },
  { name: "Contracted", value: 20, color: "#8b5cf6" },
  { name: "Negotiating", value: 12, color: "#f59e0b" },
  { name: "New", value: 5, color: "#3b82f6" },
]

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("6m")

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0)
  const totalBookings = revenueData.reduce((sum, item) => sum + item.bookings, 0)
  const avgBookingValue = totalRevenue / totalBookings

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-card-foreground">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Performance insights and booking metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="glass-card bg-transparent">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="glass-card bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {[
          { value: "1m", label: "1M" },
          { value: "3m", label: "3M" },
          { value: "6m", label: "6M" },
          { value: "1y", label: "1Y" },
        ].map(({ value, label }) => (
          <Button
            key={value}
            variant={timeRange === value ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange(value)}
            className={timeRange === value ? "" : "glass-card bg-transparent"}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${totalRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-500">+12.5%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalBookings}</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-500">+8.3%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Avg Booking Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${Math.round(avgBookingValue).toLocaleString()}</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingDown className="w-3 h-3 text-red-500" />
              <span className="text-red-500">-2.1%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Active Venues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">12</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-500">+2</span>
              <span className="text-muted-foreground">new this month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ fill: "#06b6d4", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Booking Status Distribution */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle>Booking Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {statusDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Venue Performance */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle>Venue Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={venuePerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="venue" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Bookings */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle>Monthly Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="bookings" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers Table */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>Top Performing Venues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {venuePerformance.map((venue, index) => (
              <div key={venue.venue} className="flex items-center justify-between p-4 glass-panel rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">{venue.venue}</p>
                    <p className="text-sm text-muted-foreground">{venue.bookings} bookings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">${venue.revenue.toLocaleString()}</p>
                  <Badge variant="outline" className="glass-panel bg-transparent">
                    ${Math.round(venue.revenue / venue.bookings).toLocaleString()} avg
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
