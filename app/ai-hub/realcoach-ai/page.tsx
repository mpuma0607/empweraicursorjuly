"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useMemberSpaceUser } from "@/hooks/use-memberspace-user"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Brain, 
  Target, 
  Users, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Star,
  TrendingUp,
  Calendar,
  MessageSquare,
  Settings,
  BarChart3,
  Lightbulb,
  Shield,
  Zap,
  Award,
  BookOpen,
  FileText,
  PlayCircle,
  Eye,
  Heart,
  Building2,
  DollarSign,
  Phone,
  Mail,
  Share2,
  Video,
  Home,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Minus,
  Plus
} from "lucide-react"

// Step components
import RapportStep from "./components/RapportStep"
import ElicitationStep from "./components/ElicitationStep"
import ProductionMathStep from "./components/ProductionMathStep"
import ExperienceStep from "./components/ExperienceStep"
import WillMatrixStep from "./components/WillMatrixStep"
import SkillsStep from "./components/SkillsStep"
import PositioningStep from "./components/PositioningStep"
import CommitmentStep from "./components/CommitmentStep"
import PlanOutput from "./components/PlanOutput"

export interface AgentProfile {
  // Personal Information
  name: string
  email: string
  
  // Session & Style
  sessionGoal: string
  coachPreference: 'direct' | 'empathetic' | 'data-driven'
  experienceMonths: number
  experienceLevel: 'new' | 'intermediate' | 'experienced' | 'expert'
  
  // Goals & Motivation
  whyPrimary: string
  whySecondary: string
  inactionCost: string
  nonNegotiables: string[]
  
  // Production Targets
  targetUnits: number
  targetGCI: number
  avgPricePoint: number
  avgNetPerClose: number
  marketCycleDays: number
  
  // Current Performance
  currentFunnel: {
    convosToAppt: number
    apptsToClient: number
    clientsToClose: number
  }
  
  // Experience & Sources
  databaseSize: number
  crmStatus: 'none' | 'basic' | 'advanced'
  closingsBySource: Record<string, number>
  uniqueStrengths: string[]
  
  // Will/Will-Not Matrix
  willingActivities: string[]
  hardNos: string[]
  energizingActivities: string[]
  drainingActivities: string[]
  hoursPerWeek: number
  marketingBudget: number
  
  // Skills & Assets
  skills: Record<string, number>
  assets: string[]
  
  // Market Positioning
  targetSegments: string[]
  usp: string
  geographicFocus: string
  
  // Commitment
  weeklyBlocks: Array<{
    day: string
    time: string
    activity: string
  }>
  kpiTargets: Record<string, number>
  confidenceScore: number
  checkinDay: string
  checkinTime: string
}

const steps = [
  { id: 1, title: "Rapport & Goals", description: "Set the foundation", icon: Heart },
  { id: 2, title: "Deep Elicitation", description: "Discover your why", icon: Brain },
  { id: 3, title: "Production Math", description: "Define your targets", icon: Target },
  { id: 4, title: "Experience & Sources", description: "What's worked before", icon: TrendingUp },
  { id: 5, title: "Will/Will-Not Matrix", description: "Your constraints", icon: Shield },
  { id: 6, title: "Skills & Assets", description: "Your capabilities", icon: Award },
  { id: 7, title: "Market Positioning", description: "Your focus areas", icon: Building2 },
  { id: 8, title: "Commitment Contract", description: "Lock in your plan", icon: CheckCircle },
  { id: 9, title: "Your Plan", description: "Personalized action plan", icon: FileText }
]

