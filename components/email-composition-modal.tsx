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
  Loader2,
  RefreshCw
} from "lucide-react"

interface EmailCompositionModalProps {
  isOpen: boolean
  onClose: () => void
  scriptContent: string
  agentName: string
  brokerageName: string
  contentType?: 'script' | 'cma' | 'ideahub' | 'realbio' | 'listit' | 'real-img' // Add content type to determine which API to use
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
  brokerageName,
  contentType = 'script' // Default to script if not specified
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
      // Small delay to ensure OAuth tokens are stored
      setTimeout(() => {
        checkConnectionStatus()
      }, 500)
      
      // Parse the script content to extract subject and clean up content
      const { extractedSubject, cleanedContent } = parseScriptContent(scriptContent)
      
      // Set default subject and signature based on content type
      if (contentType === 'cma') {
        setSubject(extractedSubject || `CMA Report from ${agentName} - ${brokerageName}`)
      } else if (contentType === 'listit') {
        setSubject(extractedSubject || `Listing Description from ${agentName} - ${brokerageName}`)
      } else if (contentType === 'realbio') {
        setSubject(extractedSubject || `Agent Bio from ${agentName} - ${brokerageName}`)
      } else if (contentType === 'ideahub') {
        setSubject(extractedSubject || `Content from ${agentName} - ${brokerageName}`)
      } else if (contentType === 'real-img') {
        setSubject(extractedSubject || `Interactive Image from ${agentName} - ${brokerageName}`)
      } else {
        setSubject(extractedSubject || `Script from ${agentName} - ${brokerageName}`)
      }
      setSignature(`Best regards,\n${agentName}\n${brokerageName}`)
      // Set email body to cleaned script content
      setEmailBody(cleanedContent)
    }
  }, [isOpen, agentName, brokerageName, scriptContent])

  // Function to parse script content and extract subject/remove placeholders
  const parseScriptContent = (content: string) => {
    let extractedSubject = ''
    let cleanedContent = content

    // Extract subject line (look for patterns like "Subject:", "SUBJECT:", "**Subject:**", etc.)
    const subjectPatterns = [
      /^\*\*Subject:\*\*\s*(.+)$/m,  // **Subject:** format
      /^(?:Subject|SUBJECT):\s*(.+)$/m,  // Standard Subject: format
    ]
    
    for (const pattern of subjectPatterns) {
      const subjectMatch = content.match(pattern)
      if (subjectMatch) {
        extractedSubject = subjectMatch[1].trim()
        // Remove the subject line from content
        cleanedContent = cleanedContent.replace(pattern, '').trim()
        break
      }
    }

    // Remove signature placeholders (common patterns)
    const signaturePatterns = [
      /---+\s*Signature\s*---+/gi,
      /---+\s*Sign\s*---+/gi,
      /---+\s*---+/g,
      /_{3,}/g,
      /-{3,}/g,
      /Signature:\s*$/gm,
      /Sign:\s*$/gm,
      /Best regards,?\s*$/gm,
      /Sincerely,?\s*$/gm,
      /Thank you,?\s*$/gm,
      // Remove specific placeholder patterns
      /\[Your Name\]/g,
      /\[Your Contact Information\]/g,
      /\[Your Agency\]/g,
      /\[Your Real Estate Agency\]/g,
      /\[Your Name\]/g,
      /\[Your Contact Information\]/g,
      /\[Your Real Estate Agency\]/g
    ]

    signaturePatterns.forEach(pattern => {
      cleanedContent = cleanedContent.replace(pattern, '')
    })

    // Clean up extra whitespace and line breaks
    cleanedContent = cleanedContent
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Replace multiple line breaks with double
      .replace(/^\s+|\s+$/g, '') // Trim start and end
      .replace(/\s+$/gm, '') // Trim end of each line

    return { extractedSubject, cleanedContent }
  }

  // Function to wrap long lines for better mobile formatting
  const wrapLongLines = (text: string, maxLength: number = 72) => {
    return text.split('\n').map(line => {
      if (line.length <= maxLength) return line
      
      // Split long lines at word boundaries
      const words = line.split(' ')
      const wrappedLines = []
      let currentLine = ''
      
      for (const word of words) {
        if ((currentLine + word).length <= maxLength) {
          currentLine += (currentLine ? ' ' : '') + word
        } else {
          if (currentLine) wrappedLines.push(currentLine)
          currentLine = word
        }
      }
      
      if (currentLine) wrappedLines.push(currentLine)
      return wrappedLines.join('\n')
    }).join('\n')
  }

  const checkConnectionStatus = async () => {
    try {
      setIsLoading(true)
      console.log('Email modal: Checking OAuth status...')
      const response = await fetch('/api/auth/google/status')
      console.log('Email modal: Status response:', response.status, response.ok)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Email modal: Status data:', data)
        setConnectionStatus(data.status)
      } else {
        console.log('Email modal: Status response not ok')
        setConnectionStatus({ connected: false })
      }
    } catch (error) {
      console.error('Email modal: Error checking connection status:', error)
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
      
      // Determine which API endpoint to use based on content type
      let apiEndpoint = '/api/send-script-email-gmail' // default
      if (contentType === 'cma') {
        apiEndpoint = '/api/send-cma-email-gmail'
      } else if (contentType === 'script') {
        apiEndpoint = '/api/send-script-email-gmail'
      } else if (contentType === 'ideahub') {
        apiEndpoint = '/api/send-ideahub-email-gmail'
      } else if (contentType === 'realbio') {
        apiEndpoint = '/api/send-realbio-email-gmail'
      } else if (contentType === 'listit') {
        apiEndpoint = '/api/send-listit-email-gmail'
      }
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: toEmail,
          subject,
          body: wrapLongLines(emailBody + '\n\n' + signature),
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
               {contentType === 'cma' ? 'Send CMA Report to Client' : 
                contentType === 'ideahub' ? 'Send Content to Client' :
                contentType === 'realbio' ? 'Email To Someone Else' :
                contentType === 'listit' ? 'Email To Someone Else' :
                'Send Script to Client'}
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
             
             {/* Manual refresh button */}
             <div className="flex justify-center">
               <Button
                 variant="outline"
                 size="sm"
                 onClick={checkConnectionStatus}
                 className="text-xs"
               >
                 <RefreshCw className="h-3 w-3 mr-1" />
                 Refresh Connection Status
               </Button>
             </div>

            {/* Email Form */}
            {connectionStatus?.connected && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                                         <Label htmlFor="toEmail">Client Email *</Label>
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
