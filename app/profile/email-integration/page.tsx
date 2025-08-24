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

interface EmailConnectionStatus {
  connected: boolean
  email?: string
  connectedAt?: string
  scopes?: string[]
  lastUsed?: string
}

export default function EmailIntegrationPage() {
  const [connectionStatus, setConnectionStatus] = useState<EmailConnectionStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Check connection status and OAuth completion on page load
  useEffect(() => {
    checkConnectionStatus()
    checkOAuthCompletion()
  }, [])

  const checkConnectionStatus = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/auth/google/status')
      if (response.ok) {
        const data = await response.json()
        setConnectionStatus(data.status)
      } else {
        setConnectionStatus({ connected: false })
      }
    } catch (error) {
      console.error('Error checking connection status:', error)
      setConnectionStatus({ connected: false })
    } finally {
      setIsLoading(false)
    }
  }

  const connectGmail = async () => {
    try {
      setIsConnecting(true)
      setError(null)
      
      // Always redirect to OAuth start - simpler and more reliable
      window.location.href = '/api/auth/google/start'
    } catch (error) {
      console.error('Error connecting Gmail:', error)
      setError(error instanceof Error ? error.message : 'Failed to connect Gmail')
    } finally {
      setIsConnecting(false)
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
        setSuccess(`Gmail connected successfully! Email: ${email}`)
        checkConnectionStatus()
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname)
      } else if (error) {
        setError(`OAuth error: ${error}`)
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    } catch (e) {
      console.error('Error checking OAuth completion:', e)
    }
  }

  const disconnectGmail = async () => {
    try {
      setIsDisconnecting(true)
      setError(null)
      
      const response = await fetch('/api/auth/google/disconnect', {
        method: 'POST'
      })
      
      if (response.ok) {
        setSuccess('Gmail disconnected successfully!')
        setConnectionStatus({ connected: false })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to disconnect')
      }
    } catch (error) {
      console.error('Error disconnecting Gmail:', error)
      setError(error instanceof Error ? error.message : 'Failed to disconnect Gmail')
    } finally {
      setIsDisconnecting(false)
    }
  }

  const refreshConnection = async () => {
    await checkConnectionStatus()
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-lg">Checking email connection status...</span>
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
            Connect your Gmail account to send emails directly from our platform
          </p>
        </div>

        {/* Connection Status Card */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Mail className="h-6 w-6" />
              Gmail Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {connectionStatus?.connected ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Connected
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="ml-2 text-gray-900">{connectionStatus.email}</span>
                  </div>
                  {connectionStatus.connectedAt && (
                    <div>
                      <span className="font-medium text-gray-700">Connected:</span>
                      <span className="ml-2 text-gray-900">
                        {new Date(connectionStatus.connectedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {connectionStatus.lastUsed && (
                    <div>
                      <span className="font-medium text-gray-700">Last Used:</span>
                      <span className="ml-2 text-gray-900">
                        {new Date(connectionStatus.lastUsed).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {connectionStatus.scopes && (
                  <div>
                    <span className="font-medium text-gray-700">Permissions:</span>
                    <div className="mt-2 space-y-1">
                      {connectionStatus.scopes.map((scope, index) => (
                        <Badge key={index} variant="outline" className="mr-2">
                          {scope}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={disconnectGmail}
                    disabled={isDisconnecting}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    {isDisconnecting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Disconnecting...
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Disconnect Gmail
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={refreshConnection}
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Status
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
                
                <p className="text-gray-600">
                  Connect your Gmail account to send emails directly from our platform
                </p>
                
                <Button
                  onClick={connectGmail}
                  disabled={isConnecting}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Mail className="h-5 w-5 mr-2" />
                      Connect Gmail Account
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

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
                When you connect your Gmail account, you'll be able to send emails directly from our platform 
                using your Gmail address. This is useful for:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Sending CMA reports to clients</li>
                <li>Emailing property scripts</li>
                <li>Sharing Who's Who reports</li>
                <li>Any other email functionality in our tools</li>
              </ul>
              <p className="text-sm">
                <strong>Note:</strong> We only request permission to send emails on your behalf. 
                We cannot read your emails or access your account in any other way.
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
