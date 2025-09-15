"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Calendar, Clock, Users, MapPin, Plus, Calendar as CalendarIcon, RotateCcw } from "lucide-react"
import { useMemberSpaceUser } from "@/hooks/use-memberspace-user"

interface RecurringSchedulerProps {
  title: string
  description: string
  defaultDuration?: number
  onEventsCreated?: (events: Array<{ eventId: string; eventLink: string; date: string; title: string }>) => void
  children?: React.ReactNode
  className?: string
}

export default function RecurringScheduler({ 
  title, 
  description, 
  defaultDuration = 30,
  onEventsCreated,
  children,
  className = ""
}: RecurringSchedulerProps) {
  const { user } = useMemberSpaceUser()
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [eventData, setEventData] = useState({
    title: title,
    description: description,
    startDate: "",
    startTime: "",
    duration: defaultDuration,
    frequency: "weekly" as "daily" | "weekly" | "bi-weekly" | "monthly",
    occurrences: 5,
    attendees: "",
    location: ""
  })

  const handleCreateRecurringEvents = async () => {
    if (!user?.email) {
      alert("Please log in to create calendar events")
      return
    }

    if (!eventData.startDate || !eventData.startTime) {
      alert("Please select a start date and time")
      return
    }

    setIsCreating(true)
    try {
      const startDateTime = new Date(`${eventData.startDate}T${eventData.startTime}`).toISOString()
      const attendees = eventData.attendees 
        ? eventData.attendees.split(',').map(email => email.trim()).filter(Boolean)
        : []

      const response = await fetch('/api/calendar/create-recurring-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: eventData.title,
          description: eventData.description,
          startDateTime,
          duration: eventData.duration,
          frequency: eventData.frequency,
          occurrences: eventData.occurrences,
          attendees,
          location: eventData.location || undefined,
          userEmail: user.email
        })
      })

      const result = await response.json()

      if (result.success) {
        alert(`✅ Created ${result.totalCreated} recurring events successfully!`)
        onEventsCreated?.(result.createdEvents)
        setIsOpen(false)
        setEventData({
          title: title,
          description: description,
          startDate: "",
          startTime: "",
          duration: defaultDuration,
          frequency: "weekly",
          occurrences: 5,
          attendees: "",
          location: ""
        })
      } else {
        alert(`❌ Failed to create events: ${result.error}`)
      }
    } catch (error) {
      console.error('Error creating recurring events:', error)
      alert('❌ Failed to create events. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const getMinDateTime = () => {
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    return tomorrow.toISOString().split('T')[0]
  }

  const getMinTime = () => {
    if (eventData.startDate === new Date().toISOString().split('T')[0]) {
      const now = new Date()
      const hour = now.getHours().toString().padStart(2, '0')
      const minute = now.getMinutes().toString().padStart(2, '0')
      return `${hour}:${minute}`
    }
    return "09:00"
  }

  const getFrequencyLabel = (freq: string) => {
    switch (freq) {
      case 'daily': return 'Daily'
      case 'weekly': return 'Weekly'
      case 'bi-weekly': return 'Bi-weekly'
      case 'monthly': return 'Monthly'
      default: return 'Weekly'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className={`flex items-center gap-2 ${className}`}>
            <RotateCcw className="h-4 w-4" />
            Schedule Follow-ups
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Recurring Events
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={eventData.title}
              onChange={(e) => setEventData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter event title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Start Date</Label>
              <Input
                id="date"
                type="date"
                value={eventData.startDate}
                onChange={(e) => setEventData(prev => ({ ...prev, startDate: e.target.value }))}
                min={getMinDateTime()}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Start Time</Label>
              <Input
                id="time"
                type="time"
                value={eventData.startTime}
                onChange={(e) => setEventData(prev => ({ ...prev, startTime: e.target.value }))}
                min={getMinTime()}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Select 
                value={eventData.frequency} 
                onValueChange={(value: "daily" | "weekly" | "bi-weekly" | "monthly") => 
                  setEventData(prev => ({ ...prev, frequency: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select 
                value={eventData.duration.toString()} 
                onValueChange={(value) => setEventData(prev => ({ ...prev, duration: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="occurrences">Number of Events: {eventData.occurrences}</Label>
            <Slider
              id="occurrences"
              min={1}
              max={20}
              step={1}
              value={[eventData.occurrences]}
              onValueChange={(value) => setEventData(prev => ({ ...prev, occurrences: value[0] }))}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>20</span>
            </div>
          </div>

          <div>
            <Label htmlFor="attendees">Attendees (optional)</Label>
            <Input
              id="attendees"
              value={eventData.attendees}
              onChange={(e) => setEventData(prev => ({ ...prev, attendees: e.target.value }))}
              placeholder="email1@example.com, email2@example.com"
            />
          </div>

          <div>
            <Label htmlFor="location">Location (optional)</Label>
            <Input
              id="location"
              value={eventData.location}
              onChange={(e) => setEventData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Office, property address, etc."
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={eventData.description}
              onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Event description"
              rows={4}
            />
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Preview:</strong> {eventData.occurrences} events, {getFrequencyLabel(eventData.frequency).toLowerCase()}, 
              starting {eventData.startDate ? new Date(eventData.startDate).toLocaleDateString() : 'select date'} 
              at {eventData.startTime || 'select time'}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateRecurringEvents} 
              disabled={isCreating || !eventData.startDate || !eventData.startTime}
              className="flex items-center gap-2"
            >
              {isCreating ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Creating {eventData.occurrences} events...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create {eventData.occurrences} Events
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
