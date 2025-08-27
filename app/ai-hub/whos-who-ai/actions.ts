"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface SkipTraceFormData {
  street: string
  city: string
  state: string
  zip: string
  email: string
}

async function fetchAdditionalContactInfo(url: string, apiKey: string) {
  try {
    console.log("Fetching additional contact info from:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "zillow-working-api.p.rapidapi.com",
      },
    })

    if (response.ok) {
      const additionalData = await response.json()
      console.log("Additional contact data:", JSON.stringify(additionalData, null, 2))
      return additionalData
    }
  } catch (error) {
    console.error("Error fetching additional contact info:", error)
  }
  return null
}

// Helper function to extract and validate URLs from any object
function extractUrls(obj: any, ownerName?: string, address?: string): { url: string; description: string }[] {
  const links: { url: string; description: string }[] = []
  
  const traverse = (item: any, path: string = '') => {
    if (typeof item === 'string') {
      // Check if this string contains a URL (including URLs in parentheses)
      const urlMatch = item.match(/(https?:\/\/[^\s)]+)|(\(https?:\/\/[^\s)]+\))|(\([^)]*truepeoplesearch\.com[^)]*\))/g)
      if (urlMatch) {
        urlMatch.forEach(url => {
          // Clean and validate the URL - remove parentheses and trailing punctuation
          let cleanUrl = url.replace(/^\(|\)$/g, '') // Remove surrounding parentheses
          cleanUrl = cleanUrl.replace(/[.,;!?]+$/, '') // Remove trailing punctuation
          
          // Ensure it starts with http/https
          if (!cleanUrl.startsWith('http')) {
            cleanUrl = 'https://' + cleanUrl
          }
          
          let description = 'Public Profile'
          let validatedUrl = cleanUrl
          
          if (cleanUrl.includes('truepeoplesearch.com')) {
            description = 'TruePeopleSearch Profile'
            // Validate and potentially fix TruePeopleSearch URL
            validatedUrl = validateTruePeopleSearchUrl(cleanUrl, ownerName, address)
          } else if (cleanUrl.includes('whitepages.com')) {
            description = 'Whitepages Profile'
          } else if (cleanUrl.includes('spokeo.com')) {
            description = 'Spokeo Profile'
          } else if (cleanUrl.includes('beenverified.com')) {
            description = 'BeenVerified Profile'
          } else if (cleanUrl.includes('peoplefinder.com')) {
            description = 'PeopleFinder Profile'
          }
          
          // Only add valid URLs
          if (isValidUrl(validatedUrl)) {
            links.push({ url: validatedUrl, description })
          }
        })
      }
    } else if (typeof item === 'object' && item !== null) {
      Object.entries(item).forEach(([key, value]) => {
        traverse(value, `${path}.${key}`)
      })
    } else if (Array.isArray(item)) {
      item.forEach((value, index) => {
        traverse(value, `${path}[${index}]`)
      })
    }
  }
  
  traverse(obj)
  return links
}

// Validate and fix TruePeopleSearch URLs
function validateTruePeopleSearchUrl(url: string, ownerName?: string, address?: string): string {
  try {
    const urlObj = new URL(url)
    
    // If it's a valid TruePeopleSearch URL, return as-is
    if (urlObj.hostname === 'www.truepeoplesearch.com' && urlObj.pathname && urlObj.search) {
      return url
    }
    
    // If we have owner name and address, generate a proper search URL
    if (ownerName && address) {
      const nameParts = ownerName.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''
      
      if (firstName && lastName) {
        const searchParams = new URLSearchParams({
          name: firstName,
          lastname: lastName,
          citystatezip: address
        })
        return `https://www.truepeoplesearch.com/results?${searchParams.toString()}`
      }
    }
    
    // Fallback to basic search page
    return 'https://www.truepeoplesearch.com/'
  } catch (error) {
    // If URL parsing fails, return a basic search page
    return 'https://www.truepeoplesearch.com/'
  }
}

