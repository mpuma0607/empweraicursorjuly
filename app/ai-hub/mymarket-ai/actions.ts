"use server"

import { getTenantConfig } from "@/lib/tenant-config"
import { useMemberSpaceUser } from "@/hooks/useMemberSpaceUser"

export interface MarketData {
  location: string
  marketType: 'rental' | 'housing'
  homeType?: string
  rentalType?: string
  bedroomType?: string
  data: any
  timestamp: string
}

export async function analyzeMarket(
  location: string,
  marketType: 'rental' | 'housing',
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
      endpoint = "/rental_market_trends"
      if (rentalType) params.rental_type = rentalType
      if (bedroomType) params.bedroom_type = bedroomType
    } else {
      endpoint = "/housing_market"
      if (homeType) params.home_type = homeType
    }

    // Add location parameter
    params.location = location

    const queryString = new URLSearchParams(params).toString()
    const url = `https://zillow-working-api.p.rapidapi.com${endpoint}?${queryString}`

    console.log(`MyMarket AI: Calling ${marketType} market API for ${location}`)
    console.log(`MyMarket AI: API URL: ${url}`)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'zillow-working-api.p.rapidapi.com'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`MyMarket AI: API call failed with status ${response.status}:`, errorText)
      throw new Error(`Market API failed: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    
    return {
      location,
      marketType,
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

export async function getAgentInfo() {
  try {
    const config = getTenantConfig()
    return {
      name: config.agentName || "Real Estate Agent",
      company: config.companyName || "Real Estate Company",
      phone: config.phone || "",
      email: config.email || ""
    }
  } catch (error) {
    console.error("Error getting agent info:", error)
    return {
      name: "Real Estate Agent",
      company: "Real Estate Company",
      phone: "",
      email: ""
    }
  }
} 