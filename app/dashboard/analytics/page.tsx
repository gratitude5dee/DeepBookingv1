"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts"

const monthlyBookings = [
  { month: "Jan", bookings: 12, revenue: 15600 },
  { month: "Feb", bookings: 19, revenue: 24800 },
  { month: "Mar", bookings: 15, revenue: 19200 },
  { month: "Apr", bookings: 22, revenue: 28600 },
  { month: "May", bookings: 18, revenue: 23400 },
  { month: "Jun", bookings: 25, revenue: 32500 },
]

const venueTypes = [
  { name: "Jazz Clubs", value: 35, color: "#8b5cf6" },
  { name: "Theaters", value: 25, color: "#06b6d4" },
  { name: "Music Venues", value: 20, color: "#10b981" },
  { name: "Bars", value: 12, color: "#f59e0b" },
  { name: "Other", value: 8, color: "#ef4444" },
]

const performanceMetrics = [
  { metric: "Booking Success Rate", value: "78%", change: "+5.2%", trend: "up" },
  { metric: "Average Response Time", value: "2.4 hrs", change: "-12%", trend: "down" },
  { metric: "Customer Satisfaction", value: "4.8/5", change: "+0.3", trend: "up" },
  { metric: "Repeat Bookings", value: "42%", change: "+8.1%", trend: "up" },
]

const topVenues = [
  { name: "Blue Note Jazz Club", bookings: 8, revenue: 9600, rating: 4.9 },
  { name: "The Apollo Theater", bookings: 6, revenue: 16800, rating: 4.8 },
  { name: "Brooklyn Bowl", bookings: 5, revenue: 7500, rating: 4.6 },
  { name: "Mercury Lounge", bookings: 4, revenue: 3200, rating: 4.7 },
  { name: "Webster Hall", bookings: 3, revenue: 4500, rating: 4.5 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months")
  const [activeTab, setActiveTab] = useState("overview")

  const totalBookings = monthlyBookings.reduce((sum, month) => sum + month.bookings, 0)
  const totalRevenue = monthlyBookings.reduce((sum, month) => sum + month.revenue, 0)
  const avgBookingValue = totalRevenue / totalBookings
  const currentMonth = monthlyBookings[monthlyBookings.length - 1]
  const previousMonth = monthlyBookings[monthlyBookings.length - 2]
  const monthlyGrowth = ((currentMonth.bookings - previousMonth.bookings) / previousMonth.bookings) * 100

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <div className="flex space-x-2">
            <Button
              variant={timeRange === "30days" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("30days")}
              className={
                timeRange === "30days"
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "border-white/20 text-white hover:bg-white/10 bg-transparent"
              }
            >
              30 Days
            </Button>
            <Button
              variant={timeRange === "6months" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("6months")}
              className={
                timeRange === "6months"
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "border-white/20 text-white hover:bg-white/10 bg-transparent"
              }
            >
              6 Months
            </Button>
            <Button
              variant={timeRange === "1year" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("1year")}
              className={
                timeRange === "1year"
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "border-white/20 text-white hover:bg-white/10 bg-transparent"
              }
            >
              1 Year
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20 text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-white/20 text-white">
              Bookings
            </TabsTrigger>
            <TabsTrigger value="revenue" className="data-[state=active]:bg-white/20 text-white">
              Revenue
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-white/20 text-white">
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="text-2xl mb-2">📅</div>
                  <div className="text-2xl font-bold text-white">{totalBookings}</div>
                  <div className="text-white/70 text-sm">Total Bookings</div>
                  <div className="text-green-400 text-xs mt-1">+{monthlyGrowth.toFixed(1)}% from last month</div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="text-2xl mb-2">💰</div>
                  <div className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
                  <div className="text-white/70 text-sm">Total Revenue</div>
                  <div className="text-green-400 text-xs mt-1">+12.3% from last month</div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-2xl font-bold text-white">${Math.round(avgBookingValue).toLocaleString()}</div>
                  <div className="text-white/70 text-sm">Avg Booking Value</div>
                  <div className="text-green-400 text-xs mt-1">+8.7% from last month</div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="text-2xl mb-2">⭐</div>
                  <div className="text-2xl font-bold text-white">4.8</div>
                  <div className="text-white/70 text-sm">Avg Rating</div>
                  <div className="text-green-400 text-xs mt-1">+0.2 from last month</div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Monthly Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      bookings: {
                        label: "Bookings",
                        color: "#8b5cf6",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyBookings}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                        <YAxis stroke="rgba(255,255,255,0.7)" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="bookings" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Venue Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: {
                        label: "Bookings",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={venueTypes}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {venueTypes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <div className="flex flex-wrap gap-4 mt-4">
                    {venueTypes.map((type) => (
                      <div key={type.name} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }}></div>
                        <span className="text-white/70 text-sm">{type.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Venues */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Top Performing Venues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topVenues.map((venue, index) => (
                    <div key={venue.name} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium">{venue.name}</p>
                          <p className="text-white/60 text-sm">⭐ {venue.rating} rating</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">${venue.revenue.toLocaleString()}</p>
                        <p className="text-white/60 text-sm">{venue.bookings} bookings</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Booking Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      bookings: {
                        label: "Bookings",
                        color: "#06b6d4",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyBookings}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                        <YAxis stroke="rgba(255,255,255,0.7)" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="bookings"
                          stroke="#06b6d4"
                          strokeWidth={3}
                          dot={{ fill: "#06b6d4", strokeWidth: 2, r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Booking Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span className="text-white">Confirmed</span>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-semibold">68%</span>
                        <div className="w-32 h-2 bg-white/10 rounded-full mt-1">
                          <div className="w-[68%] h-full bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                        <span className="text-white">Pending</span>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-semibold">22%</span>
                        <div className="w-32 h-2 bg-white/10 rounded-full mt-1">
                          <div className="w-[22%] h-full bg-yellow-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        <span className="text-white">Rejected</span>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-semibold">10%</span>
                        <div className="w-32 h-2 bg-white/10 rounded-full mt-1">
                          <div className="w-[10%] h-full bg-red-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Revenue Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Revenue",
                        color: "#10b981",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyBookings}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                        <YAxis stroke="rgba(255,255,255,0.7)" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Revenue by Venue Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {venueTypes.map((type) => (
                      <div key={type.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: type.color }}></div>
                          <span className="text-white">{type.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-white font-semibold">
                            ${Math.round((totalRevenue * type.value) / 100).toLocaleString()}
                          </span>
                          <div className="w-32 h-2 bg-white/10 rounded-full mt-1">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${type.value}%`,
                                backgroundColor: type.color,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {performanceMetrics.map((metric) => (
                <Card key={metric.metric} className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-medium">{metric.metric}</h3>
                      <div
                        className={`text-sm px-2 py-1 rounded ${
                          metric.trend === "up" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {metric.change}
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
                    <div className="text-white/60 text-sm">
                      {metric.trend === "up" ? "↗️" : "↘️"} Compared to last period
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
