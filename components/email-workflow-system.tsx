"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Send, Clock, CheckCircle, XCircle, Eye, Edit, Trash2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  type: "intro" | "offer" | "contract" | "invoice" | "follow-up"
  variables: string[]
}

interface EmailCampaign {
  id: string
  name: string
  template: string
  recipients: number
  sent: number
  opened: number
  clicked: number
  status: "draft" | "scheduled" | "sending" | "completed" | "failed"
  scheduledAt?: string
  createdAt: string
}

const defaultTemplates: EmailTemplate[] = [
  {
    id: "1",
    name: "Initial Inquiry Response",
    subject: "Thank you for your booking inquiry - [VENUE_NAME]",
    content: `Hi [ARTIST_NAME],

Thank you for your interest in booking [VENUE_NAME] for [EVENT_DATE]. 

We've received your inquiry and our team is reviewing the details. We'll get back to you within 24 hours with availability and pricing information.

In the meantime, feel free to check out our venue photos and technical specifications on our website.

Best regards,
[VENUE_MANAGER_NAME]
[VENUE_NAME] Team`,
    type: "intro",
    variables: ["ARTIST_NAME", "VENUE_NAME", "EVENT_DATE", "VENUE_MANAGER_NAME"],
  },
  {
    id: "2",
    name: "Booking Offer",
    subject: "Booking Offer - [VENUE_NAME] on [EVENT_DATE]",
    content: `Hi [ARTIST_NAME],

Great news! We have availability for [VENUE_NAME] on [EVENT_DATE].

Here's our offer:
- Date: [EVENT_DATE]
- Venue: [VENUE_NAME]
- Capacity: [VENUE_CAPACITY]
- Rental Fee: $[RENTAL_FEE]
- Technical Package: [TECH_PACKAGE]

This offer is valid until [OFFER_EXPIRY_DATE]. Please let us know if you'd like to proceed or if you have any questions.

Best regards,
[VENUE_MANAGER_NAME]`,
    type: "offer",
    variables: [
      "ARTIST_NAME",
      "VENUE_NAME",
      "EVENT_DATE",
      "VENUE_CAPACITY",
      "RENTAL_FEE",
      "TECH_PACKAGE",
      "OFFER_EXPIRY_DATE",
      "VENUE_MANAGER_NAME",
    ],
  },
  {
    id: "3",
    name: "Contract Ready",
    subject: "Contract Ready for Signature - [VENUE_NAME]",
    content: `Hi [ARTIST_NAME],

Your booking contract for [VENUE_NAME] on [EVENT_DATE] is ready for signature.

Please review and sign the contract using the link below:
[CONTRACT_LINK]

Key details:
- Event Date: [EVENT_DATE]
- Load-in Time: [LOAD_IN_TIME]
- Show Time: [SHOW_TIME]
- Total Amount: $[TOTAL_AMOUNT]

Please sign by [CONTRACT_DEADLINE] to secure your booking.

Best regards,
[VENUE_MANAGER_NAME]`,
    type: "contract",
    variables: [
      "ARTIST_NAME",
      "VENUE_NAME",
      "EVENT_DATE",
      "CONTRACT_LINK",
      "LOAD_IN_TIME",
      "SHOW_TIME",
      "TOTAL_AMOUNT",
      "CONTRACT_DEADLINE",
      "VENUE_MANAGER_NAME",
    ],
  },
]

const mockCampaigns: EmailCampaign[] = [
  {
    id: "1",
    name: "December Booking Confirmations",
    template: "Contract Ready",
    recipients: 15,
    sent: 15,
    opened: 12,
    clicked: 8,
    status: "completed",
    createdAt: "2024-12-01",
  },
  {
    id: "2",
    name: "New Venue Announcements",
    template: "Initial Inquiry Response",
    recipients: 50,
    sent: 35,
    opened: 28,
    clicked: 15,
    status: "sending",
    createdAt: "2024-12-10",
  },
  {
    id: "3",
    name: "Holiday Booking Offers",
    template: "Booking Offer",
    recipients: 25,
    sent: 0,
    opened: 0,
    clicked: 0,
    status: "scheduled",
    scheduledAt: "2024-12-15T10:00:00",
    createdAt: "2024-12-08",
  },
]

