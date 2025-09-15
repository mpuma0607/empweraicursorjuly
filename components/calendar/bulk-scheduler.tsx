"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Plus, Calendar as CalendarIcon, Trash2, Edit } from "lucide-react"
import { useMemberSpaceUser } from "@/hooks/use-memberspace-user"

interface BulkEvent {
  id: string
  title: string
  description: string
  startDate: string
  startTime: string
  duration: number
  attendees: string
  location: string
}

interface BulkSchedulerProps {
  events: BulkEvent[]
  onEventsCreated?: (events: Array<{ eventId: string; eventLink: string; date: string; title: string }>) => void
  children?: React.ReactNode
  className?: string
}

export default function BulkScheduler({ 
  events,
  onEventsCreated,
  children,
  className = ""
}: BulkSchedulerProps) {
  const { user } = useMemberSpaceUser()
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [eventList, setEventList] = useState<BulkEvent[]>(events)

  const handleCreateBulkEvents = async () => {
    if (!user?.email) {
      alert("Please log in to create calendar events")
      return
    }

    if (eventList.length === 0) {
      alert("Please add at least one event")
      return
    }

    // Validate all events have required fields
    const invalidEvents = eventList.filter(event => !event.startDate || !event.startTime || !event.title)
    if (invalidEvents.length > 0) {
      alert("Please fill in all required fields (title, date, time) for all events")
      return
    }

    setIsCreating(true)
    try {
      const eventsToCreate = eventList.map(event => ({
        title: event.title,
        description: event.description,
        startDateTime: new Date(`${event.startDate}T${event.startTime}`).toISOString(),
        duration: event.duration,
        attendees: event.attendees ? event.attendees.split(',').map(email => email.trim()).filter(Boolean) : [],
        location: event.location || undefined
      }))

      const response = await fetch('/api/calendar/bulk-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: eventsToCreate,
          userEmail: user.email
        })
      })

      const result = await response.json()

      if (result.success) {
        alert(`✅ Created ${result.totalCreated} of ${result.totalRequested} events successfully!`)
        onEventsCreated?.(result.createdEvents)
        setIsOpen(false)
      } else {
        alert(`❌ Failed to create events: ${result.error}`)
      }
    } catch (error) {
      console.error('Error creating bulk events:', error)
      alert('❌ Failed to create events. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const addEvent = () => {
    const newEvent: BulkEvent = {
      id: Date.now().toString(),
      title: "",
      description: "",
      startDate: "",
      startTime: "",
      duration: 30,
      attendees: "",
      location: ""
    }
    setEventList(prev => [...prev, newEvent])
  }

  const removeEvent = (id: string) => {
    setEventList(prev => prev.filter(event => event.id !== id))
  }

  const updateEvent = (id: string, field: keyof BulkEvent, value: string | number) => {
    setEventList(prev => prev.map(event => 
      event.id === id ? { ...event, [field]: value } : event
    ))
  }

  const getMinDateTime = () => {
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    return tomorrow.toISOString().split('T')[0]
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className={`flex items-center gap-2 ${className}`}>
            <CalendarIcon className="h-4 w-4" />
            Add All to Calendar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Multiple Events
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {eventList.length} event{eventList.length !== 1 ? 's' : ''} ready to schedule
            </p>
            <Button onClick={addEvent} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {eventList.map((event, index) => (
              <Card key={event.id} className="p-4">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm">Event {index + 1}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEvent(event.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor={`title-${event.id}`}>Title *</Label>
                    <Input
                      id={`title-${event.id}`}
                      value={event.title}
                      onChange={(e) => updateEvent(event.id, 'title', e.target.value)}
                      placeholder="Event title"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`date-${event.id}`}>Date *</Label>
                      <Input
                        id={`date-${event.id}`}
                        type="date"
                        value={event.startDate}
                        onChange={(e) => updateEvent(event.id, 'startDate', e.target.value)}
                        min={getMinDateTime()}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`time-${event.id}`}>Time *</Label>
                      <Input
                        id={`time-${event.id}`}
                        type="time"
                        value={event.startTime}
                        onChange={(e) => updateEvent(event.id, 'startTime', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`duration-${event.id}`}>Duration</Label>
                      <Select 
                        value={event.duration.toString()} 
                        onValueChange={(value) => updateEvent(event.id, 'duration', parseInt(value))}
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
                    <div>
                      <Label htmlFor={`attendees-${event.id}`}>Attendees</Label>
                      <Input
                        id={`attendees-${event.id}`}
                        value={event.attendees}
                        onChange={(e) => updateEvent(event.id, 'attendees', e.target.value)}
                        placeholder="email1@example.com, email2@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`location-${event.id}`}>Location</Label>
                    <Input
                      id={`location-${event.id}`}
                      value={event.location}
                      onChange={(e) => updateEvent(event.id, 'location', e.target.value)}
                      placeholder="Office, property address, etc."
                    />
                  </div>

                  <div>
                    <Label htmlFor={`description-${event.id}`}>Description</Label>
                    <Textarea
                      id={`description-${event.id}`}
                      value={event.description}
                      onChange={(e) => updateEvent(event.id, 'description', e.target.value)}
                      placeholder="Event description"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateBulkEvents} 
              disabled={isCreating || eventList.length === 0}
              className="flex items-center gap-2"
            >
              {isCreating ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Creating {eventList.length} events...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create {eventList.length} Events
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
