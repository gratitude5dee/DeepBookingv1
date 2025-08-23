interface GroqRequest {
  id: string
  prompt: string
  timestamp: number
  retryCount: number
}

interface GroqResponse {
  recommendations: any[]
  source: "groq" | "cache" | "fallback"
  cached?: boolean
  performance?: {
    duration: number
    retries: number
  }
}

interface CacheEntry {
  data: any[]
  timestamp: number
  expiresAt: number
}

export class GroqAPIManager {
  private groq: any = null
  private requestQueue: GroqRequest[] = []
  private isProcessing = false
  private cache = new Map<string, CacheEntry>()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  private readonly MAX_RETRIES = 3
  private readonly RETRY_DELAY = 1000 // 1 second base delay

  constructor(apiKey: string) {
    try {
      const Groq = require("groq-sdk")
      this.groq = new Groq({
        apiKey,
        dangerouslyAllowBrowser: true,
      })
      console.log("[v0] Advanced Groq API Manager initialized")
    } catch (error) {
      console.error("[v0] Failed to initialize Groq client:", error)
    }
  }

  private generateCacheKey(prompt: string): string {
    // Create a simple hash of the prompt for caching
    let hash = 0
    for (let i = 0; i < prompt.length; i++) {
      const char = prompt.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return `groq_${Math.abs(hash)}`
  }

  private getCachedResponse(cacheKey: string): any[] | null {
    const cached = this.cache.get(cacheKey)
    if (cached && Date.now() < cached.expiresAt) {
      console.log("[v0] Using cached response")
      return cached.data
    }
    if (cached) {
      this.cache.delete(cacheKey)
    }
    return null
  }

  private setCachedResponse(cacheKey: string, data: any[]): void {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.CACHE_DURATION,
    })
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private async makeGroqRequest(prompt: string, retryCount = 0): Promise<any[]> {
    if (!this.groq) {
      throw new Error("Groq client not initialized")
    }

    try {
      console.log(`[v0] Making Groq API call (attempt ${retryCount + 1})...`)

      const completion = await this.groq.chat.completions.create({
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

      const content = completion.choices[0]?.message?.content
      if (!content) {
        throw new Error("No content received from Groq API")
      }

      console.log("[v0] Raw Groq response:", content.substring(0, 200) + "...")

      // Enhanced JSON parsing with better error handling
      let recommendations
      try {
        // Clean the content first - remove any potential problematic characters
        const cleanContent = content.trim().replace(/[\u0000-\u001F\u007F-\u009F]/g, "")

        // Try to parse the entire content as JSON first
        try {
          recommendations = JSON.parse(cleanContent)
        } catch {
          // Try to extract JSON array from the response
          const jsonMatch = cleanContent.match(/\[[\s\S]*\]/)
          if (jsonMatch) {
            recommendations = JSON.parse(jsonMatch[0])
          } else {
            throw new Error("No valid JSON array found in response")
          }
        }
      } catch (parseError) {
        console.error("[v0] JSON parsing error:", parseError)
        throw new Error(`Failed to parse Groq response: ${parseError}`)
      }

      // Validate the response structure
      if (!Array.isArray(recommendations)) {
        throw new Error("Response is not an array")
      }

      if (recommendations.length === 0) {
        throw new Error("Empty recommendations array")
      }

      // Validate each recommendation has required fields
      for (const rec of recommendations) {
        if (!rec.name || !rec.reason || !rec.features || !rec.setup || !rec.catering) {
          throw new Error("Invalid recommendation structure")
        }
      }

      console.log(`[v0] Successfully parsed ${recommendations.length} recommendations`)
      return recommendations
    } catch (error) {
      console.error(`[v0] Groq API error (attempt ${retryCount + 1}):`, error)

      if (retryCount < this.MAX_RETRIES) {
        const delayMs = this.RETRY_DELAY * Math.pow(2, retryCount) // Exponential backoff
        console.log(`[v0] Retrying in ${delayMs}ms...`)
        await this.delay(delayMs)
        return this.makeGroqRequest(prompt, retryCount + 1)
      }

      throw error
    }
  }

  async getRecommendations(prompt: string): Promise<GroqResponse> {
    const startTime = Date.now()
    const cacheKey = this.generateCacheKey(prompt)

    // Check cache first
    const cachedResponse = this.getCachedResponse(cacheKey)
    if (cachedResponse) {
      return {
        recommendations: cachedResponse,
        source: "cache",
        cached: true,
        performance: {
          duration: Date.now() - startTime,
          retries: 0,
        },
      }
    }

    try {
      const recommendations = await this.makeGroqRequest(prompt)

      // Cache the successful response
      this.setCachedResponse(cacheKey, recommendations)

      return {
        recommendations,
        source: "groq",
        cached: false,
        performance: {
          duration: Date.now() - startTime,
          retries: 0, // This would be tracked in a more sophisticated implementation
        },
      }
    } catch (error) {
      console.error("[v0] All Groq API attempts failed:", error)

      // Return fallback recommendations
      return {
        recommendations: this.getFallbackRecommendations(),
        source: "fallback",
        cached: false,
        performance: {
          duration: Date.now() - startTime,
          retries: this.MAX_RETRIES,
        },
      }
    }
  }

  private getFallbackRecommendations() {
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

  // Clean up expired cache entries
  cleanCache(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now >= entry.expiresAt) {
        this.cache.delete(key)
      }
    }
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        age: Date.now() - entry.timestamp,
        expiresIn: entry.expiresAt - Date.now(),
      })),
    }
  }
}
