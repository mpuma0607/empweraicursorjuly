"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Smile,
  Heart,
  GraduationCap,
  Target,
  Calendar,
  Palette,
  Video,
  Home,
  Clock,
  Users,
  FileText,
  TrendingUp,
  Phone,
} from "lucide-react"

const contentCategories = [
  { id: "entertaining", label: "Entertaining Content", icon: Smile, color: "bg-yellow-500" },
  { id: "engaging", label: "Engaging Content", icon: Heart, color: "bg-pink-500" },
  { id: "educational", label: "Educational Content", icon: GraduationCap, color: "bg-blue-500" },
  { id: "motivational", label: "Motivational Content", icon: TrendingUp, color: "bg-indigo-500" },
  { id: "prospecting", label: "Prospecting Content", icon: Target, color: "bg-purple-500" },
  { id: "holiday", label: "Holiday Content", icon: Calendar, color: "bg-red-500" },
  { id: "brand-studio", label: "Brand Studio Content", icon: Palette, color: "bg-green-500" },
  { id: "video", label: "Video Content", icon: Video, color: "bg-orange-500" },
]

const prospectingTabs = [
  { id: "fsbo", label: "FSBO", icon: Home },
  { id: "expired", label: "Expired", icon: Clock },
  { id: "absentee", label: "Absentee Owners", icon: Users },
  { id: "probate", label: "Probate", icon: FileText },
  { id: "pre-foreclosure", label: "Pre-Foreclosure", icon: TrendingUp },
  { id: "soi", label: "SOI", icon: Users },
  { id: "divorce", label: "Divorce", icon: Phone },
]

