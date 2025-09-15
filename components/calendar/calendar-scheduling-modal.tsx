"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, Clock, Users, MapPin, Loader2 } from "lucide-react"

interface CalendarSchedulingModalProps {
  title: string
  description: string
  defaultDuration?: number
  children: React.ReactNode
  onEventCreated?: (eventId: string, eventLink: string) => void
}

export default function CalendarSchedulingModal({
  title,
  description,
  defaultDuration = 60,
  children,
  onEventCreated
}: CalendarSchedulingModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    eventTitle: title,
    description: description,
    startDate: "",
    startTime: "",
    duration: defaultDuration,
    attendees: "",
    location: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      // Combine date and time
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`)
      
      // Parse attendees (comma-separated emails)
      const attendeeList = formData.attendees
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0)

      const response = await fetch('/api/calendar/create-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.eventTitle,
          description: formData.description,
          startDateTime: startDateTime.toISOString(),
          duration: formData.duration,
          attendees: attendeeList,
          location: formData.location || undefined,
          userEmail: "" // Will be filled by the API from the user context
        })
      })

      const result = await response.json()
      
      if (result.success) {
        alert(`✅ Event created successfully! Check your Google Calendar.`)
        setIsOpen(false)
        onEventCreated?.(result.eventId, result.eventLink)
      } else {
        if (response.status === 401) {
          alert(`❌ Google Calendar not connected. Please go to your profile and connect your Google account first.`)
        } else {
          alert(`❌ Failed to create event: ${result.error}`)
        }
      }
    } catch (error) {
      console.error('Error creating calendar event:', error)
      alert('❌ Failed to create calendar event. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Set default date to tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const defaultDate = tomorrow.toISOString().split('T')[0]
  const defaultTime = "09:00"

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Calendar Event
          </DialogTitle>
          <DialogDescription>
            Add this event to your Google Calendar with custom details.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="eventTitle">Event Title</Label>
            <Input
              id="eventTitle"
              value={formData.eventTitle}
              onChange={(e) => handleInputChange('eventTitle', e.target.value)}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter event description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate || defaultDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime || defaultTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 60)}
              min="15"
              max="480"
              step="15"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attendees">Attendees (comma-separated emails)</Label>
            <Input
              id="attendees"
              value={formData.attendees}
              onChange={(e) => handleInputChange('attendees', e.target.value)}
              placeholder="john@example.com, jane@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location (optional)</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Office, Zoom link, etc."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Create Event
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
