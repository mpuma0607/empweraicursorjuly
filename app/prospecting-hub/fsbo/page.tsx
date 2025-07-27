import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, Search, MessageSquare, Repeat } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FSBOPage() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Home className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-black">For Sale By Owner (FSBO)</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master the art of converting FSBO sellers into clients with our proven 3-step system: Find them, Connect
            with them, and Market to them effectively.
          </p>
        </div>

        {/* FSBO Success System */}
        <Card className="max-w-4xl mx-auto mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-black text-center">FSBO Success System</CardTitle>
            <CardDescription className="text-center">
              Everything you need to become the go-to agent for FSBO sellers in your area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid-cols-1">
              <div className="space-y-4">
                <h4 className="font-semibold text-black">What You'll Get:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✅ Complete FSBO prospecting system</li>
                  <li>✅ Proven conversion scripts and objection handlers</li>
                  <li>✅ FSBO seller guides and market analyses</li>
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
              <CardDescription>Discover the best sources and strategies for locating FSBO sellers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-black mb-3">Key Sources for FSBO Sellers:</h4>
                  <div className="grid grid-cols-1 gap-y-3 text-sm text-gray-600">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                      <div>
                        <p>
                          <span className="font-medium">Research Online Platforms:</span> Start with popular real estate
                          websites that allow FSBO listings, like Zillow, Craigslist, FSBO.com, and ForSaleByOwner.com.
                          These sites are frequently used by homeowners to list their properties directly.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                      <div>
                        <p>
                          <span className="font-medium">Utilize Social Media:</span> Social media platforms like
                          Facebook, Instagram, and Nextdoor can be useful. Look for local real estate groups or
                          community pages where homeowners might post FSBO listings.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                      <div>
                        <p>
                          <span className="font-medium">Drive Around Neighborhoods:</span> Take some time to drive
                          through local neighborhoods. Look for "For Sale By Owner" signs in yards. This method can
                          uncover listings that might not be advertised online.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                      <div>
                        <p>
                          <span className="font-medium">Network with Contacts:</span> Leverage your network of contacts.
                          Inform them that you're looking for FSBO properties. Word-of-mouth can be a powerful tool in
                          real estate.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                      <div>
                        <p>
                          <span className="font-medium">Check Local Newspapers:</span> Some sellers still use local
                          newspapers or community bulletins to advertise their properties. Regularly check these sources
                          for any new listings.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                      <div>
                        <p>
                          <span className="font-medium">Attend Community Events:</span> Engage in community events or
                          local real estate meetings. These can be great opportunities to learn about FSBO properties
                          before they hit the broader market.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                      <div>
                        <p>
                          <span className="font-medium">Use Direct Mail Marketing:</span> Consider sending out direct
                          mail to homeowners in your target areas. Sometimes, homeowners are considering selling but
                          haven't listed their property yet.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Training Video Section */}
                <div className="mt-8">
                  <h4 className="font-semibold text-black mb-4">FSBO Prospecting Training Video</h4>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <iframe
                      src="https://www.youtube.com/embed/Blhdk_5WzbY"
                      width="100%"
                      height="315"
                      style={{ border: 0 }}
                      title="FSBO Prospecting Training"
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
              <CardDescription>Proven conversation starters and objection handling for FSBO sellers</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="phone-scripts" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="phone-scripts">Phone</TabsTrigger>
                  <TabsTrigger value="email-scripts">Email</TabsTrigger>
                  <TabsTrigger value="text-scripts">SMS</TabsTrigger>
                  <TabsTrigger value="practice">Practice</TabsTrigger>
                </TabsList>

                <TabsContent value="phone-scripts" className="space-y-6 mt-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-black mb-4 text-lg">FSBO Door Knock Script</h4>
                    <div className="text-sm text-gray-700 space-y-3 max-h-96 overflow-y-auto">
                      <p>
                        <strong>Opening:</strong> ____, I'm here about the home for sale... is it still available...
                        ____ Great!
                      </p>

                      <p>
                        <strong>Introduction:</strong> I'm ______ with (insert brokerage name), and I know you are going
                        to try it on your own for a little while, and I'm here to interview for the job when you are
                        ready.....and that's why ... I'm curious...
                      </p>

                      <div className="space-y-2">
                        <p>
                          <strong>Discovery Questions:</strong>
                        </p>
                        <p>1. If you sold this home ... where would you go next. __________ Great!</p>
                        <p>2. How soon do you have to be there. _________________ No Problem!</p>
                        <p>3. How long have you been trying to ... sell your property... on your own. ____ Wow!</p>
                        <p>
                          4. How would you rate your motivation to ... move ... on a scale of 1 to 10. ______ Great!
                        </p>
                        <p>5. If we were able to ... sell your home... in the next 30 days would that be OK. ___</p>
                        <p>6. What methods are you using for marketing your home. _____Interesting!</p>
                        <p>7. How did you determine your sales price. ________________ OK!</p>
                        <p>8. Are you prepared to ... adjust your price down...when working with a buyer. __ Great!</p>
                        <p>
                          9. Why did you decide to sell yourself...rather than to ...hire the best ...Real Estate
                          company. ________________Understandable!
                        </p>
                        <p>
                          10. If you were to ... hire the best Company...what would you expect us to do ... to ...get
                          your property sold... for you. ______________ Excellent!
                        </p>
                        <p>
                          11. When do you think you will at least ... interview (your brokerage name)... for the job of
                          selling your home. _____________ Wonderful!
                        </p>
                        <p>
                          12. What would have to happen .... to cause you to ... make the decision ...to ... HIRE THE
                          BEST COMPANY ... (your brokerage name)...for the job of selling your property. ___ OK!
                        </p>
                      </div>

                      <p>
                        <strong>Value Proposition:</strong> Let's do this... let me ... show you what your house is
                        REALLY worth in today's market and show you the tools that only (your brokerage name) has that
                        allow us to sell 20-30 homes a day which is more than any of our competitors.... You do...
                        expect the best ...don't you.... Of course!
                      </p>

                      <p>
                        <strong>Close:</strong> This way... at least you REALLY ... know your options... and if ...it
                        makes sense...it makes sense... if it doesn't it doesn't... either way ... let's ... find out...
                        The worst case scenario is...you'll know what your house is REALLY going to sell for... that
                        will be nice to know.. RIGHT!
                      </p>

                      <p>
                        <strong>Appointment Setting:</strong> What would be the best time for me to come back by with
                        today's real value, show you how much you would put in your pocket and interview for the job of
                        selling your property? Either you will like what I have to say and want to ...hire us... or you
                        won't want to ...hire us...and either one is fine....
                      </p>

                      <p>
                        <strong>Final Close:</strong> What's better for you ___ or ____ Fantastic!!! See you then!
                      </p>

                      <p>
                        When can I take a look at the property to ensure that I fully maximize the value? ____ or ____
                        or right now?
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="email-scripts" className="space-y-6 mt-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-black mb-4 text-lg">FSBO Email Templates</h4>
                    <div className="text-sm text-gray-700 space-y-6 max-h-96 overflow-y-auto">
                      <div>
                        <p>
                          <strong>Email 1: Introduction and Value Proposition</strong>
                        </p>
                        <p>
                          <strong>Subject: Local Expertise to Maximize Your FSBO Success</strong>
                        </p>
                        <div className="bg-white p-4 rounded border mt-2">
                          <p>Hello [Seller's Name],</p>
                          <p>
                            As a dedicated local real estate agent, I've noticed your property on the FSBO listings. My
                            expertise in [Your Area] real estate market positions me uniquely to assist you. While
                            you're embarking on a FSBO journey, partnering with a professional can significantly enhance
                            your success.
                          </p>
                          <p>
                            My goal is to ensure your property sells for its highest potential value. This not only
                            benefits you but also positively impacts my other clients by establishing higher market
                            values in our community. Let's chat about how we can achieve the best outcome for your sale.
                          </p>
                          <p>
                            Best regards,
                            <br />
                            [Your Name]
                          </p>
                        </div>
                      </div>

                      <div>
                        <p>
                          <strong>Email 2: Highlighting Local Market Knowledge</strong>
                        </p>
                        <p>
                          <strong>Subject: Leverage My Local Market Insights for Your FSBO Sale</strong>
                        </p>
                        <div className="bg-white p-4 rounded border mt-2">
                          <p>Hi [Seller's Name],</p>
                          <p>
                            I'm [Your Name], a real estate expert in [Your Area], and I've been following your FSBO
                            listing. My deep understanding of our local market can be a vital asset in your home selling
                            process.
                          </p>
                          <p>
                            Selling at an optimal price point benefits not only you but also helps in maintaining robust
                            property values for the entire neighborhood – something all my clients, present and future,
                            greatly appreciate. Let's discuss how we can collaborate to maximize your sale price.
                          </p>
                          <p>
                            Warm regards,
                            <br />
                            [Your Name]
                          </p>
                        </div>
                      </div>

                      <div>
                        <p>
                          <strong>Email 3: Focusing on Mutual Benefits</strong>
                        </p>
                        <p>
                          <strong>Subject: Achieving Top Dollar for Your Home Benefits Us Both</strong>
                        </p>
                        <div className="bg-white p-4 rounded border mt-2">
                          <p>Dear [Seller's Name],</p>
                          <p>
                            I'm reaching out as a seasoned real estate professional in [Your Area]. I see you're selling
                            your home independently, and I admire your initiative. As someone deeply invested in the
                            local property market, I understand how important it is for homes like yours to sell for
                            their true worth.
                          </p>
                          <p>
                            Achieving a successful sale at a great price not only fulfills your goals but also elevates
                            the market, benefiting my other clients. I'd love to explore how we can work together for
                            mutual success.
                          </p>
                          <p>
                            Best,
                            <br />
                            [Your Name]
                          </p>
                        </div>
                      </div>

                      <div>
                        <p>
                          <strong>Email 4: Offering Support and Guidance</strong>
                        </p>
                        <p>
                          <strong>Subject: Expert Guidance to Enhance Your FSBO Journey</strong>
                        </p>
                        <div className="bg-white p-4 rounded border mt-2">
                          <p>Hello [Seller's Name],</p>
                          <p>
                            As a real estate agent specializing in [Your Area], I noticed your FSBO listing and wanted
                            to offer my expertise. Navigating the FSBO route can be challenging, but with the right
                            guidance, it's incredibly rewarding.
                          </p>
                          <p>
                            By ensuring your home sells for the best possible price, we not only achieve your goal but
                            also support the overall health of our local real estate market, benefiting all homeowners
                            in the area. Let's talk about how we can make your sale a resounding success.
                          </p>
                          <p>
                            Regards,
                            <br />
                            [Your Name]
                          </p>
                        </div>
                      </div>

                      <div>
                        <p>
                          <strong>Email 5: Emphasizing Community Impact</strong>
                        </p>
                        <p>
                          <strong>Subject: Your FSBO Success Contributes to Our Community's Value</strong>
                        </p>
                        <div className="bg-white p-4 rounded border mt-2">
                          <p>Hi [Seller's Name],</p>
                          <p>
                            I'm [Your Name], a local real estate agent, and I noticed your home listed as FSBO. Selling
                            your home at a peak value is crucial for you and has a ripple effect throughout our
                            community.
                          </p>
                          <p>
                            By achieving the best possible sale price, we elevate the market standards, benefiting all
                            property owners in the area, including my clients. I'd be thrilled to discuss how we can
                            collaborate to maximize your home's value and positively impact our community.
                          </p>
                          <p>
                            Sincerely,
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
                    <h4 className="font-bold text-black mb-4 text-lg">FSBO SMS Templates</h4>
                    <div className="text-sm text-gray-700 space-y-4">
                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>SMS 1: Introduction and Value Proposition</strong>
                        </p>
                        <p>
                          "Hi [Seller's Name], I'm [Your Name], a local real estate expert. Noticed your FSBO listing. I
                          can help maximize your sale price, benefiting you and our community. Let's talk! - [Your
                          Name]"
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>SMS 2: Highlighting Local Market Knowledge</strong>
                        </p>
                        <p>
                          "Hello [Seller's Name], I'm [Your Name], specializing in [Your Area] real estate. Let's use my
                          market insights to boost your FSBO sale and strengthen local property values. Interested? -
                          [Your Name]"
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>SMS 3: Focusing on Mutual Benefits</strong>
                        </p>
                        <p>
                          "Hi [Seller's Name], I'm [Your Name], a real estate pro in [Your Area]. Your successful FSBO
                          sale can elevate the market for all. Let's work together for top dollar! - [Your Name]"
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>SMS 4: Offering Support and Guidance</strong>
                        </p>
                        <p>
                          "Hey [Seller's Name], [Your Name] here, a real estate agent in [Your Area]. I can guide your
                          FSBO journey for a rewarding sale, benefiting our local market. Let's connect! - [Your Name]"
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded border">
                        <p>
                          <strong>SMS 5: Emphasizing Community Impact</strong>
                        </p>
                        <p>
                          "Hello [Seller's Name], I'm [Your Name] from [Your Area] real estate. Your FSBO success can
                          uplift our community's property values. Let's collaborate for a great sale! - [Your Name]"
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="practice" className="space-y-6 mt-6">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                      <h4 className="font-bold text-black mb-4 text-lg">FSBO Roleplay Practice with AI</h4>
                      <p className="text-gray-700 mb-4">
                        Practice your FSBO scripts with our advanced voice AI. Learn to handle objections and build
                        rapport with FSBO sellers.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <iframe
                        src="https://cerebras.vercel.app/"
                        width="100%"
                        height="700"
                        style={{ border: "none", borderRadius: "8px" }}
                        title="Cerebras Voice AI - FSBO Roleplay Training"
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
                Marketing materials and follow-up strategies to nurture FSBO relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-semibold text-black mb-4">FSBO Marketing Materials</h4>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <iframe
                    src="https://drive.google.com/embeddedfolderview?id=1tYrdrw4_zATfQDsiG_B8R7iX6JoSVayt#grid"
                    style={{ width: "100%", height: "600px", border: 0 }}
                    title="FSBO Marketing Materials"
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
