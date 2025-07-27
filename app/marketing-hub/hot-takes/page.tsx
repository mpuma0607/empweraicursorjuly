"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, ExternalLink, Calendar, RefreshCw, Twitter, Facebook, Linkedin, Copy, Check } from "lucide-react"
import Link from "next/link"

interface Article {
  title: string
  link: string
  description: string
  pubDate: string
  source: string
  image?: string
}

export default function HotTakesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState<string | null>(null)

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/news")
      if (!response.ok) throw new Error("Failed to fetch articles")
      const data = await response.json()
      setArticles(data.articles || [])
      setError(null)
    } catch (err) {
      setError("Failed to load articles. Please try again.")
      console.error("Error fetching articles:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

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
            {articles.map((article, index) => (
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
      </div>
    </div>
  )
}
