"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Mail, 
  Send, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from "lucide-react"

interface EmailCompositionModalProps {
  isOpen: boolean
  onClose: () => void
  scriptContent: string
  agentName: string
  brokerageName: string
}

interface EmailConnectionStatus {
  connected: boolean
  email?: string
}

export default function EmailCompositionModal({
  isOpen,
  onClose,
  scriptContent,
  agentName,
  brokerageName
}: EmailCompositionModalProps) {
  const [connectionStatus, setConnectionStatus] = useState<EmailConnectionStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Email form fields
  const [toEmail, setToEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [signature, setSignature] = useState("")

  // Check connection status on mount
  useEffect(() => {
    if (isOpen) {
      checkConnectionStatus()
      // Set default subject and signature
      setSubject(`Script from ${agentName} - ${brokerageName}`)
      setSignature(`Best regards,\n${agentName}\n${brokerageName}`)
      // Set email body to script content
      setEmailBody(scriptContent)
    }
  }, [isOpen, agentName, brokerageName, scriptContent])

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

  const sendEmail = async () => {
    if (!toEmail || !subject || !emailBody) {
      setError('Please fill in all required fields')
      return
    }

    if (!connectionStatus?.connected) {
      setError('Gmail account not connected. Please connect your account first.')
      return
    }

    try {
      setIsSending(true)
      setError(null)
      
      const response = await fetch('/api/send-script-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: toEmail,
          subject,
          body: emailBody + '\n\n' + signature,
          from: connectionStatus.email
        }),
      })

      if (response.ok) {
        setSuccess('Email sent successfully!')
        // Close modal after a short delay
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send email')
      }
    } catch (error) {
      console.error('Error sending email:', error)
      setError(error instanceof Error ? error.message : 'Failed to send email')
    } finally {
      setIsSending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Send Script via Email
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Connection Status */}
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>Checking email connection...</span>
              </div>
            ) : !connectionStatus?.connected ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Gmail account not connected. Please connect your account in the Email Integration section first.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Connected to Gmail: {connectionStatus.email}
                </AlertDescription>
              </Alert>
            )}

            {/* Email Form */}
            {connectionStatus?.connected && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="toEmail">To Email *</Label>
                    <Input
                      id="toEmail"
                      type="email"
                      placeholder="client@example.com"
                      value={toEmail}
                      onChange={(e) => setToEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="Script from [Your Name]"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailBody">Email Body *</Label>
                  <Textarea
                    id="emailBody"
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="min-h-[300px] resize-none"
                    placeholder="Your script content will appear here..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signature">Signature</Label>
                  <Textarea
                    id="signature"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    className="min-h-[100px] resize-none"
                    placeholder="Your signature..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={sendEmail}
                    disabled={isSending || !toEmail || !subject || !emailBody}
                    className="flex items-center gap-2"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Email
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isSending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
