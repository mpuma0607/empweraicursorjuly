"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateContent } from "./actions"
import { Loader2, Copy, Download, Mail, Mic, MicOff, Save } from "lucide-react"
import Image from "next/image"
import { useMemberSpaceUser } from "@/hooks/use-memberspace-user"
import { saveUserCreation, generateCreationTitle } from "@/lib/auto-save-creation"

const topicOptions = [
  "The benefits of working with a real estate agent",
  "How to prepare your home for sale",
  "The process of buying a new home",
  "The importance of home inspections",
  "Tips for first-time home buyers",
  "How to stage your home for maximum appeal",
  "The benefits of owning a vacation home",
  "How to find the perfect neighborhood for your family",
  "The pros and cons of renting vs. buying",
  "How to negotiate a better deal on a home",
  "How to finance a new home",
  "How to find the best mortgage rates",
  "How to maintain and improve your credit score",
  "How to invest in real estate",
  "How to flip a house for profit",
  "How to find the best real estate deals",
  "How to make money in real estate",
  "How to create a budget for buying a new home",
  "How to handle closing costs",
  "How to find the right property management company",
  "How to choose the right home insurance",
  "How to create a home maintenance schedule",
  "How to find the best home warranty plan",
  "How to create a home security plan",
  "How to create a home automation system",
  "How to design a sustainable home",
  "How to find the best architect or designer for your home",
  "How to find the best contractor for your home renovation",
  "How to create a home office space",
  "How to create a home gym",
  "How to create a home theater",
  "How to create an outdoor living space",
  "How to create a home garden",
  "How to create a home pool or spa",
  "How to create a home wine cellar or tasting room",
  "How to create a home library or study",
  "How to create a home spa or massage room",
  "How to create a home sauna or steam room",
  "How to create a home game room or arcade",
  "How to create a home bar or lounge",
  "How to create a home pet grooming room",
  "How to create a home yoga or meditation room",
  "How to create a home greenhouse or sunroom",
  "How to create a home artist studio",
  "How to create a home dance studio",
  "How to create a home music studio",
  "How to create a home photography studio",
  "How to create a home craft or sewing room",
  "A beginner's guide to real estate investing",
  "A step-by-step guide to buying your first home",
  "A guide to understanding the mortgage process",
  "A guide to home inspections and what to look for",
  "A guide to understanding property taxes",
  "A guide to the different types of mortgages",
  "A guide to the home buying process for veterans",
  "A guide to understanding home insurance",
  "A guide to home staging for sellers",
  "A guide to understanding property values and appraisals",
  "A guide to understanding closing costs",
  "A guide to understanding zoning laws and building codes",
  "A guide to understanding the real estate market",
  "A guide to understanding real estate contracts",
  "A guide to understanding home warranties",
  "A guide to understanding home security systems",
  "A guide to understanding home automation systems",
  "A guide to understanding the benefits of owning a vacation home",
  "A guide to understanding property management",
  "A guide to understanding the benefits of renting vs. buying",
  "A guide to understanding real estate trends",
  "How to buy and sell luxury properties",
  "How to buy and sell homes for first-time home buyers",
  "How to buy and sell properties for investors",
  "How to buy and sell new construction properties",
  "How to buy and sell foreclosures",
  "How to buy and sell short sales",
  "How to buy and sell rental properties",
  "How to buy and sell vacation homes",
  "How to buy and sell waterfront properties",
  "How to buy and sell beach properties",
  "How to buy and sell ski properties",
  "How to buy and sell properties on golf courses",
  "How to buy and sell farm and ranch properties",
  "How to buy and sell commercial properties",
  "Why use a real estate agent instead of going FSBO?",
  "What does 'under contract' really mean?",
  "The steps to buying your first home",
  "The importance of getting pre-approved",
  "How to win in a multiple offer situation",
  "What is earnest money and how does it work?",
  "The difference between being pre-qualified and pre-approved",
  "How interest rates affect your home buying power",
  "Understanding closing costs",
  "What is a contingency?",
  "What does a home appraisal do?",
  "What's included in a home inspection?",
  "Timeline for selling a home from listing to close",
  "What's the difference between a buyer's agent and listing agent?",
  "How to stage your home to sell faster",
  "Top home improvements that add value",
  "When is the best time of year to buy or sell?",
  "How to pick the right offer as a seller",
  "The truth about Zillow 'Zestimates'",
  "What happens at closing?",
  "5 signs you're ready to buy a home",
  "3 things every first-time buyer should know",
  "Common mistakes sellers make and how to avoid them",
  "What is a CMA and why does it matter?",
  "Why pricing your home right matters more than ever",
  "How real estate commissions work",
  "Understanding title insurance",
  "What is escrow?",
  "What is a mortgage point?",
  "Home loan types explained",
  "Understanding property taxes",
  "The home buying process from A to Z",
  "What to do if your appraisal comes in low",
  "What is a short sale?",
  "What is foreclosure?",
  "What is house hacking?",
  "What to know before buying a fixer-upper",
  "What is private mortgage insurance (PMI)?",
  "What does 'as-is' mean in real estate?",
  "How to read a real estate listing",
  "How to buy a second home or vacation property",
  "What's a 1031 exchange?",
  "How much do I need for a down payment?",
  "How to choose the right neighborhood",
  "Understanding HOA rules and fees",
  "Should you waive the inspection?",
  "What is a pocket listing?",
  "How real estate appraisers determine value",
  "What is an escalation clause?",
  "How to move without losing your mind",
  "The real cost of waiting to buy",
  "How long does it take to close?",
  "The difference between list price and sale price",
  "Tips for selling a home with pets",
  "Do I need an open house to sell my home?",
  "Tips to get your offer accepted",
  "How to sell and buy at the same time",
  "What to expect on picture day (listing photos)",
  "How to avoid buyer's remorse",
  "What is dual agency?",
  "What is a home warranty?",
  "Common home inspection issues and how to fix them",
  "How long do homes stay on the market?",
  "What to know about new construction homes",
  "What is a real estate lien?",
  "How to transfer utilities when moving",
  "The benefits of homeownership",
  "Pros and cons of condos vs. houses",
  "How long should you live in a home before selling?",
  "What affects a home's value?",
  "What is a deed?",
  "How long does an appraisal take?",
  "How to prepare for a home appraisal",
  "What happens if a buyer backs out?",
  "How to sell a home with a tenant",
  "What is an earnest money deposit?",
  "When should you walk away from a deal?",
  "What are seller concessions?",
  "How to improve your credit before buying",
  "What are closing disclosures?",
  "Can I buy with no money down?",
  "What is a real estate team?",
  "The value of a local expert",
  "What happens during a final walkthrough?",
  "How to choose the right lender",
  "What is a listing agreement?",
  "Why now is (or isn't) a good time to buy/sell",
  "How to avoid wire fraud during closing",
  "How to read a settlement statement",
  "The role of a real estate attorney",
  "Should you renovate before selling?",
  "Can I sell my home myself?",
  "The truth about iBuyers",
  "How to buy land",
  "What is a balloon mortgage?",
  "Tips for buying a home during relocation",
  "What happens after the offer is accepted?",
  "What is a backup offer?",
  "Meme: When your client asks if they can afford a mansion on a ramen budget",
  "Funny 'what I think I do vs. what I actually do' real estate edition",
  "Real estate agent starter pack meme",
  "You know you're a homeowner when... post",
  "Before caffeine vs. after caffeine (realtor edition)",
  "Showcase your 'real estate agent outfit of the day'",
  "Real estate jokes: Why did the house go to therapy? It had window issues",
  "The 5 kinds of clients you'll meet (use GIFs)",
  "What I tell my clients vs. what I'm thinking",
  "Real estate pickup lines: Are you a mortgage? Because you've got my interest",
  "Memes about Zillow addiction",
  "Parody a HGTV house hunter episode",
  "Funny bloopers from showings or open houses",
  "Most bizarre listing photo you've seen",
  "Expectation vs. reality: house hunting edition",
  "What my dog thinks I do all day",
  "Caption this awkward listing photo",
  "The funniest item you've seen in a home",
  "Realtor math: 30 minutes = 3 hours",
  "You had one job... (bad MLS photo post)",
  "Buyer logic vs. reality",
  "Real estate agent's dream car = car with a bathroom",
  "Would you rather: City condo or countryside cottage?",
  "Which kitchen design do you prefer? (A vs. B)",
  "Dream home location — beach, mountains, or city?",
  "What's the #1 thing on your home wishlist?",
  "What color would you paint your front door?",
  "How many times have you moved?",
  "What's one feature your dream home MUST have?",
  "What's your biggest dealbreaker when buying?",
  "What's your current home's nickname?",
  "Show me your current view — comment a photo!",
  "What real estate question do you wish you had the answer to?",
  "Which backyard setup would you choose?",
  "Do you believe in ghosts? Would you live in a 'haunted' house?",
  "Caption this photo challenge",
  "Poll: Should open floor plans go away?",
  "Which house wins the 'curb appeal' crown?",
  "What's your favorite home scent?",
  "Is now a good time to buy? Tell me why or why not",
  "How many homes would you tour before making an offer?",
  "Show me your favorite cozy corner at home",
  "What's your biggest home improvement regret?",
  "Dream Airbnb location?",
  "Would you flip a house if you could?",
  "Favorite local coffee shop? Tag them!",
  "What's your biggest moving tip?",
  "Share your funniest moving story!",
  "What's the weirdest house you've ever seen?",
  "Vote: carpet or hardwood?",
  "Ask me anything: real estate edition!",
  "What's your dream garage setup?",
  "Poll: pool or no pool?",
  "What's your budget decor hack?",
  "How old were you when you bought your first home?",
  "Would you live in a tiny home?",
  "Which celebrity's home would you want?",
  "What home upgrade is worth the splurge?",
  "What's your biggest home organization tip?",
  "Would you rather have a big yard or a big kitchen?",
  "What's one thing you'd change about your current home?",
  "What's your favorite paint color?",
  "What's your dream backyard feature?",
  "Comment a GIF that describes house hunting",
  "Would you live on a boat? Yes or no?",
  "Show me your favorite room!",
  "What should I cover in my next video?",
  "Can you guess the listing price?",
  "What's your current dream neighborhood?",
  "If you won the lottery, what kind of house would you buy?",
  "What would you name your future house?",
  "Tag someone who needs to buy a house!",
  "What local business should I feature next?",
  "What's your favorite holiday decor tradition?",
  "Would you ever live off-grid?",
  "Poll: Home gym or home office?",
  "What podcast do you listen to when organizing?",
  "Vote on your favorite kitchen backsplash!",
  "What real estate myth do you still hear?",
  "What's your biggest fear in buying/selling?",
  "Show me your dream home layout!",
  "Ever had a bad home buying experience?",
  "What's your favorite part of your home?",
  "Tag someone who needs a home makeover!",
  "Can you guess this home's age?",
  "What's your go-to moving day food?",
  "Favorite thing about your hometown?",
  "Share your go-to cleaning hack",
  "Tag a friend you'd live with forever!",
  "What's your #1 dealbreaker in a home?",
  "What's your dream walk-in closet feature?",
  "Would you take on a fixer-upper?",
  "Show us your pet's favorite spot at home",
  "Would you rather: Smart home or simple living?",
  "Favorite movie home of all time?",
  "Tag someone who needs to move ASAP",
  "What does 'home' mean to you?",
  "What's your ideal commute time?",
  "What's your weirdest home must-have?",
  "Are you team 'declutter everything' or 'organized chaos'?",
  "If walls could talk… what would your house say?",
  "What's the most unique house name you've heard?",
  "What room would you renovate first?",
  "Would you live in a converted school bus?",
  "What's your biggest home design regret?",
  "Best advice for first-time buyers?",
  "What's your go-to Pinterest board?",
  "Favorite HGTV show?",
  "Most important factor when choosing a home?",
  "What's your guilty pleasure in home design?",
  "Have you ever lived in a haunted house?",
  "Best advice you've received when buying a home?",
  "How would you spend $25K on your house?",
  "What's the best part of owning a home?",
  "How do you celebrate move-in day?",
  "What's your dream front porch setup?",
  "Would you rather build or buy?",
  "Describe your dream kitchen in 3 emojis",
  "What's your real estate hot take?",
  "What's your biggest home-buying regret?",
  "What's your go-to real estate app?",
  "How do you make your house feel like home?",
]

