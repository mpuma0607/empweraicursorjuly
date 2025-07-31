"use server"

import { getTenantConfig } from "@/lib/tenant-config"

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
  marketType: 'rental' | 'housing',
  searchQuery: string,
  homeType?: string,
  rentalType?: string,
  bedroomType?: string
): Promise<MarketData> {
  try {
    const apiKey = process.env.RAPIDAPI_ZILLOW_KEY
    if (!apiKey) {
      throw new Error("API key not configured")
    }

    let endpoint = ""
    let params: Record<string, string> = {}

    if (marketType === 'rental') {
      endpoint = "/rental_market"
      params = {
        search_query: searchQuery,
        bedrooom_type: bedroomType || "All_Bedrooms",
        home_type: rentalType || "All_Property_Types"
      }
    } else {
      endpoint = "/housing_market"
      params = {
        search_query: searchQuery,
        home_type: homeType || "All_Homes",
        exclude_rentalMarketTrends: "true",
        exclude_neighborhoods_zhvi: "true"
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

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`MyMarket AI: API call failed with status ${response.status}:`, errorText)
      throw new Error(`Market API failed: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    return {
      agentName,
      agentEmail,
      marketType,
      searchQuery,
      homeType,
      rentalType,
      bedroomType,
      data,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error("MyMarket AI Error:", error)
    throw error
  }
} 