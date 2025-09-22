'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, FileText, Copy, X } from 'lucide-react'

interface LeadContact {
  id: number
  name: string
  firstName: string
  lastName: string
  email: string
  phone: string
  stage: string
  source: string
  address?: {
    city: string
    state: string
    zip: string
  }
  assignedAgent: string
  recentInquiry?: {
    property: string
    date: string
  }
}

interface FUBStatus {
  connected: boolean
  provider: string
  user?: {
    id: number
    name: string
    email: string
    role: string
    phone?: string
  }
}

interface ScriptGenerationFormProps {
  contact: LeadContact
  onClose: () => void
  userEmail: string
  fubStatus: FUBStatus
  user: any
}

export default function ScriptGenerationForm({ 
  contact, 
  onClose, 
  userEmail, 
  fubStatus, 
  user 
}: ScriptGenerationFormProps) {
  const [formData, setFormData] = useState({
    agentName: fubStatus.user?.name || user?.name || user?.email?.split('@')[0] || 'Agent',
    brokerageName: 'Your Brokerage',
    scriptType: 'phone',
    topic: '',
    customTopic: '',
    additionalDetails: `Follow-up script for ${contact.name} - ${contact.stage} from ${contact.source}${contact.address ? ` in ${contact.address.city}, ${contact.address.state}` : ''}${contact.recentInquiry?.property ? `. Recently interested in ${contact.recentInquiry.property.address}` : ''}`,
    agentEmail: userEmail,
    scriptTypeCategory: 'Follow-up',
    difficultConversationType: '',
    tonality: 'Professional & Authoritative',
    selectedContactId: contact.id.toString(),
    useContactPersonalization: true
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedScript, setGeneratedScript] = useState('')
  const [selectedTonality, setSelectedTonality] = useState('Professional & Authoritative')
  const [selectedLanguage, setSelectedLanguage] = useState('English')

  // Pre-populate topic based on contact stage
  useEffect(() => {
    const getTopicForContact = (contact: LeadContact) => {
      switch (contact.stage?.toLowerCase()) {
        case 'new lead':
        case 'lead':
          return 'Initial Follow-up'
        case 'prospect':
        case 'prospecting':
          return 'Building Rapport'
        case 'buyer':
        case 'buying':
          return 'Property Search'
        case 'seller':
        case 'selling':
          return 'Market Analysis'
        case 'under contract':
        case 'pending':
          return 'Transaction Updates'
        case 'closed':
        case 'sold':
          return 'Post-Transaction Follow-up'
        default:
          return 'General Follow-up'
      }
    }

    setFormData(prev => ({
      ...prev,
      topic: getTopicForContact(contact)
    }))
  }, [contact])

  const handleGenerateScript = async () => {
    try {
      setIsGenerating(true)
      
      // Use the same generateScript function as ScriptIT
      const { generateScript } = await import('@/app/ai-hub/scriptit-ai/actions')
      const result = await generateScript(formData, userEmail)
      
      setGeneratedScript(result.script)
    } catch (error) {
      console.error('Error generating script:', error)
      alert('Failed to generate script. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyScript = async () => {
    if (!generatedScript) return
    
    try {
      await navigator.clipboard.writeText(generatedScript)
      alert('Script copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy script:', error)
      alert('Failed to copy script. Please select and copy manually.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input value={contact.name} disabled />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={contact.email} disabled />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={contact.phone || 'N/A'} disabled />
            </div>
            <div>
              <Label>Stage</Label>
              <Input value={contact.stage} disabled />
            </div>
            <div>
              <Label>Source</Label>
              <Input value={contact.source} disabled />
            </div>
            <div>
              <Label>Assigned Agent</Label>
              <Input value={contact.assignedAgent} disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Script Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Script Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scriptType">Script Type</Label>
              <Select value={formData.scriptType} onValueChange={(value) => setFormData(prev => ({ ...prev, scriptType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="text">SMS/Text Message</SelectItem>
                  <SelectItem value="presentation">Presentation</SelectItem>
                  <SelectItem value="voicemail">Voicemail</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="scriptTypeCategory">Category</Label>
              <Select value={formData.scriptTypeCategory} onValueChange={(value) => setFormData(prev => ({ ...prev, scriptTypeCategory: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Follow-up">Follow-up</SelectItem>
                  <SelectItem value="Cold Outreach">Cold Outreach</SelectItem>
                  <SelectItem value="Nurturing">Nurturing</SelectItem>
                  <SelectItem value="Closing">Closing</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="topic">Topic</Label>
            <Select value={formData.topic} onValueChange={(value) => setFormData(prev => ({ ...prev, topic: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Initial Follow-up">Initial Follow-up</SelectItem>
                <SelectItem value="Building Rapport">Building Rapport</SelectItem>
                <SelectItem value="Property Search">Property Search</SelectItem>
                <SelectItem value="Market Analysis">Market Analysis</SelectItem>
                <SelectItem value="Transaction Updates">Transaction Updates</SelectItem>
                <SelectItem value="Post-Transaction Follow-up">Post-Transaction Follow-up</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.topic === 'Custom' && (
            <div>
              <Label htmlFor="customTopic">Custom Topic</Label>
              <Input
                id="customTopic"
                value={formData.customTopic}
                onChange={(e) => setFormData(prev => ({ ...prev, customTopic: e.target.value }))}
                placeholder="Enter custom topic..."
              />
            </div>
          )}

          <div>
            <Label htmlFor="tonality">Tonality</Label>
            <Select value={formData.tonality} onValueChange={(value) => setFormData(prev => ({ ...prev, tonality: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Professional & Authoritative">Professional & Authoritative</SelectItem>
                <SelectItem value="Friendly & Approachable">Friendly & Approachable</SelectItem>
                <SelectItem value="Consultative & Expert">Consultative & Expert</SelectItem>
                <SelectItem value="Urgent & Action-Oriented">Urgent & Action-Oriented</SelectItem>
                <SelectItem value="Warm & Personal">Warm & Personal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="additionalDetails">Additional Details</Label>
            <Textarea
              id="additionalDetails"
              value={formData.additionalDetails}
              onChange={(e) => setFormData(prev => ({ ...prev, additionalDetails: e.target.value }))}
              placeholder="Add any specific details or context for this script..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleGenerateScript}
          disabled={isGenerating}
          size="lg"
          className="px-8"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Generating Script...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Generate Script
            </>
          )}
        </Button>
      </div>

      {/* Generated Script */}
      {generatedScript && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Generated Script</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <pre className="whitespace-pre-wrap text-sm">{generatedScript}</pre>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCopyScript} className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copy Script
              </Button>
              <Button variant="outline" onClick={() => setGeneratedScript('')}>
                Regenerate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  )
}
