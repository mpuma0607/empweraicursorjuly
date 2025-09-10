"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { 
  Target, 
  DollarSign, 
  TrendingUp, 
  Calculator,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  BarChart3,
  Clock,
  Home,
  Users,
  AlertCircle,
  Info,
  Mic,
  MicOff
} from "lucide-react"
import { AgentProfile } from "../page"
import { useState, useEffect } from "react"

interface ProductionMathStepProps {
  profile: AgentProfile
  updateProfile: (updates: Partial<AgentProfile>) => void
}

export default function ProductionMathStep({ profile, updateProfile }: ProductionMathStepProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Calculate derived values
  const avgNetPerClose = profile.avgPricePoint * 0.03 // 3% commission
  const targetGCI = profile.targetUnits * avgNetPerClose
  const monthlyTarget = profile.targetUnits / 12

  // Update calculated values when inputs change
  useEffect(() => {
    updateProfile({
      avgNetPerClose: avgNetPerClose,
      targetGCI: targetGCI
    })
  }, [profile.avgPricePoint, profile.targetUnits])

  const handleUnitsChange = (value: number) => {
    updateProfile({ targetUnits: value })
  }

  const handlePricePointChange = (value: number) => {
    updateProfile({ avgPricePoint: value })
  }

  const handleFunnelChange = (field: string, value: number) => {
    updateProfile({
      currentFunnel: {
        ...profile.currentFunnel,
        [field]: value
      }
    })
  }

  const calculateWeeklyTargets = () => {
    const { convosToAppt, apptsToClient, clientsToClose } = profile.currentFunnel
    const monthlyUnits = monthlyTarget
    const weeklyUnits = monthlyUnits / 4.33
    
    const weeklyClients = weeklyUnits / clientsToClose
    const weeklyAppts = weeklyClients / apptsToClient
    const weeklyConvos = weeklyAppts * convosToAppt

    return {
      weeklyConvos: Math.round(weeklyConvos),
      weeklyAppts: Math.round(weeklyAppts * 10) / 10,
      weeklyClients: Math.round(weeklyClients * 10) / 10,
      weeklyUnits: Math.round(weeklyUnits * 10) / 10
    }
  }

  const weeklyTargets = calculateWeeklyTargets()

  const pricePointRanges = [
    { label: 'Under $200k', min: 100000, max: 200000, avg: 150000 },
    { label: '$200k - $400k', min: 200000, max: 400000, avg: 300000 },
    { label: '$400k - $600k', min: 400000, max: 600000, avg: 500000 },
    { label: '$600k - $800k', min: 600000, max: 800000, avg: 700000 },
    { label: '$800k+', min: 800000, max: 2000000, avg: 1000000 }
  ]

  const getPriceRange = () => {
    return pricePointRanges.find(range => 
      profile.avgPricePoint >= range.min && profile.avgPricePoint <= range.max
    ) || pricePointRanges[2]
  }

  const currentRange = getPriceRange()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center" data-step-header>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Let's Define Your Targets</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          I need to understand your production goals and current performance to create a realistic plan.
        </p>
      </div>

      {/* Annual Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-green-600" />
            Your 12-Month Goals
          </CardTitle>
          <CardDescription>
            What do you want to achieve in the next year?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="targetUnits" className="text-base font-medium">
                How many closings do you want this year?
              </Label>
              <div className="mt-2">
                <Slider
                  value={[profile.targetUnits]}
                  onValueChange={([value]) => handleUnitsChange(value)}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>1</span>
                  <span className="font-semibold text-lg">{profile.targetUnits} closings</span>
                  <span>100</span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="avgPricePoint" className="text-base font-medium">
                What's your average price point?
              </Label>
              <div className="mt-2">
                <Slider
                  value={[profile.avgPricePoint]}
                  onValueChange={([value]) => handlePricePointChange(value)}
                  max={1000000}
                  min={100000}
                  step={10000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>$100k</span>
                  <span className="font-semibold text-lg">${profile.avgPricePoint.toLocaleString()}</span>
                  <span>$1M</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price Range Helper */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">Your Market Range</span>
            </div>
            <p className="text-blue-800 text-sm">
              You're targeting the <strong>{currentRange.label}</strong> market. 
              This helps me calibrate your prospecting strategies and client expectations.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Calculated Projections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-blue-600" />
            Your Projected Income
          </CardTitle>
          <CardDescription>
            Based on your targets and market
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {profile.targetUnits}
              </div>
              <div className="text-sm text-green-800">Annual Closings</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                ${avgNetPerClose.toLocaleString()}
              </div>
              <div className="text-sm text-blue-800">Per Closing</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                ${targetGCI.toLocaleString()}
              </div>
              <div className="text-sm text-purple-800">Annual GCI</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-orange-600" />
            Your Current Funnel Performance
          </CardTitle>
          <CardDescription>
            How many conversations does it take to get an appointment? An appointment to get a client? A client to get a closing?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-base font-medium">
                Conversations → Appointments
              </Label>
              <div className="mt-2">
                <Slider
                  value={[profile.currentFunnel.convosToAppt]}
                  onValueChange={([value]) => handleFunnelChange('convosToAppt', value)}
                  max={20}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>1</span>
                  <span className="font-semibold">{profile.currentFunnel.convosToAppt} convos</span>
                  <span>20</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">
                Appointments → Clients
              </Label>
              <div className="mt-2">
                <Slider
                  value={[profile.currentFunnel.apptsToClient * 10]}
                  onValueChange={([value]) => handleFunnelChange('apptsToClient', value / 10)}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>0.1</span>
                  <span className="font-semibold">{profile.currentFunnel.apptsToClient}</span>
                  <span>1.0</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">
                Clients → Closings
              </Label>
              <div className="mt-2">
                <Slider
                  value={[profile.currentFunnel.clientsToClose * 10]}
                  onValueChange={([value]) => handleFunnelChange('clientsToClose', value / 10)}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>0.1</span>
                  <span className="font-semibold">{profile.currentFunnel.clientsToClose}</span>
                  <span>1.0</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-yellow-900">Don't Know Your Numbers?</span>
            </div>
            <p className="text-yellow-800 text-sm">
              No worries! I've set some industry averages. We'll track your actual performance and adjust as we go.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Targets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-purple-600" />
            Your Weekly Targets
          </CardTitle>
          <CardDescription>
            Based on your goals and current performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold text-purple-600">
                {weeklyTargets.weeklyConvos}
              </div>
              <div className="text-sm text-purple-800">Conversations</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">
                {weeklyTargets.weeklyAppts}
              </div>
              <div className="text-sm text-blue-800">Appointments</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">
                {weeklyTargets.weeklyClients}
              </div>
              <div className="text-sm text-green-800">New Clients</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-xl font-bold text-orange-600">
                {weeklyTargets.weeklyUnits}
              </div>
              <div className="text-sm text-orange-800">Closings</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reality Check */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-6 w-6 text-gray-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Reality Check</h4>
            <p className="text-gray-700 text-sm mb-3">
              Does {weeklyTargets.weeklyConvos} conversations per week feel realistic for you? 
              If not, we can adjust your goals or improve your conversion rates.
            </p>
            <p className="text-gray-600 text-sm">
              Remember: It's better to set achievable goals and exceed them than to set unrealistic ones and get discouraged.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
