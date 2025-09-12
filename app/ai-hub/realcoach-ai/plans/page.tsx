"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Plus, 
  Calendar, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  BarChart3,
  ArrowRight,
  Eye,
  Edit,
  Trash2,
  Star,
  Award,
  Users,
  DollarSign
} from "lucide-react"
import { getUserRealCoachPlans, getPlanProgressSummary } from "@/lib/realcoach-plan-actions"
import { RealCoachPlan } from "@/lib/realcoach-plan-actions"

export default function RealCoachPlansPage() {
  const [plans, setPlans] = useState<RealCoachPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [progressData, setProgressData] = useState<Record<string, any>>({})

  // Mock user ID - in real app, get from auth context
  const userId = "user123"

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      setLoading(true)
      const userPlans = await getUserRealCoachPlans(userId)
      setPlans(userPlans)
      
      // Load progress data for each plan
      const progressPromises = userPlans.map(async (plan) => {
        const progress = await getPlanProgressSummary(plan.id, userId)
        return { planId: plan.id, progress }
      })
      
      const progressResults = await Promise.all(progressPromises)
      const progressMap = progressResults.reduce((acc, { planId, progress }) => {
        acc[planId] = progress
        return acc
      }, {} as Record<string, any>)
      
      setProgressData(progressMap)
    } catch (error) {
      console.error('Error loading plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'archived': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <TrendingUp className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'draft': return <Edit className="h-4 w-4" />
      case 'archived': return <Clock className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your RealCoach plans...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My RealCoach Plans</h1>
              <p className="text-gray-600 mt-2">Manage and track your personalized action plans</p>
            </div>
            <Link href="/ai-hub/realcoach-ai">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New Plan
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {plans.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Plans Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first RealCoach AI plan to get personalized strategies and track your progress.
            </p>
            <Link href="/ai-hub/realcoach-ai">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Plan
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const progress = progressData[plan.id]
              const profile = plan.profile_data
              
              return (
                <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{plan.plan_name}</CardTitle>
                        <CardDescription>
                          Created {new Date(plan.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge className={`${getStatusColor(plan.status)} flex items-center gap-1`}>
                        {getStatusIcon(plan.status)}
                        {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Progress Overview */}
                    {progress && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Progress</span>
                          <span className="text-sm font-semibold text-blue-600">
                            {progress.completionRate}%
                          </span>
                        </div>
                        <Progress value={progress.completionRate} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{progress.completedActivities} completed</span>
                          <span>{progress.totalActivities} total</span>
                        </div>
                      </div>
                    )}

                    {/* Plan Summary */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{profile.targetUnits} closings this year</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium">${profile.targetGCI?.toLocaleString() || '0'} GCI target</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">
                          {Object.keys(profile.kpiTargets || {}).length} KPI targets
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Link href={`/ai-hub/realcoach-ai/plan/${plan.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          View Plan
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
