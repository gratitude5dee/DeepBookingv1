import { type NextRequest, NextResponse } from "next/server"
import { GroqAPIManager } from "@/lib/groq-api-manager"

let groqManager: GroqAPIManager | null = null

function getGroqManager(): GroqAPIManager | null {
  if (!groqManager && process.env.GROQ_API_KEY) {
    try {
      groqManager = new GroqAPIManager(process.env.GROQ_API_KEY)
    } catch (error) {
      console.error("[v0] Failed to initialize Groq API Manager:", error)
      return null
    }
  }
  return groqManager
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Groq API route called")

    const manager = getGroqManager()
    if (!manager) {
      console.error("[v0] Groq API Manager not available - check GROQ_API_KEY")
      return NextResponse.json({
        recommendations: getFallbackRecommendations(),
        source: "fallback",
        error: "API manager not available",
      })
    }

    const { prompt } = await request.json()
    console.log("[v0] Received prompt:", prompt?.substring(0, 100) + "...")

    if (!prompt) {
      console.error("[v0] No prompt provided")
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const result = await manager.getRecommendations(prompt)

    console.log(`[v0] Returning ${result.recommendations.length} recommendations from ${result.source}`)
    if (result.performance) {
      console.log(
        `[v0] Request completed in ${result.performance.duration}ms with ${result.performance.retries} retries`,
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Unexpected error in API route:", error)
    return NextResponse.json({
      recommendations: getFallbackRecommendations(),
      source: "fallback",
      error: "Unexpected server error",
    })
  }
}

function getFallbackRecommendations() {
  return [
    {
      name: "The Fillmore",
      reason:
        "Historic venue with excellent acoustics and iconic atmosphere, perfect for memorable events with character.",
      features: ["Historic Architecture", "Professional Sound System", "Flexible Layout", "Central SF Location"],
      setup: "Cocktail style with lounge seating areas and central dance floor",
      catering: "Partner with local caterers for elevated appetizers and craft cocktails",
      costBreakdown: {
        venue: 2500,
        catering: 3500,
        extras: 800,
        total: 6800,
      },
    },
    {
      name: "Great American Music Hall",
      reason: "Intimate Victorian venue with ornate details and excellent sightlines for sophisticated gatherings.",
      features: ["Victorian Architecture", "Balcony Seating", "Full Bar", "Historic Charm"],
      setup: "Theater-style seating with cocktail reception area",
      catering: "Full-service catering with wine pairings and hors d'oeuvres",
      costBreakdown: {
        venue: 3000,
        catering: 4000,
        extras: 1000,
        total: 8000,
      },
    },
    {
      name: "Fox Theater Oakland",
      reason: "Grand Art Deco theater offering dramatic ambiance and spacious layout for larger celebrations.",
      features: ["Art Deco Design", "Large Capacity", "Professional Lighting", "Oakland Location"],
      setup: "Grand reception with multiple seating areas and stage presentation",
      catering: "Premium catering service with multiple course options",
      costBreakdown: {
        venue: 4000,
        catering: 5000,
        extras: 1200,
        total: 10200,
      },
    },
  ]
}
