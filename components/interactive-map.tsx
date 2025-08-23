"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Navigation, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Venue {
  id: string
  name: string
  location: string
  latitude: number
  longitude: number
  capacity: number
  status: "available" | "booked" | "pending"
  price: string
}

const venues: Venue[] = [
  {
    id: "1",
    name: "The Fillmore",
    location: "San Francisco, CA",
    latitude: 37.7849,
    longitude: -122.4324,
    capacity: 1150,
    status: "available",
    price: "$2,500",
  },
  {
    id: "2",
    name: "The Independent",
    location: "San Francisco, CA",
    latitude: 37.7751,
    longitude: -122.4376,
    capacity: 500,
    status: "pending",
    price: "$1,800",
  },
  {
    id: "3",
    name: "Fox Theater",
    location: "Oakland, CA",
    latitude: 37.8081,
    longitude: -122.2711,
    capacity: 2800,
    status: "booked",
    price: "$3,200",
  },
  {
    id: "4",
    name: "The Catalyst",
    location: "Santa Cruz, CA",
    latitude: 36.9741,
    longitude: -122.0308,
    capacity: 800,
    status: "available",
    price: "$2,100",
  },
]

interface InteractiveMapProps {
  onVenueSelect?: (venue: Venue) => void
}

export default function InteractiveMap({ onVenueSelect }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredVenues, setFilteredVenues] = useState(venues)

  useEffect(() => {
    const filtered = venues.filter(
      (venue) =>
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.location.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredVenues(filtered)
  }, [searchTerm])

  const handleVenueClick = (venue: Venue) => {
    setSelectedVenue(venue)
    onVenueSelect?.(venue)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-accent"
      case "pending":
        return "bg-orange-500"
      case "booked":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <div className="glass-panel rounded-xl p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search venues or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass-card border-0"
            />
          </div>
          <Button variant="outline" className="glass-card bg-transparent">
            <Navigation className="w-4 h-4 mr-2" />
            My Location
          </Button>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2">
          <Badge variant="outline" className="glass-card bg-transparent">
            All Venues
          </Badge>
          <Badge variant="outline" className="glass-card bg-transparent">
            Available
          </Badge>
          <Badge variant="outline" className="glass-card bg-transparent">
            San Francisco
          </Badge>
          <Badge variant="outline" className="glass-card bg-transparent">
            Oakland
          </Badge>
        </div>
      </div>

      {/* Interactive Map Container */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div ref={mapRef} className="relative h-96 bg-gradient-to-br from-cyan-100 to-blue-200 overflow-hidden">
          {/* Map Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Venue Markers */}
          {filteredVenues.map((venue, index) => {
            const x = 20 + index * 80 + (index % 2) * 40
            const y = 60 + index * 60 + Math.sin(index) * 30

            return (
              <div
                key={venue.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 ${
                  selectedVenue?.id === venue.id ? "scale-125 z-10" : ""
                }`}
                style={{
                  left: `${Math.min(x, 85)}%`,
                  top: `${Math.min(y, 80)}%`,
                }}
                onClick={() => handleVenueClick(venue)}
              >
                {/* Pulsing Ring */}
                <div
                  className={`absolute inset-0 rounded-full ${getStatusColor(venue.status)} opacity-30 animate-ping`}
                />

                {/* Marker */}
                <div
                  className={`w-8 h-8 rounded-full ${getStatusColor(venue.status)} flex items-center justify-center shadow-lg`}
                >
                  <MapPin className="w-4 h-4 text-white" />
                </div>

                {/* Venue Info Popup */}
                {selectedVenue?.id === venue.id && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48">
                    <div className="glass-panel rounded-lg p-3 shadow-xl">
                      <h4 className="font-semibold text-card-foreground mb-1">{venue.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{venue.location}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Capacity: {venue.capacity}</span>
                        <Badge variant="outline" className={`${getStatusColor(venue.status)} text-white border-0`}>
                          {venue.status}
                        </Badge>
                      </div>
                      <div className="mt-2 pt-2 border-t border-border">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-primary">{venue.price}</span>
                          <Button size="sm" className="h-6 text-xs">
                            Select
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 glass-panel rounded-lg p-3">
            <h5 className="text-sm font-medium mb-2 text-card-foreground">Legend</h5>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>Booked</span>
              </div>
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button size="sm" variant="outline" className="glass-card bg-transparent w-8 h-8 p-0">
              +
            </Button>
            <Button size="sm" variant="outline" className="glass-card bg-transparent w-8 h-8 p-0">
              −
            </Button>
          </div>
        </div>
      </div>

      {/* Selected Venue Details */}
      {selectedVenue && (
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-card-foreground mb-1">{selectedVenue.name}</h3>
              <p className="text-muted-foreground flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {selectedVenue.location}
              </p>
            </div>
            <Badge variant="outline" className={`${getStatusColor(selectedVenue.status)} text-white border-0`}>
              {selectedVenue.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Capacity</p>
              <p className="font-medium text-card-foreground">{selectedVenue.capacity} people</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Base Price</p>
              <p className="font-medium text-primary">{selectedVenue.price}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1">Send Booking Request</Button>
            <Button variant="outline" className="glass-card bg-transparent">
              View Details
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
