"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, FileText, Users, Settings, DollarSign } from "lucide-react"
import { useUserProgress } from "@/hooks/use-user-progress"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"

const setupSteps = [
  {
    id: 1,
    title: "How to set up your dotloop account",
    description: "Create and configure your dotloop account for transaction management",
    icon: Settings,
  },
  {
    id: 2,
    title: "Dotloop for listings",
    description: "Learn how to manage listing transactions and documents",
    icon: FileText,
  },
  {
    id: 3,
    title: "Dotloop for buyer contracts",
    description: "Manage buyer transactions from offer to closing",
    icon: Users,
  },
  {
    id: 4,
    title: "Dotloop - Getting paid at closing",
    description: "Ensure proper commission tracking and payment processing",
    icon: DollarSign,
  },
]

export default function DotloopSetupPage() {
  const { completedSteps, toggleStep, isLoading } = useUserProgress("dotloop-setup")
  const [selectedStep, setSelectedStep] = useState<number | null>(null)

  const completedCount = completedSteps.length
  const totalSteps = setupSteps.length
  const progressPercentage = (completedCount / totalSteps) * 100

  const handleStartStep = (stepId: number) => {
    setSelectedStep(stepId)
  }

  const renderStepContent = () => {
    if (selectedStep === 1) {
      return (
        <div className="space-y-6">
          {/* Dotloop Features */}
          <div className="bg-blue-600 text-white p-6 rounded-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-400 rounded-full p-4">
                <span className="text-2xl font-bold">dot loop</span>
              </div>
            </div>
            <ul className="space-y-3 text-lg">
              <li className="flex items-start gap-2">
                <span className="text-blue-200 mt-1">•</span>
                <span>Pre-Built Templates for Listings and Contracts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-200 mt-1">•</span>
                <span>Auto-Populating Forms</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-200 mt-1">•</span>
                <span>Secure e-signing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-200 mt-1">•</span>
                <span>Free Dotloop account for Clients</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-200 mt-1">•</span>
                <span>Cloud Storage for paperwork, closing statements, inspection reports, etc.</span>
              </li>
            </ul>
          </div>

          {/* Setup Instructions */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Account Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">ACCOUNT SET UP</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Go to dotloop.com</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>
                      Choose <strong>SIGN UP</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>
                      <strong>Create</strong> Your Account
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>
                      <strong>Use your @c21be/be3 company email</strong>
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Profile Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">PROFILE SET UP</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>
                      Click on your <strong>initials</strong> in the upper right
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>
                      Choose <strong>My Account</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>
                      Complete the <strong>Account Settings</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>
                      Complete the <strong>Profile Settings</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>
                      Change <strong>"Default Profile"</strong> to your name
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Mobile App */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">DOWNLOAD and INSTALL DOTLOOP'S MOBILE APP</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Stay in the loop everywhere you go with the Dotloop mobile app. Manage your transactions on the go.
              </p>
            </CardContent>
          </Card>

          {/* Visual Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Visual Setup Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-07-12%20085139-Sq7N5a8jfLfUEFmWBbcPwtuUh2WB6w.png"
                alt="Dotloop Account Setup Guide"
                width={800}
                height={400}
                className="w-full h-auto rounded-lg border"
              />
            </CardContent>
          </Card>
        </div>
      )
    }

    if (selectedStep === 2) {
      return (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold mb-2">Dotloop for Listings Training</h3>
            <p className="text-muted-foreground">
              Learn how to effectively use dotloop for managing your listing transactions and documents.
            </p>
          </div>
          <div className="w-full">
            <iframe
              src="https://present.century21.com/service/cma/presentation/pages/0c0f9f0d-87a7-41d1-9037-ebb4af8cfa8b"
              className="w-full h-[800px] border rounded-lg"
              title="Dotloop for Listings Training Presentation"
              allowFullScreen
            />
          </div>
        </div>
      )
    }

    if (selectedStep === 3) {
      return (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold mb-2">Dotloop for Buyer Contracts Training</h3>
            <p className="text-muted-foreground">
              Master dotloop for managing buyer transactions from offer to closing.
            </p>
          </div>
          <div className="w-full">
            <iframe
              src="https://present.century21.com/service/cma/presentation/pages/8bfae42d-4d59-4d86-aaf8-1d1226c3f04d"
              className="w-full h-[800px] border rounded-lg"
              title="Dotloop for Buyer Contracts Training Presentation"
              allowFullScreen
            />
          </div>
        </div>
      )
    }

    if (selectedStep === 4) {
      return (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold mb-2">Dotloop - Getting Paid at Closing Training</h3>
            <p className="text-muted-foreground">
              Learn how to ensure proper commission tracking and payment processing through dotloop.
            </p>
          </div>
          <div className="w-full">
            <iframe
              src="https://present.century21.com/service/cma/presentation/pages/2b9541a8-d53e-4913-ae83-84b8269ccd96"
              className="w-full h-[800px] border rounded-lg"
              title="Dotloop Getting Paid at Closing Training Presentation"
              allowFullScreen
            />
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-100 rounded-xl">
          <FileText className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Dotloop Setup</h1>
          <p className="text-muted-foreground">Configure your transaction management and document signing system</p>
        </div>
      </div>

      {/* Progress Section */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Setup Progress</CardTitle>
            <span className="text-sm text-muted-foreground">
              {completedCount} of {totalSteps} completed
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-sm font-medium">{Math.round(progressPercentage)}% complete</span>
          </div>
        </CardContent>
      </Card>

      {/* Setup Steps */}
      <div className="space-y-4">
        {setupSteps.map((step) => {
          const isCompleted = completedSteps.includes(step.id)
          const Icon = step.icon

          return (
            <Card key={step.id} className="transition-all duration-200 hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleStep(step.id)} disabled={isLoading} className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-400" />
                    )}
                  </button>

                  <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>

                  <Button variant="outline" onClick={() => handleStartStep(step.id)} className="flex-shrink-0">
                    Start This Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Step Detail Modal */}
      <Dialog open={selectedStep !== null} onOpenChange={() => setSelectedStep(null)}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedStep && setupSteps.find((s) => s.id === selectedStep)?.title}</DialogTitle>
            <DialogDescription>Follow the detailed setup guide below</DialogDescription>
          </DialogHeader>
          <div className="mt-4">{renderStepContent()}</div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
