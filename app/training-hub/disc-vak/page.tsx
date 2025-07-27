"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Brain, Heart, Lightbulb, Smile, Shield, Zap, MessageCircle, Handshake, X } from "lucide-react"
import Image from "next/image"

export default function DISCVAKTrainingPage() {
  const [activeModule, setActiveModule] = useState("disc-overview")
  const [expandedImage, setExpandedImage] = useState<string | null>(null)

  const modules = [
    {
      id: "disc-overview",
      title: "DISC Overview",
      icon: Users,
      color: "bg-gradient-to-br from-blue-500 to-cyan-500",
      hasTabs: true,
    },
    {
      id: "d-personality",
      title: '"D" Personality',
      icon: Zap,
      color: "bg-gradient-to-br from-red-500 to-orange-500",
      hasTabs: true,
    },
    {
      id: "i-personality",
      title: '"I" Personality',
      icon: Smile,
      color: "bg-gradient-to-br from-yellow-500 to-amber-500",
      hasTabs: true,
    },
    {
      id: "s-personality",
      title: '"S" Personality',
      icon: Shield,
      color: "bg-gradient-to-br from-green-500 to-emerald-500",
      hasTabs: true,
    },
    {
      id: "c-personality",
      title: '"C" Personality',
      icon: Brain,
      color: "bg-gradient-to-br from-blue-500 to-indigo-500",
      hasTabs: true,
    },
    {
      id: "vak",
      title: "VAK",
      icon: Lightbulb,
      color: "bg-gradient-to-br from-purple-500 to-pink-500",
      hasTabs: false,
    },
    {
      id: "art-of-connection",
      title: "The Art of Connection",
      icon: Heart,
      color: "bg-gradient-to-br from-pink-500 to-rose-500",
      hasTabs: true,
    },
    {
      id: "mirror-matching",
      title: "Mirror & Matching",
      icon: MessageCircle,
      color: "bg-gradient-to-br from-teal-500 to-cyan-500",
      hasTabs: false,
    },
    {
      id: "build-rapport",
      title: "How to Build Rapport",
      icon: Handshake,
      color: "bg-gradient-to-br from-amber-500 to-orange-500",
      hasTabs: false,
    },
  ]

  return (
    <div className="min-h-screen bg-white py-12">
      {/* Image Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              className="absolute top-2 right-2 bg-white rounded-full p-1 z-10"
              onClick={(e) => {
                e.stopPropagation()
                setExpandedImage(null)
              }}
            >
              <X className="h-6 w-6" />
            </button>
            <div className="relative w-full h-full">
              <Image
                src={expandedImage || "/placeholder.svg"}
                alt="Expanded image"
                className="object-contain w-full h-full bg-white rounded-lg"
                width={1200}
                height={900}
              />
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Users className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">DISC/VAK Training</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master communication techniques to connect with any personality type or learning style.
          </p>
        </div>

        {/* Module Selection */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
                activeModule === module.id
                  ? `${module.color} text-white`
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              <module.icon className="h-4 w-4" />
              <span>{module.title}</span>
            </button>
          ))}
        </div>

        {/* Module Content */}
        <div className="max-w-4xl mx-auto">
          {modules.map((module) => (
            <div key={module.id} className={activeModule === module.id ? "block" : "hidden"}>
              {module.hasTabs ? (
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="videos">Video Lessons</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview">
                    <Card>
                      <CardContent className="pt-6">
                        {module.id === "disc-overview" && (
                          <div className="space-y-6">
                            <div
                              className="relative w-full cursor-pointer hover:opacity-90 transition-opacity rounded-lg overflow-hidden"
                              onClick={() => setExpandedImage("/images/disc-quote.png")}
                            >
                              <Image
                                src="/images/disc-quote.png"
                                alt="DISC Quote"
                                width={1000}
                                height={400}
                                className="w-full object-contain"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center">
                                <span className="bg-white bg-opacity-75 px-3 py-1 rounded-full text-sm font-medium">
                                  Click to expand
                                </span>
                              </div>
                            </div>

                            <h3 className="text-xl font-bold">Learning Objectives</h3>
                            <ul className="list-disc pl-6 space-y-2">
                              <li>Understand the four DISC personality types and their communication preferences</li>
                              <li>Identify personality types quickly in conversation</li>
                              <li>Adapt your communication style to build rapport with any personality</li>
                              <li>Recognize Visual, Auditory, and Kinesthetic learning preferences</li>
                              <li>Master the art of mirroring and matching to create instant connection</li>
                            </ul>
                          </div>
                        )}

                        {module.id === "d-personality" && (
                          <div className="space-y-6">
                            <h3 className="text-xl font-bold">"D" Personality - Dominant</h3>

                            <div className="grid md:grid-cols-2 gap-6">
                              {/* D Personality Comprehensive Chart */}
                              <div
                                className="relative w-full aspect-[4/3] cursor-pointer hover:opacity-90 transition-opacity border border-gray-200 rounded-lg overflow-hidden"
                                onClick={() => setExpandedImage("/images/d-personality-detailed-chart.png")}
                              >
                                <Image
                                  src="/images/d-personality-detailed-chart.png"
                                  alt="D Personality Comprehensive Reference Chart"
                                  fill
                                  className="object-contain"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center">
                                  <span className="bg-white bg-opacity-75 px-3 py-1 rounded-full text-sm font-medium">
                                    Click to expand
                                  </span>
                                </div>
                              </div>

                              {/* DISC Traits Quadrant */}
                              <div
                                className="relative w-full aspect-[4/3] cursor-pointer hover:opacity-90 transition-opacity border border-gray-200 rounded-lg overflow-hidden"
                                onClick={() => setExpandedImage("/images/disc-traits-d.gif")}
                              >
                                <Image
                                  src="/images/disc-traits-d.gif"
                                  alt="DISC Personality Traits Quadrant Overview"
                                  fill
                                  className="object-contain"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center">
                                  <span className="bg-white bg-opacity-75 px-3 py-1 rounded-full text-sm font-medium">
                                    Click to expand
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className={`p-4 rounded-lg bg-red-500 bg-opacity-10 border border-red-200 mt-6`}>
                              <h4 className="font-bold mb-2">Key Traits:</h4>
                              <ul className="list-disc pl-6 space-y-1">
                                <li>Direct, decisive, and demanding</li>
                                <li>Task-oriented and results-focused</li>
                                <li>Confident, competitive, and strong-willed</li>
                                <li>Values efficiency and bottom-line results</li>
                              </ul>
                            </div>
                            <h4 className="font-bold">How to Communicate:</h4>
                            <ul className="list-disc pl-6 space-y-2">
                              <li>Be direct and get to the point quickly</li>
                              <li>Focus on results and outcomes</li>
                              <li>Provide options and let them decide</li>
                              <li>Respect their time and be efficient</li>
                              <li>Avoid small talk and unnecessary details</li>
                            </ul>
                          </div>
                        )}

                        {module.id === "i-personality" && (
                          <div className="space-y-6">
                            <h3 className="text-xl font-bold">"I" Personality - Influential</h3>

                            <div className="grid md:grid-cols-2 gap-6">
                              {/* I Personality Detailed Chart */}
                              <div
                                className="relative w-full aspect-[4/3] cursor-pointer hover:opacity-90 transition-opacity border border-gray-200 rounded-lg overflow-hidden"
                                onClick={() => setExpandedImage("/images/i-personality-chart.png")}
                              >
                                <Image
                                  src="/images/i-personality-chart.png"
                                  alt="I Personality Detailed Chart"
                                  fill
                                  className="object-contain"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center">
                                  <span className="bg-white bg-opacity-75 px-3 py-1 rounded-full text-sm font-medium">
                                    Click to expand
                                  </span>
                                </div>
                              </div>

                              {/* DISC Traits Diagram */}
                              <div
                                className="relative w-full aspect-[4/3] cursor-pointer hover:opacity-90 transition-opacity border border-gray-200 rounded-lg overflow-hidden"
                                onClick={() => setExpandedImage("/images/disc-traits-i.gif")}
                              >
                                <Image
                                  src="/images/disc-traits-i.gif"
                                  alt="DISC Personality Traits Diagram"
                                  fill
                                  className="object-contain"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center">
                                  <span className="bg-white bg-opacity-75 px-3 py-1 rounded-full text-sm font-medium">
                                    Click to expand
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className={`p-4 rounded-lg bg-yellow-500 bg-opacity-10 border border-yellow-200 mt-6`}>
                              <h4 className="font-bold mb-2">Key Traits:</h4>
                              <ul className="list-disc pl-6 space-y-1">
                                <li>Inspiring, interactive, and impressive</li>
                                <li>People-oriented and enthusiastic</li>
                                <li>Talkative, optimistic, and persuasive</li>
                                <li>Values recognition and social approval</li>
                              </ul>
                            </div>
                            <h4 className="font-bold">How to Communicate:</h4>
                            <ul className="list-disc pl-6 space-y-2">
                              <li>Be friendly and show enthusiasm</li>
                              <li>Allow time for socializing and stories</li>
                              <li>Focus on the big picture, not details</li>
                              <li>Provide testimonials and social proof</li>
                              <li>Recognize their ideas and accomplishments</li>
                            </ul>
                          </div>
                        )}

                        {module.id === "s-personality" && (
                          <div className="space-y-6">
                            <h3 className="text-xl font-bold">"S" Personality - Steady</h3>

                            <div className="grid md:grid-cols-2 gap-6">
                              {/* S Personality Detailed Chart */}
                              <div
                                className="relative w-full aspect-[4/3] cursor-pointer hover:opacity-90 transition-opacity border border-gray-200 rounded-lg overflow-hidden"
                                onClick={() => setExpandedImage("/images/s-personality-chart.png")}
                              >
                                <Image
                                  src="/images/s-personality-chart.png"
                                  alt="S Personality Detailed Chart"
                                  fill
                                  className="object-contain"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center">
                                  <span className="bg-white bg-opacity-75 px-3 py-1 rounded-full text-sm font-medium">
                                    Click to expand
                                  </span>
                                </div>
                              </div>

                              {/* DISC Traits Diagram */}
                              <div
                                className="relative w-full aspect-[4/3] cursor-pointer hover:opacity-90 transition-opacity border border-gray-200 rounded-lg overflow-hidden"
                                onClick={() => setExpandedImage("/images/disc-traits-s.gif")}
                              >
                                <Image
                                  src="/images/disc-traits-s.gif"
                                  alt="DISC Personality Traits Diagram"
                                  fill
                                  className="object-contain"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center">
                                  <span className="bg-white bg-opacity-75 px-3 py-1 rounded-full text-sm font-medium">
                                    Click to expand
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className={`p-4 rounded-lg bg-green-500 bg-opacity-10 border border-green-200 mt-6`}>
                              <h4 className="font-bold mb-2">Key Traits:</h4>
                              <ul className="list-disc pl-6 space-y-1">
                                <li>Supportive, stable, and sweet</li>
                                <li>People-oriented and patient</li>
                                <li>Good listener, loyal, and dependable</li>
                                <li>Values harmony and security</li>
                              </ul>
                            </div>
                            <h4 className="font-bold">How to Communicate:</h4>
                            <ul className="list-disc pl-6 space-y-2">
                              <li>Be warm, sincere, and personal</li>
                              <li>Take time to build trust and relationship</li>
                              <li>Provide reassurance and guarantees</li>
                              <li>Present changes gradually with support</li>
                              <li>Show genuine interest in their needs</li>
                            </ul>
                          </div>
                        )}

                        {module.id === "c-personality" && (
                          <div className="space-y-6">
                            <h3 className="text-xl font-bold">"C" Personality - Conscientious</h3>

                            <div className="grid md:grid-cols-2 gap-6">
                              {/* C Personality Detailed Chart */}
                              <div
                                className="relative w-full aspect-[4/3] cursor-pointer hover:opacity-90 transition-opacity border border-gray-200 rounded-lg overflow-hidden"
                                onClick={() => setExpandedImage("/images/c-personality-chart.png")}
                              >
                                <Image
                                  src="/images/c-personality-chart.png"
                                  alt="C Personality Detailed Chart"
                                  fill
                                  className="object-contain"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center">
                                  <span className="bg-white bg-opacity-75 px-3 py-1 rounded-full text-sm font-medium">
                                    Click to expand
                                  </span>
                                </div>
                              </div>

                              {/* DISC Traits Diagram */}
                              <div
                                className="relative w-full aspect-[4/3] cursor-pointer hover:opacity-90 transition-opacity border border-gray-200 rounded-lg overflow-hidden"
                                onClick={() => setExpandedImage("/images/disc-traits-c.gif")}
                              >
                                <Image
                                  src="/images/disc-traits-c.gif"
                                  alt="DISC Personality Traits Diagram"
                                  fill
                                  className="object-contain"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center">
                                  <span className="bg-white bg-opacity-75 px-3 py-1 rounded-full text-sm font-medium">
                                    Click to expand
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className={`p-4 rounded-lg bg-blue-500 bg-opacity-10 border border-blue-200 mt-6`}>
                              <h4 className="font-bold mb-2">Key Traits:</h4>
                              <ul className="list-disc pl-6 space-y-1">
                                <li>Cautious, calculating, and competent</li>
                                <li>Task-oriented and analytical</li>
                                <li>Precise, logical, and systematic</li>
                                <li>Values accuracy and quality</li>
                              </ul>
                            </div>
                            <h4 className="font-bold">How to Communicate:</h4>
                            <ul className="list-disc pl-6 space-y-2">
                              <li>Be prepared with facts and details</li>
                              <li>Present information logically and systematically</li>
                              <li>Provide proof and evidence for claims</li>
                              <li>Respect their need for time to analyze</li>
                              <li>Focus on quality and accuracy</li>
                            </ul>
                          </div>
                        )}

                        {module.id === "art-of-connection" && (
                          <div className="space-y-6">
                            <h3 className="text-xl font-bold">The Art of Connection</h3>
                            <p className="text-gray-700">
                              Understanding how communication really works is the foundation of building meaningful
                              connections with others.
                            </p>

                            {/* 7-38-55 Rule */}
                            <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-lg p-6">
                              <h4 className="text-2xl font-bold text-center mb-6 text-pink-800">
                                The 7-38-55 Communication Rule
                              </h4>

                              <div className="grid md:grid-cols-3 gap-6">
                                <div className="text-center">
                                  <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl font-bold text-white">7%</span>
                                  </div>
                                  <h5 className="font-bold text-lg mb-2">Words Used</h5>
                                  <p className="text-gray-600 text-sm">The actual words and content of what you say</p>
                                </div>

                                <div className="text-center">
                                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl font-bold text-white">38%</span>
                                  </div>
                                  <h5 className="font-bold text-lg mb-2">Tonality</h5>
                                  <p className="text-gray-600 text-sm">The tone, pace, and inflection of your voice</p>
                                </div>

                                <div className="text-center">
                                  <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl font-bold text-white">55%</span>
                                  </div>
                                  <h5 className="font-bold text-lg mb-2">Body Language</h5>
                                  <p className="text-gray-600 text-sm">Your posture, gestures, and physical presence</p>
                                </div>
                              </div>

                              <div className="mt-6 p-4 bg-white rounded-lg border border-pink-100">
                                <p className="text-center text-gray-700 font-medium">
                                  <strong>Key Insight:</strong> What you say matters less than how you say it and how
                                  you present yourself.
                                </p>
                              </div>
                            </div>

                            {/* People Like People Who Are Like Themselves */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                              <h4 className="text-xl font-bold mb-4 text-blue-800">The Similarity Principle</h4>
                              <div className="space-y-4">
                                <p className="text-lg font-medium text-center text-blue-700">
                                  "People like people who are like themselves"
                                </p>

                                <div className="grid md:grid-cols-2 gap-4 mt-4">
                                  <div className="bg-white p-4 rounded-lg border border-blue-100">
                                    <h5 className="font-bold text-green-600 mb-2">Think of Someone You Like</h5>
                                    <p className="text-sm text-gray-600">
                                      Consider the qualities, interests, or behaviors you share with people you enjoy
                                      being around.
                                    </p>
                                  </div>

                                  <div className="bg-white p-4 rounded-lg border border-blue-100">
                                    <h5 className="font-bold text-red-600 mb-2">Think of Someone You Don't</h5>
                                    <p className="text-sm text-gray-600">
                                      Notice how different values, communication styles, or approaches can create
                                      distance.
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-4 p-4 bg-white rounded-lg border border-blue-100">
                                  <p className="text-center text-gray-700">
                                    <strong>Application:</strong> By adapting your communication style to match others,
                                    you create instant rapport and connection.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="videos">
                    <Card>
                      <CardContent className="pt-6">
                        {module.id === "disc-overview" && (
                          <div className="space-y-6">
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                              <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/f5PQSsmSuVQ"
                                title="DISC Personality Types Overview"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-bold">DISC Personality Types Overview</h3>
                              <span className="text-sm bg-gray-100 px-2 py-1 rounded">25:30</span>
                            </div>
                            <p className="text-gray-700">
                              This comprehensive overview explains the four DISC personality types and how to identify
                              and communicate effectively with each type.
                            </p>
                          </div>
                        )}

                        {module.id === "d-personality" && (
                          <div className="space-y-6">
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                              <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/21KjFCB_Gcs"
                                title="D Personality Overview"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-bold">Understanding the "D" Personality Type</h3>
                              <span className="text-sm bg-gray-100 px-2 py-1 rounded">8:23</span>
                            </div>
                            <p className="text-gray-700">
                              This video provides in-depth insights into the Dominant personality type and strategies
                              for effective communication with D-type personalities.
                            </p>
                          </div>
                        )}

                        {module.id === "i-personality" && (
                          <div className="space-y-6">
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                              <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/_uGbXBP-n10"
                                title="I Personality Overview"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-bold">Understanding the "I" Personality Type</h3>
                              <span className="text-sm bg-gray-100 px-2 py-1 rounded">10:15</span>
                            </div>
                            <p className="text-gray-700">
                              This video provides in-depth insights into the Influential personality type and strategies
                              for effective communication with I-type personalities.
                            </p>
                          </div>
                        )}

                        {module.id === "s-personality" && (
                          <div className="space-y-6">
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                              <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/tB9VTQMnOGg"
                                title="S Personality Overview"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-bold">Understanding the "S" Personality Type</h3>
                              <span className="text-sm bg-gray-100 px-2 py-1 rounded">12:45</span>
                            </div>
                            <p className="text-gray-700">
                              This video provides in-depth insights into the Steady personality type and strategies for
                              effective communication with S-type personalities.
                            </p>
                          </div>
                        )}

                        {module.id === "c-personality" && (
                          <div className="space-y-6">
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                              <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/ku3wQVFRqZ0"
                                title="C Personality Overview"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-bold">Understanding the "C" Personality Type</h3>
                              <span className="text-sm bg-gray-100 px-2 py-1 rounded">14:20</span>
                            </div>
                            <p className="text-gray-700">
                              This video provides in-depth insights into the Conscientious personality type and
                              strategies for effective communication with C-type personalities.
                            </p>
                          </div>
                        )}

                        {module.id === "art-of-connection" && (
                          <div className="space-y-6">
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                              <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/KKXihRiifJQ"
                                title="The Art of Connection"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-bold">Communication & Connection</h3>
                              <span className="text-sm bg-gray-100 px-2 py-1 rounded">Video</span>
                            </div>
                            <p className="text-gray-700">
                              Learn the fundamental principles of human connection and how to apply the 7-38-55 rule in
                              your daily interactions to build stronger relationships.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    {module.id === "vak" && (
                      <div className="space-y-6">
                        <div
                          className="relative w-full cursor-pointer hover:opacity-90 transition-opacity rounded-lg overflow-hidden"
                          onClick={() => setExpandedImage("/images/vak-learning-styles-chart.png")}
                        >
                          <Image
                            src="/images/vak-learning-styles-chart.png"
                            alt="VAK Learning Styles Overview - Getting to Know the VAK Senses"
                            width={1200}
                            height={800}
                            className="w-full object-contain"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center">
                            <span className="bg-white bg-opacity-75 px-3 py-1 rounded-full text-sm font-medium">
                              Click to expand
                            </span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold">VAK Learning Styles</h3>
                        <p className="text-gray-700">
                          VAK represents the three primary sensory learning styles: Visual, Auditory, and Kinesthetic.
                          Understanding these preferences helps you communicate more effectively.
                        </p>

                        <div className="grid md:grid-cols-3 gap-4 mt-6">
                          <Card>
                            <CardContent className="pt-6">
                              <h4 className="font-bold text-lg text-blue-600 mb-3">Visual Learners</h4>
                              <ul className="list-disc pl-6 space-y-2 text-sm">
                                <li>Process information through seeing</li>
                                <li>Prefer charts, diagrams, and pictures</li>
                                <li>Say phrases like "I see what you mean"</li>
                                <li>Notice visual details and appearances</li>
                                <li>May gesture toward their eyes</li>
                              </ul>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="pt-6">
                              <h4 className="font-bold text-lg text-green-600 mb-3">Auditory Learners</h4>
                              <ul className="list-disc pl-6 space-y-2 text-sm">
                                <li>Process information through hearing</li>
                                <li>Prefer discussions and verbal instructions</li>
                                <li>Say phrases like "That sounds right"</li>
                                <li>May tilt head when listening</li>
                                <li>Distracted by noise</li>
                              </ul>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="pt-6">
                              <h4 className="font-bold text-lg text-red-600 mb-3">Kinesthetic Learners</h4>
                              <ul className="list-disc pl-6 space-y-2 text-sm">
                                <li>Process information through moving and doing</li>
                                <li>Prefer hands-on activities and demonstrations</li>
                                <li>Say phrases like "I can't grasp it"</li>
                                <li>Learn by trial and error</li>
                                <li>May fidget or move around</li>
                              </ul>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )}

                    {module.id === "mirror-matching" && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold">Understanding Mirror & Matching</h3>

                        {/* Milton Erickson Introduction */}
                        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-6">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mr-4">
                              <MessageCircle className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-teal-800">Milton Erickson's Technique</h4>
                              <p className="text-teal-600">The Foundation of Rapport Building</p>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-4">
                            <strong>Milton Erickson</strong> is credited with the technique of "mirror and matching". He
                            believed that when people got close to each other they would begin to mirror each other.
                          </p>

                          <div className="bg-white p-4 rounded-lg border border-teal-100">
                            <h5 className="font-bold text-red-600 mb-2">⚠️ Common Mistake</h5>
                            <p className="text-gray-700">
                              The common mistake is waiting until you find words in common. There are multiple ways to
                              communicate and all of those ways can follow this method.
                            </p>
                          </div>
                        </div>

                        {/* Mirror & Matching Techniques */}
                        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-6">
                          <h4 className="text-xl font-bold mb-6 text-cyan-800 text-center">
                            Mirror & Matching Techniques
                          </h4>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-5 rounded-lg border border-cyan-100 shadow-sm">
                              <div className="flex items-center mb-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white font-bold text-sm">1</span>
                                </div>
                                <h5 className="font-bold text-blue-700">Physical Expression</h5>
                              </div>
                              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                                <li>Gestures</li>
                                <li>Facial expressions</li>
                                <li>Tempo</li>
                              </ul>
                            </div>

                            <div className="bg-white p-5 rounded-lg border border-cyan-100 shadow-sm">
                              <div className="flex items-center mb-3">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white font-bold text-sm">2</span>
                                </div>
                                <h5 className="font-bold text-green-700">Sensory Connection</h5>
                              </div>
                              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                                <li>Breathing</li>
                                <li>Touch</li>
                                <li>Specific words</li>
                              </ul>
                            </div>

                            <div className="bg-white p-5 rounded-lg border border-cyan-100 shadow-sm">
                              <div className="flex items-center mb-3">
                                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white font-bold text-sm">3</span>
                                </div>
                                <h5 className="font-bold text-orange-700">Communication Style</h5>
                              </div>
                              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                                <li>Volume</li>
                                <li>Posture</li>
                                <li>Eye contact</li>
                              </ul>
                            </div>

                            <div className="bg-white p-5 rounded-lg border border-cyan-100 shadow-sm">
                              <div className="flex items-center mb-3">
                                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white font-bold text-sm">4</span>
                                </div>
                                <h5 className="font-bold text-purple-700">Environmental Mirroring</h5>
                              </div>
                              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                                <li>Proximity</li>
                                <li>Simple actions (drinking)</li>
                                <li>Picking up objects (pen)</li>
                              </ul>
                            </div>
                          </div>

                          <div className="mt-6 p-4 bg-white rounded-lg border border-cyan-100">
                            <p className="text-center text-gray-700 font-medium">
                              <strong>Key Principle:</strong> Effective mirroring goes beyond words - it encompasses all
                              forms of human communication and behavior.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {module.id === "build-rapport" && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold">How to Build Rapport</h3>

                        {/* Selling is NOT Telling */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
                          <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mr-4">
                              <Handshake className="h-8 w-8 text-white" />
                            </div>
                            <h4 className="text-3xl font-bold text-amber-800">Selling is NOT Telling</h4>
                          </div>

                          <div className="bg-white p-4 rounded-lg border border-amber-100 mb-4">
                            <p className="text-center text-gray-700 font-medium text-lg">
                              Rapport is created by a feeling of commonality; focus on them.
                            </p>
                          </div>

                          <div className="text-right mb-6">
                            <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                              Next Lesson
                            </span>
                          </div>
                        </div>

                        {/* Rapport Building Techniques */}
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-6">
                          <h4 className="text-xl font-bold mb-6 text-orange-800 text-center">
                            Rapport Building Techniques
                          </h4>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-5 rounded-lg border border-orange-100 shadow-sm">
                              <div className="flex items-center mb-3">
                                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white font-bold text-sm">1</span>
                                </div>
                                <h5 className="font-bold text-orange-700">Active Listening</h5>
                              </div>
                              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                                <li>Repeat and affirm what they say</li>
                                <li>Rephrase to show understanding</li>
                                <li>Label emotions to show empathy</li>
                              </ul>
                            </div>

                            <div className="bg-white p-5 rounded-lg border border-orange-100 shadow-sm">
                              <div className="flex items-center mb-3">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white font-bold text-sm">2</span>
                                </div>
                                <h5 className="font-bold text-green-700">Sensory Awareness</h5>
                              </div>
                              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                                <li>Use your sensory acuity</li>
                                <li>Notice subtle changes in expression</li>
                                <li>Respond to non-verbal cues</li>
                              </ul>
                            </div>

                            <div className="bg-white p-5 rounded-lg border border-orange-100 shadow-sm">
                              <div className="flex items-center mb-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white font-bold text-sm">3</span>
                                </div>
                                <h5 className="font-bold text-blue-700">Conversation Flow</h5>
                              </div>
                              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                                <li>Pacing and leading</li>
                                <li>Match their communication style</li>
                                <li>Gradually guide the conversation</li>
                              </ul>
                            </div>

                            <div className="bg-white p-5 rounded-lg border border-orange-100 shadow-sm">
                              <div className="flex items-center mb-3">
                                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white font-bold text-sm">4</span>
                                </div>
                                <h5 className="font-bold text-purple-700">Feedback Loops</h5>
                              </div>
                              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                                <li>"Does that make sense?"</li>
                                <li>"Does that work for you?"</li>
                                <li>Check for understanding regularly</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Key Insights */}
                        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-6">
                          <h4 className="text-xl font-bold mb-4 text-amber-800">Key Insights</h4>

                          <div className="bg-white p-5 rounded-lg border border-amber-100 mb-6">
                            <p className="text-gray-700">
                              If you understand your strategies, you can use them powerfully to create action that
                              otherwise would not have been possible to create.
                            </p>
                          </div>

                          <div className="bg-amber-600 text-white p-5 rounded-lg">
                            <p className="text-lg font-medium text-center">
                              Always remember that selling is rapport and connection which is built by asking a set of
                              questions so that you can understand the prospects needs and make them feel comfortable
                              and understood.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
