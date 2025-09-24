"use client"

import { useState, useEffect } from "react"
import { useMemberSpaceUser } from "@/hooks/use-memberspace-user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, Bot, User, Mail, Calendar, Database } from "lucide-react"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface UserContext {
  email: string
  gmailConnected: boolean
  outlookConnected: boolean
  fubConnected: boolean
}

export default function AIAssistantPage() {
  const { user } = useMemberSpaceUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userContext, setUserContext] = useState<UserContext | null>(null)

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: "Hello! I'm your AI assistant. I can help you navigate the platform, answer questions, and assist with your real estate tasks. What would you like to know?",
        timestamp: new Date()
      }])
    }
  }, [messages.length])

  // Check user connections
  useEffect(() => {
    if (user?.email) {
      checkUserConnections()
    }
  }, [user?.email])

  const checkUserConnections = async () => {
    try {
      const currentUserEmail = user?.email
      
      if (!currentUserEmail) {
        setUserContext({
          email: '',
          gmailConnected: false,
          outlookConnected: false,
          fubConnected: false
        })
        return
      }

      // Check Gmail connection (same as ScriptIT)
      let gmailConnected = false
      try {
        const googleResponse = await fetch('/api/auth/google/status', {
          headers: {
            'x-user-email': currentUserEmail
          }
        })
        if (googleResponse.ok) {
          const data = await googleResponse.json()
          gmailConnected = data.status.connected
        }
      } catch (error) {
        console.error('Error checking Gmail:', error)
      }

      // Check Outlook connection (same as ScriptIT)
      let outlookConnected = false
      try {
        const microsoftResponse = await fetch(`/api/outlook/auth/status?email=${encodeURIComponent(currentUserEmail)}`)
        if (microsoftResponse.ok) {
          const data = await microsoftResponse.json()
          outlookConnected = data.connected
        }
      } catch (error) {
        console.error('Error checking Outlook:', error)
      }

      // Check FUB connection
      let fubConnected = false
      try {
        const fubResponse = await fetch('/api/fub/status', {
          headers: {
            'x-user-email': currentUserEmail
          }
        })
        if (fubResponse.ok) {
          const data = await fubResponse.json()
          fubConnected = data.connected
        }
      } catch (error) {
        console.error('Error checking FUB:', error)
      }

      setUserContext({
        email: currentUserEmail,
        gmailConnected,
        outlookConnected,
        fubConnected
      })
    } catch (error) {
      console.error('Error checking user connections:', error)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // First, search knowledge base for relevant information
      let knowledgeResults = []
      try {
        const knowledgeResponse = await fetch('/api/knowledge-base/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: input.trim(),
            userEmail: user?.email
          })
        })
        
        if (knowledgeResponse.ok) {
          const knowledgeData = await knowledgeResponse.json()
          knowledgeResults = knowledgeData.results || []
        }
      } catch (error) {
        console.error('Error searching knowledge base:', error)
      }

      const response = await fetch('/api/ai-assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          userContext,
          conversationHistory: messages.slice(-10), // Last 10 messages for context
          knowledgeResults: knowledgeResults
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Access Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please log in to access the AI assistant.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Assistant</h1>
            <p className="text-gray-600">Your intelligent real estate assistant</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    Chat
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.role === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {message.role === 'assistant' && (
                              <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            )}
                            {message.role === 'user' && (
                              <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg px-4 py-2">
                          <div className="flex items-center gap-2">
                            <Bot className="w-4 h-4" />
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about the platform..."
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!input.trim() || isLoading}
                      size="sm"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Context Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Setup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Email</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Connections</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">Gmail</span>
                        <Badge variant={userContext?.gmailConnected ? "default" : "secondary"}>
                          {userContext?.gmailConnected ? "Connected" : "Not Connected"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">Outlook</span>
                        <Badge variant={userContext?.outlookConnected ? "default" : "secondary"}>
                          {userContext?.outlookConnected ? "Connected" : "Not Connected"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        <span className="text-sm">FUB CRM</span>
                        <Badge variant={userContext?.fubConnected ? "default" : "secondary"}>
                          {userContext?.fubConnected ? "Connected" : "Not Connected"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-500">
                      Based on your connections, I can help you with email management, 
                      calendar scheduling, and CRM tasks.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
