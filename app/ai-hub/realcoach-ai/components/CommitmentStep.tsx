"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { 
  CheckCircle, 
  Clock,
  Calendar,
  Target,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Users,
  MessageSquare,
  Home,
  TrendingUp,
  Star,
  Zap,
  Heart,
  Info,
  AlertTriangle
} from "lucide-react"
import { AgentProfile } from "../page"
import { useState } from "react"

interface CommitmentStepProps {
  profile: AgentProfile
  updateProfile: (updates: Partial<AgentProfile>) => void
}

export default function CommitmentStep({ profile, updateProfile }: CommitmentStepProps) {
  const [currentBlock, setCurrentBlock] = useState({ day: '', time: '', activity: '' })
  const [showBlockForm, setShowBlockForm] = useState(false)

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ]

  const timeSlots = [
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM'
  ]

  const activityOptions = [
    'Prospecting calls',
    'Follow-up calls',
    'Social media outreach',
    'Email marketing',
    'Content creation',
    'Open house prep',
    'Client meetings',
    'Admin tasks',
    'Skill practice',
    'Market research',
    'Networking',
    'Referral follow-up'
  ]

  const kpiOptions = [
    { id: 'conversations', label: 'Conversations', icon: MessageSquare, color: 'bg-blue-500' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, color: 'bg-green-500' },
    { id: 'listings', label: 'New Listings', icon: Home, color: 'bg-purple-500' },
    { id: 'buyers', label: 'New Buyers', icon: Users, color: 'bg-orange-500' },
    { id: 'videos', label: 'Videos Created', icon: TrendingUp, color: 'bg-pink-500' },
    { id: 'mailers', label: 'Mailers Sent', icon: MessageSquare, color: 'bg-teal-500' }
  ]

  const handleAddBlock = () => {
    if (currentBlock.day && currentBlock.time && currentBlock.activity) {
      const newBlocks = [...(profile.weeklyBlocks || []), { ...currentBlock }]
      updateProfile({ weeklyBlocks: newBlocks })
      setCurrentBlock({ day: '', time: '', activity: '' })
      setShowBlockForm(false)
    }
  }

  const handleRemoveBlock = (index: number) => {
    const newBlocks = profile.weeklyBlocks?.filter((_, i) => i !== index) || []
    updateProfile({ weeklyBlocks: newBlocks })
  }

  const handleKpiChange = (kpiId: string, value: number) => {
    updateProfile({
      kpiTargets: {
        ...profile.kpiTargets,
        [kpiId]: value
      }
    })
  }

  const handleConfidenceChange = (confidence: number) => {
    updateProfile({ confidenceScore: confidence })
  }

  const handleCheckinChange = (field: 'checkinDay' | 'checkinTime', value: string) => {
    updateProfile({ [field]: value })
  }

  const getConfidenceLevel = (score: number) => {
    if (score >= 8) return { label: 'High Confidence', color: 'text-green-600', bg: 'bg-green-50' }
    if (score >= 6) return { label: 'Medium Confidence', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    return { label: 'Low Confidence', color: 'text-red-600', bg: 'bg-red-50' }
  }

  const confidenceLevel = getConfidenceLevel(profile.confidenceScore)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center" data-step-header>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Commitment Contract</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Let's lock in your plan with specific commitments and accountability measures.
        </p>
      </div>

      {/* Weekly Calendar Blocks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            Your Weekly Time Blocks
          </CardTitle>
          <CardDescription>
            When will you do your prospecting and business development activities?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Block */}
          {!showBlockForm ? (
            <Button
              onClick={() => setShowBlockForm(true)}
              className="w-full"
              variant="outline"
            >
              + Add Time Block
            </Button>
          ) : (
            <Card className="border-2 border-dashed border-blue-300">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label>Day of Week</Label>
                    <select
                      value={currentBlock.day}
                      onChange={(e) => setCurrentBlock(prev => ({ ...prev, day: e.target.value }))}
                      className="w-full mt-1 p-2 border rounded-md"
                    >
                      <option value="">Select day</option>
                      {daysOfWeek.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Time</Label>
                    <select
                      value={currentBlock.time}
                      onChange={(e) => setCurrentBlock(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full mt-1 p-2 border rounded-md"
                    >
                      <option value="">Select time</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Activity</Label>
                    <select
                      value={currentBlock.activity}
                      onChange={(e) => setCurrentBlock(prev => ({ ...prev, activity: e.target.value }))}
                      className="w-full mt-1 p-2 border rounded-md"
                    >
                      <option value="">Select activity</option>
                      {activityOptions.map(activity => (
                        <option key={activity} value={activity}>{activity}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddBlock} disabled={!currentBlock.day || !currentBlock.time || !currentBlock.activity}>
                    Add Block
                  </Button>
                  <Button variant="outline" onClick={() => setShowBlockForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Existing Blocks */}
          {profile.weeklyBlocks && profile.weeklyBlocks.length > 0 ? (
            <div className="space-y-3">
              {profile.weeklyBlocks.map((block, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{block.day} at {block.time}</div>
                      <div className="text-gray-600 text-sm">{block.activity}</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveBlock(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No time blocks scheduled yet</p>
              <p className="text-sm">Add your first block to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* KPI Targets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-purple-600" />
            Your Weekly KPI Targets
          </CardTitle>
          <CardDescription>
            What numbers will you track to measure success?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kpiOptions.map((kpi) => {
              const Icon = kpi.icon
              const value = profile.kpiTargets?.[kpi.id] || 0
              
              return (
                <div key={kpi.id} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${kpi.color} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <Label className="font-medium">{kpi.label}</Label>
                  </div>
                  <div>
                    <Slider
                      value={[value]}
                      onValueChange={([val]) => handleKpiChange(kpi.id, val)}
                      max={50}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>0</span>
                      <span className="font-semibold">{value}</span>
                      <span>50</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Confidence Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-orange-600" />
            Confidence Assessment
          </CardTitle>
          <CardDescription>
            How confident are you that you can stick to this plan?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${confidenceLevel.bg} mb-4`}>
              <span className={`font-semibold ${confidenceLevel.color}`}>
                {profile.confidenceScore}/10 - {confidenceLevel.label}
              </span>
            </div>
            
            <Slider
              value={[profile.confidenceScore]}
              onValueChange={([value]) => handleConfidenceChange(value)}
              max={10}
              min={1}
              step={1}
              className="w-full max-w-md mx-auto"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2 max-w-md mx-auto">
              <span>Not confident (1)</span>
              <span>Very confident (10)</span>
            </div>
          </div>

          {profile.confidenceScore < 7 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-900">Confidence Check</span>
              </div>
              <p className="text-yellow-800 text-sm mb-3">
                Your confidence is below 7. Let's adjust the plan to make it more achievable:
              </p>
              <ul className="text-yellow-800 text-sm space-y-1">
                <li>• Reduce the number of activities</li>
                <li>• Decrease time commitments</li>
                <li>• Lower KPI targets</li>
                <li>• Focus on 1-2 core activities</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Accountability Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-600" />
            Accountability Setup
          </CardTitle>
          <CardDescription>
            When and how will we check in on your progress?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Check-in Day</Label>
              <select
                value={profile.checkinDay}
                onChange={(e) => handleCheckinChange('checkinDay', e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
                <option value="sunday">Sunday</option>
              </select>
            </div>
            <div>
              <Label>Check-in Time</Label>
              <select
                value={profile.checkinTime}
                onChange={(e) => handleCheckinChange('checkinTime', e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="9:00 AM">9:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="1:00 PM">1:00 PM</option>
                <option value="2:00 PM">2:00 PM</option>
                <option value="3:00 PM">3:00 PM</option>
                <option value="4:00 PM">4:00 PM</option>
                <option value="5:00 PM">5:00 PM</option>
              </select>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-5 w-5 text-indigo-600" />
              <span className="font-medium text-indigo-900">Weekly Check-in Process</span>
            </div>
            <ul className="text-indigo-800 text-sm space-y-1">
              <li>• Review what got done vs. what was planned</li>
              <li>• Identify what got in the way</li>
              <li>• Adjust targets up or down based on performance</li>
              <li>• Celebrate wins and learn from challenges</li>
              <li>• Plan the next week's priorities</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Commitment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            Your Commitment Summary
          </CardTitle>
          <CardDescription>
            Here's what you're committing to
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Weekly Time Blocks</h4>
                <div className="space-y-2">
                  {profile.weeklyBlocks && profile.weeklyBlocks.length > 0 ? (
                    profile.weeklyBlocks.map((block, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{block.day} at {block.time} - {block.activity}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No time blocks scheduled</p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Weekly KPI Targets</h4>
                <div className="space-y-2">
                  {Object.entries(profile.kpiTargets || {}).map(([kpi, target]) => {
                    const kpiOption = kpiOptions.find(k => k.id === kpi)
                    return kpiOption && target > 0 ? (
                      <div key={kpi} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{target} {kpiOption.label}</span>
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">Confidence Level</h4>
                  <p className="text-gray-600 text-sm">{profile.confidenceScore}/10 - {confidenceLevel.label}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Check-in Schedule</h4>
                  <p className="text-gray-600 text-sm">{profile.checkinDay} at {profile.checkinTime}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Commitment */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Heart className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-green-900 mb-2">Your Commitment Contract</h4>
            <p className="text-green-800 text-sm mb-3">
              By proceeding to your personalized plan, you're committing to:
            </p>
            <ul className="text-green-800 text-sm space-y-1">
              <li>• Stick to your scheduled time blocks</li>
              <li>• Track your weekly KPI targets</li>
              <li>• Participate in weekly check-ins</li>
              <li>• Give honest feedback about what's working and what's not</li>
              <li>• Adjust the plan as needed based on your results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
