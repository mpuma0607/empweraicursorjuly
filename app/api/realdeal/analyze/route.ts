import { type NextRequest, NextResponse } from "next/server"
import { OpenAI } from "openai"

// Create OpenAI client with proper configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Function to estimate tokens (rough approximation: 1 token ≈ 4 characters)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

// Function to truncate text to fit within token limits
function truncateToTokenLimit(text: string, maxTokens: number): string {
  const estimatedTokens = estimateTokens(text)

  if (estimatedTokens <= maxTokens) {
    return text
  }

  // Calculate approximate character limit (conservative estimate)
  const maxChars = maxTokens * 3.5 // More conservative than 4 chars per token
  return text.substring(0, Math.floor(maxChars))
}

// Log API key status (not the actual key) for debugging
console.log("OpenAI API key status:", process.env.OPENAI_API_KEY ? "Key is set" : "Key is missing")

export async function POST(request: NextRequest) {
  try {
    console.log("Starting contract analysis...")

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is not configured")
      return NextResponse.json({ error: "OpenAI API key is not configured" }, { status: 500 })
    }

    const formData = await request.formData()
    const contractText = formData.get("contractText") as string
    const agentName = formData.get("agentName") as string
    const email = formData.get("email") as string
    const providedAddress = formData.get("propertyAddress") as string

    console.log("Form data received:", {
      contractTextLength: contractText?.length,
      estimatedTokens: estimateTokens(contractText || ""),
      agentName,
      email,
      providedAddress,
    })

    if (!contractText || !agentName || !email) {
      console.error("Missing required fields:", { contractText: !!contractText, agentName, email })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (contractText.trim().length < 100) {
      console.error("Contract text too short:", contractText.trim().length)
      return NextResponse.json({ error: "Contract text is too short for analysis" }, { status: 400 })
    }

    // Extract property address if not provided
    let propertyAddress = providedAddress
    if (!propertyAddress) {
      console.log("Starting property address extraction...")

      try {
        // Use a larger portion of the beginning of the contract for address extraction
        // Most real estate contracts have the address in the first 10-15% of the document
        const addressSampleSize = Math.min(contractText.length, 5000) // Use up to first 5000 chars
        const addressSample = contractText.substring(0, addressSampleSize)

        const addressResponse = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are an expert at extracting property addresses from real estate contracts.
Your task is to find and extract ONLY the complete property address from the contract text.
Look for patterns like:
- "Property Address:" followed by an address
- "Subject Property:" followed by an address
- "Real property located at:" followed by an address
- Street numbers followed by street names, city, state, zip
- Legal descriptions that include lot numbers, block numbers, subdivision names

Return ONLY the complete property address with no additional text or explanation.
If you cannot find a property address with high confidence, respond with "PROPERTY ADDRESS NOT FOUND".`,
            },
            {
              role: "user",
              content: addressSample,
            },
          ],
          max_tokens: 150,
          temperature: 0.1,
        })

        const extractedAddress = addressResponse.choices[0].message.content?.trim()
        console.log("Extracted address:", extractedAddress)

        if (
          extractedAddress &&
          extractedAddress.length > 10 &&
          !extractedAddress.includes("PROPERTY ADDRESS NOT FOUND")
        ) {
          propertyAddress = extractedAddress
        } else {
          // Try a second attempt with a different prompt if the first fails
          console.log("First address extraction attempt failed, trying alternative approach...")

          const secondAttemptResponse = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: `Extract the property address from this real estate contract text.
Look at the beginning of the document, as addresses are typically mentioned early.
Return ONLY the address, with no additional text.`,
              },
              {
                role: "user",
                content: addressSample,
              },
            ],
            max_tokens: 150,
            temperature: 0.1,
          })

          const secondExtractedAddress = secondAttemptResponse.choices[0].message.content?.trim()
          console.log("Second attempt extracted address:", secondExtractedAddress)

          if (secondExtractedAddress && secondExtractedAddress.length > 10) {
            propertyAddress = secondExtractedAddress
          } else {
            propertyAddress = "Property Address Not Found"
          }
        }
      } catch (addressError) {
        console.error("Address extraction error:", addressError)
        propertyAddress = "Property Address Not Found"
      }
    }

    console.log("Final property address:", propertyAddress)
    console.log("Starting contract analysis with OpenAI...")

    // Create the analysis prompt with enhanced date extraction instructions
    const systemPrompt = `You are an expert real estate contract summarizer. Your task is to analyze the following real estate contract and produce a clean, professional summary that is simple to understand—even for someone without a real estate background.

Focus on extracting the most relevant information and presenting it in a way that highlights:

**📅 Key Dates & Deadlines**
- Contract effective date (look for "effective date", "date of contract", "agreement date", or similar terms)
- Inspection period deadline (look for "inspection period", "due diligence period", or similar terms)
- Financing contingency deadline (look for "financing contingency", "loan approval", or similar terms)
- Appraisal deadline (if applicable)
- Closing date (look for "closing date", "settlement date", or similar terms)

IMPORTANT: Search thoroughly for these dates throughout the entire contract. They are critical information and must be included in your summary. If you find a date, include it in your summary even if you're not 100% certain it's correct.

**💰 Financial Summary**
- Purchase price (look for "purchase price", "sales price", or similar terms)
- Earnest money deposit amount and due date
- Escrow and title details
- Seller contributions or credits
- Financing terms (cash, conventional, FHA, VA, etc.)

**📝 Addendums & Attachments**
- List of any included addendums (e.g., condo rider, lead paint disclosure)
- Noteworthy terms or clauses from these addendums

**🏠 Property-Specific Conditions**
- Inclusions/exclusions (e.g., appliances, fixtures)
- Notable repairs or concessions
- Contingencies or special conditions (sale of buyer's home, leaseback, etc.)

**🔍 Due Diligence Considerations**
- Inspection-related obligations
- HOA or condo association review periods
- Any disclosures or issues that could impact the transaction

**📌 Important Notes**
- Anything unusual, noteworthy, or time-sensitive
- Summary of the deal's overall strength, risk, or complexity

Please make the summary clear, professional, and easy to read—avoid legal jargon when possible. Structure matters: bold each section header and use bullet points for all details underneath.`

    // Calculate available tokens for contract text
    // GPT-4 has 8192 tokens total
    // Reserve tokens for: system prompt (~500), response (~2000), safety buffer (~200)
    const systemPromptTokens = estimateTokens(systemPrompt)
    const responseTokens = 2000
    const safetyBuffer = 200
    const availableTokensForContract = 8192 - systemPromptTokens - responseTokens - safetyBuffer

    console.log("Token allocation:", {
      totalLimit: 8192,
      systemPromptTokens,
      responseTokens,
      safetyBuffer,
      availableForContract: availableTokensForContract,
    })

    // Truncate contract text to fit within available tokens
    const truncatedContractText = truncateToTokenLimit(contractText, availableTokensForContract)
    const finalTokenEstimate = estimateTokens(systemPrompt) + estimateTokens(truncatedContractText)

    console.log("Final text stats:", {
      originalLength: contractText.length,
      truncatedLength: truncatedContractText.length,
      estimatedTotalTokens: finalTokenEstimate,
    })

    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Please analyze this real estate contract for the property at ${propertyAddress}:\n\n${truncatedContractText}`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    })

    console.log("OpenAI analysis completed successfully")

    const analysis = analysisResponse.choices[0].message.content || "Analysis could not be generated."

    console.log("Analysis length:", analysis.length)

    const result = {
      analysis,
      agentName,
      propertyAddress,
      email,
    }

    console.log("Returning successful response")
    return NextResponse.json(result)
  } catch (error) {
    console.error("Analysis error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      error,
    })

    // Return more specific error information
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json({ error: "OpenAI API key configuration error" }, { status: 500 })
      }
      if (error.message.includes("rate limit")) {
        return NextResponse.json({ error: "API rate limit exceeded. Please try again in a moment." }, { status: 429 })
      }
      if (error.message.includes("quota")) {
        return NextResponse.json({ error: "API quota exceeded. Please contact support." }, { status: 429 })
      }
      if (error.message.includes("maximum context length")) {
        return NextResponse.json(
          { error: "Contract text is too long. Please try with a shorter contract." },
          { status: 400 },
        )
      }
    }

    return NextResponse.json(
      {
        error: "Failed to analyze contract",
        details: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
