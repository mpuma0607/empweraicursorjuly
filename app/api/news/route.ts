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
    // RSS feed sources for real estate news (all publicly accessible)
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
      {
        url: "https://www.nar.realtor/news/rss",
        name: "NAR News",
      },
      {
        url: "https://www.realtor.com/news/feed/",
        name: "Realtor.com News",
      },
      {
        url: "https://www.biggerpockets.com/blog/feed",
        name: "BiggerPockets",
      },
      {
        url: "https://www.rentals.com/blog/feed/",
        name: "Rentals.com",
      },
      {
        url: "https://www.apartmenttherapy.com/feed",
        name: "Apartment Therapy",
      },
      {
        url: "https://www.curbed.com/feed",
        name: "Curbed",
      },
      {
        url: "https://www.architecturaldigest.com/feed",
        name: "Architectural Digest",
      },
      // Reddit RSS feeds (publicly accessible)
      {
        url: "https://www.reddit.com/r/RealEstate/hot.rss",
        name: "Reddit Real Estate",
      },
      {
        url: "https://www.reddit.com/r/RealEstateInvesting/hot.rss",
        name: "Reddit Real Estate Investing",
      },
      // Industry-specific feeds
      {
        url: "https://www.mortgagenewsdaily.com/rss",
        name: "Mortgage News Daily",
      },
      {
        url: "https://www.nationalmortgagenews.com/rss",
        name: "National Mortgage News",
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

        // Filter articles by keywords and quality
        const filteredArticles = articles.filter((article) => {
          const content = `${article.title} ${article.description}`.toLowerCase()
          
          // Real estate related keywords
          const realEstateKeywords = [
            "real estate", "realtor", "realtors", "realty", "property", "properties",
            "housing", "home", "homes", "buyer", "buyers", "seller", "sellers",
            "listing", "listings", "mortgage", "mortgages", "refinance", "refinancing",
            "investment", "investing", "investor", "investors", "rental", "rentals",
            "landlord", "tenant", "tenants", "lease", "leasing", "commercial real estate",
            "residential", "condo", "condos", "townhouse", "townhouses", "apartment",
            "apartments", "zillow", "redfin", "century 21", "keller williams", "remax",
            "coldwell banker", "brokerage", "broker", "brokers", "agent", "agents",
            "mls", "multiple listing service", "appraisal", "appraisals", "inspection",
            "inspections", "closing", "closings", "escrow", "title", "titles",
            "foreclosure", "foreclosures", "short sale", "short sales", "fsbo",
            "probate", "probate real estate", "divorce real estate", "pre-foreclosure",
            "absentee owner", "absentee owners", "expired listing", "expired listings",
            "soi", "sphere of influence", "first time buyer", "first time buyers"
          ]
          
          // Check if article contains any real estate keywords
          const hasRealEstateKeyword = realEstateKeywords.some(keyword => 
            content.includes(keyword)
          )
          
          // Quality filters - exclude low-quality content
          const isLowQuality = content.includes("advertisement") || 
                              content.includes("sponsored") ||
                              content.includes("promoted") ||
                              content.includes("click here") ||
                              content.includes("read more") ||
                              article.title.length < 10 ||
                              article.description.length < 20
          
          return hasRealEstateKeyword && !isLowQuality
        })

        allArticles.push(...filteredArticles)
      } catch (error) {
        console.error(`Error fetching from ${source.name}:`, error)
        continue
      }
    }

    // Remove duplicates based on title similarity
    const uniqueArticles = allArticles.filter((article, index, self) => 
      index === self.findIndex(a => 
        a.title.toLowerCase().trim() === article.title.toLowerCase().trim()
      )
    )

    // Sort by date (newest first) and limit to 30 articles
    const sortedArticles = uniqueArticles
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, 30)

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