const tonalityOptions = [
  {
    value: "Professional & Authoritative",
    description: "Tone: Confident, knowledgeable, clear",
  },
  {
    value: "Friendly & Approachable",
    description: "Tone: Warm, conversational, down-to-earth",
  },
  {
    value: "Witty & Playful",
    description: "Tone: Lighthearted, tongue-in-cheek, surprising twists",
  },
  {
    value: "Inspirational & Motivational",
    description: "Tone: Uplifting, aspirational, empowering",
  },
  {
    value: "Educational & Informative",
    description: "Tone: Clear, explanatory, step-by-step",
  },
  {
    value: "Conversational & Story-Driven",
    description: "Tone: Narrative, personal anecdotes, dialogue style",
  },
  {
    value: "Urgent & Action-Oriented",
    description: 'Tone: Direct, brisk, focused on "now"',
  },
  {
    value: "Empathetic & Supportive",
    description: "Tone: Compassionate, understanding, reassuring",
  },
  {
    value: "Visionary & Futuristic",
    description: "Tone: Forward-looking, trend-spotting, big-picture",
  },
  {
    value: "Bold & Disruptive",
    description: "Tone: Challenging conventions, strong opinions, confident declarations",
  },
]

type FormState = {
  primaryTopic: string
  alternateTopic: string
  language: string
  name: string
  email: string
  contentType: string
  tonality: string
}

