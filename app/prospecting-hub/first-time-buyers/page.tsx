import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, Search, MessageSquare, Repeat } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FirstTimeBuyersPage() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
              <Home className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-black">First-Time Buyers</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Guide first-time homebuyers through their journey with our proven 3-step system: Find them, Connect with
            them, and Market to them effectively.
          </p>
        </div>

        {/* First-Time Buyers Success System */}
        <Card className="max-w-4xl mx-auto mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-black text-center">First-Time Buyers Success System</CardTitle>
            <CardDescription className="text-center">
              Everything you need to become the trusted guide for first-time homebuyers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid-cols-1">
              <div className="space-y-4">
                <h4 className="font-semibold text-black">What You'll Get:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✅ Complete first-time buyer prospecting system</li>
                  <li>✅ Educational scripts and buyer consultation tools</li>
                  <li>✅ First-time buyer lead generation strategies</li>
                  <li>✅ Home buying guides and educational materials</li>
                  <li>✅ Follow-up sequences and nurture campaigns</li>
                  <li>✅ Buyer journey tracking and milestone celebrations</li>
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
              <CardDescription>Discover the best sources and strategies for locating first-time buyers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-black mb-3">Key Sources for First-Time Buyers:</h4>
                  <div className="grid grid-cols-1 gap-y-2 text-sm text-gray-600">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Online Lead Generation:</span> Zillow, Realtor.com, Facebook ads
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">First-Time Buyer Seminars:</span> Host educational workshops
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Lender Partnerships:</span> Network with mortgage professionals
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Apartment Complexes:</span> Target renters ready to buy
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Social Media:</span> Instagram, TikTok, Facebook groups
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Young Professional Groups:</span> Networking events and meetups
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
              <CardDescription>Educational conversation starters for first-time homebuyers</CardDescription>
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
                    <h4 className="font-bold text-black mb-4 text-lg">First-Time Buyer Consultation Script</h4>
                    <div className="text-sm text-gray-700 space-y-3 max-h-96 overflow-y-auto">
                      <p>
                        <strong>Opening:</strong> Hi [Name]! This is [Your Name] with [Brokerage]. I understand you're
                        interested in buying your first home. Congratulations on taking this exciting step! Do you have
                        a few minutes to chat?
                      </p>

                      <p>
                        <strong>Purpose:</strong> I specialize in helping first-time buyers navigate the home buying
                        process. I know it can feel overwhelming, but I'm here to make it as smooth and stress-free as
                        possible.
                      </p>

                      <div className="space-y-2">
                        <p>
                          <strong>Discovery Questions:</strong>
                        </p>
                        <p>1. What's motivating you to buy your first home right now?</p>
                        <p>2. Have you been pre-approved for a mortgage yet?</p>
                        <p>3. What areas are you considering?</p>
                        <p>4. What's most important to you in a home?</p>
                        <p>5. What's your biggest concern about the buying process?</p>
                        <p>6. What questions do you have about buying a home?</p>
                      </div>

                      <p>
                        <strong>Education Offer:</strong> I have a comprehensive first-time buyer guide that walks you
                        through every step of the process. It covers everything from getting pre-approved to closing
                        day. Would you like me to send that to you?
                      </p>

                      <p>
                        <strong>Close:</strong> I'd love to set up a time to meet and go over your home buying goals.
                        There's no obligation - just helpful information to get you started on the right foot.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="email-scripts" className="space-y-6 mt-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-black mb-4 text-lg">First-Time Buyer Email Templates</h4>
                    <div className="text-sm text-gray-700 space-y-4">
                      <div>
                        <p>
                          <strong>Subject: Your First Home Buying Journey Starts Here!</strong>
                        </p>
                        <div className="bg-white p-4 rounded border mt-2">
                          <p>Hi [Name],</p>
                          <p>
                            Congratulations on taking the exciting step toward homeownership! I'm [Your Name], a local
                            real estate professional who specializes in helping first-time buyers.
                          </p>
                          <p>
                            I know the home buying process can feel overwhelming, but it doesn't have to be. I've helped
                            hundreds of first-time buyers find their perfect home, and I'd love to help you too.
                          </p>
                          <p>Here's what I can help you with:</p>
                          <ul>
                            <li>• Understanding the entire buying process step-by-step</li>
                            <li>• Connecting you with trusted lenders for pre-approval</li>
                            <li>• Finding homes that fit your budget and wishlist</li>
                            <li>• Negotiating the best price and terms</li>
                            <li>• Guiding you through inspections and closing</li>
                          </ul>
                          <p>
                            I've attached my First-Time Buyer Guide that covers everything you need to know. It's
                            completely free and will help you understand what to expect.
                          </p>
                          <p>
                            I'd love to schedule a no-obligation consultation to discuss your home buying goals and
                            answer any questions you have.
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
                    <h4 className="font-bold text-black mb-4 text-lg">First-Time Buyer Text Templates</h4>
                    <div className="text-sm text-gray-700 space-y-4">
                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>Initial Contact:</strong>
                        </p>
                        <p>
                          "Hi [Name]! Congrats on looking for your first home! I'm [Your Name], a local agent who
                          specializes in first-time buyers. What questions do you have about the process?"
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>Follow-up:</strong>
                        </p>
                        <p>
                          "Hi [Name], how's your home search going? I have a great first-time buyer guide that might
                          help. Want me to send it over?"
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="practice" className="space-y-6 mt-6">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                      <h4 className="font-bold text-black mb-4 text-lg">First-Time Buyer Roleplay Practice with AI</h4>
                      <p className="text-gray-700 mb-4">
                        Practice your first-time buyer consultation scripts with our advanced voice AI. Learn to educate
                        and guide nervous first-time buyers.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <iframe
                        src="https://cerebras.vercel.app/"
                        width="100%"
                        height="700"
                        style={{ border: "none", borderRadius: "8px" }}
                        title="Cerebras Voice AI - First-Time Buyer Roleplay Training"
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
                Marketing materials and follow-up strategies to nurture first-time buyer relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-semibold text-black mb-4">First-Time Buyer Marketing Materials</h4>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <iframe
                    src="https://drive.google.com/embeddedfolderview?id=1duf-xMuHsHK-GWkM8-VwsphbsjGlWuBS#grid"
                    style={{ width: "100%", height: "600px", border: 0 }}
                    title="First-Time Buyer Marketing Materials"
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
