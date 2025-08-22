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

export async function skipTraceProperty(formData: SkipTraceFormData) {
  try {
    const apiKey = process.env.RAPIDAPI_ZILLOW_KEY

    if (!apiKey) {
      return {
        success: false,
        error: "API key not configured. Please contact administrator.",
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

    // Generate AI summary with all available data
    const fullAddress = `${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}`

    const prompt = `
Generate: Professional property owner report
Structure: 6 sections with clear headers
Style: Actionable insights, professional tone
Data: Include URLs in CONTACT DETAILS

Property: ${fullAddress}
Skip Trace: ${JSON.stringify(skipTraceData, null, 2)}
Additional: ${additionalContactData ? JSON.stringify(additionalContactData, null, 2) : "None"}

## PROPERTY OVERVIEW
- Address, type, characteristics, value info

## OWNER INFORMATION  
- Primary owner names and associated individuals
- Mailing address, demographics, ownership history

## CONTACT DETAILS
- Phone numbers with type, emails, social media
- Public record links: TruePeopleSearch.com, Whitepages, Spokeo, etc.
- Include specific URLs like "https://www.truepeoplesearch.com/find-person?name=[NAME]&citystatezip=[LOCATION]"

## PROPERTY CHARACTERISTICS
- Type, size, features, estimated value, history

## PROFESSIONAL OUTREACH STRATEGY
- Initial contact approach, key talking points, follow-up

## MARKET INSIGHTS
- Local conditions, investment potential, comparables`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      maxTokens: 2000,
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

    return {
      success: true,
      data: {
        summary: text,
        rawData: skipTraceData,
        additionalData: additionalContactData,
        address: fullAddress,
      },
    }
  } catch (error) {
    console.error("Skip trace error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to retrieve property information",
    }
  }
}
