"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, Users, Plus, Search, Mail, MessageSquare, Target, ArrowLeft, Trash2, Edit } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

interface Agent {
  id: string
  name: string
  email: string
  phone: string
  level: string
  joinDate: string
  goals: string
  notes: string
  lastContact: string
}

export default function RealRosterPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [newAgent, setNewAgent] = useState({
    name: "",
    email: "",
    phone: "",
    level: "",
    goals: "",
    notes: ""
  })
  const { toast } = useToast()

  // Load agents on page load
  useEffect(() => {
    loadAgents()
  }, [])

  const loadAgents = async () => {
    try {
      const response = await fetch('/api/leadership-hub/realroster/load')
      if (response.ok) {
        const data = await response.json()
        setAgents(data.agents || [])
      }
    } catch (error) {
      console.error('Error loading agents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const agentLevels = [
    "New Agent (0-6 months)",
    "Developing Agent (6-18 months)",
    "Established Agent (1-3 years)",
    "Top Agent (3+ years)",
    "Team Leader",
    "Broker"
  ]

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file.",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/leadership-hub/realroster/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload CSV')
      }

      const data = await response.json()
      setAgents(data.agents)
      toast({
        title: "CSV uploaded successfully",
        description: `Loaded ${data.agents.length} agents.`,
      })
      // Reload agents to ensure persistence
      await loadAgents()
    } catch (error) {
      console.error('Error uploading CSV:', error)
      toast({
        title: "Upload failed",
        description: "Failed to process CSV file.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleAddAgent = async () => {
    if (!newAgent.name || !newAgent.email) {
      toast({
        title: "Missing Information",
        description: "Name and email are required.",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await fetch('/api/leadership-hub/realroster/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAgent)
      })

      if (!response.ok) {
        throw new Error('Failed to add agent')
      }

      const data = await response.json()
      setAgents([...agents, data.agent])
      setNewAgent({ name: "", email: "", phone: "", level: "", goals: "", notes: "" })
      setShowAddForm(false)
      toast({
        title: "Agent added successfully",
        description: `${data.agent.name} has been added to your roster.`,
      })
      // Reload agents to ensure persistence
      await loadAgents()
    } catch (error) {
      console.error('Error adding agent:', error)
      toast({
        title: "Add failed",
        description: "Failed to add agent.",
        variant: "destructive"
      })
    }
  }

  const handleSendEmail = async (agent: Agent) => {
    // This would integrate with your email system
    toast({
      title: "Email sent",
      description: `Email sent to ${agent.name}`,
    })
  }

  const handleSendMessage = async (agent: Agent) => {
    // This would integrate with your messaging system
    toast({
      title: "Message sent",
      description: `Message sent to ${agent.name}`,
    })
  }

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent)
    setShowEditForm(true)
  }

  const handleUpdateAgent = async () => {
    if (!editingAgent) return

    try {
      const response = await fetch(`/api/leadership-hub/realroster/update/${editingAgent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingAgent)
      })

      if (!response.ok) {
        throw new Error('Failed to update agent')
      }

      const data = await response.json()
      setAgents(agents.map(agent => agent.id === editingAgent.id ? data.agent : agent))
      setSelectedAgent(data.agent)
      setShowEditForm(false)
      setEditingAgent(null)
      toast({
        title: "Agent updated successfully",
        description: `${data.agent.name} has been updated.`,
      })
      // Reload agents to ensure persistence
      await loadAgents()
    } catch (error) {
      console.error('Error updating agent:', error)
      toast({
        title: "Update failed",
        description: "Failed to update agent.",
        variant: "destructive"
      })
    }
  }

  const handleDeleteAgent = async (agent: Agent) => {
    if (!confirm(`Are you sure you want to delete ${agent.name}?`)) return

    try {
      const response = await fetch(`/api/leadership-hub/realroster/delete/${agent.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete agent')
      }

      setAgents(agents.filter(a => a.id !== agent.id))
      if (selectedAgent?.id === agent.id) {
        setSelectedAgent(null)
      }
      toast({
        title: "Agent deleted successfully",
        description: `${agent.name} has been removed from your roster.`,
      })
      // Reload agents to ensure persistence
      await loadAgents()
    } catch (error) {
      console.error('Error deleting agent:', error)
      toast({
        title: "Delete failed",
        description: "Failed to delete agent.",
        variant: "destructive"
      })
    }
  }

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.level.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/leadership-hub">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Leadership Hub
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-green-600" />
              <h1 className="text-4xl font-bold text-gray-900">RealRoster</h1>
            </div>
            <p className="text-xl text-gray-600">Manage your agent roster and track performance</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Agent List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Agent Roster ({filteredAgents.length})</CardTitle>
                    <div className="flex gap-2">
                      <Button onClick={() => setShowAddForm(!showAddForm)} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Agent
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search agents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading agents...</p>
                    </div>
                  ) : agents.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 mb-4">No agents in your roster yet</p>
                      <div className="space-y-2">
                        <Label htmlFor="csv-upload" className="cursor-pointer">
                          <Button asChild>
                            <span>
                              <Upload className="w-4 h-4 mr-2" />
                              Upload CSV
                            </span>
                          </Button>
                        </Label>
                        <Input
                          id="csv-upload"
                          type="file"
                          accept=".csv"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                          className="hidden"
                        />
                        {isUploading && (
                          <p className="text-sm text-gray-500">Uploading...</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredAgents.map((agent) => (
                        <div
                          key={agent.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedAgent?.id === agent.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedAgent(agent)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{agent.name}</h3>
                              <p className="text-sm text-gray-600">{agent.email}</p>
                              <Badge variant="secondary" className="mt-1">
                                {agent.level}
                              </Badge>
                            </div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={(e) => {
                                e.stopPropagation()
                                handleSendEmail(agent)
                              }}>
                                <Mail className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={(e) => {
                                e.stopPropagation()
                                handleSendMessage(agent)
                              }}>
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={(e) => {
                                e.stopPropagation()
                                handleEditAgent(agent)
                              }}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteAgent(agent)
                              }}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Agent Details */}
            <div>
              {selectedAgent ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedAgent.name}</CardTitle>
                    <p className="text-sm text-gray-600">{selectedAgent.email}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <p className="text-sm">{selectedAgent.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Level</Label>
                      <Badge variant="secondary">{selectedAgent.level}</Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Goals</Label>
                      <p className="text-sm">{selectedAgent.goals || 'No goals set'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Notes</Label>
                      <p className="text-sm">{selectedAgent.notes || 'No notes'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" onClick={() => handleSendEmail(selectedAgent)}>
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleSendMessage(selectedAgent)}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditAgent(selectedAgent)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteAgent(selectedAgent)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Select an agent to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Add Agent Form */}
          {showAddForm && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Add New Agent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={newAgent.name}
                      onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                      placeholder="Agent name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newAgent.email}
                      onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                      placeholder="agent@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newAgent.phone}
                      onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })}
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="level">Level</Label>
                    <Select value={newAgent.level} onValueChange={(value) => setNewAgent({ ...newAgent, level: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {agentLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="goals">Goals</Label>
                    <Textarea
                      id="goals"
                      value={newAgent.goals}
                      onChange={(e) => setNewAgent({ ...newAgent, goals: e.target.value })}
                      placeholder="Agent goals and objectives"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newAgent.notes}
                      onChange={(e) => setNewAgent({ ...newAgent, notes: e.target.value })}
                      placeholder="Additional notes"
                      rows={2}
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleAddAgent}>Add Agent</Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Edit Agent Form */}
          {showEditForm && editingAgent && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Edit Agent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Name *</Label>
                    <Input
                      id="edit-name"
                      value={editingAgent.name}
                      onChange={(e) => setEditingAgent({ ...editingAgent, name: e.target.value })}
                      placeholder="Agent name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-email">Email *</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editingAgent.email}
                      onChange={(e) => setEditingAgent({ ...editingAgent, email: e.target.value })}
                      placeholder="agent@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input
                      id="edit-phone"
                      value={editingAgent.phone}
                      onChange={(e) => setEditingAgent({ ...editingAgent, phone: e.target.value })}
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-level">Level</Label>
                    <Select value={editingAgent.level} onValueChange={(value) => setEditingAgent({ ...editingAgent, level: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {agentLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="edit-goals">Goals</Label>
                    <Textarea
                      id="edit-goals"
                      value={editingAgent.goals}
                      onChange={(e) => setEditingAgent({ ...editingAgent, goals: e.target.value })}
                      placeholder="Agent goals and objectives"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-notes">Notes</Label>
                    <Textarea
                      id="edit-notes"
                      value={editingAgent.notes}
                      onChange={(e) => setEditingAgent({ ...editingAgent, notes: e.target.value })}
                      placeholder="Additional notes"
                      rows={2}
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleUpdateAgent}>Update Agent</Button>
                  <Button variant="outline" onClick={() => {
                    setShowEditForm(false)
                    setEditingAgent(null)
                  }}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
