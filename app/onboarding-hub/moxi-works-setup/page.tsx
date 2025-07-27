"use client"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CheckCircle, Circle, Building, Users, BarChart3, Loader2 } from "lucide-react"
import { useTenant } from "@/contexts/tenant-context"
import { useUserProgress } from "@/hooks/use-user-progress"
import { MoxiEssentialViewer } from "@/components/moxi-essential-viewer"
import { PresentationIframe } from "@/components/presentation-iframe"

const steps = [
  {
    id: 1,
    title: "Moxi Works Essential Steps",
    description: "Learn the fundamental features and setup requirements for Moxi Works",
    icon: Users,
    content: {
      overview: "Master the essential components of Moxi Works to build a strong foundation for your CRM success.",
      steps: [
        "Complete your initial account setup and profile configuration",
        "Understand the main dashboard and navigation structure",
        "Set up your personal preferences and notification settings",
        "Configure your basic contact management system",
        "Learn the core features for daily CRM operations",
      ],
      tips: "Focus on mastering these essentials before moving to advanced features - a solid foundation leads to better results!",
      hasImageViewer: true,
    },
  },
  {
    id: 2,
    title: "Moxi Works For Effective Client Relationships",
    description: "Optimize your client relationship management and communication strategies",
    icon: Building,
    content: {
      overview:
        "Build stronger client relationships through effective use of Moxi Works' relationship management tools.",
      steps: [
        "Set up automated follow-up sequences for different client types",
        "Create personalized communication templates and campaigns",
        "Configure client milestone tracking and important date reminders",
        "Establish systematic touchpoint schedules for ongoing relationships",
        "Implement feedback collection and relationship scoring systems",
      ],
      tips: "Consistent communication is key - use automation to maintain regular contact while keeping it personal!",
      hasPresentation: true,
      presentationUrl:
        "https://present.century21.com/service/cma/presentation/pages/061fa41f-739e-437b-8fef-2a16483c4de4",
    },
  },
  {
    id: 3,
    title: "Moxi Works Set Up- How to Import & Export Clients",
    description: "Master the process of importing existing contacts and exporting client data",
    icon: BarChart3,
    content: {
      overview:
        "Efficiently manage your client database by learning proper import and export procedures in Moxi Works.",
      steps: [
        "Prepare your existing contact data for import (CSV formatting and data cleanup)",
        "Use Moxi Works' bulk import feature to add your contact database",
        "Map contact fields correctly to ensure data integrity",
        "Set up automated data backup and export schedules",
        "Learn how to export client data for reporting and external use",
      ],
      tips: "Always backup your data before importing and test with a small batch first to ensure everything maps correctly!",
      hasPresentation: true,
      presentationUrl:
        "https://present.century21.com/service/cma/presentation/pages/89a80e4c-4e33-48dd-8930-559132b04e9f",
    },
  },
]

export default function MoxiWorksSetupPage() {
  const { completedSteps, toggleStep, isLoading, error } = useUserProgress("moxi-works-setup")
  const { tenantConfig } = useTenant()

  const completionPercentage = Math.round((completedSteps.length / steps.length) * 100)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            <p className="text-gray-600">Loading your progress...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Moxi Works Set Up</h1>
            <p className="text-gray-600">Configure your CRM and lead management system</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Setup Progress</h2>
            <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>
              {completedSteps.length} of {steps.length} completed
            </Badge>
          </div>
          <Progress value={completionPercentage} className="mb-2" />
          <p className="text-sm text-gray-600">{completionPercentage}% complete</p>
          {error && <p className="text-sm text-red-600 mt-2">{error} - Your progress is still saved locally.</p>}
        </div>
      </div>

      <div className="grid gap-4">
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id)
          const Icon = step.icon

          return (
            <Card
              key={step.id}
              className={`transition-all duration-200 ${isCompleted ? "bg-purple-50 border-purple-200" : "hover:shadow-md"}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <button onClick={() => toggleStep(step.id)} className="mt-1 transition-colors duration-200">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-purple-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-purple-600" />
                        <CardTitle className={`text-lg ${isCompleted ? "text-purple-800" : "text-gray-900"}`}>
                          {step.title}
                        </CardTitle>
                      </div>
                      <CardDescription className={isCompleted ? "text-purple-700" : "text-gray-600"}>
                        {step.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Start This Step
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden flex flex-col">
                      <DialogHeader className="flex-shrink-0">
                        <DialogTitle className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-purple-600" />
                          {step.title}
                        </DialogTitle>
                        <DialogDescription>{step.content.overview}</DialogDescription>
                      </DialogHeader>

                      {/* Image Viewer for Step 1 */}
                      {step.id === 1 && step.content.hasImageViewer ? (
                        <div className="flex-1 overflow-y-auto">
                          <MoxiEssentialViewer />
                        </div>
                      ) : step.content.hasPresentation ? (
                        /* Presentation iframe for steps 2 and 3 */
                        <div className="flex-1 overflow-hidden min-h-[70vh]">
                          <PresentationIframe src={step.content.presentationUrl!} title={step.title} />
                        </div>
                      ) : (
                        /* Regular content for other steps */
                        <div className="flex-1 overflow-y-auto space-y-6">
                          <div>
                            <h4 className="font-semibold mb-2">Steps to Complete:</h4>
                            <ol className="list-decimal list-inside space-y-1">
                              {step.content.steps.map((stepItem, index) => (
                                <li key={index} className="text-sm text-gray-700">
                                  {stepItem}
                                </li>
                              ))}
                            </ol>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <h4 className="font-semibold text-purple-900 mb-1">💡 Pro Tip:</h4>
                            <p className="text-sm text-purple-800">{step.content.tips}</p>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      {completionPercentage === 100 && (
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
          <CheckCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-purple-800 mb-2">Moxi Works Setup Complete! 🎉</h3>
          <p className="text-purple-700 mb-4">
            Your CRM is now configured and ready to help you manage leads and grow your business effectively.
          </p>
          <p className="text-sm text-purple-600">
            Start adding your first leads and explore the automation features to maximize your productivity!
          </p>
        </div>
      )}
    </div>
  )
}
