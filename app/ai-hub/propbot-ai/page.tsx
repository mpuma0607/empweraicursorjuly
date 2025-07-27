"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic, MicOff, Search, Home, MapPin, Bed, Bath, Square, DollarSign, Calendar, CheckCircle, ExternalLink, ArrowUpDown, AlertTriangle, ThumbsUp } from 'lucide-react'
import { searchProperties } from "./actions"
import { useActionState } from "react"

interface Property {
  zpid: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  livingArea: number
  lotSize?: number
  yearBuilt?: number
  propertyType: string
  homeStatus: string
  zestimate?: number
  rentZestimate?: number
  photos?: string[]
  description?: string
  features?: string[]
  aiAnalysis?: string
  matchScore?: number
  matchReasons?: string[]
  missingFeatures?: string[]
  brokerName?: string
  url?: string
  pricePerSqft?: number
}

export default function PropBotAIPage() {
  const [isListening, setIsListening] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("price-high")
  const [state, formAction, isPending] = useActionState(searchProperties, null)

  // Client-side sorting function
  const sortProperties = (properties: Property[], sortType: string): Property[] => {
    const sorted = [...properties]

    console.log(`PropBot AI: Client-side sorting by ${sortType}`)
    console.log(
      `PropBot AI: Before sort - First 3 prices:`,
      sorted.slice(0, 3).map((p) => p.price),
    )

    switch (sortType) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        sorted.sort((a, b) => b.price - a.price)
        break
      case "sqft-high":
        sorted.sort((a, b) => b.livingArea - a.livingArea)
        break
      case "sqft-low":
        sorted.sort((a, b) => a.livingArea - b.livingArea)
        break
      case "price-per-sqft":
        sorted.sort((a, b) => (a.pricePerSqft || 0) - (b.pricePerSqft || 0))
        break
      case "newest":
        sorted.sort((a, b) => (b.yearBuilt || 0) - (a.yearBuilt || 0))
        break
      case "match":
        sorted.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
        break
      default:
        sorted.sort((a, b) => b.price - a.price)
        break
    }

    console.log(
      `PropBot AI: After sort - First 3 prices:`,
      sorted.slice(0, 3).map((p) => p.price),
    )
    return sorted
  }

  // Get sorted properties for display
  const displayProperties = state?.properties ? sortProperties(state.properties, sortBy) : []

  const startListening = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()

      // Mobile-optimized settings
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = "en-US"
      recognition.maxAlternatives = 3

      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        recognition.continuous = false
        recognition.interimResults = true
        recognition.speechTimeoutLength = 10000
        recognition.speechInputPossiblyComplete = 8000
      }

      let finalTranscript = ""
      let interimTranscript = ""

      recognition.onstart = () => {
        setIsListening(true)
        console.log("Voice recognition started")
      }

      recognition.onresult = (event: any) => {
        finalTranscript = ""
        interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        const currentText = finalTranscript || interimTranscript
        if (currentText.trim()) {
          setSearchQuery(currentText)
        }

        console.log("Voice result:", { final: finalTranscript, interim: interimTranscript })
      }

      recognition.onerror = (event: any) => {
        console.error("Voice recognition error:", event.error)
        setIsListening(false)

        let errorMessage = "Voice recognition failed. "
        switch (event.error) {
          case "no-speech":
            errorMessage += "No speech detected. Please try again."
            break
          case "audio-capture":
            errorMessage += "Microphone not accessible. Please check permissions."
            break
          case "not-allowed":
            errorMessage += "Microphone permission denied. Please enable microphone access."
            break
          case "network":
            errorMessage += "Network error. Please check your connection."
            break
          default:
            errorMessage += "Please try typing your search instead."
        }

        if (event.error !== "aborted") {
          alert(errorMessage)
        }
      }

      recognition.onend = () => {
        setIsListening(false)
        console.log("Voice recognition ended")

        if (finalTranscript.trim()) {
          setSearchQuery(finalTranscript.trim())
        }
      }

      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        navigator.mediaDevices
          ?.getUserMedia({ audio: true })
          .then(() => {
            recognition.start()
          })
          .catch((err) => {
            console.error("Microphone permission error:", err)
            alert("Please allow microphone access to use voice search.")
          })
      } else {
        recognition.start()
      }
    } else {
      alert("Voice recognition is not supported in your browser. Please try Chrome or Safari.")
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatSquareFeet = (sqft: number) => {
    return new Intl.NumberFormat("en-US").format(sqft)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Home className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold">PropBot AI</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Describe the perfect property in natural language, and let AI find, analyze, and filter the best matches from
          all available listings.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Property Search
            </CardTitle>
            <CardDescription>
              Describe what you're looking for in natural language. AI will analyze ALL available properties and filter
              out those missing your requirements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <div className="relative">
                <Textarea
                  name="searchQuery"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="4 bedroom homes with a pool in Tampa under $500,000..."
                  className="min-h-[100px] pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={startListening}
                  disabled={isListening}
                >
                  {isListening ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>

              {/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && (
                <div className="text-xs text-muted-foreground mt-2 p-2 bg-blue-50 rounded">
                  <strong>Mobile Voice Tips:</strong> Speak clearly, hold phone close to mouth, ensure good internet
                  connection
                </div>
              )}

              {isListening && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <div className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></div>
                  Listening... Speak now
                </div>
              )}

              <Button type="submit" disabled={isPending || !searchQuery.trim()} className="w-full">
                {isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing Properties...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Find Properties
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sorting Controls - Only show when we have results */}
        {state?.properties && state.properties.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  <span className="text-sm font-medium">Sort by:</span>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="match">Best Match</SelectItem>
                    <SelectItem value="sqft-high">Largest First</SelectItem>
                    <SelectItem value="sqft-low">Smallest First</SelectItem>
                    <SelectItem value="price-per-sqft">Price per Sq Ft</SelectItem>
                    <SelectItem value="newest">Newest Built</SelectItem>
                  </SelectContent>
                </Select>
                <Badge variant="secondary" className="text-sm">
                  {displayProperties.length} properties
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Summary */}
        {state?.searchSummary && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-green-800">AI Analysis Complete</h3>
              </div>
              <div className="text-sm text-green-700">
                <p className="mb-1">
                  <strong>Search:</strong> "{state.searchSummary.originalQuery}"
                </p>
                <p>
                  <strong>Results:</strong> Found {state.searchSummary.totalFound} properties, AI filtered to{" "}
                  {state.searchSummary.filtered} matches
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {displayProperties.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{displayProperties.length} AI-Verified Properties</h2>
              <Badge variant="secondary" className="text-sm">
                Sorted by {sortBy === "match" ? "Best Match" : sortBy.replace("-", " ")}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayProperties.map((property: Property) => (
                <Card key={property.zpid} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {property.photos && property.photos[0] && (
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={property.photos[0] || "/placeholder.svg"}
                        alt={property.address}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-green-600">{property.matchScore}% Match</Badge>
                      {property.pricePerSqft && (
                        <Badge className="absolute top-2 left-2 bg-blue-600">${property.pricePerSqft}/sqft</Badge>
                      )}
                    </div>
                  )}

                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{formatPrice(property.price)}</h3>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {property.address}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          {property.bedrooms} bed
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4" />
                          {property.bathrooms} bath
                        </div>
                        <div className="flex items-center gap-1">
                          <Square className="h-4 w-4" />
                          {formatSquareFeet(property.livingArea)} sqft
                        </div>
                      </div>

                      {property.yearBuilt && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Built in {property.yearBuilt}
                        </div>
                      )}

                      {property.zestimate && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          Zestimate: {formatPrice(property.zestimate)}
                        </div>
                      )}

                      {property.brokerName && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          MLS: {property.brokerName}
                        </div>
                      )}

                      {property.url && (
                        <div className="mt-3">
                          <a
                            href={property.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View on Zillow
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}

                      {/* Match Analysis */}
                      {property.matchReasons && property.matchReasons.length > 0 && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <ThumbsUp className="h-4 w-4 text-green-600" />
                            <h4 className="font-medium text-sm text-green-800">Why This Matches</h4>
                          </div>
                          <ul className="text-xs text-green-700 space-y-1">
                            {property.matchReasons.map((reason, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <div className="w-1 h-1 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Missing Features */}
                      {property.missingFeatures && property.missingFeatures.length > 0 && (
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <h4 className="font-medium text-sm text-yellow-800">Missing Features</h4>
                          </div>
                          <ul className="text-xs text-yellow-700 space-y-1">
                            {property.missingFeatures.map((feature, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <div className="w-1 h-1 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {property.aiAnalysis && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <h4 className="font-medium text-sm mb-1">AI Analysis</h4>
                          <p className="text-sm text-muted-foreground">{property.aiAnalysis}</p>
                        </div>
                      )}

                      {property.features && property.features.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {property.features.slice(0, 4).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {property.features.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{property.features.length - 4} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {state?.error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-red-600">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="font-medium">Search Error</p>
              </div>
              <p className="text-red-700 mt-2">{state.error}</p>
            </CardContent>
          </Card>
        )}

        {state?.properties && state.properties.length === 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-6 text-center">
              <Home className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-yellow-800 mb-2">No Properties Match Your Criteria</h3>
              <p className="text-yellow-700">
                AI analyzed all available properties but none met your specific requirements. Try adjusting your search
                criteria.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
