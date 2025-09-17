'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Users, Zap, Home, Activity, ArrowRight, Database, Filter, Mail, FileText, Clock, MapPin, Phone, X, Download, RefreshCw, Edit } from 'lucide-react'
import { useMemberSpaceUser } from '@/hooks/use-memberspace-user'
import EmailCompositionModal from '@/components/email-composition-modal'
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

interface LeadContact {
  id: number
  name: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: {
    city: string
    state: string
    full: string
  } | null
  source: string
  stage: string
  created: string
  updated: string
  lastActivity: string
  recentInquiry?: {
    property?: {
      address: string
      city: string
      state: string
    }
  }
}

function LeadHubDashboard({ fubStatus, userEmail }: { fubStatus: FUBStatus, userEmail: string }) {
  const [contacts, setContacts] = useState<LeadContact[]>([])
  const [isLoadingContacts, setIsLoadingContacts] = useState(true)
  const [filterStage, setFilterStage] = useState<string>('all')
  const [filterSource, setFilterSource] = useState<string>('all')
  
  // Action states
  const [generatingScript, setGeneratingScript] = useState<number | null>(null)
  const [generatingCMA, setGeneratingCMA] = useState<number | null>(null)
  const [generatedScript, setGeneratedScript] = useState<{contact: LeadContact, script: string} | null>(null)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  
  // Script modal customization
  const [editableEmail, setEditableEmail] = useState('')
  const [selectedTonality, setSelectedTonality] = useState('Professional & Authoritative')
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const [isRegenerating, setIsRegenerating] = useState(false)

  // Load contacts from Follow Up Boss
  useEffect(() => {
    if (userEmail) {
      loadContacts()
    }
  }, [userEmail])

  const loadContacts = async () => {
    try {
      setIsLoadingContacts(true)
      const response = await fetch('/api/fub/contacts?limit=50', {
        headers: {
          'x-user-email': userEmail
        }
      })

      if (response.ok) {
        const data = await response.json()
        setContacts(data.contacts || [])
      }
    } catch (error) {
      console.error('Error loading contacts:', error)
    } finally {
      setIsLoadingContacts(false)
    }
  }

  // Filter contacts based on selected filters
  const filteredContacts = contacts.filter(contact => {
    if (filterStage !== 'all' && contact.stage !== filterStage) return false
    if (filterSource !== 'all' && contact.source !== filterSource) return false
    return true
  })

  // Get recent contacts (last 7 days)
  const recentContacts = contacts.filter(contact => {
    const createdDate = new Date(contact.created)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return createdDate > weekAgo
  })

  // Get contacts needing follow-up (30+ days since last activity)
  const needsFollowUp = contacts.filter(contact => {
    const lastActivity = new Date(contact.lastActivity)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return lastActivity < thirtyDaysAgo
  })

  // Get contacts with recent property inquiries
  const withInquiries = contacts.filter(contact => contact.recentInquiry?.property)

  // Generate personalized script for contact
  const generateScriptForContact = async (contact: LeadContact) => {
    try {
      setGeneratingScript(contact.id)
      
      // Build script data based on contact info
      const scriptData = {
        agentName: fubStatus.user?.name || 'Agent',
        brokerageName: 'Your Brokerage', // Could get from user profile
        scriptType: 'email',
        topic: getTopicForContact(contact),
        customTopic: '',
        additionalDetails: `Follow-up script for ${contact.name} - ${contact.stage} from ${contact.source}${contact.address ? ` in ${contact.address.city}, ${contact.address.state}` : ''}${contact.recentInquiry?.property ? `. Recently interested in ${contact.recentInquiry.property.address}` : ''}`,
        agentEmail: userEmail,
        scriptTypeCategory: 'Follow-up',
        difficultConversationType: '',
        tonality: 'Professional & Authoritative',
        selectedContactId: contact.id.toString(),
        useContactPersonalization: true
      }

      // Use the same generateScript function as ScriptIT
      const { generateScript } = await import('@/app/ai-hub/scriptit-ai/actions')
      const result = await generateScript(scriptData, userEmail)
      
      // Store the generated script and open email modal directly
      setGeneratedScript({ contact, script: result.script })
      setEditableEmail(contact.email)
      setSelectedTonality('Professional & Authoritative')
      setSelectedLanguage('English')
      setIsEmailModalOpen(true)
      
    } catch (error) {
      console.error('Error generating script:', error)
      alert('Failed to generate script. Please try again.')
    } finally {
      setGeneratingScript(null)
    }
  }

  // Smart topic selection based on contact data
  const getTopicForContact = (contact: LeadContact) => {
    if (contact.stage === 'Lead') return 'current-client'
    if (contact.stage === 'Past Client') return 'past-client'
    if (contact.source === 'Zillow') return 'first-time-homebuyer'
    return 'current-client'
  }

  // Regenerate script with new tonality/language
  const regenerateScript = async () => {
    if (!generatedScript) return

    try {
      setIsRegenerating(true)
      const contact = generatedScript.contact
      
      // Build script data with new settings
      let additionalDetails = `Follow-up script for ${contact.name} - ${contact.stage} from ${contact.source}${contact.address ? ` in ${contact.address.city}, ${contact.address.state}` : ''}${contact.recentInquiry?.property ? `. Recently interested in ${contact.recentInquiry.property.address}` : ''}`
      
      // Add language instruction if not English
      if (selectedLanguage !== 'English') {
        additionalDetails += `\n\nIMPORTANT: Generate this script in ${selectedLanguage} language.`
      }

      const scriptData = {
        agentName: fubStatus.user?.name || 'Agent',
        brokerageName: 'Your Brokerage',
        scriptType: 'email',
        topic: getTopicForContact(contact),
        customTopic: '',
        additionalDetails,
        agentEmail: userEmail,
        scriptTypeCategory: 'Follow-up',
        difficultConversationType: '',
        tonality: selectedTonality,
        selectedContactId: contact.id.toString(),
        useContactPersonalization: true
      }

      const { generateScript } = await import('@/app/ai-hub/scriptit-ai/actions')
      const result = await generateScript(scriptData, userEmail)
      
      // Update the generated script
      setGeneratedScript({ contact, script: result.script })
      
    } catch (error) {
      console.error('Error regenerating script:', error)
      alert('Failed to regenerate script. Please try again.')
    } finally {
      setIsRegenerating(false)
    }
  }

  // Generate CMA for contact's property inquiry
  const generateCMAForContact = async (contact: LeadContact) => {
    if (!contact.recentInquiry?.property) {
      alert('No recent property inquiry found for this contact')
      return
    }

    try {
      setGeneratingCMA(contact.id)
      
      // Open QuickCMA with pre-filled property address
      const params = new URLSearchParams({
        address: contact.recentInquiry.property.address,
        contactId: contact.id.toString(),
        contactName: contact.name,
        contactEmail: contact.email
      })
      
      window.open(`/ai-hub/quickcma-ai?${params.toString()}`, '_blank')
      
    } catch (error) {
      console.error('Error generating CMA:', error)
      alert('Failed to generate CMA. Please try again.')
    } finally {
      setGeneratingCMA(null)
    }
  }

  // Handle bulk actions from Action Required panel
  const handleBulkFollowUps = () => {
    if (recentContacts.length === 0) {
      alert('No recent leads to generate follow-ups for')
      return
    }
    
    // Open bulk script generator (we'll build this next)
    const params = new URLSearchParams({
      bulkAction: 'follow-up',
      contactIds: recentContacts.map(c => c.id.toString()).join(','),
      filterType: 'recent'
    })
    window.open(`/lead-hub/bulk-scripts?${params.toString()}`, '_blank')
  }

  const handleBulkScripts = () => {
    if (needsFollowUp.length === 0) {
      alert('No contacts need follow-up scripts')
      return
    }
    
    const params = new URLSearchParams({
      bulkAction: 'overdue',
      contactIds: needsFollowUp.map(c => c.id.toString()).join(','),
      filterType: 'overdue'
    })
    window.open(`/lead-hub/bulk-scripts?${params.toString()}`, '_blank')
  }

  const handleBulkCMAs = () => {
    if (withInquiries.length === 0) {
      alert('No contacts have property inquiries for CMAs')
      return
    }
    
    const params = new URLSearchParams({
      bulkAction: 'cma',
      contactIds: withInquiries.map(c => c.id.toString()).join(','),
      filterType: 'inquiries'
    })
    window.open(`/lead-hub/bulk-cmas?${params.toString()}`, '_blank')
  }

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

      {/* Action Required Section */}
      <Card className="mb-8 border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Clock className="w-5 h-5" />
            Action Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">{recentContacts.length}</div>
              <div className="text-sm text-gray-600">New Leads (Last 7 Days)</div>
              <Button 
                size="sm" 
                className="mt-2" 
                variant="outline"
                onClick={handleBulkFollowUps}
                disabled={recentContacts.length === 0}
              >
                Generate Follow-ups
              </Button>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-red-600">{needsFollowUp.length}</div>
              <div className="text-sm text-gray-600">Need Follow-up (30+ Days)</div>
              <Button 
                size="sm" 
                className="mt-2" 
                variant="outline"
                onClick={handleBulkScripts}
                disabled={needsFollowUp.length === 0}
              >
                Create Scripts
              </Button>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-green-600">{withInquiries.length}</div>
              <div className="text-sm text-gray-600">Property Inquiries Need CMAs</div>
              <Button 
                size="sm" 
                className="mt-2" 
                variant="outline"
                onClick={handleBulkCMAs}
                disabled={withInquiries.length === 0}
              >
                Create CMAs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Button 
          className="h-20 flex flex-col gap-2" 
          variant="outline"
          onClick={() => {
            const params = new URLSearchParams({ bulkAction: 'all', filterType: 'all' })
            window.open(`/lead-hub/bulk-scripts?${params.toString()}`, '_blank')
          }}
        >
          <Zap className="w-6 h-6" />
          <span>Bulk Scripts</span>
        </Button>
        <Button 
          className="h-20 flex flex-col gap-2" 
          variant="outline"
          onClick={() => {
            const params = new URLSearchParams({ bulkAction: 'cma-all', filterType: 'all' })
            window.open(`/lead-hub/bulk-cmas?${params.toString()}`, '_blank')
          }}
        >
          <Home className="w-6 h-6" />
          <span>Batch CMAs</span>
        </Button>
        <Button 
          className="h-20 flex flex-col gap-2" 
          variant="outline"
          onClick={() => {
            alert('Email Campaign builder coming soon!')
          }}
        >
          <Mail className="w-6 h-6" />
          <span>Email Campaign</span>
        </Button>
        <Button 
          className="h-20 flex flex-col gap-2" 
          variant="outline"
          onClick={() => {
            alert('Analytics dashboard coming soon!')
          }}
        >
          <Activity className="w-6 h-6" />
          <span>View Analytics</span>
        </Button>
      </div>

      {/* Lead Pipeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Lead Pipeline ({filteredContacts.length} contacts)
            </CardTitle>
            <div className="flex gap-2">
              <Select value={filterStage} onValueChange={setFilterStage}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Prospect">Prospect</SelectItem>
                  <SelectItem value="Client">Client</SelectItem>
                  <SelectItem value="Past Client">Past Client</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="Zillow">Zillow</SelectItem>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingContacts ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading contacts...
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No contacts found with current filters
            </div>
          ) : (
            <div className="space-y-3">
              {filteredContacts.slice(0, 10).map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {contact.firstName?.[0]}{contact.lastName?.[0]}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-4">
                        {contact.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {contact.email}
                          </span>
                        )}
                        {contact.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {contact.phone}
                          </span>
                        )}
                        {contact.address && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {contact.address.city}, {contact.address.state}
                          </span>
                        )}
                      </div>
                      {contact.recentInquiry?.property && (
                        <div className="text-xs text-green-600 mt-1">
                          Interested in: {contact.recentInquiry.property.address}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{contact.stage}</Badge>
                    <Badge variant="secondary">{contact.source}</Badge>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => generateScriptForContact(contact)}
                        disabled={generatingScript === contact.id}
                      >
                        {generatingScript === contact.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Mail className="w-3 h-3" />
                        )}
                        Create Email
                      </Button>
                      {contact.recentInquiry?.property && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => generateCMAForContact(contact)}
                          disabled={generatingCMA === contact.id}
                        >
                          {generatingCMA === contact.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Home className="w-3 h-3" />
                          )}
                          CMA
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredContacts.length > 10 && (
                <div className="text-center pt-4">
                  <Button variant="outline">
                    Load More ({filteredContacts.length - 10} remaining)
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>


      {/* Email Composition Modal */}
      {generatedScript && (
        <EmailCompositionModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          scriptContent={generatedScript.script}
          agentName={fubStatus.user?.name || 'Agent'}
          brokerageName="Your Brokerage"
          recipientEmail={editableEmail}
        />
      )}
    </div>
  )
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

  // Connected to FUB - show full dashboard
  return <LeadHubDashboard fubStatus={fubStatus} userEmail={user?.email || ''} />
}
