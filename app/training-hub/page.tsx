"use client"

import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, ArrowRight, Monitor, BookOpen, Users, Target, Video, FileText, Settings } from "lucide-react"
import Link from "next/link"
import { useTenantConfig } from "@/hooks/useTenantConfig"

const trainingModules = [
  {
    title: "Moxi Works Training",
    href: "/training-hub/moxi-works",
    description: "Master the complete Moxi Works platform with comprehensive training modules",
    icon: Monitor,
    color: "bg-gradient-to-br from-blue-500 to-cyan-500",
  },
  {
    title: "Script Mastery",
    href: "/training-hub/script-mastery",
    description: "Master objection handling and conversion scripts for any situation",
    icon: BookOpen,
    color: "bg-gradient-to-br from-purple-500 to-indigo-500",
  },
  {
    title: "Buyer Process (6P's)",
    href: "/training-hub/buyer-process",
    description: "Our proven 6P's system for guiding buyers through the purchase process",
    icon: Target,
    color: "bg-gradient-to-br from-orange-500 to-yellow-500",
  },
  {
    title: "Listing Process (7P's)",
    href: "/training-hub/listing-process",
    description: "Complete 7P's system for securing and managing listings from start to finish",
    icon: Target,
    color: "bg-gradient-to-br from-green-500 to-emerald-500",
  },
  {
    title: "DISC/VAK Connection",
    href: "/training-hub/disc-vak",
    description: "Communication training to connect with any personality or learning style",
    icon: Users,
    color: "bg-gradient-to-br from-pink-500 to-red-500",
  },
]

const begginsTenantModules = [
  {
    title: "Daily Morning Huddles",
    href: "/training-hub/daily-morning-huddles",
    description: "Join our daily team huddles for motivation, updates, and training",
    icon: Video,
    color: "bg-gradient-to-br from-yellow-500 to-orange-500",
    tenants: ["century21-beggins"],
  },
  {
    title: "Buyer Broker Agreement Training",
    href: "/training-hub/buyer-broker-agreement-training",
    description: "Master the art of presenting and executing buyer broker agreements effectively",
    icon: FileText,
    color: "bg-gradient-to-br from-blue-600 to-indigo-600",
    tenants: ["century21-beggins"],
  },
  {
    title: "Dotloop Training",
    href: "/training-hub/dotloop-training",
    description: "Complete Dotloop mastery from setup to closing with interactive training modules",
    icon: Settings,
    color: "bg-gradient-to-br from-indigo-600 to-purple-600",
    tenants: ["century21-beggins"],
  },
]

export default function TrainingHubPage() {
  const tenantConfig = useTenantConfig()

  const filteredBegginsTenantModules = begginsTenantModules.filter(
    (module) => !module.tenants || module.tenants.includes(tenantConfig.id),
  )

  const allModules = [...filteredBegginsTenantModules, ...trainingModules]

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">Training Hub</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master your skills with comprehensive training programs designed to elevate your real estate business.
          </p>
        </div>

        {/* Training Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {allModules.map((module, index) => (
            <Link key={index} href={module.href} className="group">
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg group-hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 ${module.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <module.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-black mb-3 group-hover:text-blue-600 transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">{module.description}</p>
                    <div className="flex items-center justify-center text-blue-600 font-medium">
                      <span>Start Training</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
