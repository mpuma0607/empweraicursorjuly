"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Mail, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  ExternalLink,
  AlertCircle
} from "lucide-react"
import { useMemberSpaceUser } from "@/hooks/useMemberSpaceUser"

interface EmailConnectionStatus {
  connected: boolean
  email?: string
  connectedAt?: string
  scopes?: string[]
  lastUsed?: string
  provider?: string
}

interface ProviderStatus {
  google: EmailConnectionStatus | null
  microsoft: EmailConnectionStatus | null
}

export default function EmailIntegrationPage() {
  const { user, loading: userLoading } = useMemberSpaceUser()
  const [providerStatus, setProviderStatus] = useState<ProviderStatus>({
    google: null,
    microsoft: null
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState<{google: boolean, microsoft: boolean}>({
    google: false,
    microsoft: false
  })
  const [isDisconnecting, setIsDisconnecting] = useState<{google: boolean, microsoft: boolean}>({
    google: false,
    microsoft: false
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Check connection status and OAuth completion on page load
  useEffect(() => {
    checkConnectionStatus()
    checkOAuthCompletion()
  }, []) // Only run once on page load - NO user dependency

  const checkConnectionStatus = async () => {
    try {
      setIsLoading(true)
      
      // Priority 1: Check URL params first (OAuth success)
      const urlParams = new URLSearchParams(window.location.search)
      let currentUserEmail = urlParams.get('email')
      
      if (currentUserEmail) {
        setUserEmail(currentUserEmail) // Store it for future use
        localStorage.setItem('connected_email', currentUserEmail)
        console.log('📧 Got email from URL params:', currentUserEmail)
      } else {
        // Priority 2: Check localStorage
        currentUserEmail = localStorage.getItem('connected_email') || localStorage.getItem('gmail_connected_email')
        if (currentUserEmail) {
          setUserEmail(currentUserEmail)
          console.log('💾 Using localStorage email:', currentUserEmail)
        } else {
          // Priority 3: Use stored state
          currentUserEmail = userEmail
          console.log('💾 Using stored state email:', currentUserEmail)
        }
      }
      
      // Priority 4: Fall back to user hook (but this often fails for Beggins)
      if (!currentUserEmail) {
        currentUserEmail = user?.email
        console.log('👤 Using user hook email:', currentUserEmail)
      }
      
      console.log('🔍 Final email for status check:', currentUserEmail)
      
      if (!currentUserEmail) {
        console.log('No user email found, showing disconnected status')
        setProviderStatus({ google: { connected: false }, microsoft: { connected: false } })
        return
      }
      
      // Check Google status
      const googleResponse = await fetch('/api/auth/google/status', {
        headers: {
          'x-user-email': currentUserEmail
        }
      })
      
      let googleStatus: EmailConnectionStatus = { connected: false, provider: 'google' }
      if (googleResponse.ok) {
        const data = await googleResponse.json()
        googleStatus = { ...data.status, provider: 'google' }
      }
      
      // Check Microsoft status
      const microsoftResponse = await fetch(`/api/outlook/auth/status?email=${encodeURIComponent(currentUserEmail)}`)
      
      let microsoftStatus: EmailConnectionStatus = { connected: false, provider: 'microsoft' }
      if (microsoftResponse.ok) {
        const data = await microsoftResponse.json()
        microsoftStatus = { ...data, provider: 'microsoft' }
      }
      
      console.log('✅ Status data received:', { google: googleStatus, microsoft: microsoftStatus })
      setProviderStatus({
        google: googleStatus,
        microsoft: microsoftStatus
      })
      
    } catch (error) {
      console.error('Error checking connection status:', error)
      setProviderStatus({ google: { connected: false }, microsoft: { connected: false } })
    } finally {
      setIsLoading(false)
    }
  }

  const connectProvider = async (provider: 'google' | 'microsoft') => {
    try {
      setIsConnecting(prev => ({ ...prev, [provider]: true }))
      setError(null)
      
      const startUrl = provider === 'google' 
        ? '/api/auth/google/start'
        : '/api/outlook/auth/start'
      
      // Always redirect to OAuth start - simpler and more reliable
      window.location.href = startUrl
    } catch (error) {
      console.error(`Error connecting ${provider}:`, error)
      setError(error instanceof Error ? error.message : `Failed to connect ${provider}`)
    } finally {
      setIsConnecting(prev => ({ ...prev, [provider]: false }))
    }
  }

  // Check OAuth completion from URL parameters
  const checkOAuthCompletion = async () => {
    try {
      // Check if we have OAuth success/error in URL params
      const urlParams = new URLSearchParams(window.location.search)
      const success = urlParams.get('success')
      const error = urlParams.get('error')
      const email = urlParams.get('email')
      
      if (success === 'oauth_completed' && email) {
        // Store email in localStorage for persistence
        localStorage.setItem('connected_email', email)
        setUserEmail(email)
        setSuccess(`Gmail connected successfully! Email: ${email}`)
        
        // Wait a moment for the OAuth callback to complete, then check status
        setTimeout(() => {
          checkConnectionStatus()
        }, 1000)
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname)
      } else if (success === 'microsoft_connected' && email) {
        // Store email in localStorage for persistence
        localStorage.setItem('connected_email', email)
        setUserEmail(email)
        setSuccess(`Microsoft Outlook connected successfully! Email: ${email}`)
        
        // Wait a moment for the OAuth callback to complete, then check status
        setTimeout(() => {
          checkConnectionStatus()
        }, 1000)
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname)
      } else if (error) {
        let errorMessage = 'OAuth error'
        if (error.includes('google')) {
          errorMessage = 'Google OAuth error'
        } else if (error.includes('microsoft')) {
          errorMessage = 'Microsoft OAuth error'
        }
        setError(`${errorMessage}: ${error}`)
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    } catch (e) {
      console.error('Error checking OAuth completion:', e)
    }
  }

  const disconnectProvider = async (provider: 'google' | 'microsoft') => {
    try {
      setIsDisconnecting(prev => ({ ...prev, [provider]: true }))
      setError(null)
      
      // Use stored userEmail or user email from hook
      const currentUserEmail = userEmail || user?.email
      
      if (!currentUserEmail) {
        setError('User email required for disconnect')
        return
      }
      
      const disconnectUrl = provider === 'google' 
        ? '/api/auth/google/disconnect'
        : '/api/outlook/auth/disconnect'
      
      const requestOptions = provider === 'google'
        ? {
            method: 'POST',
            headers: { 'x-user-email': currentUserEmail }
          }
        : {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentUserEmail })
          }
      
      const response = await fetch(disconnectUrl, requestOptions)
      
      if (response.ok) {
        const providerName = provider === 'google' ? 'Gmail' : 'Microsoft Outlook'
        setSuccess(`${providerName} disconnected successfully!`)
        
        // Update provider status
        setProviderStatus(prev => ({
          ...prev,
          [provider]: { connected: false, provider }
        }))
        
        // Clear stored email if no providers are connected
        const otherProvider = provider === 'google' ? 'microsoft' : 'google'
        const otherProviderConnected = providerStatus[otherProvider]?.connected
        
        if (!otherProviderConnected) {
          setUserEmail(null)
          localStorage.removeItem('connected_email')
          localStorage.removeItem('gmail_connected_email')
        }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to disconnect')
      }
    } catch (error) {
      const providerName = provider === 'google' ? 'Gmail' : 'Microsoft Outlook'
      console.error(`Error disconnecting ${providerName}:`, error)
      setError(error instanceof Error ? error.message : `Failed to disconnect ${providerName}`)
    } finally {
      setIsDisconnecting(prev => ({ ...prev, [provider]: false }))
    }
  }

  const refreshConnection = async () => {
    await checkConnectionStatus()
  }

  if (userLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-lg">
            {userLoading ? 'Loading user data...' : 'Checking email connection status...'}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Integration</h1>
          <p className="text-lg text-gray-600">
            Connect your Gmail or Microsoft Outlook account to send emails directly from our platform
          </p>
        </div>

        {/* Email Providers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Google Gmail Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                Gmail
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {providerStatus.google?.connected ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Connected
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <span className="ml-2 text-gray-900">{providerStatus.google.email}</span>
                    </div>
                    {providerStatus.google.lastUsed && (
                      <div>
                        <span className="font-medium text-gray-700">Last Used:</span>
                        <span className="ml-2 text-gray-900">
                          {new Date(providerStatus.google.lastUsed).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => disconnectProvider('google')}
                      disabled={isDisconnecting.google}
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      {isDisconnecting.google ? (
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <XCircle className="h-6 w-6 text-gray-400" />
                    <Badge variant="outline" className="text-gray-600">
                      Not Connected
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 text-sm">
                    Connect Gmail to send emails using your Google account
                  </p>
                  
                  <Button
                    onClick={() => connectProvider('google')}
                    disabled={isConnecting.google}
                    className="bg-red-600 hover:bg-red-700 w-full"
                  >
                    {isConnecting.google ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Connect Gmail
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Microsoft Outlook Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                Microsoft Outlook
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {providerStatus.microsoft?.connected ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Connected
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <span className="ml-2 text-gray-900">{providerStatus.microsoft.email}</span>
                    </div>
                    {providerStatus.microsoft.lastUsed && (
                      <div>
                        <span className="font-medium text-gray-700">Last Used:</span>
                        <span className="ml-2 text-gray-900">
                          {new Date(providerStatus.microsoft.lastUsed).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => disconnectProvider('microsoft')}
                      disabled={isDisconnecting.microsoft}
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      {isDisconnecting.microsoft ? (
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <XCircle className="h-6 w-6 text-gray-400" />
                    <Badge variant="outline" className="text-gray-600">
                      Not Connected
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 text-sm">
                    Connect Outlook to send emails using your Microsoft account
                  </p>
                  
                  <Button
                    onClick={() => connectProvider('microsoft')}
                    disabled={isConnecting.microsoft}
                    className="bg-blue-600 hover:bg-blue-700 w-full"
                  >
                    {isConnecting.microsoft ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Connect Outlook
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Refresh Button */}
        <div className="text-center">
          <Button
            onClick={refreshConnection}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Connection Status
          </Button>
        </div>

        {/* Information Card */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <AlertCircle className="h-5 w-5" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <div className="space-y-3">
              <p>
                When you connect your Gmail or Microsoft Outlook account, you'll be able to send emails directly from our platform 
                using your email address. This is useful for:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Sending CMA reports to clients</li>
                <li>Emailing property scripts</li>
                <li>Sharing Who's Who reports</li>
                <li>Sending virtual staging results</li>
                <li>Any other email functionality in our tools</li>
              </ul>
              <p className="text-sm">
                <strong>Note:</strong> We only request permission to send emails and create calendar events on your behalf. 
                We cannot read your emails or access your account in any other way. You can connect both Gmail and Outlook if desired.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Error/Success Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
