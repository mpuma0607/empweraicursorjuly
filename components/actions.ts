"use server"

import OpenAI from "openai"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { getCitiesForZipCode, extractZipCodeFromAddress, buildAddressWithCity } from "@/lib/smarty-api"

const openaiInstance = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

type FormData = {
  name: string
  email: string
  prospectType: string
  customProspectType: string
  language: string
  specificGoals: string
}

type ContentFormData = {
  contentType: string
  topic: string
  tone: string
  length: string
  audience: string
  additionalContext?: string
}

export async function generateActionPlan(formData: FormData) {
  try {
    const prospectFocus = formData.prospectType === "Other" ? formData.customProspectType : formData.prospectType

    const prompt = `Take on the role of an elite real estate coach and create a high-performance daily action plan for a real estate agent to execute today, focused on finding and prospecting ${prospectFocus}.

${formData.specificGoals ? `Additional context: ${formData.specificGoals}` : ""}

IMPORTANT: Generate this entire action plan in ${formData.language}. All text, scripts, and instructions should be written in ${formData.language}.

Instructions:
This plan should be for today only — do not spread tasks across multiple days.

The plan must be detailed, specific, and fully executable with a clear breakdown of actions and recommended numbers (e.g., "Send 10 text messages").

Include professionally written scripts for each outreach method: Text, Email, and Phone Calls.

Scripts must be crafted using VAK language principles to appeal to visual, auditory, and kinesthetic personality types.

Ensure the tone is empowering, confident, and focused on helping the agent take effective, immediate action.

REQUIRED SECTIONS (include ALL of these with the exact emojis):

🔍 Prospecting Focus
Brief summary of who they're targeting today (based on input)
Why this audience is important today
Emotional or strategic angle to approach them with

📱 Text Outreach Plan
Specific number of texts to send today
Custom text message script using VAK language
Tip on how to follow up or track replies

📞 Phone Call Plan
Number of calls to make today
Prescriptive call structure: Opener, Questions, Close
Full phone script with sensory-rich wording

📧 Email Outreach Plan
Number of emails to send today
Email subject line idea
Full email script that includes a visually descriptive layout and emotionally resonant CTA

📊 Bonus Task or Follow-Up Assignment
Optional bonus action that helps close the loop
Short motivational note tied to the agent's bigger goals

Generate a complete, detailed action plan with all 5 sections. Each section should contain substantial, actionable content.`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
    })

    return {
      plan: text,
      html: text,
    }
  } catch (error) {
    console.error("Error generating action plan:", error)
    throw new Error("Failed to generate action plan. Please try again.")
  }
}



