"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Users, 
  BarChart3,
  ArrowLeft,
  Download,
  Mail,
  Share2,
  PlayCircle,
  BookOpen,
  Settings,
  Star,
  Zap,
  Lightbulb,
  Award,
  FileText,
  Eye,
  Heart,
  Building2,
  DollarSign,
  Phone,
  MessageSquare,
  Home,
  Video,
  AlertTriangle,
  Info
} from "lucide-react"
import { getRealCoachPlan, getPlanProgressSummary, savePlanProgress } from "@/lib/realcoach-plan-actions"
import { RealCoachPlan, PlanProgress } from "@/lib/realcoach-plan-actions"
import Link from "next/link"

export default function RealCoachPlanPage() {
  const params = useParams()
  const planId = params.id as string
  
  const [plan, setPlan] = useState<RealCoachPlan | null>(null)
  const [progress, setProgress] = useState<PlanProgress[]>([])
  const [progressSummary, setProgressSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentWeek, setCurrentWeek] = useState(1)
  const [activeTab, setActiveTab] = useState('overview')

  // Mock user ID - in real app, get from auth context
  const userId = "user123"

  useEffect(() => {
    loadPlan()
  }, [planId])

  const loadPlan = async () => {
    try {
      setLoading(true)
      const planData = await getRealCoachPlan(planId, userId)
      if (planData) {
        setPlan(planData)
        loadProgress(planId)
      }
    } catch (error) {
      console.error('Error loading plan:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadProgress = async (planId: string) => {
    try {
      const summary = await getPlanProgressSummary(planId, userId)
      setProgressSummary(summary)
    } catch (error) {
      console.error('Error loading progress:', error)
    }
  }

  const handleActivityToggle = async (activityType: string, activityName: string, completed: boolean) => {
    try {
      await savePlanProgress(planId, userId, currentWeek, 'Monday', activityType, activityName, completed)
      loadProgress(planId)
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your RealCoach plan...</p>
        </div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Plan Not Found</h1>
          <p className="text-gray-600 mb-6">This RealCoach plan could not be found or you don't have access to it.</p>
          <Link href="/ai-hub/realcoach-ai">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to RealCoach AI
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const profile = plan.profile_data
  const planData = plan.plan_data

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/ai-hub/realcoach-ai">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{plan.plan_name}</h1>
                <p className="text-gray-600">Created {new Date(plan.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      {progressSummary && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{progressSummary.completionRate}%</div>
                  <div className="text-sm text-gray-600">Overall Progress</div>
                  <Progress value={progressSummary.completionRate} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{progressSummary.completedActivities}</div>
                  <div className="text-sm text-gray-600">Completed Activities</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-600">{progressSummary.totalActivities}</div>
                  <div className="text-sm text-gray-600">Total Activities</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{progressSummary.weeklyProgress.length}</div>
                  <div className="text-sm text-gray-600">Weeks Tracked</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="playbook">Interactive Playbook</TabsTrigger>
            <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* North Star */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-6 w-6 text-yellow-600" />
                    Your North Star
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-6 bg-yellow-50 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-800">{profile.targetUnits} Closings</div>
                    <div className="text-lg text-yellow-700">This Year</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-semibold text-gray-900">Annual GCI</div>
                      <div className="text-gray-600">${profile.targetGCI?.toLocaleString() || '0'}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Avg Price Point</div>
                      <div className="text-gray-600">${profile.avgPricePoint?.toLocaleString() || '0'}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Why Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-6 w-6 text-red-600" />
                    Your Why
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="font-semibold text-gray-900">Primary Motivation</div>
                      <div className="text-gray-600">{profile.whyPrimary || 'Not specified'}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Secondary Motivation</div>
                      <div className="text-gray-600">{profile.whySecondary || 'Not specified'}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Cost of Inaction</div>
                      <div className="text-gray-600">{profile.inactionCost || 'Not specified'}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly KPI Targets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-purple-600" />
                  Weekly KPI Targets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(profile.kpiTargets || {}).map(([kpi, target]) => (
                    <div key={kpi} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium capitalize">{kpi.replace('_', ' ')}</span>
                      <span className="font-bold text-purple-600">{target}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Interactive Playbook Tab */}
          <TabsContent value="playbook" className="space-y-6">
            <InteractivePlaybook 
              profile={profile} 
              planData={planData}
              onActivityToggle={handleActivityToggle}
              currentWeek={currentWeek}
              onWeekChange={setCurrentWeek}
            />
          </TabsContent>

          {/* Progress Tracking Tab */}
          <TabsContent value="progress" className="space-y-6">
            <ProgressTracking 
              progressSummary={progressSummary}
              currentWeek={currentWeek}
              onWeekChange={setCurrentWeek}
            />
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <ResourcesSection profile={profile} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Interactive Playbook Component
function InteractivePlaybook({ profile, planData, onActivityToggle, currentWeek, onWeekChange }: any) {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  
  const weeklyActivities = [
    { day: 'Monday', activities: ['Prospecting calls', 'Follow-up calls', 'Social media outreach'] },
    { day: 'Tuesday', activities: ['Text messaging', 'Email follow-ups', 'Content creation'] },
    { day: 'Wednesday', activities: ['Open house prep', 'Market research', 'Client meetings'] },
    { day: 'Thursday', activities: ['Networking events', 'Referral asks', 'Database cleanup'] },
    { day: 'Friday', activities: ['Week review', 'Next week planning', 'Team meetings'] },
  ]

  return (
    <div className="space-y-6">
      {/* Week Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Week {currentWeek} Playbook</CardTitle>
          <CardDescription>Track your daily activities and mark them as complete</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4].map(week => (
              <Button
                key={week}
                variant={currentWeek === week ? 'default' : 'outline'}
                onClick={() => onWeekChange(week)}
              >
                Week {week}
              </Button>
            ))}
          </div>

          {/* Daily Activities */}
          <div className="space-y-4">
            {weeklyActivities.map((dayData, dayIndex) => (
              <Card key={dayData.day}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {dayData.day}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dayData.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-gray-400" />
                          <span className="font-medium">{activity}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onActivityToggle('daily_activity', activity, true)}
                        >
                          Mark Complete
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Progress Tracking Component
function ProgressTracking({ progressSummary, currentWeek, onWeekChange }: any) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Progress Tracking</CardTitle>
          <CardDescription>Monitor your weekly progress and completion rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {progressSummary?.weeklyProgress.map((week: any) => (
              <div key={week.week} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold">Week {week.week}</div>
                  <div className="text-sm text-gray-600">
                    {week.completed} of {week.total} activities completed
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={(week.completed / week.total) * 100} className="w-32" />
                  <span className="font-semibold">{Math.round((week.completed / week.total) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Resources Section Component
function ResourcesSection({ profile }: any) {
  const resources = [
    {
      title: 'ScriptIT AI',
      description: 'Generate scripts for calls and objections',
      icon: FileText,
      color: 'bg-blue-500',
      link: '/ai-hub/scriptit-ai'
    },
    {
      title: 'IdeaHub AI',
      description: 'Get content ideas for social media',
      icon: Lightbulb,
      color: 'bg-yellow-500',
      link: '/ai-hub/ideahub-ai'
    },
    {
      title: 'MyMarket AI',
      description: 'Market analysis and insights',
      icon: BarChart3,
      color: 'bg-green-500',
      link: '/ai-hub/mymarket-ai'
    },
    {
      title: 'Negotiation Mastery',
      description: 'Advanced negotiation training',
      icon: Award,
      color: 'bg-purple-500',
      link: '/training-hub/negotiation-mastery'
    },
    {
      title: 'Social Media Mastery',
      description: 'Social media marketing course',
      icon: Share2,
      color: 'bg-pink-500',
      link: '/training-hub/social-media-mastery'
    }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recommended Resources</CardTitle>
          <CardDescription>Tools and training courses to support your goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource, index) => (
              <Link key={index} href={resource.link}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${resource.color} text-white`}>
                        <resource.icon className="h-5 w-5" />
                      </div>
                      <div className="font-semibold">{resource.title}</div>
                    </div>
                    <p className="text-sm text-gray-600">{resource.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