export default function RealCoachAIPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const { user, loading: isUserLoading } = useMemberSpaceUser()
  const [agentProfile, setAgentProfile] = useState<AgentProfile>({
    name: '',
    email: '',
    sessionGoal: '',
    coachPreference: 'empathetic',
    experienceMonths: 0,
    experienceLevel: 'new',
    whyPrimary: '',
    whySecondary: '',
    inactionCost: '',
    nonNegotiables: [],
    targetUnits: 0,
    targetGCI: 0,
    avgPricePoint: 0,
    avgNetPerClose: 0,
    marketCycleDays: 0,
    currentFunnel: {
      convosToAppt: 10,
      apptsToClient: 0.5,
      clientsToClose: 0.6
    },
    databaseSize: 0,
    crmStatus: 'none',
    closingsBySource: {},
    uniqueStrengths: [],
    willingActivities: [],
    hardNos: [],
    energizingActivities: [],
    drainingActivities: [],
    hoursPerWeek: 0,
    marketingBudget: 0,
    skills: {},
    assets: [],
    targetSegments: [],
    usp: '',
    geographicFocus: '',
    weeklyBlocks: [],
    kpiTargets: {},
    confidenceScore: 0,
    checkinDay: 'friday',
    checkinTime: '5:00 PM'
  })

  const updateProfile = (updates: Partial<AgentProfile>) => {
    setAgentProfile(prev => ({ ...prev, ...updates }))
  }

  // Auto-populate user data when available - exactly like other tools
  useEffect(() => {
    if (user && !isUserLoading) {
      setAgentProfile(prev => ({
        ...prev,
        name: prev.name || user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: prev.email || user.email || "",
      }))
    }
  }, [user, isUserLoading])

  useEffect(() => {
    // Listen for custom events from child components
    const handleNextStep = () => {
      nextStep()
    }

    window.addEventListener('nextStep', handleNextStep)
    
    return () => {
      window.removeEventListener('nextStep', handleNextStep)
    }
  }, [])

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1)
      // Scroll to the main header of the new step
      setTimeout(() => {
        const stepHeader = document.querySelector('[data-step-header]')
        if (stepHeader) {
          stepHeader.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }, 200)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      // Scroll to the main header of the previous step
      setTimeout(() => {
        const stepHeader = document.querySelector('[data-step-header]')
        if (stepHeader) {
          stepHeader.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }, 200)
    }
  }

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <RapportStep profile={agentProfile} updateProfile={updateProfile} />
      case 2:
        return <ElicitationStep profile={agentProfile} updateProfile={updateProfile} />
      case 3:
        return <ProductionMathStep profile={agentProfile} updateProfile={updateProfile} />
      case 4:
        return <ExperienceStep profile={agentProfile} updateProfile={updateProfile} />
      case 5:
        return <WillMatrixStep profile={agentProfile} updateProfile={updateProfile} />
      case 6:
        return <SkillsStep profile={agentProfile} updateProfile={updateProfile} />
      case 7:
        return <PositioningStep profile={agentProfile} updateProfile={updateProfile} />
      case 8:
        return <CommitmentStep profile={agentProfile} updateProfile={updateProfile} />
      case 9:
        return <PlanOutput profile={agentProfile} onBack={() => setCurrentStep(8)} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Brain className="h-4 w-4" />
            AI-Powered Coaching
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            RealCoach AI
          </h1>
          
          <p className="text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
            Personalized business coaching that adapts to your style, goals, and constraints
          </p>
          
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Get a customized 4-week action plan based on your unique situation, preferences, and commitments.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ai-hub/realcoach-ai/plans">
              <Button variant="outline" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                View My Plans
              </Button>
            </Link>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              const Icon = step.icon
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all
                    ${isActive ? 'bg-purple-600 text-white' : 
                      isCompleted ? 'bg-green-600 text-white' : 
                      'bg-gray-200 text-gray-500'}
                  `}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className={`text-xs font-medium ${isActive ? 'text-purple-600' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400 hidden md:block">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="min-h-[600px]">
            <CardContent className="p-8">
              {renderStep()}
            </CardContent>
          </Card>
        </div>

        {/* Navigation Buttons */}
        {currentStep < 9 && (
          <div className="max-w-4xl mx-auto mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <Button
              onClick={nextStep}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
            >
              {currentStep === 8 ? 'Generate My Plan' : 'Next Step'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Restart Button for Plan Output */}
        {currentStep === 9 && (
          <div className="max-w-4xl mx-auto mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Start Over
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}