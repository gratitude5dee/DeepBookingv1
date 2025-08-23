"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, DollarSign, MapPin, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface BookingStep {
  id: number
  title: string
  description: string
  completed: boolean
}

interface BookingDetails {
  venue: string
  eventType: string
  date: string
  time: string
  duration: number
  guestCount: number
  budget: number
  requirements: string
  contactInfo: {
    name: string
    email: string
    phone: string
    company?: string
  }
  addOns: string[]
  paymentMethod: string
}

export function EnhancedBookingFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    venue: "",
    eventType: "",
    date: "",
    time: "",
    duration: 4,
    guestCount: 0,
    budget: 0,
    requirements: "",
    contactInfo: {
      name: "",
      email: "",
      phone: "",
      company: "",
    },
    addOns: [],
    paymentMethod: "",
  })

  const steps: BookingStep[] = [
    { id: 1, title: "Event Details", description: "Basic event information", completed: false },
    { id: 2, title: "Venue Selection", description: "Choose your perfect venue", completed: false },
    { id: 3, title: "Add-ons & Services", description: "Enhance your event", completed: false },
    { id: 4, title: "Contact Information", description: "Your details", completed: false },
    { id: 5, title: "Review & Payment", description: "Confirm and pay", completed: false },
  ]

  const progress = (currentStep / steps.length) * 100

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const addOnOptions = [
    {
      id: "catering",
      name: "Premium Catering",
      price: 2500,
      description: "Full-service catering with multiple courses",
    },
    {
      id: "photography",
      name: "Professional Photography",
      price: 1200,
      description: "Event photography and videography",
    },
    {
      id: "decoration",
      name: "Event Decoration",
      price: 800,
      description: "Custom decorations and floral arrangements",
    },
    { id: "sound", name: "Sound System", price: 600, description: "Professional audio equipment and setup" },
    { id: "lighting", name: "Lighting Package", price: 900, description: "Ambient and accent lighting design" },
    { id: "security", name: "Security Service", price: 400, description: "Professional security personnel" },
  ]

  const toggleAddOn = (addOnId: string) => {
    setBookingDetails((prev) => ({
      ...prev,
      addOns: prev.addOns.includes(addOnId) ? prev.addOns.filter((id) => id !== addOnId) : [...prev.addOns, addOnId],
    }))
  }

  const calculateTotal = () => {
    const basePrice = 3500 // Base venue price
    const addOnTotal = bookingDetails.addOns.reduce((total, addOnId) => {
      const addOn = addOnOptions.find((option) => option.id === addOnId)
      return total + (addOn?.price || 0)
    }, 0)
    return basePrice + addOnTotal
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-black mb-2 block">Event Type *</label>
                <Input
                  placeholder="Wedding, Corporate Event, Birthday Party..."
                  value={bookingDetails.eventType}
                  onChange={(e) => setBookingDetails((prev) => ({ ...prev, eventType: e.target.value }))}
                  className="bg-white/50 border-white/30 text-black placeholder:text-gray-600"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-black mb-2 block">Guest Count *</label>
                <Input
                  type="number"
                  placeholder="50"
                  value={bookingDetails.guestCount || ""}
                  onChange={(e) =>
                    setBookingDetails((prev) => ({ ...prev, guestCount: Number.parseInt(e.target.value) || 0 }))
                  }
                  className="bg-white/50 border-white/30 text-black placeholder:text-gray-600"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-black mb-2 block">Event Date *</label>
                <Input
                  type="date"
                  value={bookingDetails.date}
                  onChange={(e) => setBookingDetails((prev) => ({ ...prev, date: e.target.value }))}
                  className="bg-white/50 border-white/30 text-black"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-black mb-2 block">Start Time *</label>
                <Input
                  type="time"
                  value={bookingDetails.time}
                  onChange={(e) => setBookingDetails((prev) => ({ ...prev, time: e.target.value }))}
                  className="bg-white/50 border-white/30 text-black"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-black mb-2 block">Duration (hours) *</label>
                <Input
                  type="number"
                  placeholder="4"
                  value={bookingDetails.duration || ""}
                  onChange={(e) =>
                    setBookingDetails((prev) => ({ ...prev, duration: Number.parseInt(e.target.value) || 0 }))
                  }
                  className="bg-white/50 border-white/30 text-black placeholder:text-gray-600"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-black mb-2 block">Budget Range *</label>
                <Input
                  type="number"
                  placeholder="5000"
                  value={bookingDetails.budget || ""}
                  onChange={(e) =>
                    setBookingDetails((prev) => ({ ...prev, budget: Number.parseInt(e.target.value) || 0 }))
                  }
                  className="bg-white/50 border-white/30 text-black placeholder:text-gray-600"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-black mb-2 block">Special Requirements</label>
              <Textarea
                placeholder="Any special requirements, accessibility needs, or preferences..."
                value={bookingDetails.requirements}
                onChange={(e) => setBookingDetails((prev) => ({ ...prev, requirements: e.target.value }))}
                className="bg-white/50 border-white/30 text-black placeholder:text-gray-600 min-h-[100px]"
              />
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {["The Fillmore", "Great American Music Hall", "Fox Theater Oakland"].map((venue) => (
                <Card
                  key={venue}
                  className={`cursor-pointer transition-all duration-300 ${
                    bookingDetails.venue === venue
                      ? "ring-2 ring-purple-500 bg-purple-50/50"
                      : "hover:shadow-lg hover:scale-105"
                  } glass-card border-white/20`}
                  onClick={() => setBookingDetails((prev) => ({ ...prev, venue }))}
                >
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-purple-500" />
                    </div>
                    <h3 className="font-semibold text-black mb-2">{venue}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Users className="w-4 h-4" />
                      <span>Up to 500 guests</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span>From $3,500</span>
                    </div>
                    {bookingDetails.venue === venue && (
                      <Badge className="mt-2 bg-purple-100 text-purple-700">Selected</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addOnOptions.map((addOn) => (
                <Card
                  key={addOn.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    bookingDetails.addOns.includes(addOn.id)
                      ? "ring-2 ring-green-500 bg-green-50/50"
                      : "hover:shadow-lg"
                  } glass-card border-white/20`}
                  onClick={() => toggleAddOn(addOn.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-black">{addOn.name}</h3>
                      <div className="text-right">
                        <div className="font-bold text-green-600">${addOn.price.toLocaleString()}</div>
                        {bookingDetails.addOns.includes(addOn.id) && (
                          <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{addOn.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-black mb-2 block">Full Name *</label>
                <Input
                  placeholder="John Doe"
                  value={bookingDetails.contactInfo.name}
                  onChange={(e) =>
                    setBookingDetails((prev) => ({
                      ...prev,
                      contactInfo: { ...prev.contactInfo, name: e.target.value },
                    }))
                  }
                  className="bg-white/50 border-white/30 text-black placeholder:text-gray-600"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-black mb-2 block">Email Address *</label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={bookingDetails.contactInfo.email}
                  onChange={(e) =>
                    setBookingDetails((prev) => ({
                      ...prev,
                      contactInfo: { ...prev.contactInfo, email: e.target.value },
                    }))
                  }
                  className="bg-white/50 border-white/30 text-black placeholder:text-gray-600"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-black mb-2 block">Phone Number *</label>
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={bookingDetails.contactInfo.phone}
                  onChange={(e) =>
                    setBookingDetails((prev) => ({
                      ...prev,
                      contactInfo: { ...prev.contactInfo, phone: e.target.value },
                    }))
                  }
                  className="bg-white/50 border-white/30 text-black placeholder:text-gray-600"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-black mb-2 block">Company (Optional)</label>
                <Input
                  placeholder="Company Name"
                  value={bookingDetails.contactInfo.company}
                  onChange={(e) =>
                    setBookingDetails((prev) => ({
                      ...prev,
                      contactInfo: { ...prev.contactInfo, company: e.target.value },
                    }))
                  }
                  className="bg-white/50 border-white/30 text-black placeholder:text-gray-600"
                />
              </div>
            </div>
          </motion.div>
        )

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-black">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Event Type:</span>
                    <span className="ml-2 font-medium text-black">{bookingDetails.eventType}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Venue:</span>
                    <span className="ml-2 font-medium text-black">{bookingDetails.venue}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date & Time:</span>
                    <span className="ml-2 font-medium text-black">
                      {bookingDetails.date} at {bookingDetails.time}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <span className="ml-2 font-medium text-black">{bookingDetails.duration} hours</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Guest Count:</span>
                    <span className="ml-2 font-medium text-black">{bookingDetails.guestCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Contact:</span>
                    <span className="ml-2 font-medium text-black">{bookingDetails.contactInfo.name}</span>
                  </div>
                </div>

                {bookingDetails.addOns.length > 0 && (
                  <div>
                    <h4 className="font-medium text-black mb-2">Selected Add-ons:</h4>
                    <div className="space-y-2">
                      {bookingDetails.addOns.map((addOnId) => {
                        const addOn = addOnOptions.find((option) => option.id === addOnId)
                        return addOn ? (
                          <div key={addOnId} className="flex justify-between text-sm">
                            <span className="text-gray-700">{addOn.name}</span>
                            <span className="font-medium text-black">${addOn.price.toLocaleString()}</span>
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-black">Total Amount:</span>
                    <span className="text-green-600">${calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-black">Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Credit Card", "Bank Transfer", "PayPal"].map((method) => (
                    <label key={method} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={bookingDetails.paymentMethod === method}
                        onChange={(e) => setBookingDetails((prev) => ({ ...prev, paymentMethod: e.target.value }))}
                        className="text-purple-600"
                      />
                      <span className="text-black">{method}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="glass-card border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-black">Book Your Event</h2>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              Step {currentStep} of {steps.length}
            </Badge>
          </div>

          <Progress value={progress} className="mb-4" />

          <div className="flex items-center justify-between text-sm">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center space-x-2 ${
                  step.id === currentStep ? "text-purple-600 font-medium" : "text-gray-500"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    step.id < currentStep
                      ? "bg-green-500 text-white"
                      : step.id === currentStep
                        ? "bg-purple-500 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.id < currentStep ? <CheckCircle className="w-4 h-4" /> : step.id}
                </div>
                <div className="hidden md:block">
                  <div className="font-medium">{step.title}</div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="text-black">{steps[currentStep - 1]?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentStep === steps.length ? (
          <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white">
            <CheckCircle className="w-4 h-4 mr-2" />
            Confirm Booking
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            Next Step
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}
