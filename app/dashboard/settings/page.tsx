"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

interface UserProfile {
  name: string
  email: string
  phone: string
  bio: string
  website: string
  location: string
  performanceType: string
  experience: string
}

interface NotificationSettings {
  emailBookingUpdates: boolean
  emailPaymentReminders: boolean
  emailMarketingEmails: boolean
  pushBookingUpdates: boolean
  pushPaymentReminders: boolean
  pushNewVenues: boolean
  smsBookingUpdates: boolean
  smsPaymentReminders: boolean
}

interface SecuritySettings {
  twoFactorEnabled: boolean
  loginAlerts: boolean
  sessionTimeout: string
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [profile, setProfile] = useState<UserProfile>({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    bio: "Professional jazz musician with 10+ years of experience performing at venues across NYC.",
    website: "https://alexjohnsonmusic.com",
    location: "New York, NY",
    performanceType: "Jazz, Blues, Soul",
    experience: "10+ years",
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailBookingUpdates: true,
    emailPaymentReminders: true,
    emailMarketingEmails: false,
    pushBookingUpdates: true,
    pushPaymentReminders: true,
    pushNewVenues: false,
    smsBookingUpdates: false,
    smsPaymentReminders: true,
  })

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: "30days",
  })

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleProfileUpdate = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleNotificationUpdate = (field: keyof NotificationSettings, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [field]: value }))
  }

  const handleSecurityUpdate = (field: keyof SecuritySettings, value: string | boolean) => {
    setSecurity((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = () => {
    console.log("Saving profile:", profile)
    alert("Profile updated successfully!")
  }

  const handleSaveNotifications = () => {
    console.log("Saving notifications:", notifications)
    alert("Notification preferences updated!")
  }

  const handleSaveSecurity = () => {
    console.log("Saving security:", security)
    alert("Security settings updated!")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="profile" className="data-[state=active]:bg-white/20 text-white">
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-white/20 text-white">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-white/20 text-white">
              Security
            </TabsTrigger>
            <TabsTrigger value="account" className="data-[state=active]:bg-white/20 text-white">
              Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => handleProfileUpdate("name", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileUpdate("email", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => handleProfileUpdate("phone", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => handleProfileUpdate("location", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-white">
                      Website
                    </Label>
                    <Input
                      id="website"
                      value={profile.website}
                      onChange={(e) => handleProfileUpdate("website", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="performanceType" className="text-white">
                      Performance Type
                    </Label>
                    <Input
                      id="performanceType"
                      value={profile.performanceType}
                      onChange={(e) => handleProfileUpdate("performanceType", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-white">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => handleProfileUpdate("bio", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
                    placeholder="Tell venues about your experience and style..."
                  />
                </div>

                <Button
                  onClick={handleSaveProfile}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <div className="space-y-6">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Email Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Booking Updates</p>
                      <p className="text-white/60 text-sm">
                        Get notified about booking confirmations, rejections, and changes
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailBookingUpdates}
                      onCheckedChange={(checked) => handleNotificationUpdate("emailBookingUpdates", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Payment Reminders</p>
                      <p className="text-white/60 text-sm">Receive reminders about upcoming payments and invoices</p>
                    </div>
                    <Switch
                      checked={notifications.emailPaymentReminders}
                      onCheckedChange={(checked) => handleNotificationUpdate("emailPaymentReminders", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Marketing Emails</p>
                      <p className="text-white/60 text-sm">Get updates about new features and promotional offers</p>
                    </div>
                    <Switch
                      checked={notifications.emailMarketingEmails}
                      onCheckedChange={(checked) => handleNotificationUpdate("emailMarketingEmails", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Push Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Booking Updates</p>
                      <p className="text-white/60 text-sm">Real-time notifications for booking status changes</p>
                    </div>
                    <Switch
                      checked={notifications.pushBookingUpdates}
                      onCheckedChange={(checked) => handleNotificationUpdate("pushBookingUpdates", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Payment Reminders</p>
                      <p className="text-white/60 text-sm">Push notifications for payment due dates</p>
                    </div>
                    <Switch
                      checked={notifications.pushPaymentReminders}
                      onCheckedChange={(checked) => handleNotificationUpdate("pushPaymentReminders", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">New Venues</p>
                      <p className="text-white/60 text-sm">Get notified when new venues match your preferences</p>
                    </div>
                    <Switch
                      checked={notifications.pushNewVenues}
                      onCheckedChange={(checked) => handleNotificationUpdate("pushNewVenues", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">SMS Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Booking Updates</p>
                      <p className="text-white/60 text-sm">SMS alerts for urgent booking changes</p>
                    </div>
                    <Switch
                      checked={notifications.smsBookingUpdates}
                      onCheckedChange={(checked) => handleNotificationUpdate("smsBookingUpdates", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Payment Reminders</p>
                      <p className="text-white/60 text-sm">SMS reminders for overdue payments</p>
                    </div>
                    <Switch
                      checked={notifications.smsPaymentReminders}
                      onCheckedChange={(checked) => handleNotificationUpdate("smsPaymentReminders", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleSaveNotifications}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                Save Notification Preferences
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <div className="space-y-6">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Authentication</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Two-Factor Authentication</p>
                      <p className="text-white/60 text-sm">Add an extra layer of security to your account</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {security.twoFactorEnabled && <Badge className="bg-green-600 text-white">Enabled</Badge>}
                      <Switch
                        checked={security.twoFactorEnabled}
                        onCheckedChange={(checked) => handleSecurityUpdate("twoFactorEnabled", checked)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Login Alerts</p>
                      <p className="text-white/60 text-sm">Get notified when someone logs into your account</p>
                    </div>
                    <Switch
                      checked={security.loginAlerts}
                      onCheckedChange={(checked) => handleSecurityUpdate("loginAlerts", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Password & Sessions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Change Password</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="password"
                        placeholder="Current password"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                      <Input
                        type="password"
                        placeholder="New password"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                        Update
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Session Timeout</Label>
                    <div className="flex space-x-2">
                      <Button
                        variant={security.sessionTimeout === "1day" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSecurityUpdate("sessionTimeout", "1day")}
                        className={
                          security.sessionTimeout === "1day"
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "border-white/20 text-white hover:bg-white/10 bg-transparent"
                        }
                      >
                        1 Day
                      </Button>
                      <Button
                        variant={security.sessionTimeout === "7days" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSecurityUpdate("sessionTimeout", "7days")}
                        className={
                          security.sessionTimeout === "7days"
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "border-white/20 text-white hover:bg-white/10 bg-transparent"
                        }
                      >
                        7 Days
                      </Button>
                      <Button
                        variant={security.sessionTimeout === "30days" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSecurityUpdate("sessionTimeout", "30days")}
                        className={
                          security.sessionTimeout === "30days"
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "border-white/20 text-white hover:bg-white/10 bg-transparent"
                        }
                      >
                        30 Days
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleSaveSecurity}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                Save Security Settings
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="account" className="mt-6">
            <div className="space-y-6">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">Account Status</p>
                      <p className="text-white/60 text-sm">Your account is active and in good standing</p>
                    </div>
                    <Badge className="bg-green-600 text-white">Active</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">Member Since</p>
                      <p className="text-white/60 text-sm">January 15, 2024</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">Total Bookings</p>
                      <p className="text-white/60 text-sm">Successfully completed 47 bookings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Data & Privacy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    Download My Data
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    Privacy Settings
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-red-500/10 backdrop-blur-sm border-red-500/20">
                <CardHeader>
                  <CardTitle className="text-red-400">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-white font-medium mb-2">Delete Account</p>
                    <p className="text-white/60 text-sm mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                    >
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-xl border border-red-500/20 rounded-2xl max-w-md w-full">
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">⚠️</div>
                  <h2 className="text-xl font-bold text-white mb-2">Delete Account</h2>
                  <p className="text-white/70">
                    Are you sure you want to delete your account? This action cannot be undone and will permanently
                    remove all your data.
                  </p>
                </div>

                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      console.log("Account deletion requested")
                      alert("Account deletion request submitted. You will receive a confirmation email.")
                      setShowDeleteConfirm(false)
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
