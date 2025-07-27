import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, Users, BookOpen, Award, Target } from "lucide-react"

const onboardingSteps = [
  {
    title: "Welcome & Orientation",
    description: "Introduction to Century 21 Beggins culture, values, and expectations",
    duration: "2 hours",
    status: "pending",
    icon: Users,
  },
  {
    title: "Technology Setup",
    description: "Set up your MLS, CRM, Dotloop, and other essential tools",
    duration: "3 hours",
    status: "pending",
    icon: BookOpen,
  },
  {
    title: "Compliance Training",
    description: "Legal requirements, fair housing, and ethical practices",
    duration: "4 hours",
    status: "pending",
    icon: Award,
  },
  {
    title: "Lead Generation Systems",
    description: "Learn our proven prospecting and lead generation methods",
    duration: "2 hours",
    status: "pending",
    icon: Target,
  },
  {
    title: "Transaction Management",
    description: "From contract to closing - managing the entire process",
    duration: "3 hours",
    status: "pending",
    icon: CheckCircle,
  },
  {
    title: "Marketing & Branding",
    description: "Personal branding, social media, and marketing materials",
    duration: "2 hours",
    status: "pending",
    icon: Users,
  },
]

const milestones = [
  {
    title: "First 30 Days",
    goals: [
      "Complete all onboarding modules",
      "Set up technology stack",
      "Shadow experienced agent on 2 appointments",
      "Create personal marketing materials",
    ],
  },
  {
    title: "First 60 Days",
    goals: [
      "Generate first 10 leads",
      "Complete first listing presentation",
      "Attend 4 networking events",
      "Complete compliance certification",
    ],
  },
  {
    title: "First 90 Days",
    goals: [
      "Close first transaction",
      "Build SOI database of 100+ contacts",
      "Establish social media presence",
      "Complete advanced training modules",
    ],
  },
]

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="w-20 h-20 bg-gradient-to-br from-gold-500 to-yellow-600 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "linear-gradient(135deg, #b6a888 0%, #d4c4a8 100%)" }}
          >
            <Award className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">New Agent Onboarding</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Welcome to Century 21 Beggins! Your comprehensive onboarding program designed to set you up for success.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="mb-12">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-black">Onboarding Progress</h2>
                <div className="text-right">
                  <div className="text-3xl font-bold" style={{ color: "#b6a888" }}>
                    0%
                  </div>
                  <div className="text-sm text-gray-500">Complete</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full"
                  style={{ width: "0%", background: "linear-gradient(90deg, #b6a888 0%, #d4c4a8 100%)" }}
                ></div>
              </div>
              <p className="text-gray-600 mt-2">0 of {onboardingSteps.length} modules completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Onboarding Steps */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-8">Onboarding Modules</h2>
          <div className="space-y-6">
            {onboardingSteps.map((step, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mr-6"
                        style={{ background: "linear-gradient(135deg, #b6a888 0%, #d4c4a8 100%)" }}
                      >
                        <step.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-black mb-2">{step.title}</h3>
                        <p className="text-gray-600 mb-2">{step.description}</p>
                        <div className="flex items-center text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-sm">{step.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <button
                        className="px-6 py-2 rounded-lg font-medium text-white transition-colors"
                        style={{ background: "linear-gradient(135deg, #b6a888 0%, #d4c4a8 100%)" }}
                      >
                        Start Module
                      </button>
                      <div className="text-xs text-gray-500 mt-2">Not Started</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 30-60-90 Day Goals */}
        <div>
          <h2 className="text-3xl font-bold text-black mb-8">30-60-90 Day Milestones</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {milestones.map((milestone, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ background: "linear-gradient(135deg, #b6a888 0%, #d4c4a8 100%)" }}
                    >
                      <Target className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-black">{milestone.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {milestone.goals.map((goal, goalIndex) => (
                      <li key={goalIndex} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-gray-300 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{goal}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
