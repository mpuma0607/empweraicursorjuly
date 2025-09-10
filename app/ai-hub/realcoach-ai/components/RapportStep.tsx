"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Heart, 
  Target, 
  Brain, 
  BarChart3, 
  Clock, 
  Star,
  CheckCircle,
  ArrowRight,
  MessageSquare,
  Users,
  TrendingUp,
  Award,
  Lightbulb
} from "lucide-react"
import { AgentProfile } from "../page"

interface RapportStepProps {
  profile: AgentProfile
  updateProfile: (updates: Partial<AgentProfile>) => void
}

export default function RapportStep({ profile, updateProfile }: RapportStepProps) {
  const sessionGoals = [
    {
      id: 'clarity',
      title: 'Get Clarity on My Goals',
      description: 'I want to define what success really looks like for me',
      icon: Target,
      color: 'bg-blue-500'
    },
    {
      id: 'plan',
      title: 'Create a Concrete Plan',
      description: 'I need a step-by-step action plan I can actually follow',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      id: 'consistency',
      title: 'Build Better Habits',
      description: 'I want to develop consistent prospecting and follow-up systems',
      icon: Clock,
      color: 'bg-purple-500'
    },
    {
      id: 'growth',
      title: 'Scale My Business',
      description: 'I\'m ready to take my production to the next level',
      icon: TrendingUp,
      color: 'bg-orange-500'
    },
    {
      id: 'balance',
      title: 'Find Work-Life Balance',
      description: 'I want to make more money while working fewer hours',
      icon: Heart,
      color: 'bg-pink-500'
    }
  ]

  const coachStyles = [
    {
      id: 'direct',
      title: 'Direct & Straightforward',
      description: 'Give it to me straight, no sugar-coating',
      icon: Target,
      traits: ['Honest feedback', 'Clear expectations', 'Action-focused']
    },
    {
      id: 'empathetic',
      title: 'Supportive & Understanding',
      description: 'Help me work through challenges with encouragement',
      icon: Heart,
      traits: ['Patient guidance', 'Emotional support', 'Gentle accountability']
    },
    {
      id: 'data-driven',
      title: 'Analytical & Strategic',
      description: 'Show me the numbers and let\'s optimize everything',
      icon: BarChart3,
      traits: ['Metrics-focused', 'Systematic approach', 'Performance tracking']
    }
  ]

  const experienceLevels = [
    {
      id: 'new',
      title: 'New Agent (0-12 months)',
      description: 'Just getting started in real estate',
      icon: Star,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'intermediate',
      title: 'Building Momentum (1-2 years)',
      description: 'Have some deals under my belt, ready to grow',
      icon: TrendingUp,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'experienced',
      title: 'Established Agent (2-5 years)',
      description: 'Consistent production, looking to scale',
      icon: Award,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'expert',
      title: 'Top Producer (5+ years)',
      description: 'High volume, optimizing systems and team',
      icon: Star,
      color: 'bg-yellow-100 text-yellow-800'
    }
  ]

  const handleSessionGoalSelect = (goalId: string) => {
    updateProfile({ sessionGoal: goalId })
    // Auto-scroll to next section after selection
    setTimeout(() => {
      document.getElementById('coach-style-section')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }, 300)
  }

  const handleCoachStyleSelect = (style: 'direct' | 'empathetic' | 'data-driven') => {
    updateProfile({ coachPreference: style })
    // Auto-scroll to next section after selection
    setTimeout(() => {
      document.getElementById('experience-section')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }, 300)
  }

  const handleExperienceSelect = (level: 'new' | 'intermediate' | 'experienced' | 'expert') => {
    updateProfile({ experienceLevel: level })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center" data-step-header>
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Let's Get Started</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          I'm going to ask you some questions to understand your situation and create a personalized plan that actually works for you.
        </p>
      </div>

      {/* Session Goal */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          What would make the next 30 minutes wildly useful for you?
        </h3>
        <p className="text-gray-600 mb-6">
          Choose the outcome that would have the biggest impact on your business right now.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessionGoals.map((goal) => {
            const Icon = goal.icon
            const isSelected = profile.sessionGoal === goal.id
            return (
              <Card 
                key={goal.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleSessionGoalSelect(goal.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${goal.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{goal.title}</h4>
                      <p className="text-gray-600 text-sm">{goal.description}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle className="h-6 w-6 text-purple-600" />
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Coach Style Preference */}
      <div id="coach-style-section">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          How do you prefer to receive coaching?
        </h3>
        <p className="text-gray-600 mb-6">
          This helps me tailor my approach to match your communication style.
        </p>
        <div className="space-y-4">
          {coachStyles.map((style) => {
            const Icon = style.icon
            const isSelected = profile.coachPreference === style.id
            return (
              <Card 
                key={style.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleCoachStyleSelect(style.id as any)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      style.id === 'direct' ? 'bg-red-100 text-red-600' :
                      style.id === 'empathetic' ? 'bg-pink-100 text-pink-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{style.title}</h4>
                      <p className="text-gray-600 mb-3">{style.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {style.traits.map((trait, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle className="h-6 w-6 text-purple-600" />
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Experience Level */}
      <div id="experience-section">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          How would you describe your experience level?
        </h3>
        <p className="text-gray-600 mb-6">
          This helps me calibrate the advice and strategies to your situation.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {experienceLevels.map((level) => {
            const Icon = level.icon
            const isSelected = profile.experienceLevel === level.id
            return (
              <Card 
                key={level.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleExperienceSelect(level.id as any)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${level.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{level.title}</h4>
                      <p className="text-gray-600 text-sm">{level.description}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle className="h-6 w-6 text-purple-600" />
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Elicitation Preview */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">What to Expect Next</h4>
            <p className="text-blue-800 text-sm">
              I'm going to ask you some deeper questions about your motivations, goals, and what's worked for you in the past. 
              The more honest you are, the better I can tailor your plan. There are no wrong answers - just be real with me.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
