"use client"

import { useEffect, useRef, useState } from "react"

interface Venue {
  id: string
  name: string
  type: string
  address: string
  latitude: number
  longitude: number
  capacity: number
  price_per_hour: number
  rating: number
  image_url?: string
  description?: string
}

interface MapboxMapProps {
  venues: Venue[]
  selectedVenue?: Venue | null
  onVenueSelect?: (venue: Venue) => void
  className?: string
}

export default function MapboxMap({ venues, selectedVenue, onVenueSelect, className = "" }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const markers = useRef<any[]>([])
  const [mapboxgl, setMapboxgl] = useState<any>(null)

  // Load Mapbox GL JS dynamically
  useEffect(() => {
    const loadMapbox = async () => {
      if (typeof window !== "undefined" && !mapboxgl) {
        const mapboxModule = await import("mapbox-gl")
        const mapboxgl = mapboxModule.default

        // Load CSS
        const link = document.createElement("link")
        link.href = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css"
        link.rel = "stylesheet"
        document.head.appendChild(link)

        setMapboxgl(mapboxgl)
      }
    }
    loadMapbox()
  }, [mapboxgl])

  // Initialize map
  useEffect(() => {
    if (!mapboxgl || !mapContainer.current || map.current) return

    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    if (!accessToken) {
      console.error("Mapbox access token is required")
      return
    }

    mapboxgl.accessToken = accessToken

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-74.006, 40.7128], // NYC default
      zoom: 12,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [mapboxgl])

  // Add venue markers
  useEffect(() => {
    if (!map.current || !mapboxgl || !venues.length) return

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove())
    markers.current = []

    // Add new markers
    venues.forEach((venue) => {
      const markerColor = getMarkerColor(venue.type)

      // Create marker element
      const markerEl = document.createElement("div")
      markerEl.className = "venue-marker"
      markerEl.style.cssText = `
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: ${markerColor};
        border: 2px solid white;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
      `

      // Hover effects
      markerEl.addEventListener("mouseenter", () => {
        markerEl.style.transform = "scale(1.2)"
        markerEl.style.zIndex = "1000"
      })

      markerEl.addEventListener("mouseleave", () => {
        markerEl.style.transform = "scale(1)"
        markerEl.style.zIndex = "1"
      })

      const marker = new mapboxgl.Marker(markerEl).setLngLat([venue.longitude, venue.latitude]).addTo(map.current)

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 15,
        className: "venue-popup",
      }).setHTML(`
        <div class="p-3 min-w-[200px]">
          <h3 class="font-semibold text-sm mb-1">${venue.name}</h3>
          <p class="text-xs text-gray-600 mb-2">${venue.type}</p>
          <p class="text-xs text-gray-700 mb-2">${venue.address}</p>
          <div class="flex justify-between items-center text-xs">
            <span class="text-green-600 font-medium">$${venue.price_per_hour}/hr</span>
            <span class="text-yellow-600">★ ${venue.rating}</span>
          </div>
        </div>
      `)

      marker.setPopup(popup)

      // Click handler
      markerEl.addEventListener("click", () => {
        if (onVenueSelect) {
          onVenueSelect(venue)
        }
      })

      markers.current.push(marker)
    })

    // Fit map to show all venues
    if (venues.length > 0) {
      const bounds = new mapboxgl.LngLatBounds()
      venues.forEach((venue) => {
        bounds.extend([venue.longitude, venue.latitude])
      })
      map.current.fitBounds(bounds, { padding: 50 })
    }
  }, [venues, mapboxgl, onVenueSelect])

  // Highlight selected venue
  useEffect(() => {
    if (!selectedVenue || !map.current) return

    map.current.flyTo({
      center: [selectedVenue.longitude, selectedVenue.latitude],
      zoom: 15,
      duration: 1000,
    })
  }, [selectedVenue])

  const getMarkerColor = (type: string): string => {
    const colors: Record<string, string> = {
      "Concert Hall": "#8B5CF6",
      Theater: "#EC4899",
      Club: "#06B6D4",
      Restaurant: "#10B981",
      Gallery: "#F59E0B",
      Rooftop: "#EF4444",
      default: "#6B7280",
    }
    return colors[type] || colors.default
  }

  if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center p-8">
          <p className="text-gray-600 mb-2">Mapbox access token required</p>
          <p className="text-sm text-gray-500">
            Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your environment variables
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden" />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h4 className="text-xs font-semibold mb-2">Venue Types</h4>
        <div className="space-y-1">
          {Object.entries({
            "Concert Hall": "#8B5CF6",
            Theater: "#EC4899",
            Club: "#06B6D4",
            Restaurant: "#10B981",
          }).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border border-white" style={{ backgroundColor: color }} />
              <span className="text-xs text-gray-700">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
