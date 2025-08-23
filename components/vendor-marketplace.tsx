"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Utensils,
  Camera,
  Music,
  Palette,
  Truck,
  Shield,
  Star,
  MapPin,
  Search,
  Filter,
  Heart,
  MessageCircle,
} from "lucide-react"
import { motion } from "framer-motion"

interface Vendor {
  id: string
  name: string
  category: "catering" | "photography" | "entertainment" | "decoration" | "equipment" | "security"
  rating: number
  reviews: number
  priceRange: "$" | "$$" | "$$$" | "$$$$"
  location: string
  description: string
  specialties: string[]
  portfolio: string[]
  contact: {
    phone: string
    email: string
    website?: string
  }
  verified: boolean
  featured: boolean
}

export function VendorMarketplace() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])

  const vendors: Vendor[] = [
    {
      id: "1",
      name: "Gourmet Catering Co.",
      category: "catering",
      rating: 4.9,
      reviews: 127,
      priceRange: "$$$",
      location: "San Francisco, CA",
      description:
        "Premium catering services specializing in farm-to-table cuisine and custom menus for any event size.",
      specialties: ["Farm-to-table", "Vegan options", "Wine pairing", "Custom menus"],
      portfolio: [
        "https://images.unsplash.com/photo-1555244162-803834f70033?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop",
      ],
      contact: {
        phone: "(415) 555-0123",
        email: "info@gourmetcatering.com",
        website: "gourmetcatering.com",
      },
      verified: true,
      featured: true,
    },
    {
      id: "2",
      name: "Lens & Light Photography",
      category: "photography",
      rating: 4.8,
      reviews: 89,
      priceRange: "$$",
      location: "Oakland, CA",
      description:
        "Professional event photography and videography with a creative eye for capturing memorable moments.",
      specialties: ["Event photography", "Videography", "Drone shots", "Same-day editing"],
      portfolio: [
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&h=200&fit=crop",
      ],
      contact: {
        phone: "(510) 555-0456",
        email: "hello@lensandlight.com",
      },
      verified: true,
      featured: false,
    },
    {
      id: "3",
      name: "Bay Area Sound Systems",
      category: "equipment",
      rating: 4.7,
      reviews: 156,
      priceRange: "$$",
      location: "San Jose, CA",
      description: "Professional audio equipment rental and setup services for events of all sizes.",
      specialties: ["Sound systems", "Lighting", "DJ equipment", "Technical support"],
      portfolio: [
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=200&fit=crop",
      ],
      contact: {
        phone: "(408) 555-0789",
        email: "rentals@bayareasound.com",
        website: "bayareasound.com",
      },
      verified: true,
      featured: true,
    },
    {
      id: "4",
      name: "Elegant Events Decor",
      category: "decoration",
      rating: 4.9,
      reviews: 203,
      priceRange: "$$$",
      location: "San Francisco, CA",
      description:
        "Full-service event decoration and design, creating stunning atmospheres for unforgettable celebrations.",
      specialties: ["Floral arrangements", "Lighting design", "Custom backdrops", "Table settings"],
      portfolio: [
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&h=200&fit=crop",
      ],
      contact: {
        phone: "(415) 555-0321",
        email: "design@elegantevents.com",
      },
      verified: true,
      featured: false,
    },
  ]

  const categories = [
    { id: "all", label: "All Vendors", icon: Search },
    { id: "catering", label: "Catering", icon: Utensils },
    { id: "photography", label: "Photography", icon: Camera },
    { id: "entertainment", label: "Entertainment", icon: Music },
    { id: "decoration", label: "Decoration", icon: Palette },
    { id: "equipment", label: "Equipment", icon: Truck },
    { id: "security", label: "Security", icon: Shield },
  ]

  const filteredVendors = vendors.filter((vendor) => {
    const matchesCategory = activeCategory === "all" || vendor.category === activeCategory
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.specialties.some((specialty) => specialty.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const toggleFavorite = (vendorId: string) => {
    setFavorites((prev) => (prev.includes(vendorId) ? prev.filter((id) => id !== vendorId) : [...prev, vendorId]))
  }

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find((cat) => cat.id === category)
    return categoryData ? categoryData.icon : Search
  }

  const getPriceRangeColor = (priceRange: string) => {
    switch (priceRange) {
      case "$":
        return "text-green-600"
      case "$$":
        return "text-yellow-600"
      case "$$$":
        return "text-orange-600"
      case "$$$$":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">Vendor Marketplace</h2>
          <p className="text-gray-600 mt-1">Connect with trusted event professionals and service providers</p>
        </div>
        <Badge className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700 border-green-200">
          {filteredVendors.length} Vendors Available
        </Badge>
      </div>

      {/* Search and Filters */}
      <Card className="glass-card border-white/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search vendors, services, or specialties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/50 border-white/30 text-black placeholder:text-gray-600"
                />
              </div>
            </div>
            <Button variant="outline" className="bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-3 md:grid-cols-7 bg-white/50 backdrop-blur-sm border border-white/20">
          {categories.map(({ id, label, icon: Icon }) => (
            <TabsTrigger
              key={id}
              value={id}
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              <span className="hidden md:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor, index) => {
              const CategoryIcon = getCategoryIcon(vendor.category)
              return (
                <motion.div
                  key={vendor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-0">
                      {/* Portfolio Images */}
                      <div className="relative aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={vendor.portfolio[0] || "/placeholder.svg"}
                          alt={vendor.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          {vendor.verified && (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {vendor.featured && (
                            <Badge className="bg-purple-100 text-purple-700 border-purple-200">Featured</Badge>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                          onClick={() => toggleFavorite(vendor.id)}
                        >
                          <Heart
                            className={`w-4 h-4 ${favorites.includes(vendor.id) ? "fill-current text-red-500" : ""}`}
                          />
                        </Button>
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-black">{vendor.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <CategoryIcon className="w-4 h-4" />
                              <span className="capitalize">{vendor.category}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="font-medium text-black">{vendor.rating}</span>
                            </div>
                            <p className="text-xs text-gray-600">({vendor.reviews} reviews)</p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{vendor.description}</p>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{vendor.location}</span>
                          </div>
                          <span className={`font-bold ${getPriceRangeColor(vendor.priceRange)}`}>
                            {vendor.priceRange}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {vendor.specialties.slice(0, 3).map((specialty, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {specialty}
                            </Badge>
                          ))}
                          {vendor.specialties.length > 3 && (
                            <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                              +{vendor.specialties.length - 3} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Contact
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-transparent border-blue-200 text-blue-700 hover:bg-blue-50"
                          >
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {filteredVendors.length === 0 && (
        <Card className="glass-card border-white/20">
          <CardContent className="p-12 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-black mb-2">No vendors found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or browse different categories.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
