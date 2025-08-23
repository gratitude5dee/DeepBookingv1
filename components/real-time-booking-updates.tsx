"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Calendar } from "lucide-react"

interface BookingUpdate {
  id: string
  query_number: string
  venue_name: string
  contact_name: string
  status: string
  current_offer: number
  created_at: string
  updated_at: string
}

export default function RealTimeBookingUpdates() {
  const [recentUpdates, setRecentUpdates] = useState<BookingUpdate[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    // Fetch initial data
    const fetchInitialData = async () => {
      const { data, error } = await supabase
        .from("booking_queries")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(5)

      if (data && !error) {
        setRecentUpdates(data)
      }
    }

    fetchInitialData()

    // Set up real-time subscription
    const channel = supabase
      .channel("booking_updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "booking_queries",
        },
        (payload) => {
          console.log("[v0] Real-time booking update received:", payload)

          if (payload.eventType === "INSERT") {
            const newBooking = payload.new as BookingUpdate
            setRecentUpdates((prev) => [newBooking, ...prev.slice(0, 4)])

            toast({
              title: "New Booking Query",
              description: `${newBooking.contact_name} submitted a booking for ${newBooking.venue_name}`,
            })
          } else if (payload.eventType === "UPDATE") {
            const updatedBooking = payload.new as BookingUpdate
            setRecentUpdates((prev) =>
              prev.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking)),
            )

            toast({
              title: "Booking Updated",
              description: `${updatedBooking.query_number} status changed to ${updatedBooking.status}`,
            })
          }
        },
      )
      .subscribe((status) => {
        console.log("[v0] Subscription status:", status)
        setIsConnected(status === "SUBSCRIBED")
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, toast])

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

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Live Updates
          <Badge
            variant="outline"
            className={`ml-auto ${isConnected ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentUpdates.length > 0 ? (
            recentUpdates.map((update) => (
              <div key={update.id} className="flex items-center justify-between p-3 glass-panel rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground text-sm">{update.query_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {update.contact_name} • {update.venue_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusColor(update.status)} text-white border-0 text-xs`}>
                    {update.status}
                  </Badge>
                  <span className="text-xs font-medium text-primary">${update.current_offer?.toLocaleString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent updates</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
