import { NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface PropertyScriptRequest {
  // Property/Owner Data
  propertyAddress: string
  ownerNames?: string[]
  propertyType?: string
  estimatedValue?: string
  propertyDetails?: string
  
  // Script Configuration
  deliveryMethod: "email" | "phone" | "text" | "in-person"
  prospectType: "fsbo" | "expired" | "absentee" | "off-market" | "other"
  customProspectType?: string
  language: string
  tonality: string
  
  // Agent Information
  agentName: string
  brokerageName: string
  agentEmail: string
  
  // Additional Context
  additionalDetails?: string
}

const deliveryMethodDetails = {
  email: {
    requirements: "Create a professional email with subject line, greeting, body content, and closing signature.",
    lengthGuidance: "Keep the email comprehensive but scannable - aim for 150-200 words total.",
    format: "email"
  },
  phone: {
    requirements: "Create a phone conversation script with natural dialogue flow and pause points for responses.",
    lengthGuidance: "Create a 30-60 second conversation script (approximately 100-200 words).",
    format: "conversation"
  },
  text: {
    requirements: "Create a concise, friendly text message that's action-oriented.",
    lengthGuidance: "KEEP THIS VERY SHORT - Maximum 160 characters to fit in one SMS message. Be direct and compelling.",
    format: "text"
  },
  "in-person": {
    requirements: "Create a face-to-face conversation script for door-to-door prospecting with natural dialogue.",
    lengthGuidance: "Create a 60-90 second door conversation script (approximately 150-250 words).",
    format: "conversation"
  }
}

const prospectTypeContexts = {
  fsbo: "Address challenges of selling alone, market expertise, and time savings. Respect their independence while showing value.",
  expired: "Focus on why their listing didn't sell, market expertise, and fresh marketing approach. Address frustration and offer hope.",
  absentee: "Emphasize property management challenges, market opportunities, and the benefits of professional representation.",
  "off-market": "Highlight the advantages of working with a professional agent and accessing exclusive opportunities.",
  other: "Focus on providing value and building trust with the prospect based on their specific situation."
}

export async function POST(request: NextRequest) {
  try {
    const body: PropertyScriptRequest = await request.json()
    
    // Validate required fields
    if (!body.propertyAddress || !body.deliveryMethod || !body.prospectType || !body.agentName || !body.brokerageName) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing required fields: propertyAddress, deliveryMethod, prospectType, agentName, brokerageName" 
      }, { status: 400 })
    }

    const deliveryDetails = deliveryMethodDetails[body.deliveryMethod]
    const prospectContext = body.prospectType === "other" && body.customProspectType 
      ? `Focus on ${body.customProspectType} and provide value based on their specific situation.`
      : prospectTypeContexts[body.prospectType]

                    // Build property context
                const propertyContext = `
Property Address: ${body.propertyAddress}
${body.ownerNames && body.ownerNames.length > 0 ? `Owner Names: ${body.ownerNames.join(", ")}` : ""}
${body.propertyType ? `Property Type: ${body.propertyType}` : ""}
${body.estimatedValue ? `Estimated Value: ${body.estimatedValue}` : ""}
${body.propertyDetails ? `Property Details: ${body.propertyDetails}` : ""}
`.trim()

                // Enhanced personalization context
                const personalizationContext = body.ownerNames && body.ownerNames.length > 0 
                  ? `PERSONALIZATION: Use the owner names "${body.ownerNames.join(", ")}" naturally throughout the script. Address them directly by name when appropriate.`
                  : "PERSONALIZATION: Make the script feel personal and specific to this property and situation."

                const valueContext = body.estimatedValue 
                  ? `VALUE CONTEXT: The property has an estimated value of ${body.estimatedValue}. Use this information strategically in the script to show market knowledge and create urgency or opportunity.`
                  : "VALUE CONTEXT: Focus on the property's market potential and opportunities."

    const prompt = `You are an expert real estate script writer. Create ONE professional ${body.deliveryMethod} script for ${body.agentName} from ${body.brokerageName}.

            PROPERTY CONTEXT:
            ${propertyContext}
            
            ${personalizationContext}
            
            ${valueContext}
            
            SCRIPT PURPOSE: This is a prospecting script targeting ${body.prospectType === "other" ? body.customProspectType : body.prospectType} prospects for the property at ${body.propertyAddress}.

${deliveryDetails.requirements}

TONALITY: Use a ${body.tonality} tonality throughout the script. This should influence your word choice, sentence structure, and overall approach.

PROSPECT CONTEXT: ${prospectContext}

IMPORTANT LANGUAGE REQUIREMENTS (VAK Integration):

- Naturally incorporate Visual language: "see," "picture," "look," "view," "imagine," "envision," "clear," "bright," "focus," "show," "appear," "visualize"

- Naturally incorporate Auditory language: "hear," "listen," "sounds," "tell," "discuss," "rings true," "clicks," "resonates," "speak," "talk," "mention"  

- Naturally incorporate Kinesthetic language: "feel," "touch," "grasp," "handle," "solid," "smooth," "comfortable," "experience," "sense," "connect," "move"

SCRIPT STRUCTURE:
1. Opening Hook (attention-grabbing, builds rapport using property details)
2. Value Proposition (clear benefit using sensory language)
3. Proof/Credibility (establish trust with market expertise)
4. Call to Action (specific next step)
5. Objection Handling (brief, if applicable)

TONE: ${body.tonality}, professional, conversational, confident but not pushy, empathetic

${body.additionalDetails ? `ADDITIONAL REQUIREMENTS: ${body.additionalDetails}` : ""}

${deliveryDetails.lengthGuidance}

Write this as ONE complete, flowing script that naturally weaves in visual, auditory, and kinesthetic language throughout while maintaining the ${body.tonality} tonality. Make it sound conversational and natural. Do NOT create separate sections or versions. Just write one professional script.

            IMPORTANT: Personalize the script using the specific property address, owner names, and property value. Make it clear this is about their specific property. Use owner names naturally in the conversation flow.`

    const { text: generatedScript } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
    })

    return NextResponse.json({
      success: true,
      script: generatedScript,
      metadata: {
        propertyAddress: body.propertyAddress,
        deliveryMethod: body.deliveryMethod,
        prospectType: body.prospectType,
        customProspectType: body.customProspectType,
        tonality: body.tonality,
        agentName: body.agentName,
        brokerageName: body.brokerageName,
        generatedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error("Error generating property script:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate script"
    }, { status: 500 })
  }
} 