// Validate if URL is properly formatted
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Structured data extraction function for consistent results
function extractStructuredData(skipTraceData: any, additionalContactData: any, fullAddress: string) {
  const structuredData = {
    propertyType: '',
    estimatedValue: '',
    primaryOwner: '',
    associatedIndividuals: [] as string[],
    mailingAddress: '',
    ownershipDuration: '',
    phoneNumbers: [] as string[],
    emailAddresses: [] as string[],
    publicProfileLinks: [] as { url: string; description: string }[],
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    lotSize: '',
    yearBuilt: ''
  }

  // Helper function to safely extract nested values
  const safeExtract = (obj: any, path: string): string => {
    const keys = path.split('.')
    let current = obj
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key]
      } else {
        return ''
      }
    }
    return current ? String(current).trim() : ''
  }

  // Helper function to extract arrays
  const safeExtractArray = (obj: any, path: string): string[] => {
    const value = safeExtract(obj, path)
    if (Array.isArray(value)) {
      return value.map(String).filter(v => v.trim())
    }
    return value ? [value] : []
  }

  // Extract from skip trace data
  if (skipTraceData) {
    // Extract current owners (prioritize current ownership data)
    structuredData.primaryOwner = safeExtract(skipTraceData, 'current_owner') ||
                                 safeExtract(skipTraceData, 'owner_name') || 
                                 safeExtract(skipTraceData, 'owner') ||
                                 safeExtract(skipTraceData, 'property_owner') ||
                                 safeExtract(skipTraceData, 'name')
    
    structuredData.mailingAddress = safeExtract(skipTraceData, 'mailing_address') ||
                                   safeExtract(skipTraceData, 'owner_address') ||
                                   safeExtract(skipTraceData, 'current_address')
    
    structuredData.phoneNumbers = safeExtractArray(skipTraceData, 'phone_numbers') ||
                                 safeExtractArray(skipTraceData, 'phones') ||
                                 safeExtractArray(skipTraceData, 'phone') ||
                                 safeExtractArray(skipTraceData, 'current_phone')
    
    structuredData.emailAddresses = safeExtractArray(skipTraceData, 'email_addresses') ||
                                   safeExtractArray(skipTraceData, 'emails') ||
                                   safeExtractArray(skipTraceData, 'email') ||
                                   safeExtractArray(skipTraceData, 'current_email')
    
    structuredData.propertyType = safeExtract(skipTraceData, 'property_type') ||
                                 safeExtract(skipTraceData, 'type')
    
    structuredData.estimatedValue = safeExtract(skipTraceData, 'estimated_value') ||
                                   safeExtract(skipTraceData, 'value') ||
                                   safeExtract(skipTraceData, 'price')
    
    structuredData.bedrooms = safeExtract(skipTraceData, 'bedrooms') ||
                             safeExtract(skipTraceData, 'beds')
    
    structuredData.bathrooms = safeExtract(skipTraceData, 'bathrooms') ||
                              safeExtract(skipTraceData, 'baths')
    
    structuredData.squareFeet = safeExtract(skipTraceData, 'square_feet') ||
                               safeExtract(skipTraceData, 'sqft') ||
                               safeExtract(skipTraceData, 'size')
    
    structuredData.lotSize = safeExtract(skipTraceData, 'lot_size') ||
                            safeExtract(skipTraceData, 'lot')
    
    structuredData.yearBuilt = safeExtract(skipTraceData, 'year_built') ||
                              safeExtract(skipTraceData, 'built')
    
    // Extract ownership duration/status
    structuredData.ownershipDuration = safeExtract(skipTraceData, 'ownership_duration') ||
                                      safeExtract(skipTraceData, 'owned_since') ||
                                      safeExtract(skipTraceData, 'purchase_date')
    
    // Extract associated individuals (but prioritize current owners)
    const associated = safeExtractArray(skipTraceData, 'associated_individuals') ||
                      safeExtractArray(skipTraceData, 'associated_people') ||
                      safeExtractArray(skipTraceData, 'residents') ||
                      safeExtractArray(skipTraceData, 'co_owners')
    structuredData.associatedIndividuals = associated

    // Extract public profile links from the data
    structuredData.publicProfileLinks = extractUrls(skipTraceData, structuredData.primaryOwner, fullAddress)
  }

  // Extract from additional contact data
  if (additionalContactData) {
    // Merge additional data, prioritizing skip trace data
    if (!structuredData.primaryOwner) {
      structuredData.primaryOwner = safeExtract(additionalContactData, 'owner_name') ||
                                   safeExtract(additionalContactData, 'owner')
    }
    
    if (structuredData.phoneNumbers.length === 0) {
      structuredData.phoneNumbers = safeExtractArray(additionalContactData, 'phone_numbers') ||
                                   safeExtractArray(additionalContactData, 'phones')
    }
    
    if (structuredData.emailAddresses.length === 0) {
      structuredData.emailAddresses = safeExtractArray(additionalContactData, 'email_addresses') ||
                                     safeExtractArray(additionalContactData, 'emails')
    }

    // Add any additional public profile links
    const additionalLinks = extractUrls(additionalContactData, structuredData.primaryOwner, fullAddress)
    structuredData.publicProfileLinks.push(...additionalLinks)
  }

  // Remove duplicate URLs
  const uniqueLinks = structuredData.publicProfileLinks.filter((link, index, self) => 
    index === self.findIndex(l => l.url === link.url)
  )
  structuredData.publicProfileLinks = uniqueLinks

  console.log("Extracted structured data:", JSON.stringify(structuredData, null, 2))
  console.log("Public profile links extracted:", structuredData.publicProfileLinks)
  return structuredData
}

