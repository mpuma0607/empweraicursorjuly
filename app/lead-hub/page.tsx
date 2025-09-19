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
  assignedAgent?: string
  recentInquiry?: {
    property?: {
      address: string
      city: string
      state: string
    }
  }
}

function LeadHubDashboard({ fubStatus, userEmail, user }: { fubStatus: FUBStatus, userEmail: string, user: any }) {
  const [contacts, setContacts] = useState<LeadContact[]>([])
  const [isLoadingContacts, setIsLoadingContacts] = useState(true)
  const [filterStage, setFilterStage] = useState<string>('all')
  const [filterSource, setFilterSource] = useState<string>('all')
  const [filterAgent, setFilterAgent] = useState<string>('all')
  const [displayLimit, setDisplayLimit] = useState(10)
  
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
  
  // Follow-up campaign state
  const [isGenerating, setIsGenerating] = useState(false)
  const [emailsToSend, setEmailsToSend] = useState<any[]>([])
  const [isFollowUpPreviewOpen, setIsFollowUpPreviewOpen] = useState(false)
  const [isSendingFollowUps, setIsSendingFollowUps] = useState(false)
  
  // Template editing state
  const [editableSubjectTemplate, setEditableSubjectTemplate] = useState('')
  const [editableBodyTemplate, setEditableBodyTemplate] = useState('')
  
  // Activity logging state
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false)
  const [selectedContactForActivity, setSelectedContactForActivity] = useState<LeadContact | null>(null)
  const [activityType, setActivityType] = useState('email')
  const [activityNotes, setActivityNotes] = useState('')
  const [isLoggingActivity, setIsLoggingActivity] = useState(false)

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

  // Get recent contacts (last 7 days)
  const recentContacts = contacts.filter(contact => {
    const createdDate = new Date(contact.created)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return createdDate > weekAgo
  })

  // Helper function to check if contact is new
  const isNewLead = (contact: LeadContact) => {
    return recentContacts.some(rc => rc.id === contact.id)
  }

  // Filter and smart sort contacts
  const filteredContacts = contacts
    .filter(contact => {
      console.log('Filtering contact:', contact.name, 'stage:', contact.stage, 'source:', contact.source, 'filterStage:', filterStage, 'filterSource:', filterSource)
      
      if (filterStage !== 'all' && contact.stage !== filterStage) {
        console.log('Filtered out by stage:', contact.name)
        return false
      }
      if (filterSource !== 'all' && contact.source !== filterSource) {
        console.log('Filtered out by source:', contact.name, 'has source:', contact.source, 'looking for:', filterSource)
        return false
      }
      if (filterAgent !== 'all' && contact.assignedAgent !== filterAgent) {
        console.log('Filtered out by agent:', contact.name)
        return false
      }
      return true
    })
    .sort((a, b) => {
      // Smart sorting: New leads first, then by last activity
      const aIsNew = isNewLead(a)
      const bIsNew = isNewLead(b)
      
      if (aIsNew && !bIsNew) return -1
      if (!aIsNew && bIsNew) return 1
      
      // If both are new or both are old, sort by last activity (most recent first)
      return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    })

  console.log('Total contacts:', contacts.length, 'Filtered contacts:', filteredContacts.length, 'Displaying:', Math.min(filteredContacts.length, displayLimit))

  // Get contacts needing follow-up (30+ days since last activity)
  const needsFollowUp = contacts.filter(contact => {
    const lastActivity = new Date(contact.lastActivity)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return lastActivity < thirtyDaysAgo
  })

  // Get contacts with recent property inquiries
  const withInquiries = contacts.filter(contact => contact.recentInquiry?.property)

  // Get unique sources and agents for filter dropdowns
  const uniqueSources = ['all', ...new Set(contacts.map(c => c.source).filter(Boolean))]
  const uniqueAgents = ['all', ...new Set(contacts.map(c => c.assignedAgent).filter(Boolean))]

  // Regenerate emails when templates change (moved after all variable definitions)
  useEffect(() => {
    if (editableSubjectTemplate && editableBodyTemplate && recentContacts.length > 0 && userEmail && fubStatus.user) {
      regenerateFollowUpEmails()
    }
  }, [editableSubjectTemplate, editableBodyTemplate, recentContacts.length, userEmail, fubStatus.user])

  // Generate personalized script for contact
  const generateScriptForContact = async (contact: LeadContact) => {
    try {
      setGeneratingScript(contact.id)
      
      // Build script data based on contact info (using same logic as follow-up campaign)
      const agentName = fubStatus.user?.name || user?.name || user?.email?.split('@')[0] || 'Agent'
      const scriptData = {
        agentName: agentName,
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

  // Generate follow-ups for new leads using template + merge fields
  const generateNewLeadFollowUps = async () => {
    if (recentContacts.length === 0) {
      alert('No recent leads to send follow-ups to')
      return
    }

    try {
      setIsGenerating(true)

      // Get agent data for signature with debugging
      console.log('FUB Status for signature:', fubStatus)
      console.log('User email for signature:', userEmail)
      console.log('MemberSpace user for signature:', user)
      
      // Try multiple sources for agent name
      const agentName = fubStatus.user?.name || user?.name || user?.email?.split('@')[0] || 'Your Agent'
      const brokerageName = 'Your Brokerage' // Could be enhanced later with branding profile
      const agentPhone = fubStatus.user?.phone || 'Your Phone'
      
      console.log('Agent data:', { agentName, brokerageName, agentPhone, userEmail })
      
      // Generate signature directly from available FUB data (more reliable than API)
      let generatedSignature = `Best regards,\n${agentName}`
      
      // Add brokerage if we have it
      if (brokerageName && brokerageName !== 'Your Brokerage') {
        generatedSignature += `\n${brokerageName}`
      }
      
      // Add phone if we have it
      if (agentPhone && agentPhone !== 'Your Phone') {
        generatedSignature += `\n${agentPhone}`
      }
      
      // Always add email
      if (userEmail) {
        generatedSignature += `\n${userEmail}`
      }
      
      console.log('Generated signature from FUB data:', generatedSignature)
      
      // Create the follow-up template with merge fields (signature pre-populated)
      const template = {
        subject: 'Welcome to your home search, {{firstName}}!',
        body: `Hi {{firstName}},

Thank you for your interest in {{city}} properties! I'm ${agentName} with ${brokerageName}, and I'd love to help you find the perfect home.

I noticed you came to us through {{source}}, which tells me you're serious about your home search. I specialize in helping clients in {{city}} and the surrounding areas find exactly what they're looking for.

Based on your recent activity, I have some great properties that might be perfect for you. I'd love to schedule a quick 15-minute call to understand your needs and show you what's available in your price range.

When would be a good time to chat this week?

${generatedSignature}`
      }

      // Store editable templates
      setEditableSubjectTemplate(template.subject)
      setEditableBodyTemplate(template.body)

      // Generate initial emails manually since useEffect won't fire immediately
      const initialEmails = recentContacts.map(contact => {
        const firstName = contact.firstName || contact.name.split(' ')[0] || 'there'
        const city = contact.address?.city || 'your area'
        const source = contact.source || 'your inquiry'
        
        return {
          contactId: contact.id,
          contactName: contact.name,
          email: contact.email,
          subject: template.subject
            .replace(/\{\{firstName\}\}/g, firstName),
          body: template.body
            .replace(/\{\{firstName\}\}/g, firstName)
            .replace(/\{\{city\}\}/g, city)
            .replace(/\{\{source\}\}/g, source)
        }
      })
      
      setEmailsToSend(initialEmails)
      setIsFollowUpPreviewOpen(true)

    } catch (error) {
      console.error('Error generating follow-ups:', error)
      alert('Failed to generate follow-ups. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Regenerate emails when template is edited
  const regenerateFollowUpEmails = () => {
    try {
      if (!editableSubjectTemplate || !editableBodyTemplate || !userEmail) {
        console.log('Missing template data:', { 
          hasSubject: !!editableSubjectTemplate, 
          hasBody: !!editableBodyTemplate, 
          hasEmail: !!userEmail,
          contactCount: recentContacts.length 
        })
        return
      }
      
      const updatedEmails = recentContacts.map(contact => {
        const firstName = contact.firstName || contact.name.split(' ')[0] || 'there'
        const city = contact.address?.city || 'your area'
        const source = contact.source || 'your inquiry'
        
        return {
          contactId: contact.id,
          contactName: contact.name,
          email: contact.email,
          subject: editableSubjectTemplate
            .replace(/\{\{firstName\}\}/g, firstName),
          body: editableBodyTemplate
            .replace(/\{\{firstName\}\}/g, firstName)
            .replace(/\{\{city\}\}/g, city)
            .replace(/\{\{source\}\}/g, source)
        }
      })
      
      console.log('Generated emails:', updatedEmails.length)
      setEmailsToSend(updatedEmails)
    } catch (error) {
      console.error('Error in regenerateFollowUpEmails:', error)
    }
  }

  // Send the follow-up campaign
  const sendFollowUpCampaign = async () => {
    if (emailsToSend.length === 0) return

    try {
      setIsSendingFollowUps(true)
      let successCount = 0
      let failCount = 0

      // Send emails one by one (could be done in parallel but this is safer)
      for (const email of emailsToSend) {
        try {
          // Use the existing script email API
          const response = await fetch('/api/send-script-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              to: email.email,
              subject: email.subject,
              script: email.body,
              agentName: fubStatus.user?.name || 'Agent',
              brokerageName: 'Your Brokerage'
            })
          })

          if (response.ok) {
            successCount++
            console.log(`Follow-up sent to ${email.contactName}`)
          } else {
            failCount++
            console.error(`Failed to send to ${email.contactName}`)
          }

          // Small delay between emails to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 500))

        } catch (error) {
          failCount++
          console.error(`Error sending to ${email.contactName}:`, error)
        }
      }

      // Show results
      if (successCount > 0) {
        alert(`Successfully sent ${successCount} follow-up emails!${failCount > 0 ? ` ${failCount} failed.` : ''}`)
      } else {
        alert('Failed to send follow-up emails. Please try again.')
      }

      // Close modal
      setIsFollowUpPreviewOpen(false)
      setEmailsToSend([])

    } catch (error) {
      console.error('Error in follow-up campaign:', error)
      alert('Failed to send follow-up campaign. Please try again.')
    } finally {
      setIsSendingFollowUps(false)
    }
  }

  // Log activity to Follow Up Boss
  const logActivityToFUB = async () => {
    if (!selectedContactForActivity || !activityNotes.trim()) {
      alert('Please enter activity notes')
      return
    }

    try {
      setIsLoggingActivity(true)
      
      console.log('Logging activity:', {
        contactId: selectedContactForActivity.id,
        activityType: activityType,
        notes: activityNotes,
        agentName: fubStatus.user?.name || 'Agent',
        userEmail: userEmail
      })
      
      const response = await fetch('/api/fub/log-activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': userEmail
        },
        body: JSON.stringify({
          contactId: selectedContactForActivity.id,
          activityType: activityType,
          notes: activityNotes,
          agentName: fubStatus.user?.name || 'Agent'
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Activity logged successfully:', result)
        alert(`${activityType} activity logged successfully for ${selectedContactForActivity.name}`)
        setIsActivityModalOpen(false)
        setActivityNotes('')
        setSelectedContactForActivity(null)
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Activity logging failed:', response.status, errorData)
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }
    } catch (error) {
      console.error('Error logging activity:', error)
      alert('Failed to log activity. Please try again.')
    } finally {
      setIsLoggingActivity(false)
    }
  }

  // Open activity logging modal
  const openActivityModal = (contact: LeadContact, type: string) => {
    setSelectedContactForActivity(contact)
    setActivityType(type)
    setActivityNotes('')
    setIsActivityModalOpen(true)
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
                onClick={generateNewLeadFollowUps}
                disabled={recentContacts.length === 0 || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                    Preparing...
                  </>
                ) : (
                  'Generate Follow-ups'
                )}
              </Button>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-red-600">{needsFollowUp.length}</div>
              <div className="text-sm text-gray-600">Need Follow-up (30+ Days)</div>
              <div className="text-xs text-gray-500 mt-1">
                Use individual "Create Email" buttons below
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-green-600">{withInquiries.length}</div>
              <div className="text-sm text-gray-600">Property Inquiries Need CMAs</div>
              <div className="text-xs text-gray-500 mt-1">
                Use individual "CMA" buttons below
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
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
        <Button 
          className="h-20 flex flex-col gap-2" 
          variant="outline"
          onClick={() => {
            // Export contacts functionality
            const csvData = contacts.map(c => ({
              name: c.name,
              email: c.email,
              phone: c.phone,
              stage: c.stage,
              source: c.source,
              city: c.address?.city || '',
              state: c.address?.state || ''
            }))
            alert('Export functionality coming soon!')
          }}
        >
          <Download className="w-6 h-6" />
          <span>Export Contacts</span>
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
                  <SelectItem value="Nurture">Nurture</SelectItem>
                  <SelectItem value="Appointment Set">Appointment Set</SelectItem>
                  <SelectItem value="Spoke with Customer">Spoke with Customer</SelectItem>
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
                  {uniqueSources.filter(s => s !== 'all').map(source => (
                    <SelectItem key={source} value={source}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterAgent} onValueChange={setFilterAgent}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  {uniqueAgents.filter(a => a !== 'all').map(agent => (
                    <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                  ))}
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
              {filteredContacts.slice(0, displayLimit).map((contact) => (
                <div key={contact.id} className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 ${
                  isNewLead(contact) ? 'border-orange-300 bg-orange-50' : ''
                }`}>
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
                        {contact.assignedAgent && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {contact.assignedAgent}
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
                    {isNewLead(contact) && (
                      <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                        NEW
                      </Badge>
                    )}
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
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openActivityModal(contact, 'call')}
                      >
                        <Phone className="w-3 h-3" />
                        Log
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredContacts.length > displayLimit && (
                <div className="text-center pt-4">
                  <Button 
                    variant="outline"
                    onClick={() => setDisplayLimit(prev => prev + 10)}
                  >
                    Load More ({filteredContacts.length - displayLimit} remaining)
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
          agentName={fubStatus.user?.name || user?.name || user?.email?.split('@')[0] || 'Agent'}
          brokerageName="Your Brokerage"
          recipientEmail={editableEmail}
        />
      )}

      {/* Follow-up Preview Modal */}
      {isFollowUpPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  New Lead Follow-up Campaign
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Ready to send to {emailsToSend.length} new leads
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setIsFollowUpPreviewOpen(false)
                  setEmailsToSend([])
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[70vh]">
              <div className="space-y-4">
                {/* Template Editor */}
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm font-medium text-blue-800 mb-2">
                    📝 Edit Template (uses merge fields: firstName, city, source, agentName)
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="editableSubject" className="text-sm font-medium">
                        Subject Template
                      </Label>
                      <Input
                        id="editableSubject"
                        value={editableSubjectTemplate}
                        onChange={(e) => setEditableSubjectTemplate(e.target.value)}
                        className="text-sm"
                        placeholder="Welcome to your home search, {{firstName}}!"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="editableBody" className="text-sm font-medium">
                        Email Body Template
                      </Label>
                      <textarea
                        id="editableBody"
                        value={editableBodyTemplate}
                        onChange={(e) => setEditableBodyTemplate(e.target.value)}
                        className="w-full min-h-[200px] p-3 border border-gray-300 rounded-md text-sm"
                        placeholder="Hi {{firstName}}, Thank you for your interest in {{city}} properties..."
                      />
                    </div>
                  </div>
                </div>

                {/* Email Preview */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="text-sm font-medium text-gray-700 mb-2">Preview (using first contact as example):</div>
                  {emailsToSend.length > 0 && (
                    <div className="space-y-2">
                      <div><strong>To:</strong> {emailsToSend[0].email}</div>
                      <div><strong>Subject:</strong> {emailsToSend[0].subject}</div>
                      <div className="border-t pt-2">
                        <pre className="whitespace-pre-wrap text-sm">{emailsToSend[0].body}</pre>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact List */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Sending to these contacts:</div>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {emailsToSend.map((email, index) => (
                      <div key={email.contactId} className="flex items-center justify-between text-sm p-2 bg-white border rounded">
                        <span>{email.contactName}</span>
                        <span className="text-gray-500">{email.email}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    onClick={sendFollowUpCampaign}
                    disabled={isSendingFollowUps}
                    className="flex items-center gap-2"
                  >
                    {isSendingFollowUps ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                    {isSendingFollowUps ? `Sending ${emailsToSend.length} emails...` : `Send ${emailsToSend.length} Follow-ups`}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsFollowUpPreviewOpen(false)
                      setEmailsToSend([])
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Activity Logging Modal */}
      {isActivityModalOpen && selectedContactForActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Log Activity for {selectedContactForActivity.name}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedContactForActivity.email} • {selectedContactForActivity.stage}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setIsActivityModalOpen(false)
                  setSelectedContactForActivity(null)
                  setActivityNotes('')
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Activity Type</Label>
                  <Select value={activityType} onValueChange={setActivityType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email Sent</SelectItem>
                      <SelectItem value="call">Phone Call</SelectItem>
                      <SelectItem value="text">Text Message</SelectItem>
                      <SelectItem value="meeting">Meeting/Appointment</SelectItem>
                      <SelectItem value="property_showing">Property Showing</SelectItem>
                      <SelectItem value="follow_up">Follow-up</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Activity Notes</Label>
                  <textarea
                    value={activityNotes}
                    onChange={(e) => setActivityNotes(e.target.value)}
                    className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md text-sm"
                    placeholder="Enter details about this activity..."
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={logActivityToFUB}
                    disabled={isLoggingActivity || !activityNotes.trim()}
                    className="flex items-center gap-2"
                  >
                    {isLoggingActivity ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Activity className="w-4 h-4" />
                    )}
                    {isLoggingActivity ? 'Logging...' : 'Log Activity'}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsActivityModalOpen(false)
                      setSelectedContactForActivity(null)
                      setActivityNotes('')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
  return <LeadHubDashboard fubStatus={fubStatus} userEmail={user?.email || ''} user={user} />
}
