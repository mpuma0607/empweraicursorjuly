"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Target, BookOpen } from "lucide-react"

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "videos", label: "Training Videos" },
]

const learningPoints = [
  "Understanding buyer broker agreement fundamentals",
  "Effective presentation techniques and timing",
  "Handling common objections and concerns",
  "Legal requirements and compliance standards",
  "Building trust and rapport with buyers",
  "Negotiating terms and compensation structures",
]

const objectives = [
  "Present buyer broker agreements confidently",
  "Increase agreement signing rates by 40%",
  "Navigate legal compliance requirements",
  "Handle objections professionally",
  "Build stronger buyer relationships",
  "Maximize commission protection",
]

export default function BuyerBrokerAgreementTraining() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Buyer Broker Agreement Training</h1>
              <p className="text-lg text-gray-600 mb-4">
                Master the art of presenting and executing buyer broker agreements effectively
              </p>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Intermediate Level
                </Badge>
                <Badge variant="outline">30 min duration</Badge>
                <Badge variant="outline">Century 21 Beggins</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* What You'll Learn */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <BookOpen className="h-5 w-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">What You'll Learn</h3>
                    </div>
                    <ul className="space-y-3">
                      {learningPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Training Objectives */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Target className="h-5 w-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Training Objectives</h3>
                    </div>
                    <ul className="space-y-3">
                      {objectives.map((objective, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Training Videos Tab */}
            {activeTab === "videos" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Buyer Broker Agreement Training Playlist</h3>
                  <p className="text-gray-600 mb-6">
                    Watch our comprehensive training series on buyer broker agreements. This playlist covers everything
                    from basic concepts to advanced presentation techniques.
                  </p>

                  {/* YouTube Playlist Embed */}
                  <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/videoseries?list=PLnJRpgqKE8_POy877wg0BVJ-F-Js3TzhS"
                      title="Buyer Broker Agreement Training Playlist"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Tip:</strong> Click the playlist icon in the top-right corner of the video player to see
                      all available training videos and navigate between them.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
