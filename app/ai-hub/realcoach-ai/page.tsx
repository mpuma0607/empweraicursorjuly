import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "RealCoach AI | Next Level U",
  description: "Get personalized coaching and a detailed action plan to hit your real estate income targets",
}

import RealCoachForm from "./realcoach-form"

export default function RealCoachAIPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-black to-[#b6a888] bg-clip-text text-transparent">
          RealCoach AI
        </h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Answer a few questions about your real estate business goals, and receive a personalized coaching plan with
          precise calculations and actionable steps to hit your income targets.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2 text-[#b6a888]">Income Analysis</h3>
            <p className="text-gray-700">
              Get a detailed breakdown of your income goals and the exact number of transactions needed to achieve them.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2 text-[#b6a888]">Personalized Strategy</h3>
            <p className="text-gray-700">
              Receive a customized prospecting plan based on your preferences, strengths, and chosen business lane.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2 text-[#b6a888]">Daily Action Plan</h3>
            <p className="text-gray-700">
              Get a day-by-day execution plan with specific activities, targets, and scripts to reach your goals.
            </p>
          </div>
        </div>

        <RealCoachForm />
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-[#b6a888]">How RealCoach AI Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-lg mb-2">Step 1: Share Your Goals</h3>
            <p className="text-gray-700 mb-4">
              Answer questions about your current situation, income goals, and business preferences. The more specific
              you are, the more tailored your plan will be.
            </p>

            <h3 className="font-bold text-lg mb-2">Step 2: Get Your Custom Plan</h3>
            <p className="text-gray-700">
              Our AI coach analyzes your responses and creates a personalized action plan with precise calculations,
              daily activities, and accountability tracking.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Step 3: Execute With Confidence</h3>
            <p className="text-gray-700 mb-4">
              Follow your daily execution plan, use the provided scripts and templates, and track your progress using
              the accountability system.
            </p>

            <h3 className="font-bold text-lg mb-2">Step 4: Track & Adjust</h3>
            <p className="text-gray-700">
              Monitor your results against the weekly targets and make adjustments as needed to stay on track toward
              your income goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