export async function analyzeComparables(address: string) {
  try {
    console.log("=== QuickCMA Analysis Debug ===")
    console.log("Address:", address)
    console.log("RAPIDAPI_ZILLOW_KEY exists:", !!process.env.RAPIDAPI_ZILLOW_KEY)

    // Try to fetch comparable homes data with fallback for city name issues
    const comparableData = await fetchComparableHomesWithFallback(address)
    console.log("Comparable data result:", {
      totalComparables: comparableData.totalComparables,
      hasComparables: comparableData.comparables.length > 0,
      apiSuccess: comparableData.apiSuccess,
    })

    if (!comparableData.apiSuccess || comparableData.totalComparables === 0) {
      throw new Error("No comparable properties found for this address. Please try a different address.")
    }

    // Create AI prompt for CMA analysis
    const prompt = `You are a professional real estate appraiser creating a Comparative Market Analysis (CMA). 

Subject Property: ${address}

Comparable Properties Data:
${
  comparableData.comparables.length > 0
    ? comparableData.comparables
        .slice(0, 10)
        .map(
          (comp, index) =>
            `Comp ${index + 1}: ${comp.address}
      - Price: $${comp.price?.toLocaleString() || "N/A"}
      - Bedrooms: ${comp.bedrooms || "N/A"}
      - Bathrooms: ${comp.bathrooms || "N/A"}
      - Square Feet: ${comp.sqft?.toLocaleString() || "N/A"}
      - Year Built: ${comp.yearBuilt || "N/A"}
      - Days on Market: ${comp.daysOnMarket || "N/A"}
      - Price per Sq Ft: $${comp.pricePerSqft || "N/A"}
      - Property Type: ${comp.propertyType || "N/A"}
      - Lot Size: ${comp.lotSize || "N/A"}
      - MLS ID: ${comp.mlsId || comp.listingId || "N/A"}
      `,
        )
        .join("\n\n")
    : "No comparable properties found"
}

Summary Statistics:
- Total Comparables: ${comparableData.totalComparables}
- Average Price: $${comparableData.summary.averagePrice.toLocaleString()}
- Price Range: $${comparableData.summary.priceRange.min.toLocaleString()} - $${comparableData.summary.priceRange.max.toLocaleString()}
- Average Square Footage: ${comparableData.summary.averageSqft.toLocaleString()}

Create a professional CMA report with these EXACT sections:

**Property Overview**
- Subject property details and location analysis
- Neighborhood characteristics and market position

**Comparable Properties Analysis**
- Analysis of the ${comparableData.totalComparables} comparable properties
- Key similarities and differences with subject property
- Market positioning relative to comparables

**Pricing Analysis**
- Current market value estimate range
- Price per square foot analysis
- Factors affecting property value

**Market Conditions**
- Current market trends in this area
- Days on market analysis
- Market velocity and activity levels

**Key Insights & Recommendations**
- Pricing strategy recommendations
- Market timing considerations
- Competitive advantages and challenges

Format each section with detailed bullet points using specific data from the comparable properties provided.`

    const response = await openaiInstance.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a professional real estate appraiser creating detailed CMA reports with specific data analysis.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      
      max_tokens: 2500,
    })

    const analysisText = response.choices[0].message.content || ""

    if (!analysisText) {
      throw new Error("No analysis generated")
    }

    // Parse the response into clean sections
    const sections = parseCleanSections(analysisText)

    // Return only serializable data - remove any functions, undefined values, etc.
    const result = {
      analysisText: analysisText,
      sections: sections,
      address: address,
      comparableData: {
        totalComparables: comparableData.totalComparables,
        comparables: comparableData.comparables.map((comp) => ({
          id: comp.id || "",
          address: comp.address || "",
          price: comp.price || 0,
          bedrooms: comp.bedrooms || 0,
          bathrooms: comp.bathrooms || 0,
          sqft: comp.sqft || 0,
          yearBuilt: comp.yearBuilt || null,
          daysOnMarket: comp.daysOnMarket || 0,
          propertyType: comp.propertyType || "",
          pricePerSqft: comp.pricePerSqft || 0,
          lotSize: comp.lotSize || 0,
          listingStatus: comp.listingStatus || "",
          zestimate: comp.zestimate || null,
          mlsId: comp.mlsId || null,
          listingId: comp.listingId || null,
        })),
        summary: {
          averagePrice: comparableData.summary.averagePrice || 0,
          averageSqft: comparableData.summary.averageSqft || 0,
          priceRange: {
            min: comparableData.summary.priceRange.min || 0,
            max: comparableData.summary.priceRange.max || 0,
          },
        },
      },
      rawData: {
        usingRealData: comparableData.totalComparables > 0,
      },
    }

    console.log("Returning serializable result:", {
      hasAnalysisText: !!result.analysisText,
      sectionsCount: Object.keys(result.sections).length,
      comparablesCount: result.comparableData.comparables.length,
      mlsIdCount: result.comparableData.comparables.filter((c) => c.mlsId || c.listingId).length,
    })

    return result
  } catch (error) {
    console.error("QuickCMA Analysis Error:", error)

    // Return a serializable error response
    return {
      error: true,
      message: error instanceof Error ? error.message : "Unknown error occurred",
      analysisText: "",
      sections: {},
      address: address,
      comparableData: {
        totalComparables: 0,
        comparables: [],
        summary: {
          averagePrice: 0,
          averageSqft: 0,
          priceRange: { min: 0, max: 0 },
        },
      },
      rawData: {
        usingRealData: false,
      },
    }
  }
}

