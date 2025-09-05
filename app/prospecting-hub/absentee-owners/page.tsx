import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, MessageSquare, Repeat } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProspectingContentComponent from "@/components/prospecting-content-component"

export default function AbsenteeOwnersPage() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-black">Absentee Owners</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with property owners who live elsewhere with our proven 3-step system: Find them, Connect with them,
            and Market to them effectively.
          </p>
        </div>

        {/* Absentee Owners Success System */}
        <Card className="max-w-4xl mx-auto mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-black text-center">Absentee Owners Success System</CardTitle>
            <CardDescription className="text-center">
              Everything you need to connect with out-of-area property owners ready to sell
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid-cols-1">
              <div className="space-y-4">
                <h4 className="font-semibold text-black">What You'll Get:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✅ Complete absentee owner prospecting system</li>
                  <li>✅ Property management pain point scripts</li>
                  <li>✅ Owner contact information lookup tools</li>
                  <li>��� Direct mail and email templates</li>
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
              <CardDescription>
                Discover the best sources and strategies for locating absentee property owners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-black mb-3">
                    Professional Strategies for Finding Absentee Owners:
                  </h4>
                  <div className="grid grid-cols-1 gap-y-3 text-sm text-gray-600">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Research Online Platforms:</span> Start with popular real estate
                        websites that allow FSBO listings, like Zillow, Craigslist, FSBO.com, and ForSaleByOwner.com.
                        These sites are frequently used by homeowners to list their properties directly.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Utilize Social Media:</span> Social media platforms like Facebook,
                        Instagram, and Nextdoor can be useful. Look for local real estate groups or community pages
                        where homeowners might post FSBO listings.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Drive Around Neighborhoods:</span> Take some time to drive through
                        local neighborhoods. Look for "For Sale By Owner" signs in yards. This method can uncover
                        listings that might not be advertised online.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Network with Contacts:</span> Leverage your network of contacts.
                        Inform them that you're looking for FSBO properties. Word-of-mouth can be a powerful tool in
                        real estate.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Check Local Newspapers:</span> Some sellers still use local
                        newspapers or community bulletins to advertise their properties. Regularly check these sources
                        for any new listings.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Attend Community Events:</span> Engage in community events or
                        local real estate meetings. These can be great opportunities to learn about FSBO properties
                        before they hit the broader market.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Use Direct Mail Marketing:</span> Consider sending out direct mail
                        to homeowners in your target areas. Sometimes, homeowners are considering selling but haven't
                        listed their property yet.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Training Video */}
                <div className="mt-8">
                  <h4 className="font-semibold text-black mb-4">📹 Professional Training Video</h4>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <iframe
                      width="100%"
                      height="315"
                      src="https://www.youtube.com/embed/OAyGcei-gMo"
                      title="Absentee Owner Prospecting Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full"
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
              <CardDescription>Targeted conversation starters for out-of-area property owners</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="phone-scripts" className="w-full">
                <TabsList className="grid w-full grid-cols-4 text-xs">
                  <TabsTrigger value="phone-scripts" className="text-xs px-2">
                    Phone
                  </TabsTrigger>
                  <TabsTrigger value="email-scripts" className="text-xs px-2">
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="text-scripts" className="text-xs px-2">
                    SMS
                  </TabsTrigger>
                  <TabsTrigger value="practice" className="text-xs px-2">
                    Practice
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="phone-scripts" className="space-y-6 mt-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-black mb-4 text-lg">Absentee Owner Cold Call Script</h4>
                    <div className="text-sm text-gray-700 space-y-3 max-h-96 overflow-y-auto">
                      <p>
                        <strong>Opening:</strong> Hi, is this [Name]? This is [Your Name] with [Brokerage]. I'm calling
                        about your property on [Street Name] here in [City]. Do you have a quick minute?
                      </p>

                      <p>
                        <strong>Purpose:</strong> I work with a lot of out-of-area property owners, and I know managing
                        a property from [their city] can be challenging. I wanted to reach out and see how things are
                        going.
                      </p>

                      <div className="space-y-2">
                        <p>
                          <strong>Discovery Questions:</strong>
                        </p>
                        <p>1. How long have you owned the property?</p>
                        <p>2. Are you managing it yourself or using a property manager?</p>
                        <p>3. How has your experience been so far?</p>
                        <p>4. What's been the biggest challenge?</p>
                        <p>5. Have you ever considered selling?</p>
                        <p>6. What would make you consider selling?</p>
                      </div>

                      <p>
                        <strong>Value Offer:</strong> I help a lot of out-of-area owners with their properties. Whether
                        you want to sell, need property management referrals, or just want market updates, I'm here to
                        help.
                      </p>

                      <p>
                        <strong>Close:</strong> Would you like me to send you a current market analysis so you know what
                        your property is worth in today's market?
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-6">
                    <h4 className="font-bold text-black mb-4 text-lg">Out-of-Area Property Owner Script</h4>
                    <div className="text-sm text-gray-700 space-y-3 max-h-96 overflow-y-auto">
                      <p>
                        <strong>Mirror and Match greeting:</strong> ____ (Repeat back their greeting exactly - match
                        their Energy / tonality / vocabulary)
                      </p>

                      <p>
                        <strong>Introduction:</strong> It's ______ (Your name) with (Insert brokerage name) here in
                        _________(area)
                      </p>

                      <p>
                        <strong>Purpose:</strong> I'm reaching out about the property that you own on ___________. (Ex.
                        Oak Street) I live and work right here in ______ (area) and I'm checking on my out-of-area
                        owners to see if there's anything I can do to bring some value to you since I'm here and it's
                        sometimes difficult for you to check on your investment.
                      </p>

                      <p>
                        <strong>Value Proposition:</strong> I don't want anything at all from you...just here to help
                        out like I would hope someone would do for me if I lived away from my investment... for some
                        I've been doing a drive by to check on things and take some pics...
                      </p>

                      <p>for others .... I've been doing a FaceTime /duo/skype walk around with them....</p>

                      <p>for others I am connecting them with some handymen, contractors, .etc...</p>

                      <p>
                        for others...I'm emailing them values occasionally so they know what it's worth... . so..I'm
                        curious ....what can I do to help you...
                      </p>

                      <p>
                        <strong>Response Handling:</strong>
                      </p>
                      <p>If something.. ______ - Great I'm happy to help... I'm on it...</p>

                      <p>
                        If nothing..... Ok no problem, just know I'm right here if you need anything...this is my cell
                        number so please ...save it now... as _(your name) ____real estate friend___(area) (ex. Jeff
                        Beggins Real Estate Friend Orlando). ....if you ever need anything locally just ...reach out to
                        me...anytime... and let's connect when you are in town...
                      </p>

                      <p>
                        <strong>Close:</strong> Well, thanks for your time, great talking with you. I'll reach out from
                        time to time to check on you, feel free to do the same.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="email-scripts" className="space-y-6 mt-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-black mb-4 text-lg">Absentee Owner Email Campaign Series</h4>
                    <div className="text-sm text-gray-700 space-y-6">
                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>EMAIL 1: Evaluating Financial Impact</strong>
                        </p>
                        <p>
                          <strong>Subject:</strong> Navigating Recent Changes in Florida Property Costs
                        </p>
                        <div className="mt-2 space-y-2">
                          <p>Dear [Owner's Name],</p>
                          <p>
                            Florida's real estate landscape has experienced some noteworthy changes recently, especially
                            regarding insurance and property taxes. As an absentee owner, these shifts could have a
                            substantial effect on your investment.
                          </p>
                          <p>
                            If you're reconsidering the financial feasibility of holding onto your property, I
                            specialize in helping owners like you assess and maximize its current value.
                          </p>
                          <p>Reach out for a no-obligation discussion on how we can optimize your investment.</p>
                          <p>Warm Regards, [Your Name]</p>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>EMAIL 2: Time-sensitive Alert</strong>
                        </p>
                        <p>
                          <strong>Subject:</strong> Important Update: Florida Insurance & Property Taxes
                        </p>
                        <div className="mt-2 space-y-2">
                          <p>Hello [Owner's Name],</p>
                          <p>
                            Recent hikes in insurance and property taxes in Florida have left many absentee owners
                            re-evaluating their position. With these increases, is your property still the investment
                            you envisioned?
                          </p>
                          <p>
                            Should you feel the financials no longer make sense, my expertise lies in helping absentee
                            owners like you navigate this terrain and maximize your property's value.
                          </p>
                          <p>Don't hesitate to contact me for insights tailored to your unique situation.</p>
                          <p>Best, [Your Name]</p>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>EMAIL 3: Offering Solutions</strong>
                        </p>
                        <p>
                          <strong>Subject:</strong> Is Your Florida Property Still Working for You?
                        </p>
                        <div className="mt-2 space-y-2">
                          <p>Hi [Owner's Name],</p>
                          <p>
                            With Florida's recent upticks in insurance and property taxes, many absentee owners are
                            grappling with the effects on their bottom line. Is your property still yielding the returns
                            you expect?
                          </p>
                          <p>
                            I have successfully guided many in your position, helping them pivot strategies and unlock
                            their property's true potential. If the numbers aren't adding up for you, let's talk
                            solutions.
                          </p>
                          <p>Warmly, [Your Name]</p>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>EMAIL 4: The Consultative Approach</strong>
                        </p>
                        <p>
                          <strong>Subject:</strong> Let's Review Your Florida Property's Financial Health
                        </p>
                        <div className="mt-2 space-y-2">
                          <p>Dear [Owner's Name],</p>
                          <p>
                            The recent changes in insurance and property taxes in Florida have prompted many absentee
                            owners to take a closer look at their investments. I offer a comprehensive review to help
                            you determine if your property is still aligned with your financial aspirations.
                          </p>
                          <p>
                            If the rising costs have you second-guessing, allow me to help you understand your options
                            and maximize its current value.
                          </p>
                          <p>Looking forward to assisting you, [Your Name]</p>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>EMAIL 5: Positioning for the Future</strong>
                        </p>
                        <p>
                          <strong>Subject:</strong> Maximizing Your Florida Property in Today's Market
                        </p>
                        <div className="mt-2 space-y-2">
                          <p>Hello [Owner's Name],</p>
                          <p>
                            Changes are afoot in Florida's property sector, particularly with the latest surge in
                            insurance and property taxes. As an absentee owner, it's crucial to assess how these shifts
                            impact your long-term plans.
                          </p>
                          <p>
                            My specialty is in assisting owners like you navigate these waters, ensuring you're poised
                            for success irrespective of market dynamics. Let's strategize together to ensure your
                            property continues to be a valuable asset.
                          </p>
                          <p>Best wishes, [Your Name]</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="text-scripts" className="space-y-6 mt-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-black mb-4 text-lg">Absentee Owner SMS Campaign Series</h4>
                    <div className="text-sm text-gray-700 space-y-4">
                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>SMS 1: Investment Partnership</strong>
                        </p>
                        <p>
                          "Hi [Owner's Name], I noticed you own a property in Florida but aren't currently residing
                          there. Many owners in your position have partnered with us to maximize their investment
                          returns. Curious to learn more?"
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>SMS 2: Market Opportunity</strong>
                        </p>
                        <p>
                          "Hey [Owner's Name]! Florida's real estate market has seen some interesting shifts. Being an
                          absentee owner, have you considered your property's current potential? Let's chat."
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>SMS 3: Sunshine State Focus</strong>
                        </p>
                        <p>
                          "☀️ Greetings, [Owner's Name]! Sunshine State properties are in demand. As you own a property
                          in Florida but aren't local, we can help assess its value and opportunities. Interested?"
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>SMS 4: Management Support</strong>
                        </p>
                        <p>
                          "Hi [Owner's Name], managing a property from afar can be challenging. We've assisted many
                          absentee owners in Florida, ensuring their homes are well-maintained and profitable. Fancy a
                          chat?"
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>SMS 5: Local Expertise</strong>
                        </p>
                        <p>
                          "Hello [Owner's Name]! Owning a property in beautiful Florida is a dream for many. If you ever
                          think of selling or need local insights, let's connect. We specialize in supporting absentee
                          owners like you."
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="practice" className="space-y-6 mt-6">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                      <h4 className="font-bold text-black mb-4 text-lg">Absentee Owner Roleplay Practice with AI</h4>
                      <p className="text-gray-700 mb-4">
                        Practice your absentee owner scripts with our advanced voice AI. Learn to address property
                        management challenges and build trust.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <iframe
                        src="https://cerebras.vercel.app/"
                        width="100%"
                        height="700"
                        style={{ border: "none", borderRadius: "8px" }}
                        title="Cerebras Voice AI - Absentee Owner Roleplay Training"
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
                Marketing materials and follow-up strategies to nurture absentee owner relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProspectingContentComponent
                lane="absentee-owners"
                title="Absentee Owner Marketing Materials"
                description="Marketing materials and follow-up strategies to nurture absentee owner relationships"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
