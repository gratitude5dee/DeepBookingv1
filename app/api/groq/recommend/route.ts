import { type NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Groq API route called")

    let groq: Groq | null = null
    try {
      if (process.env.GROQ_API_KEY) {
        groq = new Groq({
          apiKey: process.env.GROQ_API_KEY,
          dangerouslyAllowBrowser: true,
        })
        console.log("[v0] Groq client initialized successfully")
      } else {
        console.error("[v0] GROQ_API_KEY environment variable not found")
      }
    } catch (error) {
      console.error("[v0] Failed to initialize Groq client:", error)
    }

    if (!groq) {
      console.error("[v0] Groq client not initialized - using fallback recommendations")
      return NextResponse.json({
        recommendations: getFallbackRecommendations(),
        source: "fallback",
      })
    }

    const { prompt } = await request.json()
    console.log("[v0] Received prompt:", prompt?.substring(0, 100) + "...")

    if (!prompt) {
      console.error("[v0] No prompt provided")
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    console.log("[v0] Making Groq API call...")
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert event planner and venue specialist with deep knowledge of San Francisco Bay Area venues. 
          
          IMPORTANT: You must respond with ONLY a valid JSON array. No additional text, explanations, or markdown formatting.
          
          Each venue recommendation should have this exact structure:
          {
            "name": "Venue Name",
            "reason": "Why it's perfect for this event",
            "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
            "setup": "Suggested layout and setup description",
            "catering": "Catering recommendations and options",
            "costBreakdown": {
              "venue": 2000,
              "catering": 3000,
              "extras": 500,
              "total": 5500
            }
          }
          
          Provide exactly 3 venue recommendations in a JSON array format.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2000,
    })

    console.log("[v0] Groq API response received")
    const content = completion.choices[0]?.message?.content
    console.log("[v0] Raw content:", content?.substring(0, 200) + "...")

    let recommendations
    try {
      if (content) {
        // Try to parse the entire content as JSON first
        try {
          recommendations = JSON.parse(content.trim())
        } catch {
          // Try to extract JSON array from the response
          const jsonMatch = content.match(/\[[\s\S]*\]/)
          if (jsonMatch) {
            recommendations = JSON.parse(jsonMatch[0])
          } else {
            throw new Error("No valid JSON found")
          }
        }
      }

      // Validate that we have an array with proper structure
      if (!Array.isArray(recommendations) || recommendations.length === 0) {
        throw new Error("Invalid recommendations format")
      }

      console.log("[v0] Successfully parsed", recommendations.length, "recommendations")
      return NextResponse.json({ recommendations, source: "groq" })
    } catch (parseError) {
      console.error("[v0] JSON parsing error:", parseError)
      console.log("[v0] Using fallback recommendations due to parsing error")
      return NextResponse.json({
        recommendations: getFallbackRecommendations(),
        source: "fallback",
      })
    }
  } catch (error) {
    console.error("[v0] Groq API error:", error)
    console.log("[v0] Using fallback recommendations due to API error")

    return NextResponse.json({
      recommendations: getFallbackRecommendations(),
      source: "fallback",
      note: "Using fallback recommendations due to API unavailability",
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
