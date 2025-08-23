"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  MapPin,
  Users,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  CreditCard,
  FileText,
  ImageIcon,
  ExternalLink,
} from "lucide-react"

interface VenueCardProps {
  venue: {
    id: string
    name: string
    location: string
    capacity: number
    imageUrl?: string
    amenities: string[]
    availableDates: string[]
    currentOffer?: number
    status: "new" | "negotiating" | "accepted" | "contracted" | "paid" | "completed"
    isSigned?: boolean
    isPaid?: boolean
    showDate?: string
    eventPosterUrl?: string
    merchLink?: string
  }
  onSendOffer?: (venueId: string, offer: number, date: string) => void
  onConfirm?: (venueId: string) => void
  onNegotiate?: (venueId: string) => void
}

export default function VenueCard({ venue, onSendOffer, onConfirm, onNegotiate }: VenueCardProps) {
  const [showOfferPanel, setShowOfferPanel] = useState(false)
  const [offerAmount, setOfferAmount] = useState(venue.currentOffer || 2500)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("20:00")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500"
      case "negotiating":
        return "bg-orange-500"
      case "accepted":
        return "bg-green-500"
      case "contracted":
        return "bg-purple-500"
      case "paid":
        return "bg-emerald-500"
      case "completed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleSendOffer = () => {
    if (selectedDate && onSendOffer) {
      onSendOffer(venue.id, offerAmount, `${selectedDate} ${selectedTime}`)
      setShowOfferPanel(false)
    }
  }

  const incrementOffer = () => setOfferAmount((prev) => prev + 100)
  const decrementOffer = () => setOfferAmount((prev) => Math.max(prev - 100, 0))

  return (
    <Card className="glass-card border-0 overflow-hidden group hover:shadow-xl transition-all duration-300 relative">
      {/* Status Badges */}
      <div className="absolute top-4 left-4 z-10">
        {venue.isSigned && (
          <Badge className="bg-purple-500 text-white border-0 shimmer mb-2">
            <CheckCircle className="w-3 h-3 mr-1" />
            Signed
          </Badge>
        )}
      </div>

      <div className="absolute top-4 right-4 z-10">
        {venue.isPaid && (
          <Badge className="bg-emerald-500 text-white border-0 shimmer">
            <CreditCard className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        )}
      </div>

      {/* Venue Image */}
      <div className="relative h-48 bg-gradient-to-br from-cyan-400 to-blue-500 overflow-hidden">
        {venue.imageUrl ? (
          <img src={venue.imageUrl || "/placeholder.svg"} alt={venue.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-white/70" />
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status Indicator */}
        <div className="absolute bottom-4 left-4">
          <Badge variant="outline" className={`${getStatusColor(venue.status)} text-white border-0`}>
            {venue.status}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Venue Info */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-card-foreground mb-2">{venue.name}</h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {venue.location}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {venue.capacity}
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1 mb-4">
            {venue.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="outline" className="text-xs glass-panel bg-transparent">
                {amenity}
              </Badge>
            ))}
            {venue.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs glass-panel bg-transparent">
                +{venue.amenities.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Date/Time Inputs */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <Label htmlFor={`date-${venue.id}`} className="text-xs text-muted-foreground">
              Show Date
            </Label>
            <Input
              id={`date-${venue.id}`}
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="glass-card border-0 text-sm"
            />
          </div>
          <div>
            <Label htmlFor={`time-${venue.id}`} className="text-xs text-muted-foreground">
              Show Time
            </Label>
            <Input
              id={`time-${venue.id}`}
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="glass-card border-0 text-sm"
            />
          </div>
        </div>

        {/* Current Offer Display */}
        {venue.currentOffer && (
          <div className="glass-panel rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Offer</span>
              <span className="font-semibold text-primary">${venue.currentOffer.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Offer Panel */}
        {showOfferPanel && (
          <div className="glass-panel rounded-lg p-4 mb-4 space-y-3">
            <Label className="text-sm font-medium">Offer Amount</Label>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={decrementOffer}
                className="glass-card bg-transparent w-8 h-8 p-0"
              >
                −
              </Button>
              <div className="flex-1 text-center">
                <span className="text-lg font-semibold text-primary">${offerAmount.toLocaleString()}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={incrementOffer}
                className="glass-card bg-transparent w-8 h-8 p-0"
              >
                +
              </Button>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSendOffer} className="flex-1" size="sm">
                Confirm Offer
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowOfferPanel(false)}
                className="glass-card bg-transparent"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {venue.status === "new" && (
            <Button onClick={() => setShowOfferPanel(!showOfferPanel)} className="w-full" disabled={!selectedDate}>
              <DollarSign className="w-4 h-4 mr-2" />
              Send Offer
            </Button>
          )}

          {venue.status === "negotiating" && (
            <div className="flex gap-2">
              <Button onClick={() => onConfirm?.(venue.id)} className="flex-1">
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm
              </Button>
              <Button
                variant="outline"
                onClick={() => onNegotiate?.(venue.id)}
                className="flex-1 glass-card bg-transparent"
              >
                Negotiate
              </Button>
            </div>
          )}

          {venue.status === "accepted" && (
            <Button className="w-full" disabled>
              <FileText className="w-4 h-4 mr-2" />
              Contract Pending
            </Button>
          )}

          {venue.status === "contracted" && (
            <Button className="w-full" disabled>
              <CreditCard className="w-4 h-4 mr-2" />
              Payment Pending
            </Button>
          )}

          {venue.status === "paid" && venue.eventPosterUrl && (
            <Button
              variant="outline"
              className="w-full glass-card bg-transparent"
              onClick={() => window.open(venue.eventPosterUrl, "_blank")}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              View Event Poster
            </Button>
          )}

          {venue.status === "completed" && venue.merchLink && (
            <Button
              variant="outline"
              className="w-full glass-card bg-transparent"
              onClick={() => window.open(venue.merchLink, "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Merch Store
            </Button>
          )}
        </div>

        {/* Show Date Display */}
        {venue.showDate && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Show: {new Date(venue.showDate).toLocaleDateString()}</span>
              <Clock className="w-4 h-4 ml-2" />
              <span>{new Date(venue.showDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
