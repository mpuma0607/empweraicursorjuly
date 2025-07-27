"use client"

import { useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, Video } from "lucide-react"
import { useTenant } from "@/contexts/tenant-context"
import { ZoomSetupViewer } from "@/components/zoom-setup-viewer"

const steps = [
  {
    id: 1,
    title: "Zoom Initial Set Up",
    description: "Set up your Zoom account and learn the basics for client meetings",
    icon: Video,
    content: {
      overview: "Get your Zoom account configured for professional client meetings and daily training sessions.",
      steps: [
        "Go to zoom.us and sign in with your company Google account",
        "Add your professional photo and confirm your name is displayed correctly",
        "Learn about the company Zoom benefits and free access",
        "Use Zoom code 509 422 490 for daily training sessions",
        "Join morning meetings weekdays from 9 to 9:30 am",
      ],
      tips: "Signing in under the company account gives you free access to Zoom features!",
    },
  },
]

export default function ZoomSetupPage() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [showZoomViewer, setShowZoomViewer] = useState(false)
  const { tenantConfig } = useTenant()

  const toggleStep = (stepId: number) => {
    setCompletedSteps((prev) => (prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]))
  }

  const completionPercentage = Math.round((completedSteps.length / steps.length) * 100)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Zoom Set Up</h1>
            <p className="text-gray-600">Configure your video conferencing for client meetings and virtual tours</p>
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
        </div>
      </div>

      <div className="grid gap-4">
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id)
          const Icon = step.icon

          return (
            <Card
              key={step.id}
              className={`transition-all duration-200 ${isCompleted ? "bg-orange-50 border-orange-200" : "hover:shadow-md"}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <button onClick={() => toggleStep(step.id)} className="mt-1 transition-colors duration-200">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-orange-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-orange-600" />
                        <CardTitle className={`text-lg ${isCompleted ? "text-orange-800" : "text-gray-900"}`}>
                          {step.title}
                        </CardTitle>
                      </div>
                      <CardDescription className={isCompleted ? "text-orange-700" : "text-gray-600"}>
                        {step.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowZoomViewer(true)}>
                    Start This Step
                  </Button>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      {completionPercentage === 100 && (
        <div className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
          <CheckCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-orange-800 mb-2">Zoom Setup Complete! 🎉</h3>
          <p className="text-orange-700 mb-4">
            Your video conferencing system is now ready for professional client meetings and virtual property tours.
          </p>
          <p className="text-sm text-orange-600">
            Start scheduling your first virtual consultation and experience the power of professional video
            communication!
          </p>
        </div>
      )}

      <ZoomSetupViewer isOpen={showZoomViewer} onClose={() => setShowZoomViewer(false)} />
    </div>
  )
}
