"use server"

import { getTenantConfig } from "@/lib/tenant-config"
import { OpenAI } from "openai"

export interface MarketData {
  agentName: string
  agentEmail: string
  marketType: 'rental' | 'housing'
  searchQuery: string
  homeType?: string
  rentalType?: string
  bedroomType?: string
  data: any
  timestamp: string
}

export async function getAgentInfo() {
  const config = getTenantConfig()
  return {
    name: config.branding.name || "Your Name",
    email: "your.email@example.com" // This will be populated from MemberSpace user
  }
}

export async function analyzeMarket(
  agentName: string,
  agentEmail: string,
  marketType: 'housing' | 'rental',
  searchQuery: string,
  homeType?: string,
  rentalType?: string,
  bedroomType?: string
): Promise<MarketData> {
  try {
    console.log("MyMarket AI: Starting market analysis...")
    console.log("Market Type:", marketType)
    console.log("Search Query:", searchQuery)
    console.log("Agent:", agentName)

    // Get market data from API
    const marketData = await fetchMarketData(searchQuery, marketType, homeType, rentalType, bedroomType)
    
    // Generate AI insights for deeper analysis
    const aiInsights = await generateAIInsights(searchQuery, marketType, marketData)
    console.log("MyMarket AI: Generated AI insights:", aiInsights ? "Success" : "Failed")
    
    // Combine market data with AI insights
    const enhancedData = {
      ...marketData,
      ai_insights: aiInsights,
      search_query: searchQuery,
      market_type: marketType
    }

    const result: MarketData = {
      agentName,
      agentEmail,
      marketType,
      searchQuery,
      homeType,
      rentalType,
      bedroomType,
      timestamp: new Date().toISOString(),
      data: enhancedData
    }

    console.log("MyMarket AI: Analysis completed successfully")
    return result

  } catch (error) {
    console.error("MyMarket AI Error:", error)
    throw error
  }
}

async function generateAIInsights(location: string, marketType: 'housing' | 'rental', marketData: any): Promise<string> {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    let marketContext = ""
    if (marketType === 'housing') {
      marketContext = `
        Location: ${location}
        Typical Home Value: $${marketData.market_overview?.typical_home_values?.toLocaleString() || 'N/A'}
        For Sale Inventory: ${marketData.market_overview?.for_sale_inventory?.toLocaleString() || 'N/A'}
        New Listings: ${marketData.market_overview?.new_listings?.toLocaleString() || 'N/A'}
        Sale/List Ratio: ${marketData.market_overview?.["market saletolist ratio"] || 'N/A'}
      `
    } else {
      marketContext = `
        Location: ${location}
        Average Rent: $${marketData.rental_market_trends?.average_rent?.toLocaleString() || marketData.average_rent?.toLocaleString() || 'N/A'}
        Rental Inventory: ${marketData.rental_market_trends?.rental_inventory?.toLocaleString() || marketData.rental_inventory?.toLocaleString() || 'N/A'}
        Rent Trend: ${marketData.rental_market_trends?.rent_trend || marketData.rent_trend || 'N/A'}
      `
    }

    const prompt = `As a real estate market analyst, provide deep insights about the ${marketType} market in ${location}. 

Market Data:
${marketContext}

Please provide:
1. Market trends and what they indicate
2. Opportunities for buyers/sellers/renters
3. Potential challenges in this market
4. Seasonal factors that might affect this market
5. Economic indicators that could impact this area
6. Recommendations for different types of clients

Keep the analysis professional, data-driven, and actionable. Focus on real insights that would help real estate agents and their clients make informed decisions.`

        const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert real estate market analyst with deep knowledge of local markets, economic trends, and real estate dynamics. Provide insightful, professional analysis that helps real estate professionals and their clients understand market conditions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
 
    })

    return completion.choices[0]?.message?.content || "Unable to generate AI insights at this time."
  } catch (error) {
    console.error("Error generating AI insights:", error)
    return "AI insights temporarily unavailable."
  }
}

async function fetchMarketData(
  searchQuery: string,
  marketType: 'housing' | 'rental',
  homeType?: string,
  rentalType?: string,
  bedroomType?: string
): Promise<any> {
  // Use the same environment variable as other tools
  const apiKey = process.env.RAPIDAPI_ZILLOW_KEY
  if (!apiKey) {
    throw new Error("API key not configured")
  }
  
  console.log(`MyMarket AI: Using API key (first 10 chars): ${apiKey.substring(0, 10)}...`)

  let endpoint = ""
  let params: Record<string, string> = {}

  if (marketType === 'rental') {
    endpoint = "/rental_market"
    params = {
      search_query: searchQuery,
      bedroom_type: bedroomType || "All_Bedrooms",
      home_type: rentalType || "All_Property_Types"
    }
  } else {
    endpoint = "/housing_market"
    params = {
      search_query: searchQuery,
      home_type: homeType || "All_Homes"
    }
  }

  // Build query string
  const queryString = new URLSearchParams(params).toString()
  const url = `https://zillow-working-api.p.rapidapi.com${endpoint}?${queryString}`

  console.log(`MyMarket AI: Calling API for ${marketType} market`)
  console.log(`MyMarket AI: URL: ${url}`)

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'zillow-working-api.p.rapidapi.com'
    }
  })

  console.log(`MyMarket AI: Response status: ${response.status}`)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error(`MyMarket AI: API call failed with status ${response.status}:`, errorText)
    
    // Return fallback data instead of throwing error to prevent server crashes
    if (marketType === 'rental') {
      return {
        message: "success",
        rental_market_trends: {
          areaName: searchQuery,
          areaType: "zip",
          average_rent: null,
          rental_inventory: null,
          rent_trend: null,
          description: `Rental market data for ${searchQuery} is currently unavailable. Please try again later or contact support if the issue persists.`
        }
      }
    } else {
      return {
        message: "success",
        market_overview: {
          typical_home_values: null,
          for_sale_inventory: null,
          new_listings: null,
          "market saletolist ratio": null,
          description: `Housing market data for ${searchQuery} is currently unavailable. Please try again later or contact support if the issue persists.`
        }
      }
    }
  }

  const data = await response.json()
  console.log(`MyMarket AI: API response data:`, JSON.stringify(data, null, 2))
  return data
} 