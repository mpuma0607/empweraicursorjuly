import { NextResponse } from "next/server"

interface Article {
  title: string
  link: string
  description: string
  pubDate: string
  source: string
  image?: string
}

export async function GET() {
  try {
    // RSS feed sources for real estate news
    const rssSources = [
      {
        url: "https://feeds.feedburner.com/realtor-mag-daily-news",
        name: "REALTOR Magazine",
      },
      {
        url: "https://www.inman.com/feed/",
        name: "Inman News",
      },
      {
        url: "https://www.housingwire.com/feed/",
        name: "HousingWire",
      },
      // Google News RSS for specific keywords
      {
        url: 'https://news.google.com/rss/search?q="real estate" OR "Century 21"&hl=en-US&gl=US&ceid=US:en',
        name: "Google News",
      },
    ]

    const allArticles: Article[] = []

    // Fetch articles from each RSS source
    for (const source of rssSources) {
      try {
        const response = await fetch(source.url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; RSS Reader)",
          },
        })

        if (!response.ok) continue

        const xmlText = await response.text()
        const articles = parseRSSFeed(xmlText, source.name)

        // Filter articles by keywords
        const filteredArticles = articles.filter((article) => {
          const content = `${article.title} ${article.description}`.toLowerCase()
          return content.includes("real estate") || content.includes("century 21")
        })

        allArticles.push(...filteredArticles)
      } catch (error) {
        console.error(`Error fetching from ${source.name}:`, error)
        continue
      }
    }

    // Sort by date (newest first) and limit to 20 articles
    const sortedArticles = allArticles
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, 20)

    return NextResponse.json({ articles: sortedArticles })
  } catch (error) {
    console.error("Error fetching RSS feeds:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}

function parseRSSFeed(xmlText: string, sourceName: string): Article[] {
  const articles: Article[] = []

  try {
    // Simple XML parsing for RSS feeds
    const itemMatches = xmlText.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || []

    itemMatches.forEach((item) => {
      const title = extractXMLContent(item, "title")
      const link = extractXMLContent(item, "link")
      const description = extractXMLContent(item, "description")
      const pubDate = extractXMLContent(item, "pubDate")

      if (title && link) {
        articles.push({
          title: cleanText(title),
          link: link.trim(),
          description: cleanText(description || ""),
          pubDate: pubDate || new Date().toISOString(),
          source: sourceName,
        })
      }
    })
  } catch (error) {
    console.error("Error parsing RSS feed:", error)
  }

  return articles
}

function extractXMLContent(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i")
  const match = xml.match(regex)
  return match ? match[1] : ""
}

function cleanText(text: string): string {
  return text
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&[^;]+;/g, " ") // Remove HTML entities
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim()
}
