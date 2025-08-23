"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, Maximize, Eye, Camera, MapPin } from "lucide-react"
import { motion } from "framer-motion"

interface VirtualTour {
  id: string
  venueName: string
  tourType: "360" | "walkthrough" | "ar"
  duration: string
  views: number
  rating: number
  thumbnail: string
  hotspots: Array<{
    id: string
    x: number
    y: number
    title: string
    description: string
    type: "info" | "layout" | "feature"
  }>
}

export function VirtualVenueTours() {
  const [selectedTour, setSelectedTour] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentView, setCurrentView] = useState("main")

  const tours: VirtualTour[] = [
    {
      id: "1",
      venueName: "The Fillmore",
      tourType: "360",
      duration: "8:30",
      views: 2847,
      rating: 4.9,
      thumbnail: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=300&fit=crop",
      hotspots: [
        {
          id: "1",
          x: 30,
          y: 40,
          title: "Main Stage",
          description: "Professional lighting and sound system",
          type: "feature",
        },
        {
          id: "2",
          x: 70,
          y: 60,
          title: "VIP Area",
          description: "Elevated seating with premium amenities",
          type: "layout",
        },
        {
          id: "3",
          x: 50,
          y: 80,
          title: "Bar Area",
          description: "Full-service bar with craft cocktails",
          type: "info",
        },
      ],
    },
    {
      id: "2",
      venueName: "Great American Music Hall",
      tourType: "walkthrough",
      duration: "12:15",
      views: 1923,
      rating: 4.7,
      thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      hotspots: [
        {
          id: "1",
          x: 25,
          y: 35,
          title: "Victorian Balcony",
          description: "Historic ornate balcony seating",
          type: "feature",
        },
        {
          id: "2",
          x: 60,
          y: 50,
          title: "Main Floor",
          description: "Flexible standing and seating area",
          type: "layout",
        },
        { id: "3", x: 80, y: 70, title: "Backstage", description: "Artist preparation and green room", type: "info" },
      ],
    },
    {
      id: "3",
      venueName: "Fox Theater Oakland",
      tourType: "ar",
      duration: "15:45",
      views: 3156,
      rating: 4.8,
      thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop",
      hotspots: [
        {
          id: "1",
          x: 40,
          y: 30,
          title: "Art Deco Stage",
          description: "Historic proscenium arch stage",
          type: "feature",
        },
        { id: "2", x: 55, y: 65, title: "Orchestra Pit", description: "Retractable orchestra pit", type: "layout" },
        { id: "3", x: 75, y: 45, title: "Box Seats", description: "Premium box seating with city views", type: "info" },
      ],
    },
  ]

  const selectedTourData = tours.find((tour) => tour.id === selectedTour)

  const getTourTypeColor = (type: string) => {
    switch (type) {
      case "360":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "walkthrough":
        return "bg-green-100 text-green-700 border-green-200"
      case "ar":
        return "bg-purple-100 text-purple-700 border-purple-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getHotspotColor = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-500"
      case "layout":
        return "bg-green-500"
      case "feature":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">Virtual Venue Tours</h2>
          <p className="text-gray-600 mt-1">Explore venues in immersive 360°, walkthrough, and AR experiences</p>
        </div>
        <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200">
          <Eye className="w-4 h-4 mr-1" />
          Interactive Tours
        </Badge>
      </div>

      {!selectedTour ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card
                className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedTour(tour.id)}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={tour.thumbnail || "/placeholder.svg"}
                      alt={tour.venueName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        size="lg"
                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                      >
                        <Play className="w-6 h-6 mr-2" />
                        Start Tour
                      </Button>
                    </div>
                    <div className="absolute top-3 left-3">
                      <Badge className={getTourTypeColor(tour.tourType)}>{tour.tourType.toUpperCase()}</Badge>
                    </div>
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-sm">
                      {tour.duration}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-black mb-2">{tour.venueName}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{tour.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>★</span>
                          <span>{tour.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{tour.hotspots.length} hotspots</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Tour Viewer */}
          <Card className="glass-card border-white/20">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg overflow-hidden">
                {selectedTourData && (
                  <>
                    <img
                      src={selectedTourData.thumbnail || "/placeholder.svg"}
                      alt={selectedTourData.venueName}
                      className="w-full h-full object-cover"
                    />

                    {/* Interactive Hotspots */}
                    {selectedTourData.hotspots.map((hotspot) => (
                      <motion.div
                        key={hotspot.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className={`absolute w-6 h-6 ${getHotspotColor(hotspot.type)} rounded-full cursor-pointer hover:scale-125 transition-transform duration-200 flex items-center justify-center animate-pulse`}
                        style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                        title={hotspot.title}
                      >
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </motion.div>
                    ))}

                    {/* Tour Controls */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-black/60 backdrop-blur-sm border-white/30 text-white hover:bg-black/80"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-black/60 backdrop-blur-sm border-white/30 text-white hover:bg-black/80"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-black/60 backdrop-blur-sm border-white/30 text-white hover:bg-black/80"
                        >
                          <ZoomOut className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-black/60 backdrop-blur-sm border-white/30 text-white hover:bg-black/80"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-black/60 backdrop-blur-sm border-white/30 text-white hover:bg-black/80"
                        >
                          <Maximize className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Tour Info Overlay */}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white p-3 rounded-lg">
                      <h3 className="font-semibold">{selectedTourData.venueName}</h3>
                      <p className="text-sm opacity-80">{selectedTourData.tourType.toUpperCase()} Tour</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Hotspot Information */}
          {selectedTourData && (
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  <Camera className="w-5 h-5 text-purple-500" />
                  Interactive Hotspots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedTourData.hotspots.map((hotspot) => (
                    <div key={hotspot.id} className="p-4 bg-white/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 ${getHotspotColor(hotspot.type)} rounded-full`}></div>
                        <h4 className="font-medium text-black">{hotspot.title}</h4>
                      </div>
                      <p className="text-sm text-gray-700">{hotspot.description}</p>
                      <Badge className={`mt-2 text-xs ${getTourTypeColor(hotspot.type)}`}>{hotspot.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Back Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setSelectedTour(null)}
              className="bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              ← Back to Tours
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
