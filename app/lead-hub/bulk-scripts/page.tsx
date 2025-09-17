'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2, Users, FileText, ArrowLeft, Mail, Download } from 'lucide-react'
import { useMemberSpaceUser } from '@/hooks/use-memberspace-user'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface BulkContact {
  id: number
  name: string
  email: string
  stage: string
  source: string
  address?: {
    city: string
    state: string
  }
  recentInquiry?: {
    property?: {
      address: string
    }
  }
}

export default function BulkScriptsPage() {
  const { user } = useMemberSpaceUser()
  const searchParams = useSearchParams()
  const [contacts, setContacts] = useState<BulkContact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedScripts, setGeneratedScripts] = useState<{[key: number]: string}>({})
  
  // Form data
  const [scriptType, setScriptType] = useState('email')
  const [tonality, setTonality] = useState('Professional & Authoritative')
  const [additionalContext, setAdditionalContext] = useState('')

  const bulkAction = searchParams.get('bulkAction') || 'all'
  const filterType = searchParams.get('filterType') || 'all'
  const contactIds = searchParams.get('contactIds')?.split(',') || []

  useEffect(() => {
    if (user?.email && contactIds.length > 0) {
      loadContactDetails()
    }
  }, [user?.email, contactIds])

  const loadContactDetails = async () => {
    if (!user?.email) return

    try {
      setIsLoading(true)
      const response = await fetch('/api/fub/contacts', {
        headers: {
          'x-user-email': user.email
        }
      })

      if (response.ok) {
        const data = await response.json()
        const filteredContacts = data.contacts.filter((contact: any) => 
          contactIds.includes(contact.id.toString())
        )
        setContacts(filteredContacts)
      }
    } catch (error) {
      console.error('Error loading contact details:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateBulkScripts = async () => {
    if (!user?.email || contacts.length === 0) return

    try {
      setIsGenerating(true)
      const scripts: {[key: number]: string} = {}

      // Generate script for each contact
      for (const contact of contacts) {
        const scriptData = {
          agentName: user.name || 'Agent',
          brokerageName: 'Your Brokerage',
          scriptType: scriptType,
          topic: getTopicForContact(contact),
          customTopic: '',
          additionalDetails: `${additionalContext}\n\nPersonalized for ${contact.name} - ${contact.stage} from ${contact.source}${contact.address ? ` in ${contact.address.city}, ${contact.address.state}` : ''}${contact.recentInquiry?.property ? `. Recently interested in ${contact.recentInquiry.property.address}` : ''}`,
          agentEmail: user.email,
          scriptTypeCategory: 'Follow-up',
          difficultConversationType: '',
          tonality: tonality,
          selectedContactId: contact.id.toString(),
          useContactPersonalization: true
        }

        try {
          const { generateScript } = await import('@/app/ai-hub/scriptit-ai/actions')
          const result = await generateScript(scriptData, user.email)
          scripts[contact.id] = result.script
        } catch (error) {
          console.error(`Error generating script for ${contact.name}:`, error)
          scripts[contact.id] = `Error generating script for ${contact.name}`
        }
      }

      setGeneratedScripts(scripts)
    } catch (error) {
      console.error('Error in bulk script generation:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getTopicForContact = (contact: BulkContact) => {
    // Smart topic selection based on contact data
    if (contact.stage === 'Lead') return 'current-client'
    if (contact.stage === 'Past Client') return 'past-client'
    if (contact.source === 'Zillow') return 'first-time-homebuyer'
    if (filterType === 'overdue') return 'past-client'
    return 'current-client'
  }

  const getActionTitle = () => {
    switch (filterType) {
      case 'recent': return 'Recent Leads Follow-up'
      case 'overdue': return 'Overdue Contacts Follow-up'
      case 'inquiries': return 'Property Inquiry Follow-up'
      default: return 'Bulk Script Generation'
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-3" />
          <span className="text-lg">Loading contacts...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/lead-hub">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lead Hub
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">{getActionTitle()}</h1>
          <Badge variant="secondary">BETA</Badge>
        </div>
      </div>

      {/* Contact Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Selected Contacts ({contacts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {contacts.slice(0, 8).map(contact => (
              <div key={contact.id} className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">
                  {contact.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="truncate">{contact.name}</span>
              </div>
            ))}
            {contacts.length > 8 && (
              <div className="text-gray-500">
                +{contacts.length - 8} more...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Script Configuration */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Script Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Script Type</Label>
              <Select value={scriptType} onValueChange={setScriptType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="text">Text Message</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Tonality</Label>
              <Select value={tonality} onValueChange={setTonality}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Professional & Authoritative">Professional & Authoritative</SelectItem>
                  <SelectItem value="Friendly & Conversational">Friendly & Conversational</SelectItem>
                  <SelectItem value="Urgent & Direct">Urgent & Direct</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Additional Context (Optional)</Label>
            <Textarea 
              placeholder="Any specific context or message you want included in all scripts..."
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          
          <Button 
            onClick={generateBulkScripts}
            disabled={isGenerating || contacts.length === 0}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating {contacts.length} Scripts...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generate {contacts.length} Personalized Scripts
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Scripts */}
      {Object.keys(generatedScripts).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Generated Scripts ({Object.keys(generatedScripts).length})</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Send All
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {contacts.map(contact => {
                const script = generatedScripts[contact.id]
                if (!script) return null

                return (
                  <div key={contact.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium">{contact.name}</div>
                          <div className="text-sm text-gray-500">{contact.email}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Mail className="w-3 h-3 mr-1" />
                          Send
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">
                      {script}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
