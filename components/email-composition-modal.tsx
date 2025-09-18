"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useMemberSpaceUser } from "@/hooks/use-memberspace-user"
import { 
  Mail, 
  Send, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  RefreshCw,
  XCircle
} from "lucide-react"

interface EmailCompositionModalProps {
  isOpen: boolean
  onClose: () => void
  scriptContent: string
  agentName: string
  brokerageName: string
  contentType?: 'script' | 'cma' | 'ideahub' | 'realbio' | 'listit' | 'real-img' // Add content type to determine which API to use
  attachments?: {
    pdfData?: string // Base64 encoded PDF data for CMA
    imageData?: string // Base64 encoded image data for IdeaHub
    imageUrl?: string // URL to image for IdeaHub
    fileName?: string // Name for the attachment
  }
  recipientEmail?: string // Pre-populate recipient email (e.g., from CRM contact)
}

interface EmailConnectionStatus {
  connected: boolean
  email?: string
  provider?: string
}

interface ProviderStatus {
  google: EmailConnectionStatus | null
  microsoft: EmailConnectionStatus | null
}

export default function EmailCompositionModal({
  isOpen,
  onClose,
  scriptContent,
  agentName,
  brokerageName,
  contentType = 'script', // Default to script if not specified
  attachments,
  recipientEmail
}: EmailCompositionModalProps) {
  const { user } = useMemberSpaceUser()
  const [providerStatus, setProviderStatus] = useState<ProviderStatus>({
    google: null,
    microsoft: null
  })
  const [selectedProvider, setSelectedProvider] = useState<'google' | 'microsoft' | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Email form fields
  const [toEmail, setToEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [signature, setSignature] = useState("")
  
  // Attachment handling
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([])
  const [inlineImageHtml, setInlineImageHtml] = useState("")

  // Check connection status on mount and reset initialization
  useEffect(() => {
    if (isOpen && user?.email) {
      // Small delay to ensure OAuth tokens are stored
      setTimeout(() => {
        checkConnectionStatus()
      }, 500)
    } else if (isOpen && !user?.email) {
      console.log('Email modal: User not available, setting loading to false')
      setIsLoading(false)
    }
    
      
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
    // Generate signature using the API
    generateSignature()
    
    // Set email body to cleaned script content
    setEmailBody(cleanedContent)
    
    // Pre-populate recipient email if provided (e.g., from CRM contact)
    if (recipientEmail) {
      setToEmail(recipientEmail)
    } else {
      setToEmail("") // Clear if no recipient email provided
    }
  }, [isOpen, user?.email, agentName, brokerageName, scriptContent, recipientEmail])

  // Update email body when inline image changes
  useEffect(() => {
    if (inlineImageHtml && emailBody) {
      // Only add inline image if it's not already there
      if (!emailBody.includes(inlineImageHtml)) {
        setEmailBody(inlineImageHtml + emailBody)
      }
    }
  }, [inlineImageHtml])

  // Generate signature using the API
  const generateSignature = async () => {
    try {
      if (!user?.email) return
      
      const response = await fetch('/api/generate-signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userEmail: user.email
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setSignature(data.signature)
      } else {
        // Fallback to basic signature
        setSignature(`Best regards,\n${agentName}\n${brokerageName}`)
      }
    } catch (error) {
      console.error('Error generating signature:', error)
      // Fallback to basic signature
      setSignature(`Best regards,\n${agentName}\n${brokerageName}`)
    }
  }

  // Handle attachments when modal opens
  useEffect(() => {
    if (isOpen && attachments) {
      const files: File[] = []
      let imageHtml = ""

      // Handle PDF attachment for CMA
      if (attachments.pdfData && contentType === 'cma') {
        try {
          const pdfBlob = new Blob([Uint8Array.from(atob(attachments.pdfData), c => c.charCodeAt(0))], { type: 'application/pdf' })
          const pdfFile = new File([pdfBlob], attachments.fileName || 'cma-report.pdf', { type: 'application/pdf' })
          files.push(pdfFile)
        } catch (error) {
          console.error('Error creating PDF file:', error)
        }
      }

      // Handle image attachment for IdeaHub
      if (attachments.imageData && contentType === 'ideahub') {
        try {
          const imageBlob = new Blob([Uint8Array.from(atob(attachments.imageData), c => c.charCodeAt(0))], { type: 'image/png' })
          const imageFile = new File([imageBlob], attachments.fileName || 'social-content.png', { type: 'image/png' })
          files.push(imageFile)
          
          // Create inline image HTML
          imageHtml = `<div style="text-align: center; margin-bottom: 20px;"><img src="data:image/png;base64,${attachments.imageData}" style="max-width: 100%; height: auto; border-radius: 8px;" alt="Generated Content" /></div>`
        } catch (error) {
          console.error('Error creating image file:', error)
        }
      }

      // Handle image URL for IdeaHub - just attach it, no inline display
      if (attachments.imageUrl && contentType === 'ideahub' && !attachments.imageData) {
        // No inline image HTML - just attach the file
        imageHtml = ""
        
        // For attachment, we'll fetch the image and convert to file
        fetch(attachments.imageUrl)
          .then(response => response.blob())
          .then(blob => {
            const imageFile = new File([blob], attachments.fileName || 'social-content.png', { type: 'image/png' })
            setAttachmentFiles(prev => [...prev, imageFile])
          })
          .catch(error => {
            console.error('Error fetching image for attachment:', error)
          })
      }

      // Handle image URL for StageIT (script content type) - just attach it, no inline display
      if (attachments.imageUrl && contentType === 'script' && !attachments.imageData) {
        // No inline image HTML - just attach the file
        imageHtml = ""
        
        // For attachment, we'll fetch the image and convert to file
        fetch(attachments.imageUrl)
          .then(response => response.blob())
          .then(blob => {
            const imageFile = new File([blob], attachments.fileName || 'staged-image.jpg', { type: 'image/jpeg' })
            setAttachmentFiles(prev => [...prev, imageFile])
          })
          .catch(error => {
            console.error('Error fetching image for attachment:', error)
          })
      }

      setAttachmentFiles(files)
      setInlineImageHtml(imageHtml)
    } else if (isOpen && !attachments) {
      setAttachmentFiles([])
      setInlineImageHtml("")
    }
  }, [isOpen, attachments, contentType])

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
      /\[Agent Name\]/g,
      /\[Brokerage Name\]/g,
      /\[Your Real Estate Company\]/g,
      // More aggressive signature removal for AI-generated content
      /Best regards,?\s*\n\s*Agent\s*\n\s*Your Brokerage/gi,
      /Best regards,?\s*\n\s*\[?Agent Name\]?\s*\n\s*\[?Your Brokerage\]?/gi,
      /Warm regards,?\s*\n\s*\[?Your Real Estate Company\]?/gi,
      /Sincerely,?\s*\n\s*\[?Agent\]?\s*\n\s*\[?Your Brokerage\]?/gi
    ]

    signaturePatterns.forEach(pattern => {
      cleanedContent = cleanedContent.replace(pattern, '')
    })
    
    // Clean up any trailing whitespace or multiple newlines
    cleanedContent = cleanedContent.trim().replace(/\n{3,}/g, '\n\n')

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
    // Use same email detection logic as Email Integration page
    let currentUserEmail = localStorage.getItem('connected_email') || localStorage.getItem('gmail_connected_email')
    
    if (!currentUserEmail) {
      currentUserEmail = user?.email
    }
    
    if (!currentUserEmail) {
      console.log('Email modal: No user email available')
      setProviderStatus({ google: { connected: false }, microsoft: { connected: false } })
      setIsLoading(false)
      return
    }
    
    try {
      setIsLoading(true)
      console.log('Email modal: Checking OAuth status for:', currentUserEmail, '(localStorage email:', localStorage.getItem('connected_email'), 'MemberSpace email:', user?.email, ')')
      
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
        console.log('Email modal: Microsoft status data:', data)
        microsoftStatus = { ...data, provider: 'microsoft' }
      } else {
        console.log('Email modal: Microsoft status response not ok:', microsoftResponse.status)
      }
      
      console.log('Email modal: Provider status:', { google: googleStatus, microsoft: microsoftStatus })
      setProviderStatus({
        google: googleStatus,
        microsoft: microsoftStatus
      })
      
      // Auto-select provider if only one is connected
      if (googleStatus.connected && !microsoftStatus.connected) {
        setSelectedProvider('google')
      } else if (microsoftStatus.connected && !googleStatus.connected) {
        setSelectedProvider('microsoft')
      } else if (googleStatus.connected && microsoftStatus.connected) {
        // If both are connected, default to Google (existing behavior)
        setSelectedProvider('google')
      }
      
    } catch (error) {
      console.error('Email modal: Error checking connection status:', error)
      setProviderStatus({ google: { connected: false }, microsoft: { connected: false } })
    } finally {
      setIsLoading(false)
    }
  }

  const sendEmail = async () => {
    if (!toEmail || !subject || !emailBody) {
      setError('Please fill in all required fields')
      return
    }

    if (!selectedProvider) {
      setError('Please select an email provider.')
      return
    }

    const currentProvider = providerStatus[selectedProvider]
    if (!currentProvider?.connected) {
      const providerName = selectedProvider === 'google' ? 'Gmail' : 'Microsoft Outlook'
      setError(`${providerName} account not connected. Please connect your account first.`)
      return
    }

    try {
      setIsSending(true)
      setError(null)
      
      // Determine which API endpoint to use based on provider and content type
      let apiEndpoint = '/api/send-script-email-gmail' // default
      
      if (selectedProvider === 'microsoft') {
        // Use Microsoft Outlook API
        apiEndpoint = '/api/send-outlook-email'
      } else {
        // Use Gmail APIs (existing behavior)
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
      }
      
      // Create FormData for attachments
      const formData = new FormData()
      formData.append('to', toEmail)
      formData.append('subject', subject)
      formData.append('body', wrapLongLines(emailBody + '\n\n' + signature))
      formData.append('from', currentProvider.email || '')
      formData.append('contentType', contentType || 'script')
      
      // Add attachments if any
      attachmentFiles.forEach((file, index) => {
        formData.append(`attachment_${index}`, file)
      })

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData, // Use FormData instead of JSON for file uploads
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
            ) : (
              <div className="space-y-4">
                {/* Provider Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Gmail Status */}
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                        <Mail className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">Gmail</span>
                      {providerStatus.google?.connected ? (
                        <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400 ml-auto" />
                      )}
                    </div>
                    {providerStatus.google?.connected ? (
                      <div>
                        <p className="text-sm text-green-700">Connected as:</p>
                        <p className="text-xs text-green-600">{providerStatus.google.email}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">Not connected</p>
                    )}
                  </div>

                  {/* Microsoft Status */}
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                        <Mail className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">Outlook</span>
                      {providerStatus.microsoft?.connected ? (
                        <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400 ml-auto" />
                      )}
                    </div>
                    {providerStatus.microsoft?.connected ? (
                      <div>
                        <p className="text-sm text-green-700">Connected as:</p>
                        <p className="text-xs text-green-600">{providerStatus.microsoft.email}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">Not connected</p>
                    )}
                  </div>
                </div>

                {/* Provider Selection */}
                {(providerStatus.google?.connected || providerStatus.microsoft?.connected) && (
                  <div className="space-y-2">
                    <Label>Send email using:</Label>
                    <div className="flex gap-2">
                      {providerStatus.google?.connected && (
                        <Button
                          variant={selectedProvider === 'google' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedProvider('google')}
                          className="flex items-center gap-2"
                        >
                          <div className="w-4 h-4 bg-red-500 rounded flex items-center justify-center">
                            <Mail className="h-3 w-3 text-white" />
                          </div>
                          Gmail
                        </Button>
                      )}
                      {providerStatus.microsoft?.connected && (
                        <Button
                          variant={selectedProvider === 'microsoft' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedProvider('microsoft')}
                          className="flex items-center gap-2"
                        >
                          <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                            <Mail className="h-3 w-3 text-white" />
                          </div>
                          Outlook
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* No connections warning */}
                {!providerStatus.google?.connected && !providerStatus.microsoft?.connected && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No email accounts connected. Please connect Gmail or Microsoft Outlook in the Email Integration section first.
                    </AlertDescription>
                  </Alert>
                )}

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
              </div>
            )}

            {/* Email Form */}
            {(providerStatus.google?.connected || providerStatus.microsoft?.connected) && selectedProvider && (
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
                    className="min-h-[300px]"
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
