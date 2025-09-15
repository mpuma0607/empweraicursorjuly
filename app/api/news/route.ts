import { NextResponse } from "next/server"

export const revalidate = 0 // Disable caching

// Function to extract location from article content
function extractLocation(content: string): string | undefined {
  const locationPatterns = [
    // US States
    /\b(Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming)\b/gi,
    // Major US Cities
    /\b(New York|Los Angeles|Chicago|Houston|Phoenix|Philadelphia|San Antonio|San Diego|Dallas|San Jose|Austin|Jacksonville|Fort Worth|Columbus|Charlotte|San Francisco|Indianapolis|Seattle|Denver|Washington|Boston|El Paso|Nashville|Detroit|Oklahoma City|Portland|Las Vegas|Memphis|Louisville|Baltimore|Milwaukee|Albuquerque|Tucson|Fresno|Sacramento|Mesa|Kansas City|Atlanta|Long Beach|Colorado Springs|Raleigh|Miami|Virginia Beach|Omaha|Oakland|Minneapolis|Tulsa|Arlington|Tampa|New Orleans)\b/gi,
    // Canadian Provinces
    /\b(Ontario|Quebec|British Columbia|Alberta|Manitoba|Saskatchewan|Nova Scotia|New Brunswick|Newfoundland and Labrador|Prince Edward Island|Northwest Territories|Nunavut|Yukon)\b/gi,
    // Major Canadian Cities
    /\b(Toronto|Montreal|Vancouver|Calgary|Edmonton|Ottawa|Winnipeg|Quebec City|Hamilton|Kitchener|London|Victoria|Halifax|Oshawa|Windsor|Saskatoon|Regina|Sherbrooke|St. John's|Barrie|Kelowna|Abbotsford|Kingston|Guelph|Cambridge|Thunder Bay|Waterloo|Sarnia|Brantford|Peterborough|Kawartha Lakes|Belleville|Sault Ste. Marie|North Bay|Cornwall|Chatham-Kent|Welland|Timmins|Sarnia|Sault Ste. Marie|North Bay|Cornwall|Chatham-Kent|Welland|Timmins)\b/gi
  ]
  
  for (const pattern of locationPatterns) {
    const matches = content.match(pattern)
    if (matches && matches.length > 0) {
      return matches[0]
    }
  }
  
  return undefined
}

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

export async function GET() {
  try {
    console.log("Fetching real estate news from improved sources...")
    
    // RSS feed sources for real estate news (FREE and publicly accessible only)
    const rssSources = [
      // Primary industry news sources (FREE)
      {
        url: "https://feeds.feedburner.com/inmannews",
        name: "Inman News",
        category: "industry"
      },
      {
        url: "https://feeds.feedburner.com/realtor-mag-daily-news",
        name: "REALTOR Magazine",
        category: "industry"
      },
      {
        url: "https://www.housingwire.com/feed/",
        name: "HousingWire",
        category: "industry"
      },
      {
        url: "https://www.nar.realtor/news/rss",
        name: "NAR News",
        category: "industry"
      },
      // Mortgage and finance news (FREE)
      {
        url: "https://www.mortgagenewsdaily.com/rss/full",
        name: "Mortgage News Daily",
        category: "mortgage"
      },
      {
        url: "https://feeds.feedburner.com/CalculatedRisk",
        name: "Calculated Risk",
        category: "finance"
      },
      // Real estate investing and market analysis (FREE)
      {
        url: "https://www.biggerpockets.com/blog/feed",
        name: "BiggerPockets",
        category: "investing"
      },
      {
        url: "https://www.realtor.com/news/feed/",
        name: "Realtor.com News",
        category: "market"
      },
      {
        url: "https://www.redfin.com/blog/feed/",
        name: "Redfin Blog",
        category: "market"
      },
      // Additional FREE sources
      {
        url: "https://www.zillow.com/blog/feed",
        name: "Zillow Porchlight",
        category: "market"
      },
      {
        url: "https://www.apartmenttherapy.com/main.rss",
        name: "Apartment Therapy",
        category: "design"
      },
      {
        url: "https://www.worldpropertyjournal.com/real-estate-news-rss-feed.php",
        name: "World Property Journal",
        category: "market"
      },
      {
        url: "https://realestate.einnews.com/all_rss",
        name: "EIN Presswire Real Estate",
        category: "market"
      },
      // Reddit feeds for community insights (FREE)
      {
        url: "https://www.reddit.com/r/RealEstate/hot.rss",
        name: "Reddit Real Estate",
        category: "community"
      },
      {
        url: "https://www.reddit.com/r/RealEstateInvesting/hot.rss",
        name: "Reddit Real Estate Investing",
        category: "community"
      },
      {
        url: "https://www.reddit.com/r/FirstTimeHomeBuyer/hot.rss",
        name: "Reddit First Time Home Buyer",
        category: "community"
      },
      // CNBC Real Estate (FREE)
      {
        url: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000115",
        name: "CNBC Real Estate",
        category: "market"
      }
    ]

    const allArticles: Article[] = []

    // Fetch articles from each RSS source
    for (const source of rssSources) {
      try {
        console.log(`Fetching from: ${source.name} - ${source.url}`)
        const response = await fetch(source.url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; RSS Reader)",
            "Cache-Control": "no-cache",
          },
          cache: "no-store", // Disable caching
        })

        if (!response.ok) {
          console.log(`Failed to fetch from ${source.name}: ${response.status} ${response.statusText}`)
          continue
        }

        const xmlText = await response.text()
        console.log(`Raw XML from ${source.name} (first 500 chars):`, xmlText.substring(0, 500))
        const articles = parseRSSFeed(xmlText, source.name)
        console.log(`Found ${articles.length} articles from ${source.name}`)
        if (articles.length > 0) {
          console.log(`First article from ${source.name}:`, articles[0])
        }

        // Add category and location to articles
        const articlesWithMetadata = articles.map(article => ({
          ...article,
          category: source.category || 'general',
          location: extractLocation(article.title + ' ' + article.description)
        }))

        // Filter articles by keywords and quality
        const filteredArticles = articlesWithMetadata.filter((article) => {
          const content = `${article.title} ${article.description}`.toLowerCase()
          
          // Real estate related keywords
          const realEstateKeywords = [
            "real estate", "realtor", "realtors", "realty", "property", "properties",
            "housing", "home", "homes", "buyer", "buyers", "seller", "sellers",
            "mortgage", "mortgages", "refinance", "refinancing", "interest rate", "rates",
            "investment", "investing", "investor", "investors", "rental", "rentals",
            "landlord", "tenant", "tenants", "lease", "leasing", "commercial real estate",
            "residential", "condo", "condos", "townhouse", "townhouses", "apartment",
            "apartments", "market", "markets", "trends", "prices", "pricing",
            "brokerage", "broker", "brokers", "agent", "agents", "mls",
            "appraisal", "appraisals", "inspection", "inspections", "closing", "closings",
            "foreclosure", "foreclosures", "short sale", "short sales", "fsbo",
            "probate", "divorce real estate", "pre-foreclosure", "first time buyer"
          ]
          
          // Exclude listing-specific content (individual property listings)
          const isListingContent = 
            // Property details
            (content.includes("bedroom") && content.includes("bathroom")) ||
            content.includes("sq ft") || content.includes("square feet") ||
            (content.includes("$") && (content.includes("bed") || content.includes("bath"))) ||
            (content.includes("for sale") && content.includes("bedroom")) ||
            content.includes("open house") ||
            content.includes("mls#") || content.includes("mls #") ||
            // Price-focused content
            (content.includes("$") && content.includes("home") && content.includes("for sale")) ||
            (content.includes("$") && content.includes("property") && content.includes("for sale")) ||
            // Specific listing terms
            content.includes("listing") && (content.includes("$") || content.includes("bedroom")) ||
            content.includes("just listed") ||
            content.includes("new listing") ||
            content.includes("price reduced") ||
            content.includes("price drop")
          
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
                              article.title.length < 15 ||
                              article.description.length < 30
          
          return hasRealEstateKeyword && !isLowQuality && !isListingContent
        })

        console.log(`Filtered to ${filteredArticles.length} real estate articles from ${source.name}`)
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

    // Filter articles to only include those from the last 90 days
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
    
    const recentArticles = uniqueArticles.filter(article => {
      try {
        const articleDate = new Date(article.pubDate)
        return articleDate >= ninetyDaysAgo
      } catch (error) {
        console.log(`Invalid date for article: ${article.title} - ${article.pubDate}`)
        return false // Exclude articles with invalid dates
      }
    })

    // Sort by date (newest first) and limit to 50 articles for better variety
    const sortedArticles = recentArticles
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, 50)

    console.log(`Final result: ${sortedArticles.length} unique articles (filtered from ${uniqueArticles.length} total)`)
    console.log("Sources:", [...new Set(sortedArticles.map(a => a.source))])
    
    // Log date range of articles
    if (sortedArticles.length > 0) {
      const oldestArticle = sortedArticles[sortedArticles.length - 1]
      const newestArticle = sortedArticles[0]
      console.log(`Date range: ${newestArticle.pubDate} (newest) to ${oldestArticle.pubDate} (oldest)`)
      console.log(`Articles are from the last 90 days: ${ninetyDaysAgo.toISOString()}`)
    }

    // If no articles found, return empty array - no test articles
    if (sortedArticles.length === 0) {
      console.log("No articles found from any source - returning empty array")
      return NextResponse.json({ articles: [] })
    }

    return NextResponse.json({ 
      articles: sortedArticles,
      totalSources: rssSources.length,
      fetchedAt: new Date().toISOString(),
      dateRange: {
        oldest: sortedArticles.length > 0 ? sortedArticles[sortedArticles.length - 1].pubDate : null,
        newest: sortedArticles.length > 0 ? sortedArticles[0].pubDate : null,
        cutoffDate: ninetyDaysAgo.toISOString()
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
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
        // Parse and normalize the publication date
        const normalizedDate = parseRSSDate(pubDate)
        
        articles.push({
          title: cleanText(title),
          link: link.trim(),
          description: cleanText(description || ""),
          pubDate: normalizedDate,
          source: sourceName,
        })
      }
    })
  } catch (error) {
    console.error("Error parsing RSS feed:", error)
  }

  return articles
}

// Function to parse various RSS date formats
function parseRSSDate(dateString: string): string {
  if (!dateString) {
    return new Date().toISOString()
  }

  try {
    // Try parsing the date directly first
    let date = new Date(dateString)
    
    // If that fails, try some common RSS date formats
    if (isNaN(date.getTime())) {
      // Remove common timezone abbreviations that might cause issues
      const cleanedDate = dateString
        .replace(/\s+(EST|EDT|CST|CDT|MST|MDT|PST|PDT|UTC|GMT)\s*$/i, '')
        .replace(/,/g, '')
      
      date = new Date(cleanedDate)
    }
    
    // If still invalid, return current date
    if (isNaN(date.getTime())) {
      console.log(`Could not parse date: ${dateString}`)
      return new Date().toISOString()
    }
    
    return date.toISOString()
  } catch (error) {
    console.log(`Error parsing date ${dateString}:`, error)
    return new Date().toISOString()
  }
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

