import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Search, MessageSquare, Repeat } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SOIPage() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-black">Sphere of Influence (SOI)</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Build and nurture relationships with your personal network with our proven 3-step system: Find them, Connect
            with them, and Market to them effectively.
          </p>
        </div>

        {/* SOI Success System */}
        <Card className="max-w-4xl mx-auto mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-black text-center">SOI Success System</CardTitle>
            <CardDescription className="text-center">
              Everything you need to generate consistent referrals from your personal network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid-cols-1">
              <div className="space-y-4">
                <h4 className="font-semibold text-black">What You'll Get:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✅ Complete SOI cultivation system</li>
                  <li>✅ Relationship building scripts and conversation starters</li>
                  <li>✅ Contact organization and categorization tools</li>
                  <li>✅ Stay-in-touch email and text templates</li>
                  <li>✅ Follow-up sequences and touch plans</li>
                  <li>✅ Referral tracking and appreciation systems</li>
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
              <CardDescription>Identify and organize your sphere of influence contacts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-black mb-3">Key Sources for SOI Contacts:</h4>
                  <div className="grid grid-cols-1 gap-y-2 text-sm text-gray-600">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Phone Contacts:</span> Import from your smartphone
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Social Media:</span> Facebook, LinkedIn, Instagram connections
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Email Contacts:</span> Gmail, Outlook address books
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Past Clients:</span> Previous real estate transactions
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Professional Network:</span> Colleagues, vendors, service
                        providers
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Personal Network:</span> Family, friends, neighbors, hobby groups
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
              <CardDescription>Authentic conversation starters and relationship building scripts</CardDescription>
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
                    <h4 className="font-bold text-black mb-4 text-lg">SOI Relationship Building Script</h4>
                    <div className="text-sm text-gray-700 space-y-3 max-h-96 overflow-y-auto">
                      <p>
                        <strong>Opening:</strong> Hi [Name]! It's [Your Name]. How are you doing? I was just thinking
                        about you and wanted to catch up.
                      </p>

                      <p>
                        <strong>Personal Connection:</strong> [Reference something personal - their kids, job, hobby,
                        recent event]. How's [specific thing] going?
                      </p>

                      <div className="space-y-2">
                        <p>
                          <strong>Conversation Starters:</strong>
                        </p>
                        <p>1. What's new with you and the family?</p>
                        <p>2. How's work been treating you?</p>
                        <p>3. Any fun plans for the weekend/holidays?</p>
                        <p>4. Did you see [local news/event]?</p>
                        <p>5. How's the house/neighborhood?</p>
                      </div>

                      <p>
                        <strong>Natural Business Mention:</strong> Things are going great with me. Real estate has been
                        really busy - the market is [current condition]. I'm helping a lot of people right now.
                      </p>

                      <p>
                        <strong>Referral Request:</strong> By the way, if you ever hear of anyone thinking about buying
                        or selling, I'd love to help them out. You know I'll take great care of anyone you send my way.
                      </p>

                      <p>
                        <strong>Close:</strong> Let's get together soon! I'd love to catch up more in person.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="email-scripts" className="space-y-6 mt-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-black mb-4 text-lg">SOI Email Templates</h4>
                    <div className="text-sm text-gray-700 space-y-4">
                      <div>
                        <p>
                          <strong>Subject: Thinking of You!</strong>
                        </p>
                        <div className="bg-white p-4 rounded border mt-2">
                          <p>Hi [Name],</p>
                          <p>
                            I was just thinking about you and wanted to reach out to see how you're doing. [Personal
                            reference - their family, job, recent event, etc.]
                          </p>
                          <p>
                            Things have been great with me. Real estate has been keeping me busy - I'm loving helping
                            families find their perfect homes and get top dollar when they sell.
                          </p>
                          <p>
                            I wanted to share a quick market update for our area: [brief market insight relevant to
                            them]
                          </p>
                          <p>Hope you and your family are doing well! Let's catch up soon.</p>
                          <p>
                            P.S. If you ever hear of anyone thinking about buying or selling, I'd love to help them out.
                            You know I'll take great care of anyone you refer!
                          </p>
                          <p>
                            Best,
                            <br />
                            [Your Name]
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="text-scripts" className="space-y-6 mt-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-black mb-4 text-lg">SOI Text Templates</h4>
                    <div className="text-sm text-gray-700 space-y-4">
                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>Check-in Text:</strong>
                        </p>
                        <p>
                          "Hey [Name]! Hope you're doing well. Was thinking about you today. How's [personal reference]
                          going?"
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>Market Update:</strong>
                        </p>
                        <p>
                          "Hi [Name]! Saw this article about our neighborhood and thought you'd find it interesting.
                          [Link or brief summary]. Hope you're doing great!"
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>Holiday/Special Occasion:</strong>
                        </p>
                        <p>
                          "Happy [Holiday/Birthday/Anniversary] [Name]! Hope you have a wonderful day. Thinking of you!"
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="practice" className="space-y-6 mt-6">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                      <h4 className="font-bold text-black mb-4 text-lg">SOI Roleplay Practice with AI</h4>
                      <p className="text-gray-700 mb-4">
                        Practice your SOI relationship building scripts with our advanced voice AI. Learn to have
                        natural, authentic conversations.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <iframe
                        src="https://cerebras.vercel.app/"
                        width="100%"
                        height="700"
                        style={{ border: "none", borderRadius: "8px" }}
                        title="Cerebras Voice AI - SOI Roleplay Training"
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
              <CardDescription>Marketing materials and touch plans to nurture SOI relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-semibold text-black mb-4">SOI Marketing Materials</h4>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <iframe
                    src="https://drive.google.com/embeddedfolderview?id=1AP69nTX7M9Q8vhN2zTtkz6A6Ow5HV1lP#grid"
                    style={{ width: "100%", height: "600px", border: 0 }}
                    title="SOI Marketing Materials"
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
