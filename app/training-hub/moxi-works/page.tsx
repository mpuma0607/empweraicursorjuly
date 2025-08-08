"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Monitor,
  Presentation,
  Globe,
  Sparkles,
  Play,
  BookOpen,
  Users,
  Target,
  Search,
  ExternalLink,
} from "lucide-react"
import { Input } from "@/components/ui/input"

const moxiModules = [
  {
    id: "engage",
    title: "Moxi Engage",
    icon: Users,
    color: "bg-blue-500",
    description: "Master customer relationship management and lead nurturing",
    videos: [
      {
        title: "MoxiEngage Overview Tutorial | Learn the Basics",
        duration: "12:45",
        url: "https://youtu.be/KahsrF3XTrs",
      },
      {
        title: "How to Upload Contacts in Bulk",
        duration: "8:30",
        url: "https://youtu.be/e2cpkfbOqNk",
      },
      {
        title: "Adding Single Contact and Tracking Activity",
        duration: "15:20",
        url: "https://youtu.be/HzRf6zydEAA",
      },
      {
        title: "Updating a Lead from Your Brokerage in MoxiEngage",
        duration: "10:15",
        url: "https://youtu.be/Eqixxx8bMrY",
      },
      {
        title: "Updating Settings and Sales Flow Tasks",
        duration: "14:30",
        url: "https://youtu.be/9UhGKNvV4cY",
      },
      {
        title: "How to Sync Your Zillow Leads with MoxiEngage | Save Time & Automate Follow-Up",
        duration: "11:45",
        url: "https://youtu.be/s-XhLoRFrNU",
      },
      {
        title: "How to Set Up Groups in MoxiEngage | Organize Your Contacts with Ease",
        duration: "9:20",
        url: "https://youtu.be/HIkRF_KIqMg",
      },
      {
        title: "How to Add Contacts to Campaigns in MoxiEngage | Email Marketing Made Easy",
        duration: "13:10",
        url: "https://youtu.be/HkkXIYt0ZE0",
      },
      {
        title: "Faves, Saves & Neighborhood News | Keep Clients Engaged on Your Moxi Website",
        duration: "16:20",
        url: "https://youtu.be/ehiPod3jYyk",
      },
      {
        title: "How to Use Neighborhood News in MoxiEngage | Keep Clients Informed & Engaged",
        duration: "12:15",
        url: "https://youtu.be/uCwa4ZN6r0Q",
      },
      {
        title: "How to Use the Category Wizard in MoxiEngage | Organize Contacts & Assign Sales Flow",
        duration: "18:45",
        url: "https://youtu.be/bEoIarxKVWc",
      },
      {
        title: "How to Send a Custom Brokerage Eblast in MoxiEngage | Quick & Easy Email Outreach",
        duration: "14:30",
        url: "https://youtu.be/WkS6XEFO-4M",
      },
      {
        title: "Just Listed / Just Sold / Open House Eblasts | How to Create in MoxiEngage",
        duration: "11:45",
        url: "https://youtu.be/nJg32k7esuc",
      },
      {
        title: "How to Schedule a Custom Email Eblast in MoxiEngage | Set It and Forget It!",
        duration: "9:20",
        url: "https://youtu.be/xWMwa-WkjHk",
      },
    ],
  },
  {
    id: "present",
    title: "Moxi Present",
    icon: Presentation,
    color: "bg-green-500",
    description: "Create stunning presentations that convert prospects",
    videos: [
      {
        title: "How to Create a Seller Presentation Using Moxi Present | CENTURY 21 Template Tutorial",
        duration: "18:45",
        url: "https://youtu.be/xpe33y5Ldmw",
      },
      {
        title: "How to Create a Buyer Presentation in Moxi Present",
        duration: "12:30",
        url: "https://youtu.be/BRqKKkRaVk8",
      },
      {
        title: "How to Add Video to Moxi Present",
        duration: "15:20",
        url: "https://youtu.be/1-VTW-ZBdAU",
      },
      {
        title: "How to Save Your Moxi Present as a Custom Template",
        duration: "8:45",
        url: "https://youtu.be/lFzGyEcBCIM",
      },
      {
        title: "Create a Luxury Listing Presentation with Moxi Present",
        duration: "10:15",
        url: "https://youtu.be/BWx6QVbjZp4",
      },
      {
        title: "How to Create a Commercial Real Estate Presentation",
        duration: "14:30",
        url: "https://youtu.be/6UU97XrQvaM",
      },
      {
        title: "Customize & Save Your Own Moxi Present Template | Add Pages, PDFs to Your Real Estate Presentations",
        duration: "11:20",
        url: "https://youtu.be/8Or_WPNDtME",
      },
      {
        title: "How to Add a PDF to Your Presentation",
        duration: "9:40",
        url: "https://youtu.be/ix6Ro_Wwfx0",
      },
      {
        title: "How to Adjust CMA Report Pages in Moxi Present",
        duration: "13:15",
        url: "https://youtu.be/FDLL13sGunA",
      },
      {
        title: "How to Create a Buyer Tour in Moxi Present | Real-Time Property Updates, Scheduling & Client Ratings",
        duration: "7:50",
        url: "https://youtu.be/FB-32XbuR7A",
      },
      {
        title: "How to Add RealSatisfied Testimonials to Your Moxi Present",
        duration: "12:00",
        url: "https://youtu.be/VEjEoXI3jsc",
      },
      {
        title: "How to Embed Website Pages in Moxi Present",
        duration: "16:30",
        url: "https://youtu.be/9yNkwa7ds1g",
      },
      {
        title: "How to Add Multiple Net Sheets in Moxi Present",
        duration: "14:30",
        url: "https://youtu.be/NWFC6KHj_zw",
      },
      {
        title: "MoxiPresent Tips: How to Minimize Print Pages for a Shorter Presentation",
        duration: "11:20",
        url: "https://youtu.be/BqYDQfKyvgE",
      },
      {
        title: "How Brokerages Can Create Custom Pages & Templates in Moxi Present",
        duration: "13:15",
        url: "https://youtu.be/FATNt69JScQ",
      },
      {
        title: "How Brokerages Can Access Moxi Present Reports | Track Agent Activity & Presentation Usage",
        duration: "9:40",
        url: "https://youtu.be/aaLsWCuqU4Q",
      },
    ],
  },
  {
    id: "websites",
    title: "Moxi Websites",
    icon: Globe,
    color: "bg-purple-500",
    description: "Build professional real estate websites that generate leads",
    videos: [
      {
        title: "Moxi Websites 101: Step-by-Step Setup Guide for Real Estate Agents",
        duration: "24:15",
        url: "https://youtu.be/fQT8Y8r-OR0",
      },
      {
        title: "How to Change Your MoxiWorks Website Title (And Why It Matters!)",
        duration: "16:20",
        url: "https://youtu.be/ablpXYumFZw",
      },
      {
        title: "How to Add a Broker Landing Page to Your Moxi Website (Branded & Always Updated!)",
        duration: "14:50",
        url: "https://youtu.be/79Vr4TC8-iw",
      },
      {
        title: "Is Your Moxi Website Secure? How to Enable SSL for Agent Sites",
        duration: "12:45",
        url: "https://youtu.be/GHzWJP1uDGs",
      },
      {
        title: "Stand Out Online: How to Create a Custom Home Page on MoxiWorks",
        duration: "11:25",
        url: "https://youtu.be/p5ZLM2fR5iU",
      },
      {
        title: "How to Add a Vanity Domain to Your MoxiWorks Website (Up to 20!)",
        duration: "10:30",
        url: "https://youtu.be/V7uzqcnZ6AY",
      },
      {
        title: "How to Update Your DNS Settings for a MoxiWorks Website",
        duration: "12:45",
        url: "https://youtu.be/EVKL-p6vW1w",
      },
      {
        title: "Show Off Your Reviews: How to Add RealSatisfied Surveys to Your Moxi Website",
        duration: "10:30",
        url: "https://youtu.be/OZcGW3kTizg",
      },
      {
        title: "How to Create Custom Landing Pages on MoxiWorks | Beginner's Guide",
        duration: "14:50",
        url: "https://youtu.be/aDx_J5n5PQs",
      },
      {
        title: "How to Change Featured Properties on Your Moxi Website to Match Your Niche or Area",
        duration: "11:25",
        url: "https://youtu.be/0cnLvrby1x4",
      },
      {
        title: "Add a Custom Open House Sign-In Page to Your Moxi Website (Broker-Provided)",
        duration: "12:45",
        url: "https://youtu.be/5DVjFTEsUlQ",
      },
    ],
  },
  {
    id: "impress",
    title: "Moxi Impress",
    icon: Sparkles,
    color: "bg-orange-500",
    description: "Create impressive marketing materials and campaigns",
    videos: [
      {
        title: "How to Sync Facebook with Moxi Impress – Easy Step-by-Step Guide!",
        duration: "13:25",
        url: "https://youtu.be/OJMIkXYRZpg",
      },
      {
        title: "Team Setup in Moxi Impress: (Save Time on Every Listing!)",
        duration: "15:30",
        url: "https://youtu.be/LWhmsD1lW3Q",
      },
      {
        title: "Market ANY Property with Moxi Impress! (Even Other Agents' Listings)",
        duration: "9:40",
        url: "https://youtu.be/aXxAiYGKANM",
      },
      {
        title: "Moxi Impress Open House Flyers: Professional Canvassing Materials in Minutes!",
        duration: "12:15",
        url: "https://youtu.be/e4zkOm3RxhU",
      },
      {
        title: "Master Print Marketing in Moxi Impress: Flyers!!",
        duration: "11:20",
        url: "https://youtu.be/sFSGpbTcuaQ",
      },
      {
        title: "Moxi Impress Social Projects: Create On-Brand Posts in Seconds!",
        duration: "14:45",
        url: "https://youtu.be/pSHjCVTJGXc",
      },
      {
        title: "Moxi Impress Virtual Tours: Auto-Generated Tours for YOUR Listings",
        duration: "13:25",
        url: "https://youtu.be/VkwpTUrBCmk",
      },
      {
        title: "Moxi Impress Postcards & Mailers: Auto-Generated Marketing That SELLS Listings!",
        duration: "15:30",
        url: "https://youtu.be/qrMqHUwnrgk",
      },
      {
        title: "MoxiImpress Automatic Listing Videos",
        duration: "9:40",
        url: "https://youtu.be/wT6YQ6sQXW8",
      },
    ],
  },
]

