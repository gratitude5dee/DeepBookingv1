"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ShaderBackground from "./shader-background"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/dashboard/search", label: "Search Venues", icon: "🔍" },
  { href: "/dashboard/bookings", label: "My Bookings", icon: "📅" },
  { href: "/dashboard/payments", label: "Payments", icon: "💰" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "📊" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to search page with query
      window.location.href = `/dashboard/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <ShaderBackground>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <nav className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              DeepBooking
            </h1>
          </div>

          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200",
                  pathname === item.href
                    ? "bg-white/20 text-white border border-white/20"
                    : "text-white/70 hover:text-white hover:bg-white/10",
                )}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Find venues for your performance... (e.g., jazz venues in Brooklyn)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-12 rounded-xl"
                  />
                  <Button
                    onClick={handleSearch}
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-3"
                  >
                    🔍
                  </Button>
                </div>
              </div>

              <Button
                className="ml-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl"
                onClick={() => (window.location.href = "/dashboard/bookings/new")}
              >
                + Create Booking
              </Button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </ShaderBackground>
  )
}
