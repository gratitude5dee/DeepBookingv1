"use client"

import { useState } from "react"
import VenueCard from "@/components/venue-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, SortAsc } from "lucide-react"

const sampleVenues = [
  {
    id: "1",
    name: "The Fillmore",
    location: "San Francisco, CA",
    contactEmail: "booking@thefillmore.com",
    capacity: 1150,
    imageUrl: "/placeholder-c3ww0.png",
    amenities: ["Sound System", "Lighting", "Bar", "Merchandise Stand"],
    availableDates: ["2024-12-15", "2024-12-20", "2024-12-25"],
    currentOffer: 2500,
    status: "negotiating" as const,
    isSigned: false,
    isPaid: false,
    showDate: "2024-12-15T20:00:00",
  },
  {
    id: "2",
    name: "The Independent",
    location: "San Francisco, CA",
    contactEmail: "booking@theindependentsf.com",
    capacity: 500,
    imageUrl: "/placeholder-tdmg1.png",
    amenities: ["Sound System", "Lighting", "Bar", "Photo Pit"],
    availableDates: ["2024-12-18", "2024-12-22", "2024-12-28"],
    currentOffer: 1800,
    status: "accepted" as const,
    isSigned: true,
    isPaid: false,
    showDate: "2024-12-18T21:00:00",
  },
  {
    id: "3",
    name: "Fox Theater",
    location: "Oakland, CA",
    contactEmail: "booking@foxtheateroakland.com",
    capacity: 2800,
    imageUrl: "/placeholder-hd4mh.png",
    amenities: ["Sound System", "Lighting", "Bar", "VIP Area", "Balcony"],
    availableDates: ["2024-12-20", "2024-12-24", "2024-12-30"],
    currentOffer: 3200,
    status: "paid" as const,
    isSigned: true,
    isPaid: true,
    showDate: "2024-12-20T19:30:00",
    eventPosterUrl: "/concert-poster.png",
  },
  {
    id: "4",
    name: "The Catalyst",
    location: "Santa Cruz, CA",
    contactEmail: "booking@catalystclub.com",
    capacity: 800,
    imageUrl: "/placeholder-6g5z9.png",
    amenities: ["Sound System", "Lighting", "Bar", "Dance Floor"],
    availableDates: ["2024-12-16", "2024-12-21", "2024-12-26"],
    status: "new" as const,
    isSigned: false,
    isPaid: false,
  },
  {
    id: "5",
    name: "The Warfield",
    location: "San Francisco, CA",
    contactEmail: "booking@thewarfieldtheatre.com",
    capacity: 2300,
    imageUrl: "/warfield-theater.png",
    amenities: ["Sound System", "Lighting", "Bar", "Balcony", "VIP"],
    availableDates: ["2024-12-19", "2024-12-23", "2024-12-29"],
    currentOffer: 4500,
    status: "completed" as const,
    isSigned: true,
    isPaid: true,
    showDate: "2024-11-15T20:00:00",
    merchLink: "https://example.com/merch",
  },
  {
    id: "6",
    name: "Great American Music Hall",
    location: "San Francisco, CA",
    contactEmail: "booking@gamh.com",
    capacity: 470,
    imageUrl: "/great-american-music-hall.png",
    amenities: ["Sound System", "Lighting", "Bar", "Balcony"],
    availableDates: ["2024-12-17", "2024-12-24", "2024-12-31"],
    status: "new" as const,
    isSigned: false,
    isPaid: false,
  },
]

interface VenueGridProps {
  onVenueAction?: (action: string, venueId: string, data?: any) => void
}

export default function VenueGrid({ onVenueAction }: VenueGridProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [venues, setVenues] = useState(sampleVenues)

  const filteredVenues = venues.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || venue.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSendOffer = (venueId: string, offer: number, date: string) => {
    setVenues((prev) =>
      prev.map((venue) =>
        venue.id === venueId
          ? { ...venue, currentOffer: offer, showDate: date, status: "negotiating" as const }
          : venue,
      ),
    )
    onVenueAction?.("send_offer", venueId, { offer, date })

    ;(async () => {
      try {
        const venue = venues.find((v) => v.id === venueId)
        const res = await fetch("/api/agentmail/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: venueId,
            venueId,
            venueName: venue?.name || "Venue",
            venueSlug: venue?.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            offerAmount: offer,
            showDate: date,
            recipientEmail: (venue as any)?.contactEmail || "",
            strategy: "booking",
          }),
        })
        await res.json().catch(() => ({}))
      } catch {}
    })()
  }

  const handleConfirm = (venueId: string) => {
    setVenues((prev) =>
      prev.map((venue) => (venue.id === venueId ? { ...venue, status: "accepted" as const, isSigned: true } : venue)),
    )
    onVenueAction?.("confirm", venueId)
  }

  const handleNegotiate = (venueId: string) => {
    onVenueAction?.("negotiate", venueId)
  }

  const statusOptions = [
    { value: "all", label: "All Status", count: venues.length },
    { value: "new", label: "New", count: venues.filter((v) => v.status === "new").length },
    { value: "negotiating", label: "Negotiating", count: venues.filter((v) => v.status === "negotiating").length },
    { value: "accepted", label: "Accepted", count: venues.filter((v) => v.status === "accepted").length },
    { value: "paid", label: "Paid", count: venues.filter((v) => v.status === "paid").length },
  ]

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="glass-panel rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search venues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass-card border-0"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="glass-card bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" className="glass-card bg-transparent">
              <SortAsc className="w-4 h-4 mr-2" />
              Sort
            </Button>
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {statusOptions.map(({ value, label, count }) => (
            <Badge
              key={value}
              variant={statusFilter === value ? "default" : "outline"}
              className={`cursor-pointer transition-all ${
                statusFilter === value
                  ? "bg-primary text-primary-foreground"
                  : "glass-card bg-transparent hover:bg-white/20"
              }`}
              onClick={() => setStatusFilter(value)}
            >
              {label} ({count})
            </Badge>
          ))}
        </div>
      </div>

      {/* Venue Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVenues.map((venue) => (
          <VenueCard
            key={venue.id}
            venue={venue}
            onSendOffer={handleSendOffer}
            onConfirm={handleConfirm}
            onNegotiate={handleNegotiate}
          />
        ))}
      </div>

      {filteredVenues.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No venues found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
