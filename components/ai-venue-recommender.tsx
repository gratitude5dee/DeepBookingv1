"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface EventDetails {
  eventType: string
  guestCount: number
  budget: number
  date: string
  location: string
  description: string
}

interface VenueRecommendation {
  name: string
  reason: string
  features: string[]
  setup: string
  catering: string
  costBreakdown: {
    venue: number
    catering: number
    extras: number
    total: number
  }
}

export function AIVenueRecommender() {
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    eventType: "",
    guestCount: 0,
    budget: 0,
    date: "",
    location: "San Francisco Bay Area",
    description: "",
  })

  const [recommendations, setRecommendations] = useState<VenueRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateRecommendations = async () => {
    if (!eventDetails.eventType || !eventDetails.guestCount || !eventDetails.budget) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log("[v0] Starting AI recommendation request...")

      const prompt = `
        As an expert event planner, recommend 3 perfect venues for this event:
        
        Event Details:
        - Type: ${eventDetails.eventType}
        - Guest Count: ${eventDetails.guestCount}
        - Budget: $${eventDetails.budget}
        - Date: ${eventDetails.date}
        - Location: ${eventDetails.location}
        - Description: ${eventDetails.description}
        
        For each venue, provide:
        1. Venue name (realistic Bay Area venue)
        2. Why it's perfect for this event
        3. 3-4 unique features that match their needs
        4. Suggested setup/layout
        5. Catering recommendations
        6. Cost breakdown (venue, catering, extras, total)
        
        Format as JSON array with this structure:
        {
          "name": "Venue Name",
          "reason": "Why it's perfect...",
          "features": ["Feature 1", "Feature 2", "Feature 3"],
          "setup": "Suggested layout...",
          "catering": "Catering recommendations...",
          "costBreakdown": {
            "venue": 2000,
            "catering": 3000,
            "extras": 500,
            "total": 5500
          }
        }
      `

      console.log("[v0] Making fetch request to /api/groq/recommend...")
      const response = await fetch("/api/groq/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response ok:", response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] API error response:", errorText)
        throw new Error(`API request failed: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("[v0] Received data:", data)

      if (!data.recommendations || !Array.isArray(data.recommendations)) {
        console.error("[v0] Invalid data structure:", data)
        throw new Error("Invalid response format from API")
      }

      console.log("[v0] Successfully got", data.recommendations.length, "recommendations")
      setRecommendations(data.recommendations)
    } catch (err) {
      console.error("[v0] AI recommendation error:", err)
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(`Failed to generate recommendations: ${errorMessage}. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <Sparkles className="w-5 h-5 text-purple-500" />
            AI Venue Finder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-black mb-2 block">Event Type *</label>
              <Input
                placeholder="e.g., Wedding, Corporate Event, Birthday Party"
                value={eventDetails.eventType}
                onChange={(e) => setEventDetails((prev) => ({ ...prev, eventType: e.target.value }))}
                className="bg-white/50 border-white/30 text-black placeholder:text-gray-600"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-black mb-2 block">Guest Count *</label>
              <Input
                type="number"
                placeholder="50"
                value={eventDetails.guestCount || ""}
                onChange={(e) =>
                  setEventDetails((prev) => ({ ...prev, guestCount: Number.parseInt(e.target.value) || 0 }))
                }
                className="bg-white/50 border-white/30 text-black placeholder:text-gray-600"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-black mb-2 block">Budget *</label>
              <Input
                type="number"
                placeholder="5000"
                value={eventDetails.budget || ""}
                onChange={(e) => setEventDetails((prev) => ({ ...prev, budget: Number.parseInt(e.target.value) || 0 }))}
                className="bg-white/50 border-white/30 text-black placeholder:text-gray-600"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-black mb-2 block">Event Date</label>
              <Input
                type="date"
                value={eventDetails.date}
                onChange={(e) => setEventDetails((prev) => ({ ...prev, date: e.target.value }))}
                className="bg-white/50 border-white/30 text-black"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-black mb-2 block">Event Description</label>
            <Textarea
              placeholder="Tell us more about your event vision, style preferences, special requirements..."
              value={eventDetails.description}
              onChange={(e) => setEventDetails((prev) => ({ ...prev, description: e.target.value }))}
              className="bg-white/50 border-white/30 text-black placeholder:text-gray-600 min-h-[100px]"
            />
          </div>

          {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}

          <Button
            onClick={generateRecommendations}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Finding Perfect Venues...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Get AI Recommendations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <AnimatePresence>
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-black mb-4">AI Recommended Venues</h3>
            {recommendations.map((venue, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card border-white/20 hover:border-purple-300/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-black text-lg">{venue.name}</CardTitle>
                        <Badge variant="secondary" className="mt-2 bg-purple-100 text-purple-700">
                          AI Recommended
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          ${venue.costBreakdown.total.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Total Estimated</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-black mb-2">Why This Venue is Perfect</h4>
                      <p className="text-gray-700">{venue.reason}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-black mb-2">Key Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {venue.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-black mb-2">Suggested Setup</h4>
                        <p className="text-sm text-gray-700">{venue.setup}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-black mb-2">Catering Recommendations</h4>
                        <p className="text-sm text-gray-700">{venue.catering}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-black mb-2">Cost Breakdown</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div className="bg-white/50 p-2 rounded">
                          <div className="text-gray-600">Venue</div>
                          <div className="font-medium text-black">${venue.costBreakdown.venue.toLocaleString()}</div>
                        </div>
                        <div className="bg-white/50 p-2 rounded">
                          <div className="text-gray-600">Catering</div>
                          <div className="font-medium text-black">${venue.costBreakdown.catering.toLocaleString()}</div>
                        </div>
                        <div className="bg-white/50 p-2 rounded">
                          <div className="text-gray-600">Extras</div>
                          <div className="font-medium text-black">${venue.costBreakdown.extras.toLocaleString()}</div>
                        </div>
                        <div className="bg-green-50 p-2 rounded border border-green-200">
                          <div className="text-green-600">Total</div>
                          <div className="font-bold text-green-700">${venue.costBreakdown.total.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                        View Venue Details
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
                      >
                        Contact Venue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