type ContentResult = {
  text: string
  imageUrl: string
  imageBuffer?: Buffer
}

export default function IdeaHubForm() {
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const { user, loading: userLoading } = useMemberSpaceUser()
  const [formData, setFormData] = useState<FormState>({
    primaryTopic: "",
    alternateTopic: "",
    language: "English",
    name: "",
    email: "",
    contentType: "Social post",
    tonality: "Professional & Authoritative",
  })
  const [result, setResult] = useState<ContentResult | null>(null)

  // Auto-populate user data when available
  useEffect(() => {
    if (user && !userLoading) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: prev.email || user.email || "",
      }))
    }
  }, [user, userLoading])

  // Auto-scroll to results when they're generated
  useEffect(() => {
    if (result && step === 3 && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 100)
    }
  }, [result, step])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.")
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognitionRef.current = recognition

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setFormData((prev) => ({
        ...prev,
        alternateTopic: prev.alternateTopic + (prev.alternateTopic ? " " : "") + transcript,
      }))
    }

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      const generatedContent = await generateContent(formData)
      setResult(generatedContent)
      setStep(3)
    } catch (error) {
      console.error("Error generating content:", error)
      alert("Failed to generate content. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    if (result?.text) {
      navigator.clipboard.writeText(result.text)
      alert("Text copied to clipboard!")
    }
  }

  const downloadImage = () => {
    if (result?.imageUrl) {
      try {
        // Create a download link for the base64 image
        const link = document.createElement("a")
        link.href = result.imageUrl
        link.download = "social-media-image-branded.jpg"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (error) {
        console.error("Error downloading image:", error)
        alert("Failed to download image. Please try again.")
      }
    }
  }

  const sendEmail = async () => {
    if (result?.text && result?.imageUrl) {
      setIsSendingEmail(true)
      try {
        const response = await fetch("/api/ideahub", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "send-email",
            data: {
              to: formData.email,
              name: formData.name,
              content: result.text,
              imageUrl: result.imageUrl,
            },
          }),
        })

        const data = await response.json()

        if (data.success) {
          alert("Email sent successfully! Check your inbox.")
        } else {
          throw new Error(data.error || "Failed to send email")
        }
      } catch (error) {
        console.error("Error sending email:", error)
        alert(`Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`)
      } finally {
        setIsSendingEmail(false)
      }
    }
  }

  const saveToProfile = async () => {
    if (!user || !result?.text) {
      alert("Please log in to save your content.")
      return
    }

    setIsSaving(true)
    try {
      const title = generateCreationTitle("ideahub-ai", formData)
      await saveUserCreation({
        userId: user.id.toString(),
        userEmail: user.email,
        toolType: "ideahub-ai",
        title,
        content: result.text,
        formData,
        metadata: {
          imageUrl: result.imageUrl,
          contentType: formData.contentType,
          tonality: formData.tonality,
          language: formData.language,
          topic: formData.primaryTopic || formData.alternateTopic,
        },
      })
      alert("Content saved to your profile successfully!")
    } catch (error) {
      console.error("Error saving content:", error)
      alert("Failed to save content. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const renderStepOne = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="primaryTopic">Choose a Topic (Optional)</Label>
        <Select value={formData.primaryTopic} onValueChange={(value) => handleSelectChange("primaryTopic", value)}>
          <SelectTrigger id="primaryTopic">
            <SelectValue placeholder="Select a topic from our library" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {topicOptions.map((topic, index) => (
              <SelectItem key={index} value={topic}>
                {topic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="alternateTopic">Custom Topic or Additional Details</Label>
        <div className="relative">
          <Textarea
            id="alternateTopic"
            name="alternateTopic"
            placeholder="Enter any custom topic or additional details you'd like to include"
            value={formData.alternateTopic}
            onChange={handleInputChange}
            className="min-h-[100px] pr-12"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0"
            onClick={isListening ? stopListening : startListening}
          >
            {isListening ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
          </Button>
        </div>
        {isListening && <p className="text-sm text-blue-600">Listening... Speak now</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contentType">Content Type *</Label>
        <Select value={formData.contentType} onValueChange={(value) => handleSelectChange("contentType", value)}>
          <SelectTrigger id="contentType">
            <SelectValue placeholder="Select content type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Social post">Social Post</SelectItem>
            <SelectItem value="Email">Email</SelectItem>
            <SelectItem value="Blog article">Blog Article</SelectItem>
            <SelectItem value="Text message">Text Message</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tonality">Tonality</Label>
        <Select value={formData.tonality} onValueChange={(value) => handleSelectChange("tonality", value)}>
          <SelectTrigger id="tonality">
            <SelectValue placeholder="Select tonality" />
          </SelectTrigger>
          <SelectContent>
            {tonalityOptions.map((option, index) => (
              <SelectItem key={index} value={option.value}>
                <div>
                  <div className="font-medium">{option.value}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Select value={formData.language} onValueChange={(value) => handleSelectChange("language", value)}>
          <SelectTrigger id="language">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Spanish">Spanish</SelectItem>
            <SelectItem value="French">French</SelectItem>
            <SelectItem value="German">German</SelectItem>
            <SelectItem value="Italian">Italian</SelectItem>
            <SelectItem value="Portuguese">Portuguese</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={() => setStep(2)}
        disabled={!formData.primaryTopic && !formData.alternateTopic}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
      >
        Next
      </Button>
    </div>
  )

  const renderStepTwo = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Your Name *</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Your Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isGenerating || !formData.name || !formData.email}
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            "Generate Content"
          )}
        </Button>
      </div>
    </div>
  )

  const renderStepThree = () => (
    <div ref={resultsRef} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-black">Your Content is Ready!</h3>
        <p className="text-gray-600">
          Here's your professionally generated social media content with Century 21 branding
        </p>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="text">Text Only</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="space-y-4">
          <Card className="border-0 shadow-md overflow-hidden">
            <CardContent className="p-0">
              {result?.imageUrl && (
                <div className="relative w-full h-[300px]">
                  <Image
                    src={result.imageUrl || "/placeholder.svg"}
                    alt="Generated content image with Century 21 branding"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <p className="whitespace-pre-wrap text-gray-800">{result?.text}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="text">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <Textarea value={result?.text || ""} readOnly className="min-h-[300px] resize-none" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Button
          variant="outline"
          onClick={copyToClipboard}
          className="flex items-center justify-center gap-2 bg-transparent"
        >
          <Copy className="h-4 w-4" /> <span className="whitespace-nowrap">Copy</span>
        </Button>
        <Button
          variant="outline"
          onClick={downloadImage}
          className="flex items-center justify-center gap-2 bg-transparent"
        >
          <Download className="h-4 w-4" /> <span className="whitespace-nowrap">Download</span>
        </Button>
        <Button
          variant="outline"
          onClick={sendEmail}
          disabled={isSendingEmail}
          className="flex items-center justify-center gap-2 bg-transparent"
        >
          {isSendingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          <span className="whitespace-nowrap">Email</span>
        </Button>
        <Button
          variant="outline"
          onClick={saveToProfile}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 bg-transparent"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span className="whitespace-nowrap">Save</span>
        </Button>
      </div>

      <Button
        onClick={() => {
          setStep(1)
          setResult(null)
          setFormData({
            primaryTopic: "",
            alternateTopic: "",
            language: "English",
            name: "",
            email: "",
            contentType: "Social post",
            tonality: "Professional & Authoritative",
          })
        }}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
      >
        Create New Content
      </Button>
    </div>
  )

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-2">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 1 ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            1
          </div>
          <div className={`h-1 w-16 ${step >= 2 ? "bg-purple-600" : "bg-gray-200"}`}></div>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 3 ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            3
          </div>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        {step === 1 && renderStepOne()}
        {step === 2 && renderStepTwo()}
        {step === 3 && renderStepThree()}
      </form>
    </div>
  )
}
