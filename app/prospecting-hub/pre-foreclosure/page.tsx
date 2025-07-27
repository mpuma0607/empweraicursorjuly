import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, Search, MessageSquare, Repeat } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PreForeclosurePage() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center">
              <Home className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-black">Pre-Foreclosure</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master the art of helping distressed homeowners with our proven 3-step system: Find them, Connect with them,
            and Market to them effectively.
          </p>
        </div>

        {/* Pre-Foreclosure Success System */}
        <Card className="max-w-4xl mx-auto mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-black text-center">Pre-Foreclosure Success System</CardTitle>
            <CardDescription className="text-center">
              Everything you need to help distressed homeowners and build your business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid-cols-1">
              <div className="space-y-4">
                <h4 className="font-semibold text-black">What You'll Get:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✅ Complete pre-foreclosure prospecting system</li>
                  <li>✅ Proven scripts and objection handlers</li>
                  <li>✅ Legal compliance guidelines</li>
                  <li>✅ Email and direct mail templates</li>
                  <li>✅ Follow-up sequences</li>
                  <li>✅ Conversion tracking tools</li>
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
                Discover the best sources and strategies for locating pre-foreclosure properties in your market
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Key Sources */}
                <div>
                  <h4 className="font-semibold text-black mb-3">Primary Data Sources:</h4>
                  <div className="grid grid-cols-1 gap-y-3 text-sm text-gray-600">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">County Records:</span> Notice of Default (NOD) filings at county
                        recorder's office
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Public Legal Notices:</span> Local newspapers and legal
                        publications
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Online Databases:</span> RealtyTrac, ForeclosureRadar, Auction.com
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">MLS Searches:</span> Properties with high days on market or price
                        reductions
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Driving for Dollars:</span> Look for signs of distress (deferred
                        maintenance, overgrown yards)
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Networking:</span> Attorneys, mortgage brokers, and other real
                        estate professionals
                      </p>
                    </div>
                  </div>
                </div>

                {/* Legal Considerations */}
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-black mb-2 flex items-center">⚖️ Legal Compliance</h4>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>• Always follow TCPA and DNC regulations</p>
                    <p>• Respect state-specific foreclosure laws</p>
                    <p>• Never misrepresent your services</p>
                    <p>• Provide clear disclosure of your role</p>
                  </div>
                </div>

                {/* Timeline Understanding */}
                <div>
                  <h4 className="font-semibold text-black mb-3">Pre-Foreclosure Timeline:</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-500 rounded-full mr-3 text-white text-xs flex items-center justify-center font-bold">
                        1
                      </div>
                      <p>
                        <span className="font-medium">30-90 days:</span> Missed payments, lender contact
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-orange-500 rounded-full mr-3 text-white text-xs flex items-center justify-center font-bold">
                        2
                      </div>
                      <p>
                        <span className="font-medium">90-120 days:</span> Notice of Default filed
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3 text-white text-xs flex items-center justify-center font-bold">
                        3
                      </div>
                      <p>
                        <span className="font-medium">120+ days:</span> Notice of Sale, auction scheduled
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
              <CardDescription>
                Compassionate scripts and conversation starters that help distressed homeowners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="door-knock" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="door-knock">Door Knock</TabsTrigger>
                  <TabsTrigger value="phone-scripts">Phone Scripts</TabsTrigger>
                  <TabsTrigger value="email-scripts">Email Scripts</TabsTrigger>
                  <TabsTrigger value="objections">Objections</TabsTrigger>
                </TabsList>

                <TabsContent value="door-knock" className="space-y-6 mt-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-black mb-4 text-lg">Pre-Foreclosure Door Knock Script</h4>
                    <div className="text-sm text-gray-700 space-y-3 max-h-96 overflow-y-auto">
                      <p>
                        <strong>Opening:</strong> Hi, I'm [Name] with [Company]. I hope I'm not catching you at a bad
                        time. I noticed your property might be going through some challenges, and I wanted to see if
                        there's any way I might be able to help.
                      </p>

                      <div className="space-y-3">
                        <p>
                          <strong>Empathy First:</strong> I know this can be a really stressful time, and I want you to
                          know that you have options. Many homeowners don't realize there are alternatives to
                          foreclosure that can help protect their credit and potentially put money in their pocket.
                        </p>

                        <p>
                          <strong>Questions to Ask:</strong>
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• How long have you been dealing with this situation?</li>
                          <li>• Have you spoken with your lender about workout options?</li>
                          <li>• Are you familiar with all your alternatives?</li>
                          <li>• Would you be interested in learning about your options?</li>
                        </ul>

                        <p>
                          <strong>Value Proposition:</strong> I specialize in helping homeowners in situations like
                          yours. I can provide you with a free consultation to review all your options - whether that's
                          a loan modification, short sale, or traditional sale. There's no obligation, and it might save
                          you thousands of dollars and protect your credit.
                        </p>

                        <p>
                          <strong>Close:</strong> Would you be open to sitting down for 15-20 minutes so I can explain
                          your options? I have some time [today/tomorrow] or we could schedule something that works
                          better for you.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="phone-scripts" className="space-y-6 mt-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-black mb-4 text-lg">Pre-Foreclosure Phone Scripts</h4>
                    <div className="text-sm text-gray-700 space-y-4">
                      <div>
                        <h5 className="font-semibold text-black mb-2">Initial Contact Script:</h5>
                        <p className="mb-2">
                          "Hi [Name], this is [Your Name] with [Company]. I'm calling because I noticed your property on
                          [Address] might be going through some challenges with the mortgage. I specialize in helping
                          homeowners explore their options during difficult times. Do you have a few minutes to talk?"
                        </p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-black mb-2">If They're Interested:</h5>
                        <p className="mb-2">
                          "Great. I want you to know that foreclosure isn't your only option. Depending on your
                          situation, we might be able to help you with a loan modification, short sale, or even a
                          traditional sale that could put money in your pocket. The most important thing is that you
                          understand all your choices before making any decisions."
                        </p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-black mb-2">Setting Appointment:</h5>
                        <p>
                          "I'd love to meet with you in person to go over your specific situation and options. This
                          consultation is completely free, and there's no obligation. Would [day/time] work for you, or
                          is there a better time?"
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="email-scripts" className="space-y-6 mt-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-black mb-4 text-lg">Pre-Foreclosure Email Templates</h4>
                    <div className="text-sm text-gray-700 space-y-4">
                      <div>
                        <h5 className="font-semibold text-black mb-2">Subject: Your Options for [Property Address]</h5>
                        <div className="bg-white p-4 rounded border">
                          <p className="mb-3">Dear [Name],</p>
                          <p className="mb-3">
                            I hope this message finds you well. I'm reaching out because I noticed your property at
                            [Address] may be facing some mortgage challenges, and I wanted you to know that you have
                            options.
                          </p>
                          <p className="mb-3">
                            As a real estate professional who specializes in helping homeowners navigate difficult
                            situations, I've helped many families explore alternatives to foreclosure that can:
                          </p>
                          <ul className="ml-4 mb-3 space-y-1">
                            <li>• Protect your credit score</li>
                            <li>• Potentially put money in your pocket</li>
                            <li>• Provide a fresh start</li>
                            <li>• Avoid the stress of foreclosure</li>
                          </ul>
                          <p className="mb-3">
                            I'd be happy to provide you with a free, no-obligation consultation to review your specific
                            situation and discuss all available options.
                          </p>
                          <p className="mb-3">
                            Please feel free to call me at [Phone] or reply to this email. I'm here to help, not to
                            pressure you.
                          </p>
                          <p>
                            Best regards,
                            <br />
                            [Your Name]
                            <br />
                            [Your Title]
                            <br />
                            [Company Name]
                            <br />
                            [Phone Number]
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="objections" className="space-y-6 mt-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-black mb-4 text-lg">Common Objections & Responses</h4>
                    <div className="text-sm text-gray-700 space-y-4">
                      <div>
                        <h5 className="font-semibold text-red-600 mb-2">"I'm working with my lender"</h5>
                        <p className="mb-2">
                          "That's great that you're communicating with them. Working with your lender is definitely one
                          option. I'd just like to make sure you're aware of all your alternatives so you can make the
                          best decision for your family. Sometimes having a backup plan can be really valuable. Would
                          you be open to learning about your other options?"
                        </p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-red-600 mb-2">"I don't want to lose my house"</h5>
                        <p className="mb-2">
                          "I completely understand - this is your home and it means a lot to you. That's exactly why I
                          want to make sure you know about all your options. Some alternatives might actually help you
                          keep your home, while others might help you transition in a way that protects your credit and
                          financial future. Let's explore what might work best for your situation."
                        </p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-red-600 mb-2">"I can't afford to pay a realtor"</h5>
                        <p className="mb-2">
                          "I appreciate your concern about costs. The good news is that in most cases, if we're able to
                          help you with a solution, the fees come from the proceeds of the sale - you don't pay anything
                          out of pocket. And if we can't help you, there's no charge for the consultation. The most
                          important thing is that you understand all your options."
                        </p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-red-600 mb-2">"I'm not interested"</h5>
                        <p>
                          "I understand, and I don't want to pressure you. I just want you to know that you have someone
                          in your corner if you need help. Here's my card - please keep it handy. If your situation
                          changes or you have questions about your options, don't hesitate to call. I'm here to help,
                          not to sell you anything."
                        </p>
                      </div>
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
              <CardDescription>Marketing materials and follow-up strategies for pre-foreclosure leads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-semibold text-black mb-4">Pre-Foreclosure Marketing Materials</h4>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <iframe
                    src="https://drive.google.com/embeddedfolderview?id=1PreForeclosureFolder#grid"
                    style={{ width: "100%", height: "600px", border: 0 }}
                    title="Pre-Foreclosure Marketing Materials"
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
