"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Users, Search, FileText, Presentation, Settings, Play } from "lucide-react"

export default function BuyerProcessTrainingPage() {
  const [activeModule, setActiveModule] = useState("overview")

  const modules = [
    {
      id: "overview",
      title: "Buyer Process Overview",
      icon: Play,
      color: "bg-gradient-to-br from-gray-600 to-slate-600",
      hasTabs: false,
    },
    {
      id: "practice",
      title: "Practice",
      icon: Target,
      color: "bg-gradient-to-br from-blue-500 to-cyan-500",
      hasTabs: true,
    },
    {
      id: "prospect",
      title: "Prospect",
      icon: Users,
      color: "bg-gradient-to-br from-green-500 to-emerald-500",
      hasTabs: true,
    },
    {
      id: "pre-qualify",
      title: "Pre-Qualify",
      icon: Search,
      color: "bg-gradient-to-br from-yellow-500 to-amber-500",
      hasTabs: true,
    },
    {
      id: "prepare",
      title: "Prepare",
      icon: FileText,
      color: "bg-gradient-to-br from-purple-500 to-indigo-500",
      hasTabs: true,
    },
    {
      id: "present",
      title: "Present",
      icon: Presentation,
      color: "bg-gradient-to-br from-red-500 to-orange-500",
      hasTabs: true,
    },
    {
      id: "process",
      title: "Process",
      icon: Settings,
      color: "bg-gradient-to-br from-pink-500 to-rose-500",
      hasTabs: true,
    },
  ]

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Target className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">Buyer Process Training</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master our proven 6 P's system for guiding buyers through the purchase process from start to finish.
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
                        {module.id === "practice" && (
                          <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-8">
                              <TabsTrigger value="overview">Overview</TabsTrigger>
                              <TabsTrigger value="videos">Video Lessons</TabsTrigger>
                              <TabsTrigger value="scripts">Proven Scripts</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview">
                              <Card>
                                <CardContent className="pt-6">
                                  <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-blue-700">
                                      P1 - Practice, Practice, Practice
                                    </h3>

                                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
                                      <h4 className="text-xl font-bold mb-4 text-blue-800">
                                        The Foundation of Success
                                      </h4>
                                      <p className="text-gray-700 mb-4">
                                        Internalizing the words is vital so that you can focus on connection and not
                                        what to say. The best way to accomplish this is by practicing.
                                      </p>
                                      <p className="text-gray-700">
                                        Watch the video lesson that provides advice on how to practice and master the
                                        scripts and practice, practice, practice!
                                      </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                      <div className="bg-white p-5 rounded-lg border border-blue-100 shadow-sm">
                                        <h5 className="font-bold text-blue-700 mb-3">Why Practice Matters</h5>
                                        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                                          <li>Builds confidence in conversations</li>
                                          <li>Allows focus on connection, not words</li>
                                          <li>Creates natural, authentic delivery</li>
                                          <li>Reduces anxiety in client interactions</li>
                                          <li>Improves conversion rates</li>
                                        </ul>
                                      </div>

                                      <div className="bg-white p-5 rounded-lg border border-blue-100 shadow-sm">
                                        <h5 className="font-bold text-blue-700 mb-3">How to Practice Effectively</h5>
                                        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                                          <li>Practice scripts out loud daily</li>
                                          <li>Record yourself and listen back</li>
                                          <li>Role-play with colleagues</li>
                                          <li>Practice in front of a mirror</li>
                                          <li>Focus on tone and inflection</li>
                                        </ul>
                                      </div>
                                    </div>

                                    <div className="bg-blue-600 text-white p-5 rounded-lg">
                                      <p className="text-lg font-medium text-center">
                                        "When you know your scripts by heart, you can focus entirely on building rapport
                                        and connection with your prospects."
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </TabsContent>
                            <TabsContent value="videos">
                              <Card>
                                <CardContent className="pt-6">
                                  <div className="space-y-6">
                                    <h3 className="text-xl font-bold">How to Practice and Master Your Scripts</h3>

                                    <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                                      <iframe
                                        src="https://www.youtube.com/embed/-iZP4tThjtI"
                                        title="How to Practice and Master Your Scripts"
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                      ></iframe>
                                    </div>

                                    <p className="text-gray-700">
                                      Learn proven techniques for practicing and mastering your buyer scripts so they
                                      become second nature. This video covers the best methods for internalizing scripts
                                      while maintaining authenticity.
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            </TabsContent>
                            <TabsContent value="scripts">
                              <Card>
                                <CardContent className="pt-6">
                                  <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-blue-700">Proven Buyer Scripts</h3>
                                    <p className="text-gray-600">
                                      Click on any script below to expand and view the full content. Audio files are
                                      provided for practice.
                                    </p>

                                    <div className="space-y-4">
                                      <details className="bg-white border border-blue-100 rounded-lg shadow-sm">
                                        <summary className="p-4 cursor-pointer hover:bg-blue-50 font-semibold text-blue-700 flex items-center justify-between">
                                          <span>Buyer Pre-Qualification Script</span>
                                          <span className="text-sm text-gray-500">Click to expand</span>
                                        </summary>
                                        <div className="p-4 border-t border-blue-100 space-y-4">
                                          <div className="bg-blue-50 p-4 rounded-lg">
                                            <h4 className="font-bold text-blue-800 mb-2">Audio Practice File</h4>
                                            <div className="space-y-2">
                                              <audio
                                                controls
                                                className="w-full"
                                                preload="none"
                                                onError={(e) => {
                                                  console.log("Audio error:", e)
                                                  e.currentTarget.style.display = "none"
                                                  const fallback = e.currentTarget.nextElementSibling
                                                  if (fallback) fallback.style.display = "block"
                                                }}
                                              >
                                                <source
                                                  src="/audio/buyer-prequalification-script.mp3"
                                                  type="audio/mpeg"
                                                />
                                                <source
                                                  src="/audio/buyer-prequalification-script.wav"
                                                  type="audio/wav"
                                                />
                                              </audio>
                                              <div style={{ display: "none" }} className="text-center">
                                                <p className="text-red-600 text-sm mb-2">Audio player not available.</p>
                                                <a
                                                  href="/audio/buyer-prequalification-script.mp3"
                                                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                  download
                                                >
                                                  Download Audio File
                                                </a>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="prose max-w-none">
                                            <h4 className="font-bold text-gray-800">Buyer Pre Qualification Script</h4>
                                            <div className="bg-gray-50 p-4 rounded-lg text-sm leading-relaxed">
                                              <p>
                                                <strong>
                                                  Hi, this is ________________________ with CENTURY 21 Beggins
                                                </strong>
                                              </p>

                                              <p>
                                                The reason I'm calling is to{" "}
                                                <strong>SET/CONFIRM our appointment</strong> to get you into your next
                                                property...
                                              </p>

                                              <p>
                                                Would <strong>____</strong> Or <strong>____</strong> work better for
                                                you. <strong>_______</strong>
                                              </p>

                                              <p>
                                                In order to make the most efficient use of our time and provide you with
                                                the best service, I'd like to confirm some information and ask you a few
                                                questions prior to our meeting, Okay. <strong>_____(Super)</strong>
                                              </p>

                                              <p>
                                                Buyer's who <strong>get pre-approved for a mortgage</strong> are in a
                                                much better negotiating position than those who don't... Have you, by
                                                any chance, already arranged financing for your new property.{" "}
                                                <strong>_____(Good)</strong>
                                              </p>

                                              <p>
                                                <strong>If YES</strong> – Good for you! What lender are you working
                                                with. <strong>Super!</strong>
                                              </p>

                                              <p>
                                                Let me do you a favor... let's see if our in house loan officer might be
                                                able to help you to <strong>get a better rate</strong>... I will have
                                                him/her call you when we are finished...
                                              </p>

                                              <p>
                                                <strong>If NO</strong> - Our In-House Loan Officers work with over 500
                                                lenders to get you the best loan program. I will have one of our loan
                                                officers call you later today...
                                              </p>

                                              <p>
                                                And, how much of a down payment do you plan to invest.{" "}
                                                <strong>__________Great!</strong>
                                              </p>

                                              <p>
                                                And, what price ranges are you entertaining. <strong>$</strong> To{" "}
                                                <strong>$</strong>. <strong>Super!</strong>
                                              </p>

                                              <p>
                                                Ideally, when would you like to move into your new home.{" "}
                                                <strong>Great!</strong>
                                              </p>

                                              <p>
                                                Do you have to sell the property you are in now before you buy the new
                                                one...
                                              </p>

                                              <p>
                                                I'm going to be sending you a link to a very brief overview presentation
                                                that I'd like you to watch before our meeting...
                                              </p>

                                              <p>
                                                Let me confirm your e-mail address.{" "}
                                                <strong>____________________________</strong>
                                              </p>

                                              <p>
                                                I'm also going to send you a link to a cool service that I actually pay
                                                for...for you... which is going to send you daily updates of everything
                                                new that hits the inventory that matches your criteria... it's going to
                                                allow you to have a great understanding between now and the time
                                                anything new comes on the market before <strong>(_________)</strong>.
                                              </p>

                                              <p>
                                                When we get together, we're going to review all of your options as far
                                                as location... style of home... amenities... neighborhoods... everything
                                                you can possibly think of. In order to <strong>save us time</strong>...
                                                I'd like to ask you to <strong>complete our Lifestyle Profile</strong>
                                                ... it will tell me your wants and needs better... so I can do the{" "}
                                                <strong>VERY BEST JOB</strong> for you. I'll e-mail it to you.{" "}
                                                <strong>(__) GREAT!</strong>
                                              </p>

                                              <p>
                                                What you are going to find is that we have a very thorough system for
                                                finding the right home for each of our clients. Quite frankly... I think
                                                it's <strong>the best system in the industry</strong>. When we get
                                                together on <strong>____________</strong>, we'll review the entire
                                                process and I'll answer any questions that you may have.
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </details>
                                    </div>

                                    <div className="bg-blue-600 text-white p-5 rounded-lg">
                                      <p className="text-lg font-medium text-center">
                                        "Practice these scripts until they become conversational. The goal is natural
                                        delivery, not robotic recitation."
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </TabsContent>
                          </Tabs>
                        )}

                        {module.id === "prospect" && (
                          <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-green-700">P2 - Prospecting</h3>

                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                              <h4 className="text-xl font-bold mb-4 text-green-800">The Simple Truth</h4>
                              <p className="text-gray-700 mb-4">
                                This business is simple, not easy. Bottom line; you need to talk to people. WHO you talk
                                to is up to you. But you need to pick a lane and focus on it. Become an expert in that
                                niche and follow up, follow up, follow up.
                              </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="bg-white p-5 rounded-lg border border-green-100 shadow-sm">
                                <h5 className="font-bold text-green-700 mb-3">Prospecting Niches</h5>
                                <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                                  <li>First-time homebuyers</li>
                                  <li>Move-up buyers</li>
                                  <li>Downsizers</li>
                                  <li>Investors</li>
                                  <li>Luxury market</li>
                                  <li>Specific neighborhoods</li>
                                </ul>
                              </div>

                              <div className="bg-white p-5 rounded-lg border border-green-100 shadow-sm">
                                <h5 className="font-bold text-green-700 mb-3">Follow-Up System</h5>
                                <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                                  <li>Consistent contact schedule</li>
                                  <li>Value-added touchpoints</li>
                                  <li>Multi-channel approach</li>
                                  <li>Personalized communication</li>
                                  <li>CRM utilization</li>
                                  <li>Tracking and measurement</li>
                                </ul>
                              </div>
                            </div>

                            <div className="bg-white border border-green-200 rounded-lg p-6 text-center">
                              <h4 className="text-xl font-bold mb-4 text-green-800">Dive Deeper Into Common Lanes</h4>
                              <p className="text-gray-700">
                                To explore specific prospecting strategies for different buyer niches, check out our
                                video lesson in the "Video Lessons" tab above.
                              </p>
                            </div>

                            <div className="bg-green-600 text-white p-5 rounded-lg">
                              <p className="text-lg font-medium text-center">
                                "Consistency is the key to prospecting success. The agent who follows up wins the
                                business."
                              </p>
                            </div>
                          </div>
                        )}

                        {module.id === "pre-qualify" && (
                          <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-yellow-700">P3 - Pre-Qualify</h3>

                            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-6">
                              <h4 className="text-xl font-bold mb-4 text-yellow-800">Do You Have a Real Lead?</h4>
                              <p className="text-gray-700 mb-4">
                                If they can't answer these 3 simple questions, they are not 100% ready. That doesn't
                                mean they are not worth spending time with. But, it's important to know what stage they
                                are in and the timeline so that you can make strategic business decisions.
                              </p>
                            </div>

                            <div className="bg-white border border-yellow-200 rounded-lg p-6">
                              <h4 className="text-xl font-bold mb-6 text-yellow-800 text-center">
                                The Three Critical Questions
                              </h4>
                              <div className="space-y-6">
                                <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                  <div className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                                    1
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-yellow-700 mb-2">Have you spoken to their lender?</h5>
                                    <p className="text-gray-700 text-sm">
                                      This confirms their financial readiness and shows they're serious about the buying
                                      process.
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                  <div className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                                    2
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-yellow-700 mb-2">Do they HAVE to move?</h5>
                                    <p className="text-gray-700 text-sm">
                                      Understanding their motivation level helps you gauge urgency and commitment to
                                      purchasing.
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                  <div className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                                    3
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-yellow-700 mb-2">
                                      Do they know where they want to move to and do they have a timeframe?
                                    </h5>
                                    <p className="text-gray-700 text-sm">
                                      This reveals their level of preparation and helps you understand their
                                      decision-making timeline.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="bg-white p-5 rounded-lg border border-yellow-100 shadow-sm">
                                <h5 className="font-bold text-yellow-700 mb-3">Ready Buyers Have:</h5>
                                <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                                  <li>Spoken with a lender</li>
                                  <li>Clear motivation to move</li>
                                  <li>Defined location preferences</li>
                                  <li>Realistic timeline</li>
                                  <li>Understanding of their budget</li>
                                </ul>
                              </div>

                              <div className="bg-white p-5 rounded-lg border border-yellow-100 shadow-sm">
                                <h5 className="font-bold text-yellow-700 mb-3">Not-Ready Buyers Need:</h5>
                                <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                                  <li>Lender referral and pre-approval</li>
                                  <li>Help clarifying their motivation</li>
                                  <li>Education about the market</li>
                                  <li>Guidance on realistic timelines</li>
                                  <li>Nurturing until they're ready</li>
                                </ul>
                              </div>
                            </div>

                            <div className="bg-yellow-600 text-white p-5 rounded-lg">
                              <p className="text-lg font-medium text-center">
                                "Knowing where your prospects stand allows you to allocate your time and energy to the
                                highest probability opportunities."
                              </p>
                            </div>
                          </div>
                        )}

                        {module.id === "prepare" && (
                          <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-purple-700">P4 - Prepare</h3>

                            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
                              <h4 className="text-xl font-bold mb-4 text-purple-800">Preparation is Key</h4>
                              <p className="text-gray-700 mb-4">
                                Proper preparation ensures smooth showings, builds buyer confidence, and positions you
                                as a knowledgeable professional who adds value to their buying experience.
                              </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="bg-white p-5 rounded-lg border border-purple-100 shadow-sm">
                                <h5 className="font-bold text-purple-700 mb-3">Market Preparation</h5>
                                <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                                  <li>Comparative market analysis</li>
                                  <li>Neighborhood research</li>
                                  <li>School district information</li>
                                  <li>Local amenities and services</li>
                                  <li>Market trends and pricing</li>
                                  <li>Inventory analysis</li>
                                </ul>
                              </div>

                              <div className="bg-white p-5 rounded-lg border border-purple-100 shadow-sm">
                                <h5 className="font-bold text-purple-700 mb-3">Showing Preparation</h5>
                                <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                                  <li>Property research and history</li>
                                  <li>Showing route planning</li>
                                  <li>Key features to highlight</li>
                                  <li>Potential concerns to address</li>
                                  <li>Comparable properties</li>
                                  <li>Financing options</li>
                                </ul>
                              </div>
                            </div>

                            <div className="bg-purple-600 text-white p-5 rounded-lg">
                              <p className="text-lg font-medium text-center">
                                "Preparation demonstrates professionalism and builds trust. Buyers want to work with
                                agents who know the market inside and out."
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Present Section Update */}
                        {module.id === "present" && (
                          <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-red-700">P5 - Present</h3>

                            <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-lg p-6">
                              <h4 className="text-xl font-bold mb-4 text-red-800">Establishing Your Value</h4>
                              <p className="text-gray-700 mb-4">
                                The key to a great buyer presentation is establishing your value. This is not about
                                opening doors and showing them where the kitchen is. This is about guiding them through
                                the entire process from start to finish and using your expertise to get them the best
                                deal terms possible.
                              </p>
                            </div>

                            <div className="bg-white border border-red-200 rounded-lg p-6">
                              <h4 className="text-xl font-bold mb-4 text-red-800">Beyond Basic Property Tours</h4>
                              <p className="text-gray-700 mb-4">
                                Professional buyer representation means being a strategic advisor, market expert, and
                                skilled negotiator who protects your client's interests at every step of the
                                transaction.
                              </p>

                              <div className="grid md:grid-cols-3 gap-4 mt-6">
                                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
                                  <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="font-bold">1</span>
                                  </div>
                                  <h5 className="font-bold text-red-700 mb-2">Market Expert</h5>
                                  <p className="text-sm text-gray-600">
                                    Provide insights on pricing, trends, and neighborhood dynamics
                                  </p>
                                </div>

                                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
                                  <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="font-bold">2</span>
                                  </div>
                                  <h5 className="font-bold text-red-700 mb-2">Strategic Advisor</h5>
                                  <p className="text-sm text-gray-600">
                                    Guide decision-making with professional expertise and market knowledge
                                  </p>
                                </div>

                                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
                                  <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="font-bold">3</span>
                                  </div>
                                  <h5 className="font-bold text-red-700 mb-2">Skilled Negotiator</h5>
                                  <p className="text-sm text-gray-600">
                                    Secure the best possible terms and protect client interests
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="bg-white p-5 rounded-lg border border-red-100 shadow-sm">
                                <h5 className="font-bold text-red-700 mb-3">Value-Added Services</h5>
                                <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                                  <li>Comprehensive market analysis</li>
                                  <li>Property history and disclosure review</li>
                                  <li>Comparable sales evaluation</li>
                                  <li>Negotiation strategy development</li>
                                  <li>Contract terms optimization</li>
                                  <li>Transaction timeline management</li>
                                </ul>
                              </div>

                              <div className="bg-white p-5 rounded-lg border border-red-100 shadow-sm">
                                <h5 className="font-bold text-red-700 mb-3">Professional Presentation</h5>
                                <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                                  <li>Create emotional connections</li>
                                  <li>Highlight unique value propositions</li>
                                  <li>Address concerns proactively</li>
                                  <li>Use data-driven insights</li>
                                  <li>Paint the lifestyle picture</li>
                                  <li>Demonstrate market expertise</li>
                                </ul>
                              </div>
                            </div>

                            <div className="bg-red-600 text-white p-5 rounded-lg">
                              <p className="text-lg font-medium text-center">
                                "Your value isn't in opening doors—it's in opening opportunities and securing the best
                                possible outcome for your clients."
                              </p>
                            </div>
                          </div>
                        )}

                        {module.id === "process" && (
                          <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-pink-700">P6 - Process</h3>

                            <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-lg p-6">
                              <h4 className="text-xl font-bold mb-4 text-pink-800">Ready to Secure the Agreement</h4>
                              <p className="text-gray-700 mb-4">
                                At this stage you are ready to present your buyer representation services
                                professionally. You have built rapport, set clear expectations, provided market
                                guidance, and demonstrated your value. Here is how to secure the buyer representation
                                agreement and manage the entire transaction process:
                              </p>
                            </div>

                            <div className="bg-white border border-pink-200 rounded-lg p-6">
                              <h4 className="text-xl font-bold mb-4 text-pink-800">The Complete Transaction Journey</h4>
                              <p className="text-gray-700 mb-4">
                                Professional transaction management ensures every detail is handled expertly from the
                                initial buyer consultation through closing and beyond.
                              </p>

                              <div className="grid md:grid-cols-4 gap-4 mt-6">
                                <div className="text-center p-4 bg-pink-50 rounded-lg border border-pink-100">
                                  <div className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="font-bold">1</span>
                                  </div>
                                  <h5 className="font-bold text-pink-700 mb-2">Secure Agreement</h5>
                                  <p className="text-sm text-gray-600">
                                    Present services and secure buyer representation agreement
                                  </p>
                                </div>

                                <div className="text-center p-4 bg-pink-50 rounded-lg border border-pink-100">
                                  <div className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="font-bold">2</span>
                                  </div>
                                  <h5 className="font-bold text-pink-700 mb-2">Property Search</h5>
                                  <p className="text-sm text-gray-600">
                                    Guide buyers through systematic property evaluation
                                  </p>
                                </div>

                                <div className="text-center p-4 bg-pink-50 rounded-lg border border-pink-100">
                                  <div className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="font-bold">3</span>
                                  </div>
                                  <h5 className="font-bold text-pink-700 mb-2">Contract & Negotiation</h5>
                                  <p className="text-sm text-gray-600">
                                    Prepare offers and negotiate the best possible terms
                                  </p>
                                </div>

                                <div className="text-center p-4 bg-pink-50 rounded-lg border border-pink-100">
                                  <div className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="font-bold">4</span>
                                  </div>
                                  <h5 className="font-bold text-pink-700 mb-2">Closing Management</h5>
                                  <p className="text-sm text-gray-600">
                                    Coordinate all aspects through successful closing
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="bg-white p-5 rounded-lg border border-pink-100 shadow-sm">
                                <h5 className="font-bold text-pink-700 mb-3">Contract to Closing</h5>
                                <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                                  <li>Offer preparation and strategy</li>
                                  <li>Negotiation management</li>
                                  <li>Inspection coordination</li>
                                  <li>Appraisal oversight</li>
                                  <li>Financing follow-up</li>
                                  <li>Closing preparation</li>
                                </ul>
                              </div>

                              <div className="bg-white p-5 rounded-lg border border-pink-100 shadow-sm">
                                <h5 className="font-bold text-pink-700 mb-3">Client Communication</h5>
                                <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                                  <li>Regular status updates</li>
                                  <li>Timeline management</li>
                                  <li>Issue resolution</li>
                                  <li>Expectation setting</li>
                                  <li>Document coordination</li>
                                  <li>Post-closing follow-up</li>
                                </ul>
                              </div>
                            </div>

                            <div className="bg-pink-600 text-white p-5 rounded-lg">
                              <p className="text-lg font-medium text-center">
                                "Professional process management from consultation to closing creates satisfied clients
                                and generates referrals for years to come."
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="videos">
                    <Card>
                      <CardContent className="pt-6">
                        {module.id === "practice" && (
                          <div className="space-y-6">
                            <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                              <iframe
                                src="https://www.youtube.com/embed/-iZP4tThjtI"
                                title="How to Practice and Master Your Scripts"
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-bold">Building Your Practice Foundation</h3>
                              <span className="text-sm bg-gray-100 px-2 py-1 rounded">--:--</span>
                            </div>
                            <p className="text-gray-700">
                              This video will cover essential practice techniques for developing your buyer
                              representation skills and building confidence in your abilities.
                            </p>
                          </div>
                        )}

                        {module.id === "prospect" && (
                          <div className="space-y-6">
                            <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                              <iframe
                                src="https://www.youtube.com/embed/lB5b8Z_ynTo"
                                title="Effective Buyer Prospecting Strategies"
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-bold">Effective Buyer Prospecting Strategies</h3>
                              <span className="text-sm bg-gray-100 px-2 py-1 rounded">--:--</span>
                            </div>
                            <p className="text-gray-700">
                              Learn proven techniques for finding and attracting quality buyer prospects through various
                              channels and marketing strategies. This video explores different prospecting niches and
                              how to become an expert in your chosen lane.
                            </p>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <h4 className="font-medium text-green-800 mb-2">Key Takeaways:</h4>
                              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                                <li>How to identify your ideal buyer niche</li>
                                <li>Building a consistent prospecting system</li>
                                <li>Follow-up strategies that convert leads</li>
                                <li>Leveraging technology for prospecting efficiency</li>
                              </ul>
                            </div>
                          </div>
                        )}

                        {module.id === "pre-qualify" && (
                          <div className="space-y-6">
                            <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                              <iframe
                                src="https://www.youtube.com/embed/BSHRhGUybOE"
                                title="Mastering Buyer Pre-Qualification"
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-bold">Mastering Buyer Pre-Qualification</h3>
                              <span className="text-sm bg-gray-100 px-2 py-1 rounded">--:--</span>
                            </div>
                            <p className="text-gray-700">
                              Learn how to identify real leads by asking the right pre-qualification questions. This
                              video covers the three critical questions that determine if a prospect is truly ready to
                              buy and how to handle buyers at different stages of readiness.
                            </p>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <h4 className="font-medium text-yellow-800 mb-2">Key Takeaways:</h4>
                              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                                <li>How to identify truly qualified buyers</li>
                                <li>The three essential pre-qualification questions</li>
                                <li>Strategies for different buyer readiness levels</li>
                                <li>Making strategic business decisions based on lead quality</li>
                              </ul>
                            </div>
                          </div>
                        )}

                        {module.id === "prepare" && (
                          <div className="space-y-6">
                            <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                              <iframe
                                src="https://www.youtube.com/embed/vsAWQSDDC7Q"
                                title="P4- Prepare & Position | Beggins Buyer Process"
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-bold">Preparation Strategies for Success</h3>
                              <span className="text-sm bg-gray-100 px-2 py-1 rounded">--:--</span>
                            </div>
                            <p className="text-gray-700">
                              Learn comprehensive preparation techniques for market research, property analysis, and
                              showing planning that impress buyers. This video covers how to properly prepare and
                              position yourself for successful buyer interactions.
                            </p>
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                              <h4 className="font-medium text-purple-800 mb-2">Key Takeaways:</h4>
                              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                                <li>How to research properties thoroughly before showings</li>
                                <li>Creating effective showing routes and schedules</li>
                                <li>Preparing market data that builds your credibility</li>
                                <li>Anticipating buyer questions and concerns</li>
                                <li>Positioning yourself as the market expert</li>
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Present Section Update */}
                        {module.id === "present" && (
                          <div className="space-y-8">
                            {/* First Video */}
                            <div className="space-y-6">
                              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                                <iframe
                                  src="https://www.youtube.com/embed/fTXFHSFBQg8"
                                  title="Professional Buyer Presentation Strategies"
                                  className="w-full h-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>
                              <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold">Professional Buyer Presentation Strategies</h3>
                                <span className="text-sm bg-gray-100 px-2 py-1 rounded">--:--</span>
                              </div>
                              <p className="text-gray-700">
                                Learn advanced techniques for presenting properties that go beyond basic tours. This
                                video covers how to establish your value as a buyer's agent and position yourself as an
                                indispensable advisor throughout the buying process.
                              </p>
                              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <h4 className="font-medium text-red-800 mb-2">Key Takeaways:</h4>
                                <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                                  <li>How to establish your value beyond opening doors</li>
                                  <li>Techniques for guiding buyers through decision-making</li>
                                  <li>Strategies for demonstrating market expertise</li>
                                  <li>Methods for creating emotional property connections</li>
                                </ul>
                              </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-200"></div>

                            {/* Second Video */}
                            <div className="space-y-6">
                              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                                <iframe
                                  src="https://www.youtube.com/embed/oIzLWuyqM_g"
                                  title="Advanced Buyer Consultation Techniques"
                                  className="w-full h-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>
                              <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold">Advanced Buyer Consultation Techniques</h3>
                                <span className="text-sm bg-gray-100 px-2 py-1 rounded">--:--</span>
                              </div>
                              <p className="text-gray-700">
                                Master the art of buyer consultations that position you as the expert and build trust
                                from the first meeting. This video demonstrates how to conduct professional buyer
                                presentations that lead to signed agreements and successful transactions.
                              </p>
                              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <h4 className="font-medium text-red-800 mb-2">Key Takeaways:</h4>
                                <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                                  <li>Structuring effective buyer consultation meetings</li>
                                  <li>Presenting your services and value proposition</li>
                                  <li>Building trust and credibility with prospects</li>
                                  <li>Securing buyer representation agreements</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}

                        {module.id === "process" && (
                          <div className="space-y-8">
                            {/* First Video */}
                            <div className="space-y-6">
                              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                                <iframe
                                  src="https://www.youtube.com/embed/5iqtxxpKjnY"
                                  title="Buyer Representation Agreement Presentation"
                                  className="w-full h-full"
                                  className="w-full h-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>
                              <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold">Buyer Representation Agreement Presentation</h3>
                                <span className="text-sm bg-gray-100 px-2 py-1 rounded">--:--</span>
                              </div>
                              <p className="text-gray-700">
                                Learn how to professionally present your buyer representation services and secure signed
                                agreements. This video covers the essential elements of a successful buyer consultation
                                that leads to committed client relationships.
                              </p>
                              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                                <h4 className="font-medium text-pink-800 mb-2">Key Takeaways:</h4>
                                <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                                  <li>How to structure a professional buyer consultation</li>
                                  <li>Presenting your value proposition effectively</li>
                                  <li>Securing buyer representation agreements</li>
                                  <li>Setting clear expectations and boundaries</li>
                                </ul>
                              </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-200"></div>

                            {/* Second Video */}
                            <div className="space-y-6">
                              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                                <iframe
                                  src="https://www.youtube.com/embed/7wiikkaLlSk"
                                  title="Transaction Management and Closing Process"
                                  className="w-full h-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>
                              <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold">Transaction Management and Closing Process</h3>
                                <span className="text-sm bg-gray-100 px-2 py-1 rounded">--:--</span>
                              </div>
                              <p className="text-gray-700">
                                Master the complete transaction management process from contract to closing. This
                                comprehensive video covers every step of managing buyer transactions professionally and
                                ensuring successful outcomes.
                              </p>
                              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                                <h4 className="font-medium text-pink-800 mb-2">Key Takeaways:</h4>
                                <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                                  <li>Complete transaction timeline management</li>
                                  <li>Coordinating inspections, appraisals, and financing</li>
                                  <li>Managing client expectations throughout the process</li>
                                  <li>Ensuring smooth closings and client satisfaction</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    {module.id === "overview" && (
                      <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-700">Buyer Process Overview</h3>

                        <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-6">
                          <h4 className="text-xl font-bold mb-4 text-gray-800">Master the Complete Buyer Journey</h4>
                          <p className="text-gray-700 mb-4">
                            Get a comprehensive overview of our proven 6 P's system that will transform how you work
                            with buyers and dramatically improve your success rate.
                          </p>
                        </div>

                        <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                          <iframe
                            src="https://www.youtube.com/embed/k1QQFu1ViCU"
                            title="Buyer Process Overview"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>

                        <div className="bg-gray-600 text-white p-5 rounded-lg">
                          <p className="text-lg font-medium text-center">
                            "Success with buyers comes from following a proven system. Master these 6 P's and watch your
                            conversion rates soar."
                          </p>
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
