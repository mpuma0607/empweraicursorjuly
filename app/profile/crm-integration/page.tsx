'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, XCircle, ExternalLink, Users, Database, Zap } from 'lucide-react'
import { useMemberSpaceUser } from '@/hooks/use-memberspace-user'

interface ConnectionStatus {
  connected: boolean
  provider: string
  user?: {
    id: number
    name: string
    email: string
    role: string
  }
}

export default function CRMIntegrationPage() {
  const { user, loading: userLoading } = useMemberSpaceUser()
  const [fubStatus, setFubStatus] = useState<ConnectionStatus>({ connected: false, provider: 'followupboss' })
  const [apiKey, setApiKey] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Check connection status when user loads (same pattern as Email Integration)
  useEffect(() => {
    if (!userLoading && user?.email) {
      console.log('CRM Integration: User loaded, checking FUB status for:', user.email)
      setIsCheckingStatus(true)
      checkConnectionStatus(user.email)
    }
  }, [user?.email, userLoading])

  const checkConnectionStatus = async (userEmail?: string) => {
    const emailToUse = userEmail || user?.email
    
    if (!emailToUse) {
      console.log('CRM Integration: No user email, stopping status check')
      setIsCheckingStatus(false)
      return
    }

    try {
      setIsCheckingStatus(true)
      console.log('CRM Integration: Checking FUB status for:', emailToUse)
      
      // Check Follow Up Boss status
      const response = await fetch('/api/fub/status', {
        headers: {
          'x-user-email': emailToUse
        }
      })

      console.log('CRM Integration: FUB status response:', response.status, response.statusText)

      if (response.ok) {
        const data = await response.json()
        console.log('CRM Integration: FUB status data:', data)
        setFubStatus(data)
      } else {
        console.error('CRM Integration: FUB status failed:', response.status, await response.text())
        setFubStatus({ connected: false, provider: 'followupboss' })
      }
    } catch (error) {
      console.error('CRM Integration: Error checking CRM status:', error)
      setFubStatus({ connected: false, provider: 'followupboss' })
    } finally {
      setIsCheckingStatus(false)
    }
  }

  const connectFollowUpBoss = async () => {
    if (!user?.email || !apiKey.trim()) {
      setMessage({ type: 'error', text: !user?.email ? 'Please log in to connect Follow Up Boss' : 'Please enter your Follow Up Boss API key' })
      return
    }

    try {
      setIsConnecting(true)
      setMessage(null)

      const response = await fetch('/api/fub/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiKey: apiKey.trim(),
          userEmail: user.email
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: data.message })
        setApiKey('')
        await checkConnectionStatus()
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to connect to Follow Up Boss' })
      }
    } catch (error) {
      console.error('Error connecting to Follow Up Boss:', error)
      setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectFollowUpBoss = async () => {
    if (!user?.email) return

    try {
      // We'll implement this later - for now just refresh status
      await checkConnectionStatus()
      setMessage({ type: 'success', text: 'Disconnected from Follow Up Boss' })
    } catch (error) {
      console.error('Error disconnecting:', error)
    }
  }

  // Always show the interface - don't wait for MemberSpace

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">CRM Integration</h1>
        <p className="text-muted-foreground">
          Connect your CRM to personalize content and scripts with client information.
        </p>
      </div>

      {message && (
        <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-500' : 'border-green-500'}`}>
          <AlertDescription className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {/* Follow Up Boss Integration */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Follow Up Boss</CardTitle>
                  <CardDescription>Real estate CRM and lead management</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {fubStatus.connected ? (
                  <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                    <XCircle className="w-3 h-3 mr-1" />
                    Not Connected
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {fubStatus.connected && user?.email ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800">Connected as {fubStatus.user?.name}</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Email: {fubStatus.user?.email} • Role: {fubStatus.user?.role}
                  </p>
                </div>
                
                <div className="flex items-start gap-4 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={disconnectFollowUpBoss}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Disconnect
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={checkConnectionStatus}
                    disabled={isCheckingStatus}
                  >
                    {isCheckingStatus && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Refresh Status
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fub-api-key">API Key</Label>
                  <Input
                    id="fub-api-key"
                    type="password"
                    placeholder="Enter your Follow Up Boss API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && connectFollowUpBoss()}
                  />
                  <p className="text-sm text-muted-foreground">
                    Find your API key in Follow Up Boss under Admin → API
                  </p>
                </div>
                
                <Button 
                  onClick={connectFollowUpBoss} 
                  disabled={isConnecting || !apiKey.trim()}
                  className="w-full sm:w-auto"
                >
                  {isConnecting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Connect Follow Up Boss
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features & Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              What You Can Do
            </CardTitle>
            <CardDescription>
              Once connected, you'll unlock these personalization features:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Personalized Scripts</h4>
                  <p className="text-sm text-muted-foreground">
                    Generate scripts using client names, locations, and inquiry history
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Database className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Contact Context</h4>
                  <p className="text-sm text-muted-foreground">
                    Reference lead source, stage, and recent property interests
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <ExternalLink className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Property Insights</h4>
                  <p className="text-sm text-muted-foreground">
                    Create content about properties your clients have viewed
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Smart Content</h4>
                  <p className="text-sm text-muted-foreground">
                    AI-powered content that knows your client's journey
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help & Documentation */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-1">Getting Your Follow Up Boss API Key:</h4>
                <ol className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>1. Log into your Follow Up Boss account</li>
                  <li>2. Go to Admin → API</li>
                  <li>3. Copy your unique API key</li>
                  <li>4. Paste it above and click Connect</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Security:</h4>
                <p className="text-sm text-muted-foreground">
                  Your API key is encrypted and stored securely. We only access the data needed 
                  to personalize your content and never modify your CRM data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