async function fetchComparableHomesWithFallback(address: string) {
  try {
    console.log("=== QuickCMA with Smarty Fallback ===")
    console.log("Original address:", address)

    // First, try the original address
    try {
      const result = await fetchComparableHomes(address)
      console.log("✅ Original address worked!")
      return result
    } catch (error) {
      console.log("❌ Original address failed:", error instanceof Error ? error.message : String(error))
      console.log("🔄 Trying Smarty API fallback...")
    }

    // Extract components from the address
    const addressParts = address.trim().split(/\s+/)
    const zipCode = extractZipCodeFromAddress(address)
    
    if (!zipCode) {
      console.log("❌ Could not extract zip code from address")
      throw new Error("Could not extract zip code from address for fallback")
    }

    console.log("📍 Extracted zip code:", zipCode)

    // Get all valid cities for this zip code from Smarty
    const validCities = await getCitiesForZipCode(zipCode)
    console.log("🏙️ Valid cities for zip", zipCode, ":", validCities)

    if (validCities.length > 0) {
      // Try each valid city until one works
      for (const city of validCities) {
        try {
          console.log(`🔄 Trying city: ${city}`)
          
          // Rebuild address with this city
          // Pattern: "Street Address City State Zip"
          const addressRegex = /^(.+?)\s+([A-Za-z\s]+?)\s+([A-Z]{2})\s+(\d{5})$/
          const match = address.match(addressRegex)
          
          let newAddress
          if (match) {
            const [, street, , state, zip] = match
            newAddress = `${street} ${city} ${state} ${zip}`
            console.log("📍 Regex match - Street:", street, "State:", state, "Zip:", zip)
          } else {
            // Fallback: simple replacement of city part
            // Look for pattern: "Street City State Zip" and replace the city
            newAddress = address.replace(/\s+[A-Za-z\s]+\s+[A-Z]{2}\s+\d{5}$/, ` ${city} FL 33543`)
            console.log("📍 Fallback replacement used")
          }
          
          console.log("📍 New address with city:", newAddress)
          
          const result = await fetchComparableHomes(newAddress)
          console.log(`✅ Success with city: ${city}`)
          return result
        } catch (error) {
          console.log(`❌ Failed with city ${city}:`, error instanceof Error ? error.message : String(error))
          continue
        }
      }
    }

    // If Smarty didn't help, try without city name as last resort
    console.log("🔄 Trying address without city name")
    try {
      const addressParts = address.trim().split(/\s+/)
      const stateZip = addressParts.slice(-2).join(' ') // Get last two parts (state zip)
      const street = addressParts.slice(0, -2).join(' ') // Get everything except last two parts
      const addressWithoutCity = `${street} ${stateZip}`
      
      console.log("📍 Address without city:", addressWithoutCity)
      const result = await fetchComparableHomes(addressWithoutCity)
      console.log("✅ Success without city name!")
      return result
    } catch (error) {
      console.log("❌ Failed without city name:", error instanceof Error ? error.message : String(error))
      throw new Error("Address verification failed and address without city also failed")
    }

    // Try each valid city until one works
    for (const city of validCities) {
      try {
        console.log(`🔄 Trying city: ${city}`)
        
        // Better address rebuilding - replace the city part more precisely
        // Look for pattern: "Street City State Zip"
        const addressRegex = /^(.+?)\s+([A-Za-z\s]+?)\s+([A-Z]{2})\s+(\d{5})/
        const match = address.match(addressRegex)
        
        let newAddress
        if (match) {
          const [, street, , state, zip] = match
          newAddress = `${street} ${city} ${state} ${zip}`
        } else {
          // Fallback: simple replacement
          newAddress = address.replace(/\b[A-Za-z\s]+\b(?=\s+\w{2}\s+\d{5})/, city)
        }
        
        console.log("📍 New address:", newAddress)
        
        const result = await fetchComparableHomes(newAddress)
        console.log(`✅ Success with city: ${city}`)
        return result
      } catch (error) {
        console.log(`❌ Failed with city ${city}:`, error instanceof Error ? error.message : String(error))
        continue
      }
    }

    // If all cities failed, throw the original error
    throw new Error("No comparable properties found for this address with any valid city name for this zip code")

  } catch (error) {
    console.error("=== QuickCMA Fallback Error ===")
    console.error("Error message:", error instanceof Error ? error.message : String(error))
    throw error
  }
}

