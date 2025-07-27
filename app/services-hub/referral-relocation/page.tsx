"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { submitReferralForm } from "./actions"
import { useTenantConfig } from "@/contexts/tenant-context"
import { redirect } from "next/navigation"

export default function ReferralRelocationPage() {
  const tenantConfig = useTenantConfig()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [knowAgent, setKnowAgent] = useState<boolean>(false)

  // Redirect if not Beggins tenant
  if (tenantConfig.id !== "century21-beggins") {
    redirect("/portal")
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    const formData = new FormData(event.currentTarget)

    const referralData = {
      yourName: formData.get("yourName") as string,
      yourEmail: formData.get("yourEmail") as string,
      yourPhone: formData.get("yourPhone") as string,
      primaryClientName: formData.get("primaryClientName") as string,
      secondaryClientName: (formData.get("secondaryClientName") as string) || undefined,
      primaryClientPhone: formData.get("primaryClientPhone") as string,
      secondaryClientPhone: (formData.get("secondaryClientPhone") as string) || undefined,
      primaryClientEmail: formData.get("primaryClientEmail") as string,
      secondaryClientEmail: (formData.get("secondaryClientEmail") as string) || undefined,
      currentLocation: formData.get("currentLocation") as string,
      desiredLocation: formData.get("desiredLocation") as string,
      timeline: formData.get("timeline") as string,
      knowAgent: knowAgent,
      agentName: knowAgent ? (formData.get("agentName") as string) : undefined,
      agentEmail: knowAgent ? (formData.get("agentEmail") as string) : undefined,
      agentPhone: knowAgent ? (formData.get("agentPhone") as string) : undefined,
      additionalDetails: (formData.get("additionalDetails") as string) || undefined,
    }

    try {
      const result = await submitReferralForm(referralData)

      if (result.success) {
        setSubmitStatus({ type: "success", message: "Referral form submitted successfully! We will be in touch soon." })
        // Reset form
        event.currentTarget.reset()
        setKnowAgent(false)
      } else {
        setSubmitStatus({ type: "error", message: result.error || "Failed to submit form. Please try again." })
      }
    } catch (error) {
      setSubmitStatus({ type: "error", message: "An unexpected error occurred. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Referral/Relocation - Refer A Client</h1>
        <p className="text-lg text-gray-600">
          Submit client referrals and relocation requests to our team. We'll connect your clients with the right agents
          in their desired location.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Referral Form</CardTitle>
          <CardDescription>Please provide detailed information about your client and their needs.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Agent Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Your Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="yourName">Your Name *</Label>
                  <Input id="yourName" name="yourName" required />
                </div>
                <div>
                  <Label htmlFor="yourEmail">Your Email *</Label>
                  <Input id="yourEmail" name="yourEmail" type="email" required />
                </div>
                <div>
                  <Label htmlFor="yourPhone">Your Phone Number *</Label>
                  <Input id="yourPhone" name="yourPhone" type="tel" required />
                </div>
              </div>
            </div>

            {/* Primary Client Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Primary Client Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primaryClientName">Primary Client's Name *</Label>
                  <Input id="primaryClientName" name="primaryClientName" required />
                </div>
                <div>
                  <Label htmlFor="primaryClientPhone">Primary Client's Phone *</Label>
                  <Input id="primaryClientPhone" name="primaryClientPhone" type="tel" required />
                </div>
                <div>
                  <Label htmlFor="primaryClientEmail">Primary Client's Email *</Label>
                  <Input id="primaryClientEmail" name="primaryClientEmail" type="email" required />
                </div>
              </div>
            </div>

            {/* Secondary Client Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Secondary Client Information (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="secondaryClientName">Secondary Client's Name</Label>
                  <Input id="secondaryClientName" name="secondaryClientName" />
                </div>
                <div>
                  <Label htmlFor="secondaryClientPhone">Secondary Client's Phone</Label>
                  <Input id="secondaryClientPhone" name="secondaryClientPhone" type="tel" />
                </div>
                <div>
                  <Label htmlFor="secondaryClientEmail">Secondary Client's Email</Label>
                  <Input id="secondaryClientEmail" name="secondaryClientEmail" type="email" />
                </div>
              </div>
            </div>

            {/* Location and Timeline */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Location & Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentLocation">Client's Current Location *</Label>
                  <Input id="currentLocation" name="currentLocation" required />
                </div>
                <div>
                  <Label htmlFor="desiredLocation">Client's Desired Location *</Label>
                  <Input id="desiredLocation" name="desiredLocation" placeholder="City? County? Zip? DMA?" required />
                </div>
              </div>
              <div>
                <Label htmlFor="timeline">What is their desired timeline? *</Label>
                <Select name="timeline" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediately">Immediately</SelectItem>
                    <SelectItem value="1-2-months">1-2 months</SelectItem>
                    <SelectItem value="3-6-months">3-6 months</SelectItem>
                    <SelectItem value="6-plus-months">6+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Agent Preference */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Agent Preference</h3>
              <div>
                <Label>Do you know the agent you want to refer the deal to?</Label>
                <RadioGroup
                  value={knowAgent ? "yes" : "no"}
                  onValueChange={(value) => setKnowAgent(value === "yes")}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {knowAgent && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <Label htmlFor="agentName">Agent's Name</Label>
                    <Input id="agentName" name="agentName" />
                  </div>
                  <div>
                    <Label htmlFor="agentEmail">Agent's Email</Label>
                    <Input id="agentEmail" name="agentEmail" type="email" />
                  </div>
                  <div>
                    <Label htmlFor="agentPhone">Agent's Phone</Label>
                    <Input id="agentPhone" name="agentPhone" type="tel" />
                  </div>
                </div>
              )}
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="additionalDetails">Any other details or info we should know?</Label>
                <Textarea
                  id="additionalDetails"
                  name="additionalDetails"
                  rows={4}
                  placeholder="Please provide any additional information that would help us serve your client better..."
                />
              </div>
            </div>

            {/* Submit Status */}
            {submitStatus && (
              <div
                className={`p-4 rounded-md ${
                  submitStatus.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="px-8">
                {isSubmitting ? "Submitting..." : "Submit Referral"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
