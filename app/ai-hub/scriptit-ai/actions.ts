"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

type ScriptFormData = {
  agentName: string
  brokerageName: string
  scriptType: string
  topic: string
  customTopic: string
  additionalDetails: string
  agentEmail: string
  scriptTypeCategory: string
  difficultConversationType: string
  tonality: string
}

type ScriptResult = {
  script: string
}

const scriptTypeOptions = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone Call" },
  { value: "text", label: "Text Message" },
  { value: "video", label: "Video Script" },
  { value: "doorknocking", label: "Door Knocking" },
]

const topicOptions = [
  { value: "current-client", label: "Current Client" },
  { value: "expired-listing", label: "Expired Listing" },
  { value: "first-time-homebuyer", label: "First Time Homebuyer" },
  { value: "past-client", label: "Past Client" },
  { value: "neighbor", label: "Neighbor" },
  { value: "fsbo", label: "FSBO (For Sale By Owner)" },
  { value: "homeowner-high-equity", label: "Homeowner with High Equity" },
  { value: "foreclosure", label: "Foreclosure" },
  { value: "rental", label: "Rental" },
  { value: "divorce", label: "Divorce" },
  { value: "just-sold", label: "Just Sold" },
  { value: "other", label: "Other (Custom Topic)" },
]

export async function generateScript(formData: ScriptFormData) {
  try {
    // Determine the topic to use
    const topicToUse = formData.topic === "other" ? formData.customTopic : formData.topic

    // Get script type details
    const scriptTypeDetails = getScriptTypeDetails(formData.scriptType)

    // Get topic-specific context
    let topicContext = ""
    let scriptPurpose = ""

    // Handle difficult conversations differently
    if (formData.scriptTypeCategory === "Difficult conversation") {
      topicContext = getDifficultConversationContext(formData.difficultConversationType)
      scriptPurpose = `This is a script for you to use when having a difficult conversation with your client about: ${formData.difficultConversationType}. The script should help you navigate this sensitive situation professionally and maintain the client relationship.`
    } else {
      topicContext = getTopicContext(topicToUse)
      scriptPurpose = `This is a ${formData.scriptTypeCategory.toLowerCase()} targeting ${topicToUse}.`
    }

    const prompt = `You are an expert real estate script writer. Create ONE professional ${formData.scriptType} script for ${formData.agentName} from ${formData.brokerageName}.

SCRIPT PURPOSE: ${scriptPurpose}

${scriptTypeDetails.requirements}

TONALITY: Use a ${formData.tonality} tonality throughout the script. This should influence your word choice, sentence structure, and overall approach.

IMPORTANT LANGUAGE REQUIREMENTS:

- Naturally incorporate Visual language: "see," "picture," "look," "view," "imagine," "envision," "clear," "bright," "focus," "show," "appear," "visualize"

- Naturally incorporate Auditory language: "hear," "listen," "sounds," "tell," "discuss," "rings true," "clicks," "resonates," "speak," "talk," "mention"  

- Naturally incorporate Kinesthetic language: "feel," "touch," "grasp," "handle," "solid," "smooth," "comfortable," "experience," "sense," "connect," "move"

TOPIC CONTEXT: ${topicContext}

SCRIPT STRUCTURE:

${
  formData.scriptTypeCategory === "Difficult conversation"
    ? `1. Opening (acknowledge the situation with empathy)
2. Present the facts clearly and professionally
3. Listen and validate their concerns
4. Offer solutions or next steps
5. Reaffirm your commitment to their success
6. Close with confidence and next actions`
    : `1. Opening Hook (attention-grabbing, builds rapport)
2. Value Proposition (clear benefit using sensory language)
3. Proof/Credibility (establish trust)
4. Call to Action (specific next step)
5. Objection Handling (brief, if applicable)`
}

TONE: ${formData.tonality}, professional, conversational, confident but not pushy, empathetic

${formData.additionalDetails ? `ADDITIONAL REQUIREMENTS: ${formData.additionalDetails}` : ""}

${scriptTypeDetails.lengthGuidance}

Write this as ONE complete, flowing script that naturally weaves in visual, auditory, and kinesthetic language throughout while maintaining the ${formData.tonality} tonality. Make it sound conversational and natural. Do NOT create separate sections or versions. Just write one professional script.`

    const { text: generatedScript } = await generateText({
      model: openai("gpt-5"),
      prompt: prompt,
    })

    return {
      script: generatedScript,
    }
  } catch (error) {
    console.error("Error generating script:", error)
    throw new Error("Failed to generate script. Please try again.")
  }
}

