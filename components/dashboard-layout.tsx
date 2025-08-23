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
        <nav className="w-72 bg-white/8 backdrop-blur-xl border-r border-white/15 p-8">
          <div className="mb-10">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              DeepBooking
            </h1>
            <p className="text-white/60 text-sm mt-2">Intelligent venue booking</p>
          </div>

          <div className="space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 group",
                  pathname === item.href
                    ? "bg-white/20 text-white border border-white/25 shadow-lg shadow-white/5"
                    : "text-white/75 hover:text-white hover:bg-white/12 hover:border-white/20 border border-transparent",
                )}
              >
                <span className="text-xl group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                <span className="font-medium text-base">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-8 border-t border-white/10">
            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-white/5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">User Account</p>
                <p className="text-white/60 text-xs">Premium Plan</p>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="bg-white/8 backdrop-blur-xl border-b border-white/15 p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-3xl">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Find venues for your performance... (e.g., jazz venues in Brooklyn)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full bg-white/12 border-white/25 text-white placeholder:text-white/60 pr-14 rounded-2xl h-14 text-base focus:bg-white/15 focus:border-white/30 transition-all duration-200"
                  />
                  <Button
                    onClick={handleSearch}
                    size="sm"
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl"
                  >
                    🔍
                  </Button>
                </div>
              </div>

              <Button
                className="ml-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-2xl px-6 py-3 h-14 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-200"
                onClick={() => (window.location.href = "/dashboard/bookings/new")}
              >
                + Create Booking
              </Button>
            </div>
          </header>

          <main className="flex-1 p-8 overflow-auto">{children}</main>
        </div>
      </div>
    </ShaderBackground>
  )
}