export default function EmailWorkflowSystem() {
  const [activeTab, setActiveTab] = useState("campaigns")
  const [templates, setTemplates] = useState<EmailTemplate[]>(defaultTemplates)
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>(mockCampaigns)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleSendEmail = (campaignId: string) => {
    setCampaigns((prev) =>
      prev.map((campaign) => (campaign.id === campaignId ? { ...campaign, status: "sending" as const } : campaign)),
    )

    toast({
      title: "Email Campaign Started",
      description: "Your email campaign is now being sent to recipients.",
    })
  }

  const handleCreateTemplate = () => {
    const newTemplate: EmailTemplate = {
      id: Date.now().toString(),
      name: "New Template",
      subject: "",
      content: "",
      type: "intro",
      variables: [],
    }
    setTemplates((prev) => [...prev, newTemplate])
    setSelectedTemplate(newTemplate)
    setIsTemplateDialogOpen(true)
  }

  const getStatusColor = (status: EmailCampaign["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "sending":
        return "bg-blue-500"
      case "scheduled":
        return "bg-yellow-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: EmailCampaign["status"]) => {
    switch (status) {
      case "completed":
        return CheckCircle
      case "sending":
        return Clock
      case "scheduled":
        return Clock
      case "failed":
        return XCircle
      default:
        return Mail
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Workflow System
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Navigation */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "campaigns" ? "default" : "outline"}
          onClick={() => setActiveTab("campaigns")}
          className={activeTab === "campaigns" ? "" : "glass-card bg-transparent"}
        >
          Campaigns
        </Button>
        <Button
          variant={activeTab === "templates" ? "default" : "outline"}
          onClick={() => setActiveTab("templates")}
          className={activeTab === "templates" ? "" : "glass-card bg-transparent"}
        >
          Templates
        </Button>
        <Button
          variant={activeTab === "analytics" ? "default" : "outline"}
          onClick={() => setActiveTab("analytics")}
          className={activeTab === "analytics" ? "" : "glass-card bg-transparent"}
        >
          Analytics
        </Button>
      </div>

      {/* Campaigns Tab */}
      {activeTab === "campaigns" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Email Campaigns</h3>
            <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  New Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-0 max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Email Campaign</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Campaign Name" className="glass-panel border-0" />
                  <Select>
                    <SelectTrigger className="glass-panel border-0">
                      <SelectValue placeholder="Select Template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input placeholder="Recipients (comma separated emails)" className="glass-panel border-0" />
                  <div className="flex gap-2">
                    <Button className="bg-primary hover:bg-primary/90">Create Campaign</Button>
                    <Button variant="outline" onClick={() => setIsCampaignDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {campaigns.map((campaign) => {
              const StatusIcon = getStatusIcon(campaign.status)
              return (
                <Card key={campaign.id} className="glass-card border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(campaign.status)}`}
                        >
                          <StatusIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-card-foreground">{campaign.name}</h4>
                          <p className="text-sm text-muted-foreground">Template: {campaign.template}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary">
                            {campaign.sent}/{campaign.recipients}
                          </div>
                          <div className="text-xs text-muted-foreground">Sent</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary">{campaign.opened}</div>
                          <div className="text-xs text-muted-foreground">Opened</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary">{campaign.clicked}</div>
                          <div className="text-xs text-muted-foreground">Clicked</div>
                        </div>
                        <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                        {campaign.status === "draft" || campaign.status === "scheduled" ? (
                          <Button
                            size="sm"
                            onClick={() => handleSendEmail(campaign.id)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Send
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" className="glass-card bg-transparent">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Email Templates</h3>
            <Button onClick={handleCreateTemplate} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </div>

          <div className="grid gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="glass-card border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-card-foreground">{template.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{template.subject}</p>
                      <Badge variant="outline" className="text-xs">
                        {template.type}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="glass-card bg-transparent">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" className="glass-card bg-transparent">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="glass-card bg-transparent text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Sent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">1,247</div>
              <p className="text-xs text-muted-foreground">+23% from last month</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Open Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">68.5%</div>
              <p className="text-xs text-muted-foreground">+5.2% from last month</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Click Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">24.3%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">156</div>
              <p className="text-xs text-muted-foreground">+18% from last month</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Template Dialog */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="glass-card border-0 max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.id ? "Edit Template" : "Create Template"}</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Template Name" value={selectedTemplate.name} className="glass-panel border-0" />
                <Select value={selectedTemplate.type}>
                  <SelectTrigger className="glass-panel border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="intro">Introduction</SelectItem>
                    <SelectItem value="offer">Booking Offer</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="invoice">Invoice</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input placeholder="Email Subject" value={selectedTemplate.subject} className="glass-panel border-0" />
              <Textarea
                placeholder="Email Content"
                value={selectedTemplate.content}
                rows={12}
                className="glass-panel border-0"
              />
              <div className="flex gap-2">
                <Button className="bg-primary hover:bg-primary/90">Save Template</Button>
                <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
