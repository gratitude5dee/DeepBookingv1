"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import MapboxMap from "@/components/mapbox-map"

interface Venue {
  id: string
  name: string
  location: string
  type: string
  capacity: number
  priceRange: string
  rating: number
  image: string
  amenities: string[]
  availability: string
  description: string
  lat?: number
  lng?: number
}

const mockVenues: Venue[] = [
  {
    id: "1",
    name: "Blue Note Jazz Club",
    location: "Greenwich Village, NYC",
    type: "Jazz Club",
    capacity: 200,
    priceRange: "$800-1200",
    rating: 4.8,
    image: "/jazz-club-interior.png",
    amenities: ["Sound System", "Lighting", "Bar", "Piano"],
    availability: "Available",
    description: "Intimate jazz venue with world-class acoustics and historic charm.",
  },
  {
    id: "2",
    name: "The Apollo Theater",
    location: "Harlem, NYC",
    type: "Theater",
    capacity: 1500,
    priceRange: "$2000-3500",
    rating: 4.9,
    image: "/historic-theater-stage.png",
    amenities: ["Full Stage", "Dressing Rooms", "Sound System", "Lighting"],
    availability: "Limited",
    description: "Legendary theater with rich history and exceptional performance facilities.",
  },
  {
    id: "3",
    name: "Brooklyn Bowl",
    location: "Williamsburg, Brooklyn",
    type: "Music Venue",
    capacity: 600,
    priceRange: "$1200-2000",
    rating: 4.6,
    image: "/placeholder-ef8yk.png",
    amenities: ["Sound System", "Lighting", "Bar", "Bowling Lanes"],
    availability: "Available",
    description: "Unique venue combining live music with bowling and dining.",
  },
]

const venueTypes = ["All", "Jazz Club", "Theater", "Music Venue", "Concert Hall", "Bar", "Restaurant"]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("q") || "")
  const [selectedType, setSelectedType] = useState("All")
  const [venues, setVenues] = useState<Venue[]>(mockVenues)
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>(mockVenues)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)

  useEffect(() => {
    let filtered = venues

    if (searchQuery) {
      filtered = filtered.filter(
        (venue) =>
          venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          venue.type.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedType !== "All") {
      filtered = filtered.filter((venue) => venue.type === selectedType)
    }

    setFilteredVenues(filtered)
  }, [searchQuery, selectedType, venues])

  const handleBookVenue = (venue: Venue) => {
    // Navigate to booking form
    window.location.href = `/dashboard/bookings/new?venue=${venue.id}`
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Search Header */}
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold text-white">Search Venues</h1>

          <div className="flex items-center space-x-4">
            <Input
              type="text"
              placeholder="Search venues, locations, or types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl"
            />
            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl">Search</Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {venueTypes.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
                className={
                  selectedType === type
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "border-white/20 text-white hover:bg-white/10 bg-transparent"
                }
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <MapboxMap
          venues={filteredVenues.map((venue) => ({
            ...venue,
            latitude: venue.id === "1" ? 40.7308 : venue.id === "2" ? 40.8098 : 40.7214,
            longitude: venue.id === "1" ? -74.0014 : venue.id === "2" ? -73.9501 : -73.9576,
            address: venue.location,
            price_per_hour: Number.parseInt(venue.priceRange.split("-")[0].replace(/\D/g, "")) || 800,
            rating: venue.rating,
            type: venue.type,
          }))}
          onVenueSelect={setSelectedVenue}
          selectedVenue={selectedVenue}
        />

        {/* Results Count */}
        <div className="text-white/70">Found {filteredVenues.length} venues</div>

        {/* Venue Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <Card
              key={venue.id}
              className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <CardHeader className="p-0">
                <img
                  src={venue.image || "/placeholder.svg"}
                  alt={venue.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <CardTitle className="text-white text-lg mb-1">{venue.name}</CardTitle>
                    <p className="text-white/60 text-sm">{venue.location}</p>
                  </div>
                  <Badge
                    variant={venue.availability === "Available" ? "default" : "secondary"}
                    className={venue.availability === "Available" ? "bg-green-600" : "bg-yellow-600"}
                  >
                    {venue.availability}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Type:</span>
                    <span className="text-white">{venue.type}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Capacity:</span>
                    <span className="text-white">{venue.capacity} people</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Price:</span>
                    <span className="text-white">{venue.priceRange}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Rating:</span>
                    <span className="text-white">⭐ {venue.rating}</span>
                  </div>
                </div>

                <p className="text-white/70 text-sm mb-4">{venue.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {venue.amenities.slice(0, 3).map((amenity) => (
                    <Badge key={amenity} variant="outline" className="border-white/20 text-white/80 text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {venue.amenities.length > 3 && (
                    <Badge variant="outline" className="border-white/20 text-white/80 text-xs">
                      +{venue.amenities.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedVenue(venue)}
                    className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleBookVenue(venue)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Venue Details Modal */}
        {selectedVenue && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedVenue.name}</h2>
                    <p className="text-white/70">{selectedVenue.location}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedVenue(null)}
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    ✕
                  </Button>
                </div>

                <img
                  src={selectedVenue.image || "/placeholder.svg"}
                  alt={selectedVenue.name}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/70">Type:</span>
                      <span className="text-white">{selectedVenue.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Capacity:</span>
                      <span className="text-white">{selectedVenue.capacity} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Price Range:</span>
                      <span className="text-white">{selectedVenue.priceRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Rating:</span>
                      <span className="text-white">⭐ {selectedVenue.rating}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedVenue.amenities.map((amenity) => (
                        <Badge key={amenity} variant="outline" className="border-white/20 text-white/80">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-2">Description</h3>
                  <p className="text-white/70">{selectedVenue.description}</p>
                </div>

                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedVenue(null)}
                    className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => handleBookVenue(selectedVenue)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    Book This Venue
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