function getScriptTypeDetails(scriptType: string) {
  const details = {
    email: {
      requirements:
        "Create a professional email with subject line, greeting, body content, and closing signature. Format it as a complete email.",
      lengthGuidance: "Keep the email comprehensive but scannable - aim for 200-400 words total.",
    },
    phone: {
      requirements: "Create a phone conversation script with natural dialogue flow and pause points for responses.",
      lengthGuidance: "Create a 2-3 minute conversation script (approximately 300-500 words).",
    },
    text: {
      requirements: "Create a concise, friendly text message that's action-oriented.",
      lengthGuidance:
        "KEEP THIS VERY SHORT - Maximum 160 characters to fit in one SMS message. Be direct and compelling.",
    },
    video: {
      requirements: "Create a video script with clear speaking points and natural flow.",
      lengthGuidance: "Create a 60-90 second video script (approximately 150-250 words).",
    },
    doorknocking: {
      requirements: "Create a face-to-face conversation script for door-to-door prospecting with natural dialogue.",
      lengthGuidance: "Create a 1-2 minute door conversation script (approximately 200-350 words).",
    },
  }

  return details[scriptType as keyof typeof details] || details.phone
}

function getTopicContext(topic: string) {
  const contexts = {
    "current-client":
      "Focus on maintaining the relationship, providing updates, and ensuring client satisfaction. Address any concerns and reinforce your value.",
    "expired-listing":
      "Focus on why their listing didn't sell, market expertise, and fresh marketing approach. Address frustration and offer hope.",
    "first-time-homebuyer":
      "Emphasize guidance, education, and support through the buying process. Address fears and excitement.",
    "past-client":
      "Leverage existing relationship, referral opportunities, and continued service. Focus on staying connected.",
    neighbor: "Use local market knowledge, recent sales activity, and community connection. Be neighborly and helpful.",
    fsbo: "Address challenges of selling alone, market expertise, and time savings. Respect their independence while showing value.",
    "homeowner-high-equity":
      "Focus on market opportunities, timing, and wealth-building potential. Appeal to financial benefits.",
    foreclosure: "Be sensitive and helpful, focus on solutions and options. Emphasize urgency with compassion.",
    rental: "Address investment opportunities, market timing, and property management benefits.",
    divorce:
      "Be extremely sensitive, focus on practical solutions and discretion. Emphasize support and understanding.",
    "just-sold":
      "Congratulate and leverage success story for referrals and future business. Build on positive momentum.",
  }

  return contexts[topic as keyof typeof contexts] || "Focus on providing value and building trust with the prospect."
}

function getDifficultConversationContext(conversationType: string) {
  const contexts = {
    "Price Reduction Request":
      "Help the client understand market realities while maintaining their confidence in your strategy. Present data-driven reasons and alternative solutions.",
    "Listing Not Selling":
      "Address concerns about marketing strategy, pricing, and market conditions. Reassure them of your commitment while suggesting adjustments.",
    "Buyer Wants to Cancel Contract":
      "Understand their concerns, explore solutions, and protect their interests while maintaining professionalism.",
    "Seller Unrealistic on Price":
      "Use market data and comparable sales to educate them on realistic pricing while preserving the relationship.",
    "Home Inspection Issues":
      "Guide them through the inspection results, explain significance of issues, and help negotiate repairs or credits.",
    "Low Appraisal Conversation":
      "Explain the appraisal process, discuss options for moving forward, and help them understand their choices.",
    "Client Ghosting or Going Silent":
      "Re-engage them professionally, address potential concerns, and reestablish communication.",
    "Discussing Commission Concerns":
      "Explain your value proposition, services provided, and justify your commission structure professionally.",
    "Competing Agent or Friend in the Business":
      "Differentiate your services, maintain professionalism, and focus on your unique value.",
    "Multiple Offers – Managing Expectations":
      "Help them understand the competitive process and set realistic expectations about outcomes.",
    "Client Not Ready to Commit":
      "Understand their hesitations, address concerns, and help them move forward when they're ready.",
    "Financing Fell Through":
      "Provide support, explore alternative financing options, and help them navigate next steps.",
    "Delays in Closing":
      "Communicate delays professionally, manage expectations, and provide solutions to move forward.",
    "Expired Listing Follow-Up":
      "Address why the listing expired, present new strategies, and rebuild confidence in your services.",
    "Termination of Representation":
      "Handle the conversation professionally, understand their concerns, and part ways amicably.",
    "Telling a Buyer They're Over Bidding":
      "Use market data to show fair value, protect their interests, and guide them to competitive offers.",
    "Seller Won't Make Repairs":
      "Help negotiate alternatives, explain market impact, and find mutually acceptable solutions.",
    "Difficult Tenant in the Property": "Address tenant issues, legal considerations, and impact on the sale process.",
    "Client Pushing for Off-Market Deals":
      "Explain market realities, set proper expectations, and guide them to realistic opportunities.",
    "When the Market Has Shifted": "Educate them on current market conditions and adjust strategies accordingly.",
    "Unrealistic Home Search Criteria":
      "Help them prioritize needs vs. wants and adjust expectations to market realities.",
    "Client Making Emotional Decisions":
      "Provide objective guidance, help them see the bigger picture, and make rational decisions.",
    "Talking About Why You're the Best Agent":
      "Confidently present your qualifications, experience, and unique value proposition.",
    "Explaining Market Conditions They Don't Want to Hear":
      "Present market realities with empathy while helping them understand necessary adjustments.",
  }

  return (
    contexts[conversationType as keyof typeof contexts] ||
    "Navigate this difficult conversation with empathy, professionalism, and focus on solutions."
  )
}
