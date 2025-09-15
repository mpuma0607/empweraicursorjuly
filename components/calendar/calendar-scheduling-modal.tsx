"use client"

import React, { useState } from "react"
import { useMemberSpaceUser } from "@/hooks/use-memberspace-user"
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
  const { user } = useMemberSpaceUser()
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  // Set default date to tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const defaultDate = tomorrow.toISOString().split('T')[0]
  const defaultTime = "09:00"

  const [formData, setFormData] = useState({
    eventTitle: title,
    description: description,
    startDate: defaultDate,
    startTime: defaultTime,
    duration: defaultDuration,
    attendees: "",
    location: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.email) {
      alert("Please log in to schedule calendar events")
      return
    }
    
    setIsCreating(true)

    try {
      // Validate date and time inputs
      if (!formData.startDate || !formData.startTime) {
        alert("Please select both date and time")
        return
      }

      // Combine date and time with proper validation
      const dateTimeString = `${formData.startDate}T${formData.startTime}`
      console.log("Creating date from:", dateTimeString)
      const startDateTime = new Date(dateTimeString)
      console.log("Parsed date:", startDateTime)
      
      // Check if the date is valid
      if (isNaN(startDateTime.getTime())) {
        console.error("Invalid date created from:", dateTimeString)
        alert("Invalid date or time selected. Please check your inputs.")
        return
      }
      
      // Parse attendees (comma-separated emails)
      const attendeeList = formData.attendees
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0)

      const requestBody = {
        title: formData.eventTitle,
        description: formData.description,
        startDateTime: startDateTime.toISOString(),
        duration: formData.duration,
        attendees: attendeeList,
        location: formData.location || undefined,
        userEmail: user.email
      }
      
      console.log('Calendar modal: Sending request body:', requestBody)
      console.log('Calendar modal: startDateTime.toISOString():', startDateTime.toISOString())

      const response = await fetch('/api/calendar/create-event', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
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
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
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