// Simple in-memory cache for results (in production, use Redis or database)
const resultCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export async function skipTraceProperty(formData: SkipTraceFormData) {
  try {
    const apiKey = process.env.RAPIDAPI_ZILLOW_KEY

    if (!apiKey) {
      return {
        success: false,
        error: "API key not configured. Please contact administrator.",
      }
    }

    // Create cache key from address
    const fullAddress = `${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}`
    const cacheKey = fullAddress.toLowerCase().replace(/[^a-z0-9]/g, '')
    
    // Check cache first
    const cached = resultCache.get(cacheKey)
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log("Returning cached result for:", fullAddress)
      return {
        success: true,
        data: cached.data,
        cached: true
      }
    }

    // Use the correct endpoint format that works in RapidAPI - match test route format
    const street = encodeURIComponent(formData.street.toLowerCase())
    const citystatezip = encodeURIComponent(
      `${formData.city.toLowerCase()} ${formData.state.toLowerCase()} ${formData.zip}`,
    )

    const url = `https://zillow-working-api.p.rapidapi.com/skip/byaddress?street=${street}&citystatezip=${citystatezip}&page=1`

    console.log("Skip trace request URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "zillow-working-api.p.rapidapi.com",
      },
    })

    console.log("API Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error:", response.status, errorText)
      return {
        success: false,
        error: `API request failed: ${response.status} - ${errorText}`,
      }
    }

    const skipTraceData = await response.json()
    console.log("Skip trace data received:", JSON.stringify(skipTraceData, null, 2))

    // Check for additional contact info links and fetch them
    let additionalContactData = null
    if (skipTraceData && typeof skipTraceData === "object") {
      // Look for URLs in the response that might contain additional contact info
      const findUrls = (obj: any): string[] => {
        const urls: string[] = []

        const traverse = (item: any) => {
          if (typeof item === "string" && item.includes("zillow-working-api.p.rapidapi.com")) {
            urls.push(item)
          } else if (typeof item === "object" && item !== null) {
            Object.values(item).forEach(traverse)
          } else if (Array.isArray(item)) {
            item.forEach(traverse)
          }
        }

        traverse(obj)
        return urls
      }

      const additionalUrls = findUrls(skipTraceData)
      console.log("Found additional URLs:", additionalUrls)

      // Fetch additional contact info from the first URL found
      if (additionalUrls.length > 0) {
        additionalContactData = await fetchAdditionalContactInfo(additionalUrls[0], apiKey)
      }
    }

    // Generate structured summary with consistent data extraction
    // Extract structured data from API response
    const structuredData = extractStructuredData(skipTraceData, additionalContactData, fullAddress)

    const prompt = `
You are a professional real estate skip tracing analyst. Analyze the provided data to answer these CORE QUESTIONS:

1. WHO ARE THE CURRENT OWNERS? (Identify the 2 most likely current homeowners)
2. WHAT IS THEIR CONTACT INFO? (Focus on the current owners' contact details and public profile links)

Property: ${fullAddress}

AVAILABLE DATA:
${JSON.stringify(structuredData, null, 2)}

RAW API DATA (for additional context):
${JSON.stringify(skipTraceData, null, 2)}

ANALYSIS INSTRUCTIONS:
- Focus ONLY on the most likely CURRENT owners (not past owners, tenants, or associated people)
- Prioritize the 2 most relevant individuals who likely own this property
- Extract and organize their contact information professionally
- Include public profile links specifically for the current owners
- Be factual and professional - no speculation beyond what the data suggests

## PROPERTY OVERVIEW
- Address: ${fullAddress}
- Property Type: ${structuredData.propertyType || 'Not Available'}
- Estimated Value: ${structuredData.estimatedValue || 'Not Available'}

## CURRENT OWNERS (Primary Focus)
- Owner 1: [Name and relationship to property]
- Owner 2: [Name and relationship to property if applicable]
- Ownership Status: [Current ownership details]
- Mailing Address: [Current mailing address if different from property]

## CONTACT INFORMATION (Current Owners Only)
- Phone Numbers: [List phone numbers for current owners]
- Email Addresses: [List email addresses for current owners]
- Public Profile Links: ${structuredData.publicProfileLinks.length > 0 ? structuredData.publicProfileLinks.map(link => `• ${link.description}: ${link.url}`).join('\n') : 'No public profile links available'}

IMPORTANT: When displaying URLs, use the exact URLs provided above. Do not add parentheses or modify the URLs in any way.

## PROPERTY CHARACTERISTICS
- Bedrooms: ${structuredData.bedrooms || 'Not Available'}
- Bathrooms: ${structuredData.bathrooms || 'Not Available'}
- Square Feet: ${structuredData.squareFeet || 'Not Available'}
- Year Built: ${structuredData.yearBuilt || 'Not Available'}

## PROFESSIONAL OUTREACH STRATEGY
- Recommended Contact Method: [Based on available contact info]
- Key Talking Points: [Professional approach for current owners]
- Follow-up Strategy: [Next steps for engagement]`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      temperature: 0.7,
      prompt,
    })

    // Send email with results
    try {
      const emailResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/send-skiptrace-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            address: fullAddress,
            summary: text,
            rawData: skipTraceData,
            additionalData: additionalContactData,
          }),
        },
      )

      if (!emailResponse.ok) {
        console.error("Failed to send email:", await emailResponse.text())
      }
    } catch (emailError) {
      console.error("Email error:", emailError)
    }

    const resultData = {
      summary: text,
      rawData: skipTraceData,
      additionalData: additionalContactData,
      address: fullAddress,
      structuredData: structuredData
    }

    // Cache the result
    resultCache.set(cacheKey, {
      data: resultData,
      timestamp: Date.now()
    })

    return {
      success: true,
      data: resultData,
    }
  } catch (error) {
    console.error("Skip trace error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to retrieve property information",
    }
  }
}
