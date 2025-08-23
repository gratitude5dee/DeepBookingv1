"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Mic,
  Paperclip,
  ArrowRight,
  Plus,
  Minus,
  Star,
  Heart,
  MessageSquare,
  Bookmark,
  MapPin,
  Loader2,
  Sparkles,
} from "lucide-react"
import { AIVenueRecommender } from "@/components/ai-venue-recommender"

declare global {
  interface Window {
    mapboxgl: any
  }
}

interface Venue {
  id: string
  name: string
  address: string
  rating: number
  description: string
  image: string
  category: string
  latitude: number
  longitude: number
}

const mockVenues: Venue[] = [
  {
    id: "1",
    name: "The Fillmore",
    address: "1805 Geary Blvd, San Francisco, CA",
    rating: 4.8,
    description:
      "Historic music venue with incredible acoustics and legendary performances. Perfect for concerts and live music events.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=center",
    category: "Concert Hall",
    latitude: 37.7849,
    longitude: -122.4324,
  },
  {
    id: "2",
    name: "Fox Theater Oakland",
    address: "1807 Telegraph Ave, Oakland, CA",
    rating: 4.6,
    description:
      "Beautifully restored 1928 theater featuring state-of-the-art sound and lighting systems for unforgettable performances.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center",
    category: "Theater",
    latitude: 37.8081,
    longitude: -122.2711,
  },
  {
    id: "3",
    name: "The Independent",
    address: "628 Divisadero St, San Francisco, CA",
    rating: 4.5,
    description:
      "Intimate venue known for showcasing emerging artists and established acts in a cozy, welcoming atmosphere.",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=300&fit=crop&crop=center",
    category: "Music Venue",
    latitude: 37.7749,
    longitude: -122.437,
  },
  {
    id: "4",
    name: "Great American Music Hall",
    address: "859 O'Farrell St, San Francisco, CA",
    rating: 4.7,
    description:
      "Victorian-era venue with ornate architecture, offering an elegant setting for diverse musical performances.",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop&crop=center",
    category: "Historic Venue",
    latitude: 37.7849,
    longitude: -122.4194,
  },
]

