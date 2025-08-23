import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <span className="text-white/90 text-sm">✨ Welcome back, {data.user.email}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Your Booking
            </span>
            <br />
            <span className="text-white font-light italic">Dashboard</span>
          </h1>

          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Manage your venue bookings, track negotiations, and discover new performance spaces.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="text-2xl mb-2">📅</div>
            <div className="text-2xl font-bold text-white">12</div>
            <div className="text-white/70 text-sm">Active Bookings</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-white">8</div>
            <div className="text-white/70 text-sm">Pending Offers</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="text-2xl mb-2">💰</div>
            <div className="text-2xl font-bold text-white">$2,450</div>
            <div className="text-white/70 text-sm">This Month</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="text-2xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-white">4.8</div>
            <div className="text-white/70 text-sm">Avg Rating</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div>
                  <div className="text-white font-medium">Blue Note Jazz Club - Confirmed</div>
                  <div className="text-white/60 text-sm">March 15, 2024 • 8:00 PM</div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                View Details
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div>
                  <div className="text-white font-medium">The Apollo Theater - Pending</div>
                  <div className="text-white/60 text-sm">March 22, 2024 • 7:30 PM</div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                Follow Up
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-white mb-2">Find New Venues</h3>
            <p className="text-white/70 text-sm">Discover perfect spaces for your next performance</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-white mb-2">View Analytics</h3>
            <p className="text-white/70 text-sm">Track your booking performance and revenue</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer">
            <div className="text-3xl mb-4">💳</div>
            <h3 className="text-lg font-semibold text-white mb-2">Manage Payments</h3>
            <p className="text-white/70 text-sm">Handle invoices and payment processing</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
