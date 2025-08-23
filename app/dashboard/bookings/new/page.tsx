"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function NewBookingPage() {
  const searchParams = useSearchParams()
  const venueId = searchParams?.get("venue")

  const [formData, setFormData] = useState({
    venueName: "",
    eventName: "",
    eventDate: "",
    eventTime: "",
    duration: "",
    expectedAttendance: "",
    eventType: "",
    specialRequirements: "",
    budget: "",
    contactEmail: "",
    contactPhone: "",
  })

  useEffect(() => {
    if (venueId) {
      // In a real app, fetch venue details by ID
      const venueNames: { [key: string]: string } = {
        "1": "Blue Note Jazz Club",
        "2": "The Apollo Theater",
        "3": "Brooklyn Bowl",
      }
      setFormData((prev) => ({ ...prev, venueName: venueNames[venueId] || "" }))
    }
  }, [venueId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle booking submission
    console.log("Booking submitted:", formData)
    // Show success message and redirect
    alert("Booking request submitted successfully!")
    window.location.href = "/dashboard/bookings"
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Booking</h1>
          <p className="text-white/70">Fill out the details for your venue booking request</p>
        </div>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Booking Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="venueName" className="text-white">
                    Venue Name
                  </Label>
                  <Input
                    id="venueName"
                    name="venueName"
                    value={formData.venueName}
                    onChange={handleInputChange}
                    placeholder="Enter venue name"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventName" className="text-white">
                    Event Name
                  </Label>
                  <Input
                    id="eventName"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleInputChange}
                    placeholder="Enter event name"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventDate" className="text-white">
                    Event Date
                  </Label>
                  <Input
                    id="eventDate"
                    name="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventTime" className="text-white">
                    Event Time
                  </Label>
                  <Input
                    id="eventTime"
                    name="eventTime"
                    type="time"
                    value={formData.eventTime}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-white">
                    Duration (hours)
                  </Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 3"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedAttendance" className="text-white">
                    Expected Attendance
                  </Label>
                  <Input
                    id="expectedAttendance"
                    name="expectedAttendance"
                    type="number"
                    value={formData.expectedAttendance}
                    onChange={handleInputChange}
                    placeholder="Number of attendees"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventType" className="text-white">
                    Event Type
                  </Label>
                  <Input
                    id="eventType"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    placeholder="e.g., Jazz Concert, Comedy Show"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-white">
                    Budget Range
                  </Label>
                  <Input
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="e.g., $1000-1500"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="text-white">
                    Contact Email
                  </Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="text-white">
                    Contact Phone
                  </Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialRequirements" className="text-white">
                  Special Requirements
                </Label>
                <Textarea
                  id="specialRequirements"
                  name="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={handleInputChange}
                  placeholder="Any special equipment, setup requirements, or additional notes..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
                />
              </div>

              <div className="flex space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Submit Booking Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
