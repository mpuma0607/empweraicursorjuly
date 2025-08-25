"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { useMemberSpaceUser } from "@/hooks/use-memberspace-user"
import { useToast } from "@/hooks/use-toast"

export default function BegginsEmailIntegrationPage() {
  const [isGmailConnected, setIsGmailConnected] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const { user, loading: isUserLoading } = useMemberSpaceUser()
  const { toast } = useToast()

  // Check Gmail connection status when component mounts
  useEffect(() => {
    if (user?.email) {
      checkGmailStatus()
    }
  }, [user?.email])

  const checkGmailStatus = async () => {
    if (!user?.email) return
    
    setIsChecking(true)
    try {
      const response = await fetch(`/api/beggins/auth/google/status?email=${encodeURIComponent(user.email)}`)
      if (response.ok) {
        const data = await response.json()
        setIsGmailConnected(data.status.connected)
      } else {
        setIsGmailConnected(false)
      }
    } catch (error) {
      console.error('Error checking Gmail status:', error)
      setIsGmailConnected(false)
    } finally {
      setIsChecking(false)
    }
  }

  const connectGmail = async () => {
    if (!user?.email) {
      toast({
        title: "Login Required",
        description: "Please log in to connect your Gmail account.",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)
    try {
      // Redirect to Beggins Google OAuth start
      window.location.href = '/api/beggins/auth/google/start'
    } catch (error) {
      console.error('Error starting Gmail connection:', error)
      toast({
        title: "Connection Failed",
        description: "Failed to start Gmail connection. Please try again.",
        variant: "destructive",
      })
      setIsConnecting(false)
    }
  }

  const disconnectGmail = async () => {
    if (!user?.email) return

    try {
      const response = await fetch('/api/beggins/auth/google/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      })

      if (response.ok) {
        setIsGmailConnected(false)
        toast({
          title: "Gmail Disconnected",
          description: "Your Gmail account has been disconnected successfully.",
        })
      } else {
        throw new Error('Failed to disconnect')
      }
    } catch (error) {
      console.error('Error disconnecting Gmail:', error)
      toast({
        title: "Disconnect Failed",
        description: "Failed to disconnect Gmail account. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRefresh = () => {
    checkGmailStatus()
  }

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Login Required</h1>
          <p className="text-gray-300 mb-6">Please log in to access email integration.</p>
          <Button onClick={() => window.location.href = '/portal'} className="bg-white text-black hover:bg-gray-100">
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="p-6">
        <div className="container mx-auto">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="bg-transparent border-white text-white hover:bg-white hover:text-black"
          >
            ← Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Email Integration</h1>
            <p className="text-xl text-gray-300">
              Connect your Gmail account to send emails directly from Beggins University tools
            </p>
          </div>

          {/* Connection Status */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <Mail className="h-6 w-6" />
                Gmail Connection Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isGmailConnected ? (
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-400" />
                  )}
                  <span className="text-lg">
                    {isGmailConnected ? "Connected" : "Not Connected"}
                  </span>
                </div>
                <Badge variant={isGmailConnected ? "default" : "secondary"}>
                  {isGmailConnected ? "Active" : "Inactive"}
                </Badge>
              </div>

              {isGmailConnected && (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <p className="text-green-300 text-sm">
                    ✓ Your Gmail account is connected and ready to use with Beggins University tools.
                  </p>
                </div>
              )}

              {!isGmailConnected && (
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-yellow-300 text-sm">
                    ℹ️ Connect your Gmail account to send emails directly to clients from our AI tools.
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                {!isGmailConnected ? (
                  <Button
                    onClick={connectGmail}
                    disabled={isConnecting}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                  >
                    {isConnecting ? (
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
                ) : (
                  <Button
                    onClick={disconnectGmail}
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white flex-1"
                  >
                    Disconnect Gmail
                  </Button>
                )}

                <Button
                  onClick={handleRefresh}
                  disabled={isChecking}
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black"
                >
                  {isChecking ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Benefits of Gmail Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Direct Client Communication</h4>
                  <p className="text-gray-300 text-sm">
                    Send emails directly to clients using your Gmail account from our AI tools.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Professional Branding</h4>
                  <p className="text-gray-300 text-sm">
                    Maintain your professional email signature and branding when sending emails.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Seamless Workflow</h4>
                  <p className="text-gray-300 text-sm">
                    No need to copy and paste content - send emails directly from our tools.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
