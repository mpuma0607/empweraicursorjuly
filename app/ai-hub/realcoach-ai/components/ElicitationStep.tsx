"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { 
  Brain, 
  Heart, 
  Target, 
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  MessageSquare,
  Users,
  Clock,
  DollarSign,
  Home,
  Star,
  Shield,
  Zap,
  Mic,
  MicOff
} from "lucide-react"
import { AgentProfile } from "../page"
import { useState } from "react"

interface ElicitationStepProps {
  profile: AgentProfile
  updateProfile: (updates: Partial<AgentProfile>) => void
}

export default function ElicitationStep({ profile, updateProfile }: ElicitationStepProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)

  const elicitationQuestions = [
    {
      id: 'why_primary',
      title: 'The Real Why',
      question: 'I might be off here, but it sounds like part of you wants bigger income without losing your life balance. What am I missing?',
      placeholder: 'Tell me what really drives you in this business...',
      icon: Heart,
      color: 'bg-pink-500'
    },
    {
      id: 'why_secondary',
      title: 'The Deeper Motivation',
      question: 'If your favorite client wrote your review 12 months from now, what 3 results would they brag about?',
      placeholder: 'What would make you proud of your business?',
      icon: Star,
      color: 'bg-yellow-500'
    },
    {
      id: 'inaction_cost',
      title: 'Cost of Standing Still',
      question: 'If we\'re talking three months from today and nothing changed, what breaks?',
      placeholder: 'What happens if you don\'t make changes?',
      icon: AlertTriangle,
      color: 'bg-red-500'
    },
    {
      id: 'non_negotiables',
      title: 'Your Boundaries',
      question: 'What are the things you absolutely won\'t compromise on, no matter what?',
      placeholder: 'Family time, values, work style, etc.',
      icon: Shield,
      color: 'bg-purple-500'
    }
  ]

  const nonNegotiableOptions = [
    'Family time is sacred',
    'No working weekends',
    'No door-to-door prospecting',
    'No high-pressure sales tactics',
    'Must maintain work-life balance',
    'No cold calling',
    'No social media oversharing',
    'No working past 6 PM',
    'Must have time for hobbies',
    'No compromising on ethics',
    'Must have time for exercise',
    'No working on vacation',
    'Must have time for personal development',
    'No working with difficult clients',
    'Must have time for relationships'
  ]

  const handleTextResponse = (field: string, value: string) => {
    updateProfile({ [field]: value })
  }

  const handleNonNegotiableToggle = (item: string) => {
    const current = profile.nonNegotiables || []
    const updated = current.includes(item)
      ? current.filter(n => n !== item)
      : [...current, item]
    updateProfile({ nonNegotiables: updated })
  }

  // Initialize speech recognition
  useState(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        const currentQ = elicitationQuestions[currentQuestion]
        if (currentQ && currentQ.id !== 'non_negotiables') {
          handleTextResponse(currentQ.id, transcript)
        }
        setIsListening(false)
      }
      
      recognition.onerror = () => {
        setIsListening(false)
      }
      
      recognition.onend = () => {
        setIsListening(false)
      }
      
      setRecognition(recognition)
    }
  })

  const startListening = () => {
    if (recognition) {
      setIsListening(true)
      recognition.start()
    }
  }

  const stopListening = () => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < elicitationQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      // Scroll to top of new question
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      // Scroll to top of previous question
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    }
  }

  const currentQ = elicitationQuestions[currentQuestion]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="h-8 w-8 text-pink-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Let's Get Real</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          I need to understand what really drives you and what you're committed to. 
          The more honest you are, the better I can help you.
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center space-x-2 mb-8">
        {elicitationQuestions.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index <= currentQuestion ? 'bg-pink-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Current Question */}
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-lg ${currentQ.color} text-white`}>
              <currentQ.icon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">{currentQ.title}</CardTitle>
              <CardDescription>Question {currentQuestion + 1} of {elicitationQuestions.length}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-lg text-gray-800 italic mb-4">"{currentQ.question}"</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Lightbulb className="h-4 w-4" />
              <span>Take your time - there's no rush</span>
            </div>
          </div>

          {currentQ.id === 'non_negotiables' ? (
            <div>
              <p className="text-gray-700 mb-4">Select all that apply:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {nonNegotiableOptions.map((option) => {
                  const isSelected = profile.nonNegotiables?.includes(option) || false
                  return (
                    <Button
                      key={option}
                      variant={isSelected ? "default" : "outline"}
                      className={`justify-start h-auto p-4 text-left ${
                        isSelected ? 'bg-pink-600 hover:bg-pink-700' : ''
                      }`}
                      onClick={() => handleNonNegotiableToggle(option)}
                    >
                      <div className="flex items-center gap-3">
                        {isSelected ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded" />
                        )}
                        <span className="text-sm">{option}</span>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </div>
          ) : (
            <div>
              <div className="relative">
                <Textarea
                  placeholder={currentQ.placeholder}
                  value={profile[currentQ.id as keyof AgentProfile] as string || ''}
                  onChange={(e) => handleTextResponse(currentQ.id, e.target.value)}
                  className="min-h-[120px] text-base pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={isListening ? stopListening : startListening}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4 text-red-500" />
                  ) : (
                    <Mic className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Don't overthink it - just write what comes to mind or use the mic to speak your answer
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            
            {currentQuestion === elicitationQuestions.length - 1 ? (
              <Button
                onClick={() => {
                  // This will be handled by the parent component
                  const event = new CustomEvent('nextStep')
                  window.dispatchEvent(event)
                }}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={nextQuestion}
                className="bg-pink-600 hover:bg-pink-700"
              >
                Next Question
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Elicitation Tips */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <MessageSquare className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Why These Questions Matter</h4>
              <p className="text-blue-800 text-sm mb-3">
                I'm not trying to be nosy - I need to understand what really motivates you so I can create a plan that you'll actually follow through on.
              </p>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Your "why" determines what strategies will work for you</li>
                <li>• Your boundaries help me avoid suggesting things you won't do</li>
                <li>• The cost of inaction creates urgency and commitment</li>
                <li>• Your values ensure the plan aligns with who you are</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
