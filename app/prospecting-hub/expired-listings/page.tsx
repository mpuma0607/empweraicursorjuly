import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Search, MessageSquare, Repeat } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ExpiredListingsPage() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-black">Expired Listings</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Turn expired listings into new opportunities with our proven 3-step system: Find them, Connect with them,
            and Market to them effectively.
          </p>
        </div>

        {/* Expired Listings Success System */}
        <Card className="max-w-4xl mx-auto mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-black text-center">Expired Listings Success System</CardTitle>
            <CardDescription className="text-center">
              Everything you need to convert expired listings into new clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid-cols-1">
              <div className="space-y-4">
                <h4 className="font-semibold text-black">What You'll Get:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✅ Complete expired listing prospecting system</li>
                  <li>✅ Empathetic scripts and objection handlers</li>
                  <li>✅ Market analysis templates and pricing strategies</li>
                  <li>✅ Email and direct mail templates</li>
                  <li>✅ Follow-up sequences and nurture campaigns</li>
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
              <CardDescription>Discover the best sources and strategies for locating expired listings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-black mb-3">Professional Expired Listing Strategy:</h4>
                  <div className="grid grid-cols-1 gap-y-3 text-sm text-gray-600">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                      <p>
                        <span className="font-medium">Identify Expired Listings:</span> Utilize MLS or real estate
                        databases to find recently expired listings - these are often the most promising opportunities.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                      <p>
                        <span className="font-medium">Research the Listings:</span> Analyze why each listing didn't sell
                        - pricing, location, condition, and previous marketing efforts.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                      <p>
                        <span className="font-medium">Prepare Value Proposition:</span> Develop compelling solutions
                        that address specific reasons why the previous listing failed.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                      <p>
                        <span className="font-medium">Initial Contact:</span> Reach out with personalized approach
                        through phone, letter, or door-knock with empathy and insights.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                      <p>
                        <span className="font-medium">Build Rapport & Trust:</span> Listen to concerns, offer market
                        insights, and demonstrate expertise to build confidence.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                      <p>
                        <span className="font-medium">Present Strategy:</span> Arrange meetings to present
                        differentiated marketing strategy with concrete examples and data.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                      <p>
                        <span className="font-medium">Handle Objections:</span> Be prepared for skepticism with concrete
                        examples and data to back up your strategies.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                      <p>
                        <span className="font-medium">Follow-Up System:</span> Regular follow-up through emails, calls,
                        and market updates to stay top-of-mind.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                      <p>
                        <span className="font-medium">Secure Agreement:</span> Move forward with clear listing agreement
                        once homeowner is convinced.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                      <p>
                        <span className="font-medium">Effective Marketing:</span> Implement professional photography,
                        staging, and targeted advertising strategies.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                      <p>
                        <span className="font-medium">Post-Sale Relationship:</span> Maintain relationships for
                        referrals and future business opportunities.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Training Video */}
                <div className="mt-6">
                  <h4 className="font-semibold text-black mb-3">🎥 Expert Training Video</h4>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <iframe
                      src="https://www.youtube.com/embed/2-Hj6uGfyic"
                      width="100%"
                      height="200"
                      style={{ border: "none" }}
                      title="Expired Listings Training"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
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
                Empathetic conversation starters and objection handling for expired sellers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="phone-scripts" className="w-full">
                <TabsList className="grid w-full grid-cols-4 text-xs">
                  <TabsTrigger value="phone-scripts" className="px-2">
                    Phone
                  </TabsTrigger>
                  <TabsTrigger value="email-scripts" className="px-2">
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="text-scripts" className="px-2">
                    SMS
                  </TabsTrigger>
                  <TabsTrigger value="practice" className="px-2">
                    Practice
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="phone-scripts" className="space-y-6 mt-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-black mb-4 text-lg">Expired Listing Phone Script</h4>
                    <div className="text-sm text-gray-700 space-y-3 max-h-96 overflow-y-auto">
                      <p>
                        <strong>(Mirror/Match Introduction)</strong> ... I'm ______ from (your brokerage name)... The
                        reason I'm here (or calling) is your property came up on our computer as an expired listing and
                        what I am curious about is ... when I can interview for the job of getting this property sold
                        for you... You do still want to SELL YOUR PROPERTY right...
                      </p>

                      <p>
                        <strong>Let me ask you: (REMEMBER TO FIND WAYS TO CONNECT)</strong>
                      </p>

                      <div className="space-y-2">
                        <p>
                          If you sold this property ... where would you go next. (_____) Wow! (Find a way to Connect)
                        </p>
                        <p>How soon do you have to be there. (_____) Ouch!</p>
                        <p>What do you think stopped your property from selling. (_____) Really!</p>
                        <p>How did you happen to pick the last company that you listed with. (_____) Great!</p>
                        <p>What did that company do that you liked best. (_____) You're kidding!</p>
                        <p>What do you feel they should have done to get your property sold for you. (_____) OK</p>
                        <p>What will you expect from the next company that you choose. (_____) Terrific!</p>
                        <p>Have you already chosen a company to work with. (_____) Wonderful!</p>
                      </div>

                      <p>
                        <strong>Value Offer:</strong> Let's do this... let me show you what your house is REALLY worth
                        in today's market and ... show you the tools that only (your brokerage name) has ... that allow
                        us to sell 20-30 homes a day which is more than any of our competitors. You do expect the
                        best...right.
                      </p>

                      <p>
                        <strong>Options:</strong> This way at least you REALLY ...know your options... and if it makes
                        sense, it makes sense...if it doesn't, it doesn't.
                      </p>

                      <p>
                        <strong>Close:</strong> So... What would be the best time for me to come back with today's real
                        value, show you how much money you would put in your pocket and interview for the job of selling
                        your property. Either you will like what I have to say and want to ... hire us ... or you won't
                        want to... hire us ...and either one is fine.
                      </p>

                      <p>
                        <strong>Appointment:</strong> What's better for you (_____) or (_____). Fantastic!!! See you
                        then! When can I take a look around to ensure that I fully understand your property so I can
                        ...maximize your value... Now since I'm here...or ___ or ___ at ___.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-black mb-4 text-lg">SMS Quick Contact Scripts</h4>
                    <div className="text-sm text-gray-700 space-y-4">
                      <div className="bg-white p-3 rounded border">
                        <p>
                          <strong>Friendly Introduction & Value Offer:</strong>
                        </p>
                        <p>
                          "Hi [Homeowner's Name], I'm [Your Name] with [Your Realty Company]. I noticed your listing on
                          [Street Name] recently expired. I have some unique strategies that might help in this
                          challenging market. Can we chat about this?"
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <p>
                          <strong>Empathetic Approach & Expertise Highlight:</strong>
                        </p>
                        <p>
                          "Hello [Homeowner's Name], it's [Your Name] from [Your Realty Company]. Selling a home can be
                          tough, especially in today's market. I've successfully helped homes like yours sell quickly
                          and for a great price. Let's talk about how I can do the same for you."
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <p>
                          <strong>Market Insight & Consultation Offer:</strong>
                        </p>
                        <p>
                          "Good morning [Homeowner's Name], I'm [Your Name] with [Your Realty Company]. I specialize in
                          properties in [Area Name] and have insights into why some listings don't close. Would you be
                          open to a brief call to discuss your home's potential?"
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <p>
                          <strong>Personalized Strategy & Success Record:</strong>
                        </p>
                        <p>
                          "Hi [Homeowner's Name], this is [Your Name] from [Your Realty Company]. I've had success in
                          re-listing properties like yours in [Neighborhood/Area]. I have a tailored strategy ready for
                          your home. Are you available for a quick call to explore this?"
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <p>
                          <strong>Direct & Solution-Oriented:</strong>
                        </p>
                        <p>
                          "Hey [Homeowner's Name], I'm [Your Name] from [Your Realty Company]. Saw your listing on
                          [Street Name] expired. I have a few ideas that could turn things around and get your house
                          sold. Interested in hearing more?"
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="email-scripts" className="space-y-6 mt-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-black mb-4 text-lg">Expired Listing Email Templates</h4>
                    <div className="text-sm text-gray-700 space-y-4 max-h-96 overflow-y-auto">
                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>Subject: Let's Turn a New Page for Your [Address] Property!</strong>
                        </p>
                        <div className="mt-2">
                          <p>Hi [Homeowner's Name],</p>
                          <p>
                            I noticed that your listing at [Address] recently expired, and I understand this might be a
                            bit discouraging. I'm [Your Name] with [Your Realty Company], and I specialize in
                            revitalizing listings like yours. My approach is tailored to each property, focusing on
                            targeted marketing and pricing strategies that resonate with today's buyers.
                          </p>
                          <p>
                            Would you be open to discussing a fresh approach for your property? I'd love to share some
                            success stories and ideas specific to homes in [Area/Neighborhood].
                          </p>
                          <p>
                            Best regards,
                            <br />
                            [Your Name]
                          </p>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>
                            Subject: [Homeowner's Name], It's Time for a New Strategy for Your Home on [Street Name]
                          </strong>
                        </p>
                        <div className="mt-2">
                          <p>Dear [Homeowner's Name],</p>
                          <p>
                            Seeing your home on [Street Name] leave the market unsold can be frustrating, but it's often
                            just a matter of strategy. I'm [Your Name] from [Your Realty Company], and I have a track
                            record of successfully selling properties that had previously struggled to find the right
                            buyer.
                          </p>
                          <p>
                            I'd like to offer you a no-obligation assessment of your home, providing insights into the
                            current market and how we can position your property for a successful sale.
                          </p>
                          <p>
                            Looking forward to hearing from you,
                            <br />
                            [Your Name]
                          </p>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>Subject: New Possibilities Await Your Home at [Address]</strong>
                        </p>
                        <div className="mt-2">
                          <p>Hello [Homeowner's Name],</p>
                          <p>
                            I'm [Your Name], a real estate professional with [Your Realty Company]. I noticed that your
                            property at [Address] is no longer listed. In today's dynamic market, repositioning and an
                            innovative marketing approach can make all the difference.
                          </p>
                          <p>
                            I have specific ideas for your property, including a comprehensive digital marketing
                            strategy and staging techniques that can enhance its appeal. Let's discuss how we can unlock
                            the full potential of your home.
                          </p>
                          <p>
                            Warm regards,
                            <br />
                            [Your Name]
                          </p>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>
                            Subject: [Homeowner's Name], Explore a Fresh Approach to Selling Your [Area] Home
                          </strong>
                        </p>
                        <div className="mt-2">
                          <p>Greetings [Homeowner's Name],</p>
                          <p>
                            I'm [Your Name] with [Your Realty Company], and I specialize in properties in the [Area]
                            region. It's not uncommon for listings to expire in this complex market, but with a fresh
                            perspective and a customized marketing plan, success is within reach.
                          </p>
                          <p>
                            I'd love to connect and discuss a tailored strategy that aligns with your goals and
                            showcases your property's unique features to the right audience.
                          </p>
                          <p>
                            Best wishes,
                            <br />
                            [Your Name]
                          </p>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>Subject: Revitalize Your Listing at [Address] with Proven Strategies</strong>
                        </p>
                        <div className="mt-2">
                          <p>Hi [Homeowner's Name],</p>
                          <p>
                            I'm [Your Name] from [Your Realty Company], reaching out regarding your property at
                            [Address]. Sometimes, a fresh set of eyes and a new marketing approach are what's needed to
                            sell a home. With my experience in [Area], I bring proven strategies that have helped
                            similar homes sell quickly and at desirable prices.
                          </p>
                          <p>
                            Let's schedule a time to review what didn't work in the past and how we can turn things
                            around for your property.
                          </p>
                          <p>
                            Regards,
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
                    <h4 className="font-bold text-black mb-4 text-lg">Expired Listing SMS Templates</h4>
                    <div className="text-sm text-gray-700 space-y-4">
                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>Initial Contact:</strong>
                        </p>
                        <p>
                          "Hi [Name], sorry your home on [Street] didn't sell. I help homeowners in this situation get
                          sold the 2nd time. Would you like to know what went wrong?"
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>Follow-up:</strong>
                        </p>
                        <p>
                          "Hi [Name], still thinking about selling? I have a free analysis showing exactly why it didn't
                          sell and how to fix it. No obligation!"
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>Value Proposition:</strong>
                        </p>
                        <p>
                          "Hello [Name], I specialize in expired listings in [Area]. Fresh strategy + proven marketing =
                          sold home. Quick chat?"
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="practice" className="space-y-6 mt-6">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                      <h4 className="font-bold text-black mb-4 text-lg">Expired Listing Roleplay Practice with AI</h4>
                      <p className="text-gray-700 mb-4">
                        Practice your expired listing scripts with our advanced voice AI. Learn to handle disappointment
                        and objections with empathy.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <iframe
                        src="https://cerebras.vercel.app/"
                        width="100%"
                        height="700"
                        style={{ border: "none", borderRadius: "8px" }}
                        title="Cerebras Voice AI - Expired Listing Roleplay Training"
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
                Marketing materials and follow-up strategies to nurture expired listing relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-semibold text-black mb-4">Expired Listing Marketing Materials</h4>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <iframe
                    src="https://drive.google.com/embeddedfolderview?id=1G6SZedUC23xxlfvNUDjrqMZNWBDgPmoS#grid"
                    style={{ width: "100%", height: "600px", border: 0 }}
                    title="Expired Listing Marketing Materials"
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