export default function BrandedSocialContentPage() {
  const [activeCategory, setActiveCategory] = useState("entertaining")

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Branded Social Content</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access our comprehensive library of branded social media content designed to engage, educate, and convert
            your audience.
          </p>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {contentCategories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              variant={activeCategory === category.id ? "default" : "outline"}
              className={`flex items-center gap-2 ${
                activeCategory === category.id
                  ? "bg-black text-white hover:bg-gray-800"
                  : "border-gray-300 hover:border-green-500 hover:text-green-600"
              }`}
            >
              <category.icon className="h-4 w-4" />
              {category.label}
            </Button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Entertaining Content */}
          {activeCategory === "entertaining" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Smile className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-black">Entertaining Content</CardTitle>
                    <CardDescription>Fun and engaging content to build your personal brand</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src="https://drive.google.com/embeddedfolderview?id=1-Nd-NDQuX_UDw-mWARrrJuaT2Frht0Mj#grid"
                    style={{ width: "100%", height: "600px", border: 0 }}
                    title="Entertaining Content Library"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Engaging Content */}
          {activeCategory === "engaging" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-black">Engaging Content</CardTitle>
                    <CardDescription>Content designed to spark conversations and interactions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src="https://drive.google.com/embeddedfolderview?id=1y-28ETbQZ4RP6UH8UibRG0-rM5IbgERj#grid"
                    style={{ width: "100%", height: "600px", border: 0 }}
                    title="Engaging Content Library"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Educational Content */}
          {activeCategory === "educational" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-black">Educational Content</CardTitle>
                    <CardDescription>Informative content to establish your expertise</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src="https://drive.google.com/embeddedfolderview?id=1_U9QqeUP72SvmNUDSgp5ZqY11LCnuAH_#grid"
                    style={{ width: "100%", height: "600px", border: 0 }}
                    title="Educational Content Library"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Motivational Content */}
          {activeCategory === "motivational" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-black">Motivational Content</CardTitle>
                    <CardDescription>Inspiring content to motivate and uplift your audience</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src="https://drive.google.com/embeddedfolderview?id=1wheuuYTMTXaZyWnaiIHToY5lVkJuAPDf#grid"
                    style={{ width: "100%", height: "600px", border: 0 }}
                    title="Motivational Content Library"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Prospecting Content */}
          {activeCategory === "prospecting" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-black">Prospecting Content</CardTitle>
                    <CardDescription>Targeted content for different lead types</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="fsbo-content" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-6">
                    <TabsTrigger value="fsbo-content" className="flex items-center gap-1 text-xs">
                      <Home className="h-3 w-3" />
                      FSBO
                    </TabsTrigger>
                    <TabsTrigger value="expired-listings" className="flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      Expired
                    </TabsTrigger>
                    <TabsTrigger value="absentee-owners" className="flex items-center gap-1 text-xs">
                      <Users className="h-3 w-3" />
                      Absentee
                    </TabsTrigger>
                    <TabsTrigger value="pre-foreclosure" className="flex items-center gap-1 text-xs">
                      <TrendingUp className="h-3 w-3" />
                      Pre-Foreclosure
                    </TabsTrigger>
                    <TabsTrigger value="probate-content" className="flex items-center gap-1 text-xs">
                      <FileText className="h-3 w-3" />
                      Probate
                    </TabsTrigger>
                    <TabsTrigger value="divorce-content" className="flex items-center gap-1 text-xs">
                      <Phone className="h-3 w-3" />
                      Divorce
                    </TabsTrigger>
                    <TabsTrigger value="soi-content" className="flex items-center gap-1 text-xs">
                      <Users className="h-3 w-3" />
                      SOI
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="fsbo-content">
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <iframe
                        src="https://drive.google.com/embeddedfolderview?id=1tYrdrw4_zATfQDsiG_B8R7iX6JoSVayt#grid"
                        style={{ width: "100%", height: "600px", border: 0 }}
                        title="FSBO Content Library"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="expired-listings">
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <iframe
                        src="https://drive.google.com/embeddedfolderview?id=1G6SZedUC23xxlfvNUDjrqMZNWBDgPmoS#grid"
                        style={{ width: "100%", height: "600px", border: 0 }}
                        title="Expired Listings Content Library"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="absentee-owners">
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <iframe
                        src="https://drive.google.com/embeddedfolderview?id=1duf-xMuHsHK-GWkM8-VwsphbsjGlWuBS#grid"
                        style={{ width: "100%", height: "600px", border: 0 }}
                        title="Absentee Owners Content Library"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="pre-foreclosure">
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <iframe
                        src="https://drive.google.com/embeddedfolderview?id=1Y3538R-nEVf2Xo6qja7EU4dX6ZbVcnfV#grid"
                        style={{ width: "100%", height: "600px", border: 0 }}
                        title="Pre-Foreclosure Content Library"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="probate-content">
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <iframe
                        src="https://drive.google.com/embeddedfolderview?id=1Aa9mR9UEpFoAE-UfXAvDE9Kb23WLfklL#grid"
                        style={{ width: "100%", height: "600px", border: 0 }}
                        title="Probate Content Library"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="divorce-content">
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <iframe
                        src="https://drive.google.com/embeddedfolderview?id=1WfxT42P5vGo5Lbi5tj_dZCuRtp-V3JbS#grid"
                        style={{ width: "100%", height: "600px", border: 0 }}
                        title="Divorce Content Library"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="soi-content">
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <iframe
                        src="https://drive.google.com/embeddedfolderview?id=1AP69nTX7M9Q8vhN2zTtkz6A6Ow5HV1lP#grid"
                        style={{ width: "100%", height: "600px", border: 0 }}
                        title="Sphere of Influence Content Library"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Holiday Content */}
          {activeCategory === "holiday" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-black">Holiday Content</CardTitle>
                    <CardDescription>Seasonal and holiday-themed social media content</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src="https://drive.google.com/embeddedfolderview?id=1wheuuYTMTXaZyWnaiIHToY5lVkJuAPDf#grid"
                    style={{ width: "100%", height: "600px", border: 0 }}
                    title="Holiday Content Library"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Brand Studio Content */}
          {activeCategory === "brand-studio" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Palette className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-black">Brand Studio Content</CardTitle>
                    <CardDescription>Professional branded templates and designs</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src="https://drive.google.com/embeddedfolderview?id=1ZKwHpcRUj30olhjKhbVCVgc-8xSLkIwB#grid"
                    style={{ width: "100%", height: "600px", border: 0 }}
                    title="Brand Studio Content Library"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Video Content */}
          {activeCategory === "video" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <Video className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-black">Video Content</CardTitle>
                    <CardDescription>Video templates and content for social media</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-8 rounded-lg border-2 border-dashed border-gray-300 text-center">
                  <p className="text-gray-600 mb-4">Google Drive Folder Embed Placeholder</p>
                  <Badge variant="secondary">Video Content Library</Badge>
                  <p className="text-sm text-gray-500 mt-2">
                    This section will contain your Google Drive folder with video content and templates
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
