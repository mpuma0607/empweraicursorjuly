"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Users, Eye, Activity, TrendingUp, User, Clock, Calendar, X } from "lucide-react"

interface AnalyticsData {
  pageViews: Array<{
    page_path: string
    views: number
    unique_visitors: number
  }>
  dailyStats: Array<{
    date: string
    page_views: number
    unique_visitors: number
  }>
  topEvents: Array<{
    event_type: string
    count: number
  }>
  totalStats: {
    total_sessions: number
    total_page_views: number
  }
}

interface UserAnalyticsData {
  user_email: string
  total_sessions: number
  total_page_views: number
  last_login: string
  first_login: string
  total_hours: number
}

interface UserDetailData {
  sessions: Array<{
    session_id: string
    session_start: string
    session_end: string
    pages_viewed: number
    session_duration_minutes: number
  }>
  pageViews: Array<{
    page_path: string
    views: number
    last_visited: string
  }>
  events: Array<{
    event_type: string
    count: number
    last_occurred: string
  }>
  dailyActivity: Array<{
    date: string
    sessions: number
    page_views: number
    total_hours: number
  }>
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [userData, setUserData] = useState<UserAnalyticsData[]>([])
  const [selectedUser, setSelectedUser] = useState<UserDetailData | null>(null)
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [userLoading, setUserLoading] = useState(false)
  const [timeRange, setTimeRange] = useState("7")

  const fetchAnalytics = async (days: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics?days=${days}`)
      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserAnalytics = async (days: string) => {
    try {
      const response = await fetch(`/api/admin/analytics/users?days=${days}`)
      const userAnalyticsData = await response.json()
      setUserData(userAnalyticsData)
    } catch (error) {
      console.error("Failed to fetch user analytics:", error)
    }
  }

  const fetchUserDetail = async (userEmail: string, days: string) => {
    setUserLoading(true)
    try {
      const response = await fetch(`/api/admin/analytics/users/${encodeURIComponent(userEmail)}?days=${days}`)
      const userDetailData = await response.json()
      setSelectedUser(userDetailData)
      setSelectedUserEmail(userEmail)
    } catch (error) {
      console.error("Failed to fetch user detail:", error)
    } finally {
      setUserLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics(timeRange)
    fetchUserAnalytics(timeRange)
  }, [timeRange])

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading analytics...</div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Failed to load analytics data</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track user behavior and site performance</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Last 24 hours</SelectItem>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalStats.total_sessions}</div>
            <p className="text-xs text-muted-foreground">Unique visitors in the last {timeRange} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalStats.total_page_views}</div>
            <p className="text-xs text-muted-foreground">Total page views in the last {timeRange} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Pages/Session</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.totalStats.total_sessions > 0
                ? (data.totalStats.total_page_views / data.totalStats.total_sessions).toFixed(1)
                : "0"}
            </div>
            <p className="text-xs text-muted-foreground">Average pages per session</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.topEvents.reduce((sum, event) => sum + event.count, 0)}</div>
            <p className="text-xs text-muted-foreground">User interactions tracked</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="pages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pages">Page Views</TabsTrigger>
          <TabsTrigger value="daily">Daily Stats</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="users">User Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Most Visited Pages</CardTitle>
              <CardDescription>Pages ranked by total views and unique visitors</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page Path</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                    <TableHead className="text-right">Unique Visitors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.pageViews.map((page, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{page.page_path}</TableCell>
                      <TableCell className="text-right">{page.views}</TableCell>
                      <TableCell className="text-right">{page.unique_visitors}</TableCell>
                    </TableRow>
                  ))}
                  {data.pageViews.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No page views recorded
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Statistics</CardTitle>
              <CardDescription>Daily breakdown of page views and unique visitors</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Page Views</TableHead>
                    <TableHead className="text-right">Unique Visitors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.dailyStats.map((day, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{new Date(day.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">{day.page_views}</TableCell>
                      <TableCell className="text-right">{day.unique_visitors}</TableCell>
                    </TableRow>
                  ))}
                  {data.dailyStats.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No daily stats available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Events</CardTitle>
              <CardDescription>Most frequent user interactions and events</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Type</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.topEvents.map((event, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <Badge variant="outline">{event.event_type}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{event.count}</TableCell>
                    </TableRow>
                  ))}
                  {data.topEvents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground">
                        No events recorded
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Analytics</CardTitle>
              <CardDescription>Individual user activity and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Email</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Page Views</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userData.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{user.user_email}</TableCell>
                      <TableCell>{user.total_sessions}</TableCell>
                      <TableCell>{user.total_page_views}</TableCell>
                      <TableCell>{user.total_hours ? user.total_hours.toFixed(1) : '0'}</TableCell>
                      <TableCell>
                        {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => fetchUserDetail(user.user_email, timeRange)}
                        >
                          <User className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* User Detail Modal */}
          {selectedUser && selectedUserEmail && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  User Details: {selectedUserEmail}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(null)
                      setSelectedUserEmail(null)
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
                <CardDescription>Detailed analytics for this user</CardDescription>
              </CardHeader>
              <CardContent>
                {userLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-lg">Loading user details...</div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* User Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{selectedUser.sessions.length}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {selectedUser.pageViews.reduce((sum, pv) => sum + pv.views, 0)}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {selectedUser.events.reduce((sum, event) => sum + event.count, 0)}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recent Sessions */}
                    <div>
                      <h4 className="font-semibold mb-3">Recent Sessions</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Session Start</TableHead>
                            <TableHead>Duration (min)</TableHead>
                            <TableHead>Pages Viewed</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedUser.sessions.slice(0, 5).map((session, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {new Date(session.session_start).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                {session.session_duration_minutes ? session.session_duration_minutes.toFixed(1) : 'N/A'}
                              </TableCell>
                              <TableCell>{session.pages_viewed}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Most Visited Pages */}
                    <div>
                      <h4 className="font-semibold mb-3">Most Visited Pages</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Page Path</TableHead>
                            <TableHead>Views</TableHead>
                            <TableHead>Last Visited</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedUser.pageViews.slice(0, 10).map((pageView, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{pageView.page_path}</TableCell>
                              <TableCell>{pageView.views}</TableCell>
                              <TableCell>
                                {new Date(pageView.last_visited).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* User Events */}
                    <div>
                      <h4 className="font-semibold mb-3">User Events</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Event Type</TableHead>
                            <TableHead>Count</TableHead>
                            <TableHead>Last Occurred</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedUser.events.map((event, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{event.event_type}</TableCell>
                              <TableCell>{event.count}</TableCell>
                              <TableCell>
                                {new Date(event.last_occurred).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button onClick={() => {
          fetchAnalytics(timeRange)
          fetchUserAnalytics(timeRange)
        }} variant="outline">
          <TrendingUp className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>
    </div>
  )
}
