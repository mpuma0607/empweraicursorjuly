import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Search, MessageSquare, Repeat } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function InvestorsPage() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-black">Real Estate Investors</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with real estate investors with our proven 3-step system: Find them, Connect with them, and Market
            to them effectively.
          </p>
        </div>

        {/* Investors Success System */}
        <Card className="max-w-4xl mx-auto mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-black text-center">Real Estate Investors Success System</CardTitle>
            <CardDescription className="text-center">
              Everything you need to become the go-to agent for real estate investors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid-cols-1">
              <div className="space-y-4">
                <h4 className="font-semibold text-black">What You'll Get:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✅ Complete investor prospecting system</li>
                  <li>✅ ROI-focused scripts and investment analysis tools</li>
                  <li>✅ Investor contact databases and networking strategies</li>
                  <li>✅ Cash flow analysis and market reports</li>
                  <li>✅ Follow-up sequences and nurture campaigns</li>
                  <li>✅ Deal flow tracking and investor CRM</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3-Step Process */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Step 1: How to Find Them */}
          <Card className="border-2 border-blue-200 hover:border-blue-500 transition-colors">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-white" />
              </div>
              <Badge className="bg-blue-500 text-white mb-2">Step 1</Badge>
              <CardTitle className="text-xl text-black">How to Find Them</CardTitle>
              <CardDescription>
                Discover the best sources and strategies for locating real estate investors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-black mb-3">Key Sources for Real Estate Investors:</h4>
                  <div className="grid grid-cols-1 gap-y-2 text-sm text-gray-600">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">BiggerPockets:</span> Online investor community and networking
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Local REI Groups:</span> Real Estate Investment Association
                        meetings
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Property Records:</span> Multiple property owners in county
                        records
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Auction Sites:</span> Foreclosure and tax lien auction attendees
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Wholesaler Networks:</span> Connect with local wholesalers
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">LinkedIn:</span> Search for real estate investors in your area
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Scripts and What to Say */}
          <Card className="border-2 border-green-200 hover:border-green-500 transition-colors">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <Badge className="bg-green-500 text-white mb-2">Step 2</Badge>
              <CardTitle className="text-xl text-black">Scripts & What to Say</CardTitle>
              <CardDescription>ROI-focused conversation starters for real estate investors</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="phone-scripts" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="phone-scripts">Phone Scripts</TabsTrigger>
                  <TabsTrigger value="email-scripts">Email Scripts</TabsTrigger>
                  <TabsTrigger value="text-scripts">Text Scripts</TabsTrigger>
                  <TabsTrigger value="practice">Practice</TabsTrigger>
                </TabsList>

                <TabsContent value="phone-scripts" className="space-y-6 mt-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-black mb-4 text-lg">Real Estate Investor Cold Call Script</h4>
                    <div className="text-sm text-gray-700 space-y-3 max-h-96 overflow-y-auto">
                      <p>
                        <strong>Opening:</strong> Hi, is this [Name]? This is [Your Name] with [Brokerage]. I understand
                        you're active in real estate investing. Do you have a quick minute?
                      </p>

                      <p>
                        <strong>Purpose:</strong> I specialize in working with investors and I'm always looking for
                        opportunities that make sense for my investor clients. I wanted to see what you're looking for
                        right now.
                      </p>

                      <div className="space-y-2">
                        <p>
                          <strong>Discovery Questions:</strong>
                        </p>
                        <p>1. What type of properties are you currently looking for?</p>
                        <p>2. What's your target cap rate or cash-on-cash return?</p>
                        <p>3. Are you looking to buy and hold or fix and flip?</p>
                        <p>4. What areas are you focusing on?</p>
                        <p>5. How do you typically find your deals?</p>
                        <p>6. What's your biggest challenge in finding good deals?</p>
                      </div>

                      <p>
                        <strong>Value Offer:</strong> I work with several investors and I often come across deals that
                        might not work for one but could be perfect for another. I'd love to keep you in mind when I see
                        something that fits your criteria.
                      </p>

                      <p>
                        <strong>Close:</strong> Can I send you some recent investment analyses I've done? It'll give you
                        an idea of how I evaluate deals for my investor clients.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="email-scripts" className="space-y-6 mt-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-black mb-4 text-lg">Real Estate Investor Email Templates</h4>
                    <div className="text-sm text-gray-700 space-y-4">
                      <div>
                        <p>
                          <strong>Subject: Investment Opportunity - [Property Address]</strong>
                        </p>
                        <div className="bg-white p-4 rounded border mt-2">
                          <p>Hi [Name],</p>
                          <p>
                            I hope this email finds you well. I'm [Your Name], a real estate professional who
                            specializes in working with investors in the [City] area.
                          </p>
                          <p>
                            I came across your information through [source] and wanted to reach out because I regularly
                            come across investment opportunities that might interest you.
                          </p>
                          <p>I'd love to learn more about:</p>
                          <ul>
                            <li>• What type of investment properties you're looking for</li>
                            <li>• Your target return requirements</li>
                            <li>• Preferred areas or property types</li>
                            <li>• Your investment timeline</li>
                          </ul>
                          <p>
                            I've attached a recent investment analysis I completed for another client to give you an
                            idea of how I evaluate deals. I'd be happy to run similar analyses on any properties you're
                            considering.
                          </p>
                          <p>
                            Best regards,
                            <br />
                            [Your Name]
                            <br />
                            [Your Contact Info]
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="text-scripts" className="space-y-6 mt-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-black mb-4 text-lg">Real Estate Investor Text Templates</h4>
                    <div className="text-sm text-gray-700 space-y-4">
                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>Initial Contact:</strong>
                        </p>
                        <p>
                          "Hi [Name]! I'm [Your Name], a local agent who works with investors. Saw you're active in REI.
                          What type of deals are you looking for right now?"
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>Deal Alert:</strong>
                        </p>
                        <p>
                          "Hi [Name], found a potential deal that might interest you. [Property details]. Want me to
                          send you the numbers?"
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="practice" className="space-y-6 mt-6">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                      <h4 className="font-bold text-black mb-4 text-lg">
                        Real Estate Investor Roleplay Practice with AI
                      </h4>
                      <p className="text-gray-700 mb-4">
                        Practice your investor scripts with our advanced voice AI. Learn to speak their language of ROI,
                        cap rates, and cash flow.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <iframe
                        src="https://cerebras.vercel.app/"
                        width="100%"
                        height="700"
                        style={{ border: "none", borderRadius: "8px" }}
                        title="Cerebras Voice AI - Real Estate Investor Roleplay Training"
                        allow="microphone *; camera *; fullscreen *; autoplay *; clipboard-read; clipboard-write"
                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-presentation allow-downloads allow-pointer-lock allow-top-navigation"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Step 3: Marketing & Rinse and Repeat */}
          <Card className="border-2 border-purple-200 hover:border-purple-500 transition-colors">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Repeat className="h-8 w-8 text-white" />
              </div>
              <Badge className="bg-purple-500 text-white mb-2">Step 3</Badge>
              <CardTitle className="text-xl text-black">Marketing & Repeat</CardTitle>
              <CardDescription>
                Marketing materials and follow-up strategies to nurture investor relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-semibold text-black mb-4">Real Estate Investor Marketing Materials</h4>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <iframe
                    src="https://drive.google.com/embeddedfolderview?id=1duf-xMuHsHK-GWkM8-VwsphbsjGlWuBS#grid"
                    style={{ width: "100%", height: "600px", border: 0 }}
                    title="Real Estate Investor Marketing Materials"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
