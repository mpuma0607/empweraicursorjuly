'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Users, Zap, Home, Activity, ArrowRight, Database } from 'lucide-react'
import { useMemberSpaceUser } from '@/hooks/use-memberspace-user'
import Link from 'next/link'

interface FUBStatus {
  connected: boolean
  provider: string
  user?: {
    id: number
    name: string
    email: string
    role: string
  }
}

export default function LeadHubPage() {
  const { user, loading: userLoading } = useMemberSpaceUser()
  const [fubStatus, setFubStatus] = useState<FUBStatus>({ connected: false, provider: 'followupboss' })
  const [isCheckingFUB, setIsCheckingFUB] = useState(true)

  // Check FUB connection status
  useEffect(() => {
    if (!userLoading && user?.email) {
      checkFUBConnection()
    } else if (!userLoading && !user?.email) {
      setIsCheckingFUB(false)
    }
  }, [user?.email, userLoading])

  const checkFUBConnection = async () => {
    if (!user?.email) return

    try {
      setIsCheckingFUB(true)
      const response = await fetch('/api/fub/status', {
        headers: {
          'x-user-email': user.email
        }
      })

      if (response.ok) {
        const data = await response.json()
        setFubStatus(data)
      } else {
        setFubStatus({ connected: false, provider: 'followupboss' })
      }
    } catch (error) {
      console.error('Error checking FUB status:', error)
      setFubStatus({ connected: false, provider: 'followupboss' })
    } finally {
      setIsCheckingFUB(false)
    }
  }

  // Loading state
  if (userLoading || isCheckingFUB) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-3" />
          <span className="text-lg">Loading Lead Hub...</span>
        </div>
      </div>
    )
  }

  // Not connected to FUB - show connection screen
  if (!fubStatus.connected) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold">
              Lead Hub
              <Badge variant="secondary" className="ml-3 text-sm">BETA</Badge>
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced CRM integration and lead management tools to supercharge your follow-up process
          </p>
        </div>

        {/* Connection Required Card */}
        <Card className="max-w-2xl mx-auto mb-12 border-blue-200">
          <CardHeader className="text-center pb-4">
            <Database className="w-16 h-16 mx-auto text-blue-600 mb-4" />
            <CardTitle className="text-2xl">Connect Follow Up Boss to Get Started</CardTitle>
            <p className="text-gray-600 mt-2">
              Connect your Follow Up Boss CRM to unlock powerful lead management and automation features
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <Button size="lg" asChild className="mb-4">
              <Link href="/profile/crm-integration">
                Connect Follow Up Boss
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <p className="text-sm text-gray-500">
              Don't have Follow Up Boss? <a href="https://www.followupboss.com" target="_blank" className="text-blue-600 hover:underline">Learn more</a>
            </p>
          </CardContent>
        </Card>

        {/* Feature Preview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">What You'll Unlock</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Zap className="w-12 h-12 mx-auto text-orange-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Smart Follow-ups</h3>
                <p className="text-gray-600">
                  Auto-generate personalized scripts for recent leads based on their activity and interests
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Home className="w-12 h-12 mx-auto text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Instant CMAs</h3>
                <p className="text-gray-600">
                  Create property reports automatically based on your leads' recent property inquiries
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Activity className="w-12 h-12 mx-auto text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Activity Logging</h3>
                <p className="text-gray-600">
                  Automatically track all your EmpowerAI interactions back to your CRM contact timeline
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Features */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Advanced Features Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">Bulk Operations</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Generate scripts for all Zillow leads from last week</li>
                  <li>• Create market updates for contacts in specific areas</li>
                  <li>• Send follow-ups to contacts not touched in 30+ days</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">Smart Insights</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Recent lead activity notifications</li>
                  <li>• Property inquiry-based CMA suggestions</li>
                  <li>• Lead source performance tracking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Connected to FUB - show full dashboard (placeholder for now)
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">
            Lead Hub
            <Badge variant="secondary" className="ml-3">BETA</Badge>
          </h1>
        </div>
        <div className="text-sm text-gray-600">
          Connected as <span className="font-medium">{fubStatus.user?.name}</span>
        </div>
      </div>

      {/* Coming Soon - Full Dashboard */}
      <Card className="text-center py-12">
        <CardContent>
          <Users className="w-16 h-16 mx-auto text-blue-600 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Full Dashboard Coming Soon!</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Your Follow Up Boss is connected! We're building the full lead management dashboard with 
            recent leads, quick actions, and bulk operations. Stay tuned!
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="/ai-hub/scriptit-ai">Try Personalized Scripts</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/profile/crm-integration">View Connection</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
