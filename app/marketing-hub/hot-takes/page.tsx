"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, ExternalLink, Calendar, RefreshCw, Twitter, Facebook, Linkedin, Copy, Check, Search, Filter, MapPin, Tag } from "lucide-react"
import Link from "next/link"

interface Article {
  title: string
  link: string
  description: string
  pubDate: string
  source: string
  image?: string
  category?: string
  location?: string
}

export default function HotTakesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/news", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      if (!response.ok) throw new Error("Failed to fetch articles")
      const data = await response.json()
      setArticles(data.articles || [])
      setFilteredArticles(data.articles || [])
      setError(null)
    } catch (err) {
      setError("Failed to load articles. Please try again.")
      console.error("Error fetching articles:", err)
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort articles
  const filterAndSortArticles = () => {
    let filtered = [...articles]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.source.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(article => article.category === selectedCategory)
    }

    // Filter by location
    if (selectedLocation !== "all") {
      filtered = filtered.filter(article => 
        article.location && article.location.toLowerCase().includes(selectedLocation.toLowerCase())
      )
    }

    // Sort articles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        case "source":
          return a.source.localeCompare(b.source)
        default:
          return 0
      }
    })

    setFilteredArticles(filtered)
  }

  // Get unique categories and locations for filter dropdowns
  const categories = ["all", ...new Set(articles.map(a => a.category).filter(Boolean))]
  const locations = ["all", ...new Set(articles.map(a => a.location).filter(Boolean))]

  useEffect(() => {
    fetchArticles()
  }, [])

  useEffect(() => {
    filterAndSortArticles()
  }, [searchTerm, selectedCategory, selectedLocation, sortBy, articles])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return "Recent"
    }
  }

  const shareToTwitter = (article: Article) => {
    const text = `${article.title} - ${article.link}`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, "_blank", "width=600,height=400")
  }

  const shareToFacebook = (article: Article) => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(article.link)}`
    window.open(url, "_blank", "width=600,height=400")
  }

  const shareToLinkedIn = (article: Article) => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(article.link)}`
    window.open(url, "_blank", "width=600,height=400")
  }

  const copyLink = async (article: Article) => {
    try {
      await navigator.clipboard.writeText(article.link)
      setCopiedLink(article.link)
      setTimeout(() => setCopiedLink(null), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">Real Estate Hot Takes</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Stay ahead of the market with the latest real estate news, trends, and Century 21 updates. Share compelling
            stories with your network to establish yourself as a market expert.
          </p>

          <Button onClick={fetchArticles} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh News
          </Button>
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Search Articles</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <Tag className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <MapPin className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location === "all" ? "All Locations" : location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date (Newest)</SelectItem>
                    <SelectItem value="title">Title (A-Z)</SelectItem>
                    <SelectItem value="source">Source</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <p>Showing {filteredArticles.length} of {articles.length} articles</p>
                <p className="text-xs text-gray-500 mt-1">
                  All articles are from the last 90 days • Updated in real-time
                </p>
              </div>
              {(searchTerm || selectedCategory !== "all" || selectedLocation !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                    setSelectedLocation("all")
                    setSortBy("date")
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading latest real estate news...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchArticles} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, index) => (
              <Card key={index} className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-6 flex flex-col h-full">
                  {/* Article Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {article.source}
                    </span>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(article.pubDate)}
                    </div>
                  </div>

                  {/* Category and Location Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {article.category && (
                      <Badge variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                      </Badge>
                    )}
                    {article.location && (
                      <Badge variant="outline" className="text-xs">
                        <MapPin className="h-3 w-3 mr-1" />
                        {article.location}
                      </Badge>
                    )}
                  </div>

                  {/* Article Content */}
                  <h3 className="text-lg font-bold text-black mb-3 line-clamp-3 flex-grow">{article.title}</h3>

                  {article.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.description}</p>
                  )}

                  {/* Actions */}
                  <div className="mt-auto space-y-3">
                    <Link href={article.link} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Read Full Article
                      </Button>
                    </Link>

                    {/* Share Options */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs font-medium text-gray-500">Share:</span>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => shareToTwitter(article)} className="p-2">
                          <Twitter className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => shareToFacebook(article)} className="p-2">
                          <Facebook className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => shareToLinkedIn(article)} className="p-2">
                          <Linkedin className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => copyLink(article)} className="p-2">
                          {copiedLink === article.link ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Articles State */}
        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
            <p className="text-gray-500 mb-4">Try refreshing to load the latest real estate news.</p>
            <Button onClick={fetchArticles} variant="outline">
              Refresh News
            </Button>
          </div>
        )}

        {/* No Filtered Results State */}
        {!loading && !error && articles.length > 0 && filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles match your filters</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search terms or filters to find more articles.</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
                setSelectedLocation("all")
                setSortBy("date")
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
