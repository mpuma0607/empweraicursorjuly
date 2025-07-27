"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Megaphone, Target, GraduationCap, Briefcase, Users, ShoppingBag, User, BookOpen } from "lucide-react"
import Link from "next/link"
import { useTenantConfig } from "@/contexts/tenant-context"

export default function PortalPage() {
  const tenantConfig = useTenantConfig()

  const hubs = [
    {
      title: "AI Hub",
      description: "Leverage artificial intelligence to supercharge your real estate business",
      icon: Brain,
      href: "/ai-hub",
      color: "bg-gradient-to-br from-purple-600 to-indigo-600",
    },
    {
      title: "Marketing Hub",
      description: "Professional marketing materials and social media content",
      icon: Megaphone,
      href: "/marketing-hub",
      color: "bg-gradient-to-br from-pink-600 to-rose-600",
    },
    {
      title: "Prospecting Hub",
      description: "Find and convert leads with proven prospecting strategies",
      icon: Target,
      href: "/prospecting-hub",
      color: "bg-gradient-to-br from-green-600 to-emerald-600",
    },
    {
      title: "Training Hub",
      description: "Comprehensive training programs to elevate your skills",
      icon: GraduationCap,
      href: "/training-hub",
      color: "bg-gradient-to-br from-blue-600 to-cyan-600",
    },
    ...(tenantConfig.id === "century21-beggins"
      ? [
          {
            title: "Onboarding Hub",
            description: "Get started with comprehensive onboarding and setup guides",
            icon: BookOpen,
            href: "/onboarding-hub",
            color: "bg-gradient-to-br from-orange-600 to-amber-600",
          },
        ]
      : []),
    {
      title: "Services Hub",
      description: "Professional services to grow your business",
      icon: Briefcase,
      href: "/services-hub",
      color: "bg-gradient-to-br from-teal-600 to-green-600",
    },
    {
      title: "Networking Hub",
      description: "Connect with other real estate professionals",
      icon: Users,
      href: "/networking-hub",
      color: "bg-gradient-to-br from-indigo-600 to-purple-600",
    },
    {
      title: "Gear Hub",
      description: "Essential tools and equipment for real estate professionals",
      icon: ShoppingBag,
      href: "/gear-hub",
      color: "bg-gradient-to-br from-gray-600 to-slate-600",
    },
    {
      title: "Profile",
      description: "Manage your profile and view your AI creations",
      icon: User,
      href: "/profile",
      color: "bg-gradient-to-br from-amber-600 to-orange-600",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-indigo-900 text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Welcome to Your Portal</h1>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px bg-[#b6a888] w-16"></div>
            <p className="text-xl text-[#b6a888] font-medium tracking-wide">EMPOWER • EDUCATE • ENCOURAGE</p>
            <div className="h-px bg-[#b6a888] w-16"></div>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Access your complete suite of real estate superpowers. Choose your hub and start transforming your business
            today.
          </p>
        </div>
      </section>

      {/* Hubs Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Choose Your Hub</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Each hub is designed to elevate different aspects of your real estate business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {hubs.map((hub, index) => (
              <Card
                key={index}
                className="h-full bg-white hover:bg-gray-50 transition-all duration-300 border-0 shadow-lg hover:shadow-2xl group"
              >
                <CardContent className="p-8 h-full">
                  <div className="flex flex-col h-full text-center">
                    <div
                      className={`w-20 h-20 ${hub.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <hub.icon className="h-10 w-10 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-black mb-3 group-hover:text-[#b6a888] transition-colors">
                      {hub.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">{hub.description}</p>

                    <Link href={hub.href} className="w-full mt-auto">
                      <Button className="w-full bg-[#b6a888] hover:bg-[#a39577] text-white">Enter {hub.title}</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