async function fetchComparableHomes(address: string) {
  try {
    console.log("=== Zillow Comparable Homes API ===")
    console.log("Input Address:", address)

    if (!process.env.RAPIDAPI_ZILLOW_KEY) {
      throw new Error("RAPIDAPI_ZILLOW_KEY not configured")
    }

    // Use the EXACT same URL encoding as your working test
    const encodedAddress = encodeURIComponent(address)
    const apiUrl = `https://zillow-working-api.p.rapidapi.com/comparable_homes?byaddress=${encodedAddress}`

    console.log("API URL:", apiUrl)
    console.log("Encoded Address:", encodedAddress)

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_ZILLOW_KEY,
        "x-rapidapi-host": "zillow-working-api.p.rapidapi.com",
      },
    })

    console.log("API Response Status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("API Error Response:", errorText)
      throw new Error(`Zillow API failed: ${response.status} - ${response.statusText}`)
    }

    const responseText = await response.text()
    console.log("Response text length:", responseText.length)
    console.log("Response preview:", responseText.substring(0, 500))

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.log("JSON Parse Error:", parseError)
      throw new Error("Invalid JSON response from API")
    }

    console.log("Parsed data keys:", Object.keys(data))

    // Process the comparable homes data - handle different response structures
    let comparables = []
    let totalComparables = 0

    // Log the actual structure we received
    if (data.comparables) {
      console.log("Found data.comparables:", Array.isArray(data.comparables), data.comparables.length)
      comparables = Array.isArray(data.comparables) ? data.comparables : []
    } else if (data.results) {
      console.log("Found data.results:", Array.isArray(data.results), data.results.length)
      comparables = Array.isArray(data.results) ? data.results : []
    } else if (Array.isArray(data)) {
      console.log("Data is array:", data.length)
      comparables = data
    } else {
      console.log("Checking for other possible structures...")
      console.log("Data keys:", Object.keys(data))

      // Check for other possible property names
      for (const key of Object.keys(data)) {
        if (Array.isArray(data[key]) && data[key].length > 0) {
          console.log(`Found array at key '${key}' with ${data[key].length} items`)
          comparables = data[key]
          break
        }
      }
    }

    totalComparables = comparables.length
    console.log("Total comparables found:", totalComparables)

    if (totalComparables === 0) {
      console.log("No comparables found. Full response:", JSON.stringify(data, null, 2))
      throw new Error("No comparable properties found in API response")
    }

    // Process and clean the comparable data
    const processedComparables = comparables
      .slice(0, 20) // Take up to 20 comparables
      .map((comp, index) => {
        try {
          console.log(`Processing comparable ${index + 1}:`, Object.keys(comp))

          // Handle different data structures - be more flexible
          const property = comp.property || comp

          // Log the attribution info for the first few to debug MLS ID extraction
          if (index < 3) {
            console.log(`=== PROPERTY ${index + 1} ATTRIBUTION INFO ===`)
            console.log("attributionInfo:", property.attributionInfo)
            if (property.attributionInfo) {
              console.log("attributionInfo keys:", Object.keys(property.attributionInfo))
              console.log("mlsID:", property.attributionInfo.mlsID)
            }
          }

          // Extract MLS ID from attributionInfo.mlsID (the correct location!)
          let mlsId = null
          let listingId = null

          // Primary location: attributionInfo.mlsID
          if (property.attributionInfo && property.attributionInfo.mlsID) {
            mlsId = String(property.attributionInfo.mlsID)
            console.log(`Found MLS ID in attributionInfo for property ${index + 1}:`, mlsId)
          }

          // Fallback locations for MLS ID
          if (!mlsId) {
            const mlsIdSources = [
              property.mlsId,
              property.mls_id,
              property.mlsID,
              property.MLS_ID,
              property.listing?.mlsId,
              property.listing?.mls_id,
              property.listing?.mlsID,
              property.listing?.MLS_ID,
              property.listingDetails?.mlsId,
              property.listingDetails?.mls_id,
              property.mlsNumber,
              property.mls_number,
              property.listing?.mlsNumber,
              property.listing?.mls_number,
            ]

            // Find first non-null MLS ID
            for (const source of mlsIdSources) {
              if (source && source !== null && source !== undefined && source !== "") {
                mlsId = String(source)
                console.log(`Found MLS ID in fallback location for property ${index + 1}:`, mlsId)
                break
              }
            }
          }

          // Extract Listing ID from various locations
          const listingIdSources = [
            property.listingId,
            property.listing_id,
            property.listingID,
            property.LISTING_ID,
            property.listing?.listingId,
            property.listing?.listing_id,
            property.listing?.listingID,
            property.listing?.LISTING_ID,
            property.listingDetails?.listingId,
            property.listingDetails?.listing_id,
            property.zpid, // Use Zillow ID as fallback
          ]

          // Find first non-null Listing ID
          for (const source of listingIdSources) {
            if (source && source !== null && source !== undefined && source !== "") {
              listingId = String(source)
              break
            }
          }

          console.log(`Property ${index + 1} final MLS extraction:`, {
            mlsId,
            listingId,
            hasAttributionInfo: !!property.attributionInfo,
            attributionMlsID: property.attributionInfo?.mlsID,
          })

          const processedProperty = {
            id: String(property.zpid || property.id || `comp_${index}`),
            address: String(
              property.address?.streetAddress || property.address || property.streetAddress || `Property ${index + 1}`,
            ),
            price: Number(property.price?.value || property.price || property.listPrice || property.salePrice || 0),
            bedrooms: Number(property.bedrooms || property.beds || 0),
            bathrooms: Number(property.bathrooms || property.baths || 0),
            sqft: Number(property.livingArea || property.sqft || property.squareFeet || property.floorSize || 0),
            yearBuilt: property.yearBuilt ? Number(property.yearBuilt) : null,
            daysOnMarket: Number(property.daysOnZillow || property.daysOnMarket || property.dom || 0),
            propertyType: String(property.propertyType || property.homeType || "Unknown"),
            pricePerSqft: Number(
              property.price?.pricePerSquareFoot ||
                property.pricePerSqft ||
                (property.price && property.livingArea ? Math.round(property.price / property.livingArea) : 0),
            ),
            lotSize: Number(property.lotSizeWithUnit?.lotSize || property.lotSize || 0),
            listingStatus: String(property.listing?.listingStatus || property.status || "For Sale"),
            zestimate: property.zestimate?.value ? Number(property.zestimate.value) : null,
            mlsId: mlsId,
            listingId: listingId,
          }

          return processedProperty
        } catch (propError) {
          console.log(`Error processing comparable ${index + 1}:`, propError)
          return null
        }
      })
      .filter(Boolean)

    console.log("Successfully processed comparables:", processedComparables.length)
    console.log("Comparables with MLS IDs:", processedComparables.filter((p) => p.mlsId).length)
    console.log("Comparables with Listing IDs:", processedComparables.filter((p) => p.listingId).length)

    // Calculate summary statistics
    const validPrices = processedComparables.filter((p) => p.price > 0).map((p) => p.price)
    const validSqft = processedComparables.filter((p) => p.sqft > 0).map((p) => p.sqft)

    const summary = {
      averagePrice:
        validPrices.length > 0 ? Math.round(validPrices.reduce((a, b) => a + b, 0) / validPrices.length) : 0,
      averageSqft: validSqft.length > 0 ? Math.round(validSqft.reduce((a, b) => a + b, 0) / validSqft.length) : 0,
      priceRange: {
        min: validPrices.length > 0 ? Math.min(...validPrices) : 0,
        max: validPrices.length > 0 ? Math.max(...validPrices) : 0,
      },
    }

    console.log("Summary statistics:", summary)

    return {
      address: address,
      totalComparables: processedComparables.length,
      comparables: processedComparables,
      summary: summary,
      apiSuccess: true,
    }
  } catch (error) {
    console.error("=== COMPARABLE HOMES API ERROR ===")
    console.error("Error message:", error instanceof Error ? error.message : String(error))
    throw error
  }
}