export default function MoxiWorksTrainingPage() {
  const [activeModule, setActiveModule] = useState("engage")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const videoRefs = useRef<(HTMLDivElement | null)[]>([])

  // Filter videos based on search query
  const getFilteredVideos = (videos: any[]) => {
    if (!searchQuery.trim()) return videos

    return videos.filter((video) => video.title.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  // Scroll to first matching video when search results change
  useEffect(() => {
    if (searchQuery && activeTab === "videos" && videoRefs.current.length > 0) {
      const firstMatchingVideo = videoRefs.current.find((ref) => ref !== null)
      if (firstMatchingVideo) {
        firstMatchingVideo.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [searchQuery, activeTab])

  // Reset refs array when filtered videos change
  useEffect(() => {
    if (activeModule) {
      const currentModule = moxiModules.find((m) => m.id === activeModule)
      if (currentModule) {
        videoRefs.current = Array(getFilteredVideos(currentModule.videos).length).fill(null)
      }
    }
  }, [activeModule, searchQuery])

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Monitor className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-black">Moxi Works Training</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master the complete Moxi Works platform with our comprehensive training modules. From CRM management to
            website creation, become a Moxi Works expert.
          </p>
        </div>

        {/* Module Selection */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {moxiModules.map((module) => (
            <Button
              key={module.id}
              onClick={() => {
                setActiveModule(module.id)
                setSearchQuery("")
              }}
              variant={activeModule === module.id ? "default" : "outline"}
              className={`flex items-center gap-2 ${
                activeModule === module.id
                  ? "bg-black text-white hover:bg-gray-800"
                  : "border-gray-300 hover:border-green-500 hover:text-green-600"
              }`}
            >
              <module.icon className="h-4 w-4" />
              {module.title}
            </Button>
          ))}
        </div>

        {/* Training Content */}
        <div className="max-w-6xl mx-auto">
          {moxiModules.map(
            (module) =>
              activeModule === module.id && (
                <Card key={module.id} className="mb-8">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 ${module.color} rounded-full flex items-center justify-center`}>
                        <module.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-3xl text-black">{module.title}</CardTitle>
                        <CardDescription className="text-lg">{module.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs
                      defaultValue="overview"
                      className="w-full"
                      value={activeTab}
                      onValueChange={(value) => {
                        setActiveTab(value)
                        if (value !== "videos") {
                          setSearchQuery("")
                        }
                      }}
                    >
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="videos">Training Videos</TabsTrigger>
                        <TabsTrigger value="resources">Resources</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-black">
                                <BookOpen className="h-5 w-5" />
                                What You'll Learn
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                  Platform navigation and setup
                                </li>
                                <li className="flex items-center">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                  Advanced features and customization
                                </li>
                                <li className="flex items-center">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                  Best practices and workflows
                                </li>
                                <li className="flex items-center">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                  Integration with other tools
                                </li>
                                <li className="flex items-center">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                  Performance optimization
                                </li>
                              </ul>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-black">
                                <Target className="h-5 w-5" />
                                Training Objectives
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                  Become proficient in {module.title}
                                </li>
                                <li className="flex items-center">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                  Implement effective workflows
                                </li>
                                <li className="flex items-center">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                  Maximize ROI from the platform
                                </li>
                                <li className="flex items-center">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                  Troubleshoot common issues
                                </li>
                                <li className="flex items-center">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                  Train team members effectively
                                </li>
                              </ul>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      <TabsContent value="videos" className="mt-6">
                        {/* Search Bar - Show for all modules now */}
                        <div className="mb-6 relative">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                              type="text"
                              placeholder="Search for training videos..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10 py-2 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                            />
                            {searchQuery && (
                              <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                ✕
                              </button>
                            )}
                          </div>

                          {searchQuery && (
                            <div className="mt-2 text-sm text-gray-500">
                              {getFilteredVideos(module.videos).length === 0 ? (
                                <p>No videos found matching "{searchQuery}"</p>
                              ) : (
                                <p>
                                  Found {getFilteredVideos(module.videos).length} video(s) matching "{searchQuery}"
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {getFilteredVideos(module.videos).length === 0 && searchQuery ? (
                          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <p className="text-lg text-gray-600 mb-2">No videos found</p>
                            <p className="text-gray-500">Try a different search term or browse all videos</p>
                            <Button
                              variant="outline"
                              className="mt-4 bg-transparent"
                              onClick={() => setSearchQuery("")}
                            >
                              Show all videos
                            </Button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {getFilteredVideos(module.videos).map((video, index) => (
                              <Card
                                key={index}
                                className={`hover:shadow-lg transition-shadow ${
                                  searchQuery && video.title.toLowerCase().includes(searchQuery.toLowerCase())
                                    ? "ring-2 ring-blue-500 ring-opacity-50"
                                    : ""
                                }`}
                                ref={(el) => (videoRefs.current[index] = el)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                      <Play className="h-6 w-6 text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-black mb-1">{video.title}</h4>
                                      <div className="flex items-center gap-2">
                                        <Badge variant="secondary">{video.duration}</Badge>
                                        <span className="text-sm text-gray-500">Video Training</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="aspect-video">
                                    {video.url ? (
                                      video.url.includes("vimeo.com") ? (
                                        <iframe
                                          src={`https://player.vimeo.com/video/${video.url.split("/").pop()}`}
                                          width="100%"
                                          height="100%"
                                          frameBorder="0"
                                          allow="autoplay; fullscreen; picture-in-picture"
                                          allowFullScreen
                                          className="rounded border"
                                        ></iframe>
                                      ) : (
                                        <iframe
                                          width="100%"
                                          height="100%"
                                          src={`https://www.youtube.com/embed/${video.url.split("/").pop()}`}
                                          title={video.title}
                                          frameBorder="0"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                          allowFullScreen
                                          className="rounded border"
                                        ></iframe>
                                      )
                                    ) : (
                                      <div className="bg-gray-50 p-4 rounded border-2 border-dashed border-gray-300 text-center h-full flex items-center justify-center">
                                        <div>
                                          <p className="text-sm text-gray-600">Video Coming Soon</p>
                                          <p className="text-xs text-gray-500 mt-1">{video.title}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="resources" className="mt-6">
                        {module.id === "engage" ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-black">Setup Guides</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-3">
                                  <li className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                                    <a
                                      href="/pdfs/moxi-initial-setup.pdf"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm font-medium text-black hover:text-blue-600 flex-1"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        alert("PDF resources are currently being updated. Check back soon!")
                                      }}
                                    >
                                      Initial Set Up
                                    </a>
                                    <Badge variant="outline">PDF</Badge>
                                  </li>
                                  <li className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                                    <a
                                      href="/pdfs/export-contacts.pdf"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm font-medium text-black hover:text-blue-600 flex-1"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        alert("PDF resources are currently being updated. Check back soon!")
                                      }}
                                    >
                                      How To Export Contacts
                                    </a>
                                    <Badge variant="outline">PDF</Badge>
                                  </li>
                                </ul>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle className="text-black">Support & Community</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-3">
                                  <li className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <span className="text-sm font-medium text-black">Live Q&A Sessions</span>
                                    <Badge variant="outline">Weekly</Badge>
                                  </li>
                                  <li className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <span className="text-sm font-medium text-black">Community Forum</span>
                                    <Badge variant="outline">24/7</Badge>
                                  </li>
                                  <li className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <span className="text-sm font-medium text-black">Expert Office Hours</span>
                                    <Badge variant="outline">Daily</Badge>
                                  </li>
                                  <li className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <span className="text-sm font-medium text-black">Implementation Support</span>
                                    <Badge variant="outline">1-on-1</Badge>
                                  </li>
                                </ul>
                              </CardContent>
                            </Card>

                            {/* Moxi Login Button for Engage */}
                            <Card className="md:col-span-2">
                              <CardHeader>
                                <CardTitle className="text-black">Access Moxi Platform</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Button
                                  onClick={() => window.open("https://mymoxi.century21.com/sessions/new", "_blank")}
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  LOG IN TO MOXI
                                </Button>
                              </CardContent>
                            </Card>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="text-center">
                              <h3 className="text-2xl font-medium text-gray-700 mb-2">Resources Coming Soon</h3>
                              <p className="text-gray-500">
                                Additional resources for this module will be available shortly.
                              </p>
                            </div>

                            {/* Moxi Login Button for other modules */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-black">Access Moxi Platform</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Button
                                  onClick={() => window.open("https://mymoxi.century21.com/sessions/new", "_blank")}
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  LOG IN TO MOXI
                                </Button>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ),
          )}
        </div>
      </div>
    </div>
  )
}
