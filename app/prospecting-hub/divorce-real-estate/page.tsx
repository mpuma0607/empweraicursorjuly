import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, Search, MessageSquare, Repeat } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DivorcePage() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
              <Home className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-black">Divorce Real Estate</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help families through difficult transitions while building your business with our proven 3-step system: Find
            them, Connect with them, and Market to them effectively.
          </p>
        </div>

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
                Discover the best sources and strategies for locating divorce real estate opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-black mb-3">Key Sources for Divorce Real Estate:</h4>
                  <div className="grid grid-cols-1 gap-y-2 text-sm text-gray-600">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Divorce Attorneys:</span> Build relationships with family law
                        attorneys
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Court Records:</span> Public divorce filings and proceedings
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Mediators:</span> Network with divorce mediation professionals
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5"></div>
                      <p>
                        <span className="font-medium">Financial Planners:</span> Professionals who work with divorcing
                        clients
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
              <CardDescription>Sensitive and professional scripts for working with divorcing couples</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="phone-scripts" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="phone-scripts">Phone Scripts</TabsTrigger>
                  <TabsTrigger value="email-scripts">Email Scripts</TabsTrigger>
                </TabsList>

                <TabsContent value="phone-scripts" className="space-y-6 mt-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-black mb-4 text-lg">Divorce Real Estate Cold Call Script</h4>
                    <div className="text-sm text-gray-700 space-y-3 max-h-96 overflow-y-auto">
                      <p>
                        <strong>Opening:</strong> Hi, is this [Name]? This is [Your Name] with [Your Company]. I
                        specialize in helping families navigate real estate matters during life transitions.
                      </p>
                      <p>
                        <strong>Purpose:</strong> I work with many families who are dealing with divorce and need to
                        make decisions about their home. I understand this is a sensitive time.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="email-scripts" className="space-y-6 mt-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-black mb-4 text-lg">Divorce Real Estate Email Templates</h4>
                    <div className="text-sm text-gray-700 space-y-4">
                      <p>
                        <strong>Subject: Professional Real Estate Assistance During Your Transition</strong>
                      </p>
                      <div className="bg-white p-4 rounded border mt-2">
                        <p>Dear [Name],</p>
                        <p>I understand you're going through a difficult time with your divorce proceedings...</p>
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
              <CardDescription>
                Professional marketing materials and follow-up campaigns for divorce real estate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-semibold text-black mb-4">Divorce Real Estate Marketing Materials</h4>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <iframe
                    src="https://drive.google.com/embeddedfolderview?id=1WfxT42P5vGo5Lbi5tj_dZCuRtp-V3JbS#grid"
                    style={{ width: "100%", height: "600px", border: 0 }}
                    title="Divorce Real Estate Marketing Materials"
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
