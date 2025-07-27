"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, Search, Clock } from "lucide-react"
import { useTenantConfig } from "@/contexts/tenant-context"

interface Video {
  id: string
  title: string
  description: string
  publishedAt: string
  thumbnail: string
  playlistId: string
  day: string
}

const PLAYLISTS = {
  Monday: "PLnJRpgqKE8_NhC8zVWZgH5QlWeS4z2tU1",
  Tuesday: "PLnJRpgqKE8_Ou7CohCjNkTBIS71lO4QUN",
  Wednesday: "PLnJRpgqKE8_MeOquVJ33PeLyvDfDVX4eD",
  Thursday: "PLnJRpgqKE8_PcAre7YSP5dcQ20wuou0ad",
  Friday: "PLnJRpgqKE8_NYpSQCtLhGUIBOC0rRq3UF",
}

export default function DailyMorningHuddlesPage() {
  const tenantConfig = useTenantConfig()
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [allVideos, setAllVideos] = useState<Video[]>([])
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([])
  const [latestVideo, setLatestVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>("")

  // Redirect if not Beggins tenant
  useEffect(() => {
    if (tenantConfig && tenantConfig.id !== "century21-beggins") {
      window.location.href = "/training-hub"
    }
  }, [tenantConfig])

  // Fetch videos from our API route
  useEffect(() => {
    const fetchAllVideos = async () => {
      try {
        const response = await fetch("/api/youtube-videos")
        const data = await response.json()

        if (data.videos) {
          setAllVideos(data.videos)
          setLatestVideo(data.latest)
        }
      } catch (error) {
        console.error("Error fetching videos:", error)
      } finally {
        setLoading(false)
      }
    }

    if (tenantConfig?.id === "century21-beggins") {
      fetchAllVideos()
    }
  }, [tenantConfig])

  // Filter videos based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredVideos([])
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = allVideos.filter(
      (video) => video.title.toLowerCase().includes(query) || video.description.toLowerCase().includes(query),
    )
    setFilteredVideos(filtered)
  }, [searchQuery, allVideos])

  const openPlaylistModal = (day: string) => {
    setSelectedDay(day)
    setSelectedPlaylist(PLAYLISTS[day as keyof typeof PLAYLISTS])
  }

  if (tenantConfig?.id !== "century21-beggins") {
    return null
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Calendar className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">Daily Morning Huddles</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access replays of our daily training sessions from Monday through Friday. Stay up-to-date with the latest
            strategies and insights.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search training videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="max-w-6xl mx-auto mb-12">
            <h3 className="text-2xl font-bold mb-6">Search Results ({filteredVideos.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <Card key={video.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-video mb-4 bg-gray-100 rounded-lg overflow-hidden">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.id}`}
                        title={video.title}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                    <h4 className="font-semibold text-sm mb-2 line-clamp-2">{video.title}</h4>
                    <p className="text-xs text-blue-600 font-medium mb-1">{video.day}</p>
                    <p className="text-xs text-gray-400">{new Date(video.publishedAt).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Latest Video */}
        {!searchQuery && latestVideo && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="h-6 w-6 text-blue-600" />
              <h3 className="text-2xl font-bold">Latest Training</h3>
            </div>
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${latestVideo.id}`}
                      title={latestVideo.title}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-3">{latestVideo.title}</h4>
                    <p className="text-blue-600 font-medium mb-2">{latestVideo.day} Training</p>
                    <p className="text-gray-600 mb-4">{new Date(latestVideo.publishedAt).toLocaleDateString()}</p>
                    <p className="text-gray-700 line-clamp-4">{latestVideo.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Day Selection Buttons */}
        {!searchQuery && (
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">Select Training Day</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.keys(PLAYLISTS).map((day) => (
                <Dialog key={day}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => openPlaylistModal(day)}
                      className="h-24 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
                    >
                      <Calendar className="h-6 w-6 mb-2" />
                      <span className="font-semibold">{day}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">{day} Training Sessions</DialogTitle>
                    </DialogHeader>
                    <div className="mt-6">
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6">
                        <iframe
                          src={`https://www.youtube.com/embed/videoseries?list=${selectedPlaylist}`}
                          title={`${day} Training Playlist`}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      </div>
                      <p className="text-gray-600 text-center">
                        All {day} training sessions will play automatically in sequence.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading training videos...</p>
          </div>
        )}
      </div>
    </div>
  )
}