function parseCleanSections(text: string) {
  const sections: Record<string, string[]> = {}
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  let currentSection = ""

  for (const line of lines) {
    // Check if this is a section header (starts with ** and ends with **)
    if (line.startsWith("**") && line.endsWith("**")) {
      currentSection = line.replace(/\*\*/g, "").trim()
      sections[currentSection] = []
    }
    // Check if this is a bullet point (starts with -)
    else if (line.startsWith("-") && currentSection) {
      const bulletText = line.substring(1).trim()
      if (bulletText.length > 0) {
        sections[currentSection].push(bulletText)
      }
    }
    // Regular text that might be part of a section
    else if (currentSection && line.length > 10) {
      sections[currentSection].push(line)
    }
  }

  return sections
}

export async function generateContent(formData: ContentFormData) {
  try {
    // Validate required fields
    if (!formData.contentType || !formData.topic || !formData.tone || !formData.length || !formData.audience) {
      throw new Error("Missing required fields for content generation")
    }

    const prompt = `Create ${formData.contentType} content about ${formData.topic}.

Content Requirements:
- Tone: ${formData.tone}
- Length: ${formData.length}
- Target Audience: ${formData.audience}
${formData.additionalContext ? `- Additional Context: ${formData.additionalContext}` : ""}

Please create engaging, professional content that matches these specifications.`

    const { text: generatedContent } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    if (!generatedContent) {
      throw new Error("No content generated")
    }

    return {
      content: generatedContent,
      success: true,
    }
  } catch (error) {
    console.error("Error generating content:", error)
    return {
      content: "",
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate content. Please try again.",
    }
  }
}
