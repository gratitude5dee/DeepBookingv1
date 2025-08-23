"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  MapPin,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  BarChart3,
} from "lucide-react"
import { motion } from "framer-motion"

interface PricingInsight {
  id: string
  type: "opportunity" | "warning" | "success"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  recommendation: string
  potentialIncrease?: number
}

interface MarketData {
  averagePrice: number
  demandLevel: "high" | "medium" | "low"
  seasonalTrend: "increasing" | "stable" | "decreasing"
  competitorCount: number
  bookingRate: number
}

export function SmartPricingEngine() {
  const [selectedVenue, setSelectedVenue] = useState("fillmore")
  const [priceOptimization, setPriceOptimization] = useState(0)

  const venues = [
    { id: "fillmore", name: "The Fillmore", currentPrice: 3500 },
    { id: "fox", name: "Fox Theater Oakland", currentPrice: 4200 },
    { id: "gamh", name: "Great American Music Hall", currentPrice: 2800 },
  ]

  const marketData: MarketData = {
    averagePrice: 3800,
    demandLevel: "high",
    seasonalTrend: "increasing",
    competitorCount: 12,
    bookingRate: 78,
  }

  const pricingInsights: PricingInsight[] = [
    {
      id: "1",
      type: "opportunity",
      title: "Weekend Premium Opportunity",
      description: "Your weekend bookings are consistently full, but prices are 15% below market average.",
      impact: "high",
      recommendation: "Increase weekend rates by 20% to maximize revenue without affecting demand.",
      potentialIncrease: 15,
    },
    {
      id: "2",
      type: "success",
      title: "Optimal Weekday Pricing",
      description: "Your weekday pricing is perfectly positioned for maximum occupancy and revenue.",
      impact: "medium",
      recommendation: "Maintain current weekday pricing strategy.",
    },
    {
      id: "3",
      type: "warning",
      title: "Holiday Season Underpricing",
      description: "December bookings are 25% higher than average, but prices haven't adjusted accordingly.",
      impact: "high",
      recommendation: "Implement dynamic holiday pricing with 30% premium for peak dates.",
      potentialIncrease: 25,
    },
    {
      id: "4",
      type: "opportunity",
      title: "Corporate Event Premium",
      description: "Corporate events show 40% higher profit margins but represent only 20% of bookings.",
      impact: "medium",
      recommendation: "Create specialized corporate packages with premium pricing.",
      potentialIncrease: 12,
    },
  ]

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <TrendingUp className="w-5 h-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case "success":
        return <CheckCircle className="w-5 h-5 text-blue-600" />
      default:
        return <Lightbulb className="w-5 h-5 text-purple-600" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "opportunity":
        return "bg-green-50 border-green-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      case "success":
        return "bg-blue-50 border-blue-200"
      default:
        return "bg-purple-50 border-purple-200"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getDemandColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case "decreasing":
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <BarChart3 className="w-4 h-4 text-gray-500" />
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setPriceOptimization(85), 1000)
    return () => clearTimeout(timer)
  }, [])

  const selectedVenueData = venues.find((v) => v.id === selectedVenue)
  const potentialRevenue = pricingInsights
    .filter((insight) => insight.potentialIncrease)
    .reduce((sum, insight) => sum + (insight.potentialIncrease || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">Smart Pricing Engine</h2>
          <p className="text-gray-600 mt-1">AI-powered pricing optimization and market insights</p>
        </div>
        <Badge className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700 border-green-200">
          <TrendingUp className="w-4 h-4 mr-1" />+{potentialRevenue}% Revenue Potential
        </Badge>
      </div>

      {/* Venue Selector */}
      <Card className="glass-card border-white/20">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {venues.map((venue) => (
              <Button
                key={venue.id}
                variant={selectedVenue === venue.id ? "default" : "outline"}
                onClick={() => setSelectedVenue(venue.id)}
                className={
                  selectedVenue === venue.id
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
                }
              >
                <MapPin className="w-4 h-4 mr-2" />
                {venue.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Pricing Overview */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                Current Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  ${selectedVenueData?.currentPrice.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Base Event Price</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">vs Market Average</span>
                  <span
                    className={`font-medium ${
                      (selectedVenueData?.currentPrice || 0) > marketData.averagePrice
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {(selectedVenueData?.currentPrice || 0) > marketData.averagePrice ? "+" : ""}
                    {(
                      (((selectedVenueData?.currentPrice || 0) - marketData.averagePrice) / marketData.averagePrice) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Booking Rate</span>
                  <span className="font-medium text-blue-600">{marketData.bookingRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Demand Level</span>
                  <Badge className={`${getDemandColor(marketData.demandLevel)} capitalize`}>
                    {marketData.demandLevel}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Market Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Market Average</span>
                <span className="font-medium text-black">${marketData.averagePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Seasonal Trend</span>
                <div className="flex items-center gap-1">
                  {getTrendIcon(marketData.seasonalTrend)}
                  <span className="font-medium text-black capitalize">{marketData.seasonalTrend}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Competitors</span>
                <span className="font-medium text-black">{marketData.competitorCount}</span>
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Price Optimization</span>
                  <span className="font-medium text-purple-600">{priceOptimization}%</span>
                </div>
                <Progress value={priceOptimization} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Insights */}
        <div className="lg:col-span-2">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-purple-500" />
                AI Pricing Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pricingInsights.map((insight, index) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getInsightIcon(insight.type)}
                        <h4 className="font-semibold text-black">{insight.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getImpactColor(insight.impact)}`}>{insight.impact} impact</Badge>
                        {insight.potentialIncrease && (
                          <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                            +{insight.potentialIncrease}%
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3">{insight.description}</p>

                    <div className="bg-white/50 p-3 rounded border border-white/30">
                      <p className="text-sm font-medium text-black mb-2">Recommendation:</p>
                      <p className="text-sm text-gray-700">{insight.recommendation}</p>
                    </div>

                    <div className="flex justify-end mt-3">
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                        Apply Recommendation
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
