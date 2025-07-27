"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Building2, Download, Palette } from "lucide-react"
import { redirect } from "next/navigation"

const logoCategories = [
  {
    id: "c21-beggins",
    title: "Century 21 Beggins Logos",
    description: "Official Century 21 Beggins branded logos and assets",
    color: "bg-black",
    driveUrl: "https://drive.google.com/embeddedfolderview?id=1JPK2bZibjRGi4ZaQl2KAbCgNPkrVCxUF#grid",
  },
  {
    id: "c21-list-with-beggins",
    title: "Century 21 List With Beggins Logos",
    description: "List With Beggins campaign logos and branding assets",
    color: "bg-green-600",
    driveUrl: "https://drive.google.com/embeddedfolderview?id=PLACEHOLDER-LIST-WITH-BEGGINS#grid",
  },
  {
    id: "c21-be3",
    title: "Century 21 BE3 Logos",
    description: "Century 21 BE3 branded logos and marketing materials",
    color: "bg-blue-600",
    driveUrl: "https://drive.google.com/embeddedfolderview?id=PLACEHOLDER-BE3-LOGOS#grid",
  },
  {
    id: "c21-general",
    title: "Century 21 Logos",
    description: "General Century 21 corporate logos and brand assets",
    color: "bg-yellow-600",
    driveUrl: "https://drive.google.com/embeddedfolderview?id=PLACEHOLDER-C21-GENERAL#grid",
  },
  {
    id: "c21-award",
    title: "Century 21 Award Logos",
    description: "Century 21 award and recognition logos and badges",
    color: "bg-purple-600",
    driveUrl: "https://drive.google.com/embeddedfolderview?id=PLACEHOLDER-AWARD-LOGOS#grid",
  },
]

export default function Century21LogosPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  redirect("/marketing-hub/brokerage-logos")

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-black to-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">Century 21 Logos</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access official Century 21 Beggins logos, branding assets, and marketing materials for your business needs.
          </p>
        </div>

        {/* Logo Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {logoCategories.map((category) => (
            <Dialog key={category.id}>
              <DialogTrigger asChild>
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 cursor-pointer group">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <div
                        className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Palette className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-black mb-3 group-hover:text-blue-600 transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-6">{category.description}</p>
                      <div className="flex items-center justify-center text-blue-600 font-medium">
                        <span>View Logos</span>
                        <Download className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-black flex items-center gap-3">
                    <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center`}>
                      <Palette className="h-4 w-4 text-white" />
                    </div>
                    {category.title}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">{category.description}</DialogDescription>
                </DialogHeader>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src={category.driveUrl}
                    width="100%"
                    height="600"
                    frameBorder="0"
                    className="w-full"
                    title={`${category.title} - Google Drive Folder`}
                  />
                </div>
                <div className="text-sm text-gray-500 text-center">
                  Click on any logo to download it directly from Google Drive
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* Usage Guidelines */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-black">Logo Usage Guidelines</CardTitle>
              <CardDescription className="text-gray-600">
                Important guidelines for using Century 21 Beggins logos and branding materials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-black mb-3">✅ Approved Uses</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Business cards and stationery</li>
                    <li>• Marketing materials and flyers</li>
                    <li>• Website and social media profiles</li>
                    <li>• Email signatures</li>
                    <li>• Yard signs and property signage</li>
                    <li>• Professional presentations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-black mb-3">❌ Prohibited Uses</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Modifying or altering logo colors</li>
                    <li>• Stretching or distorting logos</li>
                    <li>• Using low-resolution versions</li>
                    <li>• Combining with competitor logos</li>
                    <li>• Using for personal, non-business purposes</li>
                    <li>• Placing on inappropriate backgrounds</li>
                  </ul>
                </div>
              </div>
              <div className="border-t pt-6">
                <h4 className="font-semibold text-black mb-3">📋 Best Practices</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <strong>Clear Space:</strong> Always maintain adequate white space around logos
                  </div>
                  <div>
                    <strong>File Formats:</strong> Use PNG for web, EPS/AI for print materials
                  </div>
                  <div>
                    <strong>Size Requirements:</strong> Ensure logos are legible at minimum sizes
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto border-0 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-black mb-4">Need Custom Branding?</h3>
              <p className="text-gray-600 mb-6">
                For custom logo variations, special branding requests, or questions about logo usage, contact our
                marketing team.
              </p>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Email:</strong> marketing@c21be.com
                </p>
                <p>
                  <strong>Phone:</strong> (555) 123-4567
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
