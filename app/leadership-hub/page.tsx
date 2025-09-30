"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, BarChart3, ArrowRight, Crown, Target, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function LeadershipHubPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Crown className="w-8 h-8 text-yellow-600" />
              <h1 className="text-4xl font-bold text-gray-900">Leadership Hub</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools for recruiting, managing, and analyzing your real estate team performance.
            </p>
          </div>

          {/* Main Tools Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* RealRecruit */}
            <Card className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">RealRecruit</CardTitle>
                </div>
                <p className="text-gray-600">AI-Powered Recruiting Scripts</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Generate personalized recruiting scripts for different scenarios and agent levels.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• First outreach scripts</li>
                  <li>• Follow-up sequences</li>
                  <li>• Agent referral templates</li>
                  <li>• Personalized by agent level</li>
                </ul>
                <Link href="/leadership-hub/realrecruit">
                  <Button className="w-full group-hover:bg-blue-600 transition-colors">
                    Start Recruiting
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* RealRoster */}
            <Card className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">RealRoster</CardTitle>
                </div>
                <p className="text-gray-600">Agent Management System</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Upload and manage your agent roster with personalized outreach and goal tracking.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• CSV agent roster upload</li>
                  <li>• Personalized communication</li>
                  <li>• Goal tracking & management</li>
                  <li>• Agent performance insights</li>
                </ul>
                <Link href="/leadership-hub/realroster">
                  <Button className="w-full group-hover:bg-green-600 transition-colors">
                    Manage Agents
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* RealReports */}
            <Card className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl">RealReports</CardTitle>
                </div>
                <p className="text-gray-600">Financial Data Analysis</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Upload financial reports and get AI-powered insights, trends, and summaries.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• CSV/Excel report upload</li>
                  <li>• AI-powered insights</li>
                  <li>• Trend analysis</li>
                  <li>• Executive summaries</li>
                </ul>
                <Link href="/leadership-hub/realreports">
                  <Button className="w-full group-hover:bg-purple-600 transition-colors">
                    Analyze Reports
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-sm text-gray-600">Active Recruiting Campaigns</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-sm text-gray-600">Agents in Roster</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-sm text-gray-600">Reports Analyzed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
