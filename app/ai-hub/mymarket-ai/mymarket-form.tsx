"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useTenantConfig } from "@/hooks/useTenantConfig"
import { useMemberSpaceUser } from "@/hooks/useMemberSpaceUser"
import { analyzeMarket, getAgentInfo, MarketData } from "./actions"
import { BarChart3, Home, Building2, TrendingUp, MapPin, User, Phone, Mail } from "lucide-react"

interface FormState {
  location: string
  marketType: 'rental' | 'housing'
  homeType: string
  rentalType: string
  bedroomType: string
}

export default function MyMarketForm() {
  const { toast } = useToast()
  const config = useTenantConfig()
  const { user, loading: userLoading } = useMemberSpaceUser()
  
  const [formData, setFormData] = useState<FormState>({
    location: "",
    marketType: 'housing',
    homeType: "All_Homes",
    rentalType: "Houses",
    bedroomType: "All_Bedrooms"
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<MarketData | null>(null)
  const [agentInfo, setAgentInfo] = useState<any>(null)

  useEffect(() => {
    const loadAgentInfo = async () => {
      try {
        const info = await getAgentInfo()
        setAgentInfo(info)
      } catch (error) {
        console.error("Error loading agent info:", error)
      }
    }
    loadAgentInfo()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const marketData = await analyzeMarket(
        formData.location,
        formData.marketType,
        formData.marketType === 'housing' ? formData.homeType : undefined,
        formData.marketType === 'rental' ? formData.rentalType : undefined,
        formData.marketType === 'rental' ? formData.bedroomType : undefined
      )
      
      setResult(marketData)
      toast({
        title: "Market Analysis Complete",
        description: `Successfully analyzed ${formData.marketType} market for ${formData.location}`,
      })
    } catch (error) {
      console.error("MyMarket AI Error:", error)
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An error occurred during market analysis",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatMarketData = (data: any) => {
    if (!data) return "No data available"
    
    try {
      return JSON.stringify(data, null, 2)
    } catch {
      return "Unable to format data"
    }
  }

  return (
    <div className="space-y-6">
      {/* Agent Info Card */}
      {agentInfo && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <User className="h-5 w-5" />
              Agent Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{agentInfo.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <span>{agentInfo.company}</span>
              </div>
              {agentInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{agentInfo.phone}</span>
                </div>
              )}
              {agentInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{agentInfo.email}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Analysis Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Market Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location Input */}
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input
                id="location"
                placeholder="Enter city, state, zip code, or 'USA/United States' for full country"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            {/* Market Type Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Market Type
              </Label>
              <RadioGroup
                value={formData.marketType}
                onValueChange={(value: 'rental' | 'housing') => 
                  setFormData({ ...formData, marketType: value })
                }
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="housing" id="housing" />
                  <Label htmlFor="housing" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Housing Market
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rental" id="rental" />
                  <Label htmlFor="rental" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Rental Market
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Conditional Dropdowns */}
            {formData.marketType === 'housing' && (
              <div className="space-y-2">
                <Label htmlFor="homeType">Home Type</Label>
                <Select
                  value={formData.homeType}
                  onValueChange={(value) => setFormData({ ...formData, homeType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select home type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All_Homes">All Homes</SelectItem>
                    <SelectItem value="Single_Family">Single Family</SelectItem>
                    <SelectItem value="Condo">Condo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.marketType === 'rental' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="rentalType">Rental Type</Label>
                  <Select
                    value={formData.rentalType}
                    onValueChange={(value) => setFormData({ ...formData, rentalType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rental type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Houses">Houses</SelectItem>
                      <SelectItem value="Apartments_and_Condos">Apartments and Condos</SelectItem>
                      <SelectItem value="Townhomes">Townhomes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bedroomType">Bedroom Type</Label>
                  <Select
                    value={formData.bedroomType}
                    onValueChange={(value) => setFormData({ ...formData, bedroomType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select bedroom type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All_Bedrooms">All Bedroom Types</SelectItem>
                      <SelectItem value="Studio">Studio</SelectItem>
                      <SelectItem value="1_Bedroom">1 Bedroom</SelectItem>
                      <SelectItem value="2_Bedroom">2 Bedrooms</SelectItem>
                      <SelectItem value="3_Bedroom">3 Bedrooms</SelectItem>
                      <SelectItem value="4_Bedroom">4 Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Analyzing Market..." : "Analyze Market"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Market Analysis Results
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{result.marketType} Market</Badge>
              <Badge variant="outline">{result.location}</Badge>
              {result.homeType && <Badge variant="outline">{result.homeType}</Badge>}
              {result.rentalType && <Badge variant="outline">{result.rentalType}</Badge>}
              {result.bedroomType && <Badge variant="outline">{result.bedroomType}</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                {formatMarketData(result.data)}
              </pre>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Analysis completed: {new Date(result.timestamp).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 