import { createClient } from "@/lib/supabase/server"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  // if (error || !data?.user) {
  //   redirect("/auth/login")
  // }

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <div className="text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/12 backdrop-blur-sm mb-8 border border-white/20">
            <span className="text-white/95 text-base font-medium">✨ Welcome to your dashboard</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Your Booking
            </span>
            <br />
            <span className="text-white/90 font-light italic text-4xl md:text-5xl">Dashboard</span>
          </h1>

          <p className="text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
            Manage your venue bookings, track negotiations, and discover new performance spaces with intelligent AI
            assistance.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-3xl p-8 hover:bg-white/12 transition-all duration-300 group">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-200">📅</div>
            <div className="text-3xl font-bold text-white mb-2">12</div>
            <div className="text-white/75 text-base font-medium">Active Bookings</div>
          </div>

          <div className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-3xl p-8 hover:bg-white/12 transition-all duration-300 group">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-200">🎯</div>
            <div className="text-3xl font-bold text-white mb-2">8</div>
            <div className="text-white/75 text-base font-medium">Pending Offers</div>
          </div>

          <div className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-3xl p-8 hover:bg-white/12 transition-all duration-300 group">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-200">💰</div>
            <div className="text-3xl font-bold text-white mb-2">$2,450</div>
            <div className="text-white/75 text-base font-medium">This Month</div>
          </div>

          <div className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-3xl p-8 hover:bg-white/12 transition-all duration-300 group">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-200">⭐</div>
            <div className="text-3xl font-bold text-white mb-2">4.8</div>
            <div className="text-white/75 text-base font-medium">Avg Rating</div>
          </div>
        </div>

        <div className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-3xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-8">Recent Activity</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-white/8 rounded-2xl border border-white/10 hover:bg-white/12 transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></div>
                <div>
                  <div className="text-white font-semibold text-lg">Blue Note Jazz Club - Confirmed</div>
                  <div className="text-white/70 text-base mt-1">March 15, 2024 • 8:00 PM</div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-white/25 text-white hover:bg-white/15 bg-transparent rounded-xl px-6 py-3 font-medium"
              >
                View Details
              </Button>
            </div>

            <div className="flex items-center justify-between p-6 bg-white/8 rounded-2xl border border-white/10 hover:bg-white/12 transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"></div>
                <div>
                  <div className="text-white font-semibold text-lg">The Apollo Theater - Pending</div>
                  <div className="text-white/70 text-base mt-1">March 22, 2024 • 7:30 PM</div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-white/25 text-white hover:bg-white/15 bg-transparent rounded-xl px-6 py-3 font-medium"
              >
                Follow Up
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-3xl p-8 hover:bg-white/12 transition-all duration-300 cursor-pointer group">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-200">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-3">Find New Venues</h3>
            <p className="text-white/75 text-base leading-relaxed">
              Discover perfect spaces for your next performance with AI-powered recommendations
            </p>
          </div>

          <div className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-3xl p-8 hover:bg-white/12 transition-all duration-300 cursor-pointer group">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-200">📊</div>
            <h3 className="text-xl font-semibold text-white mb-3">View Analytics</h3>
            <p className="text-white/75 text-base leading-relaxed">
              Track your booking performance and revenue with detailed insights and trends
            </p>
          </div>

          <div className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-3xl p-8 hover:bg-white/12 transition-all duration-300 cursor-pointer group">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-200">💳</div>
            <h3 className="text-xl font-semibold text-white mb-3">Manage Payments</h3>
            <p className="text-white/75 text-base leading-relaxed">
              Handle invoices and payment processing with automated workflows
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