export default function BookyPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState("searching...")
  const [showResults, setShowResults] = useState(false)
  const [venues, setVenues] = useState<Venue[]>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [animationPhase, setAnimationPhase] = useState<"idle" | "searching" | "results">("idle")
  const [visibleCards, setVisibleCards] = useState<number>(0)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [activeTab, setActiveTab] = useState<"search" | "ai">("search")

  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const markers = useRef<any[]>([])
  const popup = useRef<any>(null)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setShowResults(false)
    setAnimationPhase("searching")
    setLoadingText("searching...")

    setTimeout(() => {
      setLoadingText("thinking...")
    }, 1000)

    setTimeout(() => {
      setIsLoading(false)
      setVenues(mockVenues)
      setShowResults(true)
      setAnimationPhase("results")
      setVisibleCards(0)
    }, 2500)
  }

  useEffect(() => {
    if (showResults && mapContainer.current && !map.current) {
      const script = document.createElement("script")
      script.src = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"
      script.onload = () => {
        const link = document.createElement("link")
        link.href = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css"
        link.rel = "stylesheet"
        document.head.appendChild(link)

        if (window.mapboxgl && mapContainer.current) {
          window.mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""

          map.current = new window.mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/light-v11",
            center: [-122.4194, 37.7749],
            zoom: 11,
            attributionControl: false,
          })

          venues.forEach((venue, index) => {
            const markerElement = document.createElement("div")
            markerElement.className = "custom-marker"
            markerElement.style.cssText = `
              width: 32px;
              height: 32px;
              background: black;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              cursor: pointer;
              border: 4px solid rgba(255,255,255,0.5);
              animation: pin-drop 0.8s ease-out forwards;
              animation-delay: ${(index + 1) * 0.2}s;
              opacity: 0;
            `

            const icon = document.createElement("div")
            icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`
            markerElement.appendChild(icon)

            const marker = new window.mapboxgl.Marker(markerElement)
              .setLngLat([venue.longitude, venue.latitude])
              .addTo(map.current)

            markerElement.addEventListener("click", () => {
              if (popup.current) {
                popup.current.remove()
              }

              popup.current = new window.mapboxgl.Popup({
                offset: 25,
                className: "venue-popup",
              })
                .setLngLat([venue.longitude, venue.latitude])
                .setHTML(`
                  <div style="padding: 12px; min-width: 200px; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border-radius: 12px;">
                    <h3 style="font-weight: bold; font-size: 14px; margin-bottom: 4px; color: #111;">${venue.name}</h3>
                    <p style="font-size: 12px; color: #666; margin-bottom: 8px;">${venue.category}</p>
                    <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px;">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      <span style="font-size: 12px; font-weight: 600; color: #111;">${venue.rating}/5</span>
                    </div>
                    <p style="font-size: 12px; color: #374151; line-height: 1.4;">${venue.description}</p>
                  </div>
                `)
                .addTo(map.current)
            })

            markers.current.push(marker)
          })
        }
      }
      document.head.appendChild(script)
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
      markers.current = []
      if (popup.current) {
        popup.current.remove()
        popup.current = null
      }
    }
  }, [showResults, venues])

  useEffect(() => {
    if (animationPhase === "results" && venues.length > 0) {
      const timer = setInterval(() => {
        setVisibleCards((prev) => {
          if (prev < venues.length) {
            return prev + 1
          }
          clearInterval(timer)
          return prev
        })
      }, 150)
      return () => clearInterval(timer)
    }
  }, [animationPhase, venues.length])

  const handleLoadMore = async () => {
    setIsLoadingMore(true)

    setTimeout(() => {
      const newVenue: Venue = {
        id: `${venues.length + 1}`,
        name: "The Warfield",
        address: "982 Market St, San Francisco, CA",
        rating: 4.4,
        description:
          "Historic theater in the heart of San Francisco, featuring diverse entertainment from concerts to comedy shows.",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop&crop=center",
        category: "Theater",
        latitude: 37.7833,
        longitude: -122.4167,
      }
      setVenues((prev) => [...prev, newVenue])
      setIsLoadingMore(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleZoomIn = () => {
    if (map.current) {
      map.current.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (map.current) {
      map.current.zoomOut()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4 lg:p-6 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-200/20 to-pink-200/20 rounded-full blur-3xl animate-float-reverse" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-cyan-200/15 to-blue-200/15 rounded-full blur-2xl animate-pulse-slow" />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-2xl mx-auto mb-6">
          <div className="flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg border ring-1 ring-black/5">
              <div className="flex gap-2">
                <Button
                  variant={activeTab === "search" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("search")}
                  className={`rounded-xl px-6 py-2 transition-all duration-300 ${
                    activeTab === "search"
                      ? "bg-black text-white shadow-lg"
                      : "text-gray-600 hover:text-black hover:bg-gray-100/80"
                  }`}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search Venues
                </Button>
                <Button
                  variant={activeTab === "ai" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("ai")}
                  className={`rounded-xl px-6 py-2 transition-all duration-300 ${
                    activeTab === "ai"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-black hover:bg-gray-100/80"
                  }`}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Recommender
                  <Badge className="ml-2 bg-purple-100 text-purple-700 text-xs">NEW</Badge>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {activeTab === "search" ? (
          <>
            <div
              className={`max-w-2xl mx-auto mb-8 transition-all duration-700 ease-out ${
                animationPhase === "searching" ? "transform -translate-y-4 scale-105" : ""
              }`}
            >
              <Card className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border-0 ring-1 ring-black/5 hover:shadow-2xl transition-all duration-500">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <Search
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                          isLoading ? "text-blue-500 animate-pulse" : "text-gray-400"
                        }`}
                      />
                      <Input
                        value={isLoading ? loadingText : searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="find me performance venues in the Bay Area"
                        className="pl-10 pr-4 py-3 text-base border-0 focus:ring-0 bg-transparent placeholder:text-gray-400"
                        disabled={isLoading}
                      />
                      {isLoading && loadingText.includes("...") && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="flex space-x-1">
                            <div
                              className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            />
                            <div
                              className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            />
                            <div
                              className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 hover:bg-gray-100/80 transition-colors duration-200"
                      >
                        <Mic className="w-5 h-5 text-gray-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 hover:bg-gray-100/80 transition-colors duration-200"
                      >
                        <Paperclip className="w-5 h-5 text-gray-400" />
                      </Button>
                      <Button
                        onClick={handleSearch}
                        disabled={isLoading || !searchQuery.trim()}
                        className="bg-black hover:bg-gray-800 text-white rounded-full p-3 disabled:opacity-50 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {isLoading && (
              <div className="max-w-2xl mx-auto mb-8 animate-fade-in">
                <Card className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border-0 ring-1 ring-black/5">
                  <CardContent className="p-8 text-center">
                    <div className="relative">
                      <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
                      <div className="absolute inset-0 w-10 h-10 mx-auto">
                        <div className="w-full h-full border-2 border-blue-200 rounded-full animate-ping" />
                      </div>
                    </div>
                    <p className="text-gray-700 font-medium">Finding the perfect venues for you...</p>
                    <div className="mt-3 flex justify-center space-x-1">
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                        style={{ animationDelay: "200ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                        style={{ animationDelay: "400ms" }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {showResults && (
              <div className="space-y-8 animate-slide-up">
                <Card className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border-0 ring-1 ring-black/5 overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
                  <CardContent className="p-0">
                    <div className="relative h-80 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100">
                      <div ref={mapContainer} className="w-full h-full" />

                      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white/90 backdrop-blur-sm p-2 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
                          onClick={handleZoomIn}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white/90 backdrop-blur-sm p-2 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
                          onClick={handleZoomOut}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {venues.map((venue, index) => (
                    <Card
                      key={venue.id}
                      className={`group bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border-0 ring-1 ring-black/5 overflow-hidden hover:shadow-2xl hover:ring-black/10 transition-all duration-500 cursor-pointer ${
                        index < visibleCards ? "animate-card-reveal" : "opacity-0 translate-y-8"
                      }`}
                      style={{
                        animationDelay: `${index * 150}ms`,
                        transform: index < visibleCards ? "none" : "translateY(32px)",
                      }}
                    >
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <img
                          src={venue.image || "/placeholder.svg"}
                          alt={venue.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Badge className="absolute top-3 right-3 bg-white/95 text-gray-800 backdrop-blur-sm shadow-lg transform group-hover:scale-105 transition-transform duration-200">
                          {venue.category}
                        </Badge>
                      </div>
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-200">
                              {venue.name}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{venue.address}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-semibold text-gray-900">{venue.rating}/5</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{venue.description}</p>
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 rounded-full"
                              >
                                <Heart className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 rounded-full"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 transition-all duration-200 rounded-full"
                              >
                                <Bookmark className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Card
                    className="group bg-gradient-to-br from-gray-50/80 to-gray-100/80 backdrop-blur-xl border-2 border-dashed border-gray-300 rounded-2xl hover:border-gray-400 hover:bg-gradient-to-br hover:from-gray-100/80 hover:to-gray-200/80 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={handleLoadMore}
                  >
                    <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="w-10 h-10 text-gray-500 animate-spin mb-3" />
                          <div className="w-8 h-8 border-2 border-gray-300 rounded-full animate-ping absolute" />
                        </>
                      ) : (
                        <Plus className="w-10 h-10 text-gray-500 mb-3 group-hover:scale-110 group-hover:text-gray-700 transition-all duration-200" />
                      )}
                      <p className="text-gray-700 font-semibold">{isLoadingMore ? "Loading..." : "Add more"}</p>
                      <p className="text-gray-500 text-sm mt-1">Discover venues</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="animate-fade-in">
            <AIVenueRecommender />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes card-reveal {
          from {
            opacity: 0;
            transform: translateY(32px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes pin-drop {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0);
          }
          50% {
            transform: translateY(5px) scale(1.1);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-180deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.05); }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 10s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-card-reveal { animation: card-reveal 0.6s ease-out forwards; }
        .animate-pin-drop { animation: pin-drop 0.8s ease-out forwards; }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        :global(.custom-marker) {
          opacity: 0;
        }
        
        :global(.venue-popup .mapboxgl-popup-content) {
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(10px);
          border-radius: 12px !important;
          border: 1px solid rgba(0, 0, 0, 0.1) !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
          padding: 0 !important;
        }
        
        :global(.venue-popup .mapboxgl-popup-tip) {
          border-top-color: rgba(255, 255, 255, 0.95) !important;
        }
      `}</style>
    </div>
  )
}
