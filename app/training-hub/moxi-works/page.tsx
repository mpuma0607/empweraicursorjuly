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
        title: "How To add Contacts",
        duration: "12:45",
        url: "https://youtu.be/AyF4J4zlgzs",
      },
      {
        title: "Overview & Best Practices",
        duration: "8:30",
        url: "https://youtu.be/1z6m4_SP2dQ",
      },
      {
        title: "How to Update and Change Sales Flow",
        duration: "15:20",
        url: "https://youtu.be/jCc_nIOer64",
      },
      {
        title: "How to Set Up Neighborhood News",
        duration: "10:15",
        url: "https://youtu.be/Gqut6kEIz04",
      },
      {
        title: "Category Wizard",
        duration: "14:30",
        url: "https://youtu.be/dDRZ9iieUSU",
      },
      {
        title: "How to Update Leads",
        duration: "11:45",
        url: "https://youtu.be/GdvzZ26sdXU",
      },
      {
        title: "How To Create an E-blast",
        duration: "9:20",
        url: "https://youtu.be/L6gtcetKjCU",
      },
      {
        title: "How To Connect Moxi to Dotloop",
        duration: "13:10",
        url: "https://youtu.be/F0R2Cx3KhZw",
      },
      {
        title: "How To Set Up An Email Campaign",
        duration: "16:20",
        url: "https://youtu.be/24g0T3GtX0k",
      },
      {
        title: "How TO Back Up Your Database",
        duration: "12:15",
        url: "https://youtu.be/24g0T3GtX0k",
      },
      {
        title: "How To Create Just Listed and Just Solds",
        duration: "18:45",
        url: "https://vimeo.com/737616641",
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
        title: "Moxi Present Overview",
        duration: "18:45",
        url: "https://vimeo.com/737616641",
      },
      {
        title: "Listing Preview Presentation",
        duration: "12:30",
        url: "https://youtu.be/vecmMHVPa4Q",
      },
      {
        title: "How to build a full CMA",
        duration: "15:20",
        url: "https://youtu.be/m33K9pG5oy0",
      },
      {
        title: "Create a quick CMA",
        duration: "8:45",
        url: "https://youtu.be/FHMvG5gpTl4",
      },
      {
        title: "How to save a presentation as a template",
        duration: "10:15",
        url: "https://youtu.be/E3GUJwX9d-Q",
      },
      {
        title: "Advanced CMA Techniques",
        duration: "14:30",
        url: "https://youtu.be/egP9ebGJg7Q",
      },
      {
        title: "How to add multiple net sheets",
        duration: "11:20",
        url: "https://youtu.be/TybtV5GxrpQ",
      },
      {
        title: "Presentation Template Management",
        duration: "9:40",
        url: "https://youtu.be/FguSB3HXj00",
      },
      {
        title: "How to use monthly Wizard Article",
        duration: "13:15",
        url: "https://youtu.be/h5SoufLfleo",
      },
      {
        title: "How to add webpage to presentation",
        duration: "7:50",
        url: "https://youtu.be/oIzLWuyqM_g",
      },
      {
        title: "How to add a video to a presentation",
        duration: "12:00",
      },
      {
        title: "How to build a buyer presentation",
        duration: "16:30",
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
        title: "Full Moxi Website 101 Training",
        duration: "24:15",
        url: "https://youtu.be/SbopPjYWWbM",
      },
      {
        title: "Your Single Property Website",
        duration: "16:20",
        url: "https://youtu.be/Xe-ScvnE5a4",
      },
      {
        title: "How to ensure your site is indexed and secure",
        duration: "12:45",
        url: "https://youtu.be/MonKddMNlts",
      },
      {
        title: "How to add Real Satisfied reviews",
        duration: "10:30",
        url: "https://youtu.be/oa5nK4XHOCc",
      },
      {
        title: "How to add a brokerage page to your website",
        duration: "14:50",
        url: "https://youtu.be/8pErLSnF_OA",
      },
      {
        title: "How to promote a listing on your homepage",
        duration: "11:25",
        url: "https://youtu.be/8pErLSnF_OA",
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
        title: "Moxi Impress Company Listings",
        duration: "13:25",
        url: "https://youtu.be/t_h0c1YazB4",
      },
      {
        title: "Moxi Impress How To Guide",
        duration: "15:30",
        url: "https://youtu.be/WZCoVqdcYNw",
      },
      {
        title: "How to Sync Moxi to FB",
        duration: "9:40",
        url: "https://youtu.be/3omm1H7OWfo",
      },
      {
        title: "Moxi Impress Promote Your Listing",
        duration: "12:15",
        url: "https://youtu.be/0fempDSf-18",
      },
      {
        title: "Moxi Impress Set Up",
        duration: "11:20",
        url: "https://youtu.be/0fempDSf-18",
      },
      {
        title: "Moxi Impress Marketing Made Easy",
        duration: "14:45",
        url: "https://youtu.be/aJXiO60SXsY",
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
