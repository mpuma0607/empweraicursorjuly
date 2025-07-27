import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckSquare, Target, Clock } from "lucide-react"
import ActionPlanForm from "@/components/action-plan-form"

export default function ActionAIPage() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Calendar className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">Action AI</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Generate personalized daily action plans with AI-powered scripts and strategies. Focus your prospecting
            efforts and maximize your productivity with targeted outreach plans.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <Target className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <CardTitle className="text-black">Targeted Prospecting</CardTitle>
              <CardDescription>Focus your outreach on specific audience segments</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <CheckSquare className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
              <CardTitle className="text-black">Ready-to-Use Scripts</CardTitle>
              <CardDescription>Get professionally written scripts for calls, texts, and emails</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <Clock className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <CardTitle className="text-black">Daily Action Plans</CardTitle>
              <CardDescription>Receive a structured plan with specific tasks and goals</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Tool Interface */}
        <Card className="max-w-4xl mx-auto border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-black text-center">Daily Action Plan Generator</CardTitle>
            <CardDescription className="text-center">
              Tell us who you want to prospect today, and we'll create a complete action plan with scripts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActionPlanForm />
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-black text-center mb-8">Why Use Action AI?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  Save Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Eliminate the guesswork and planning time. Get a complete, ready-to-execute action plan in seconds
                  instead of spending hours creating one yourself.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  Increase Effectiveness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Use professionally crafted scripts that incorporate VAK language principles to connect with all
                  personality types and increase your response rates.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  Stay Focused
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Maintain clarity on your daily priorities with a structured plan that keeps you accountable and
                  focused on high-value prospecting activities.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  Track Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Set clear, measurable goals for your daily outreach efforts. Know exactly how many calls, texts, and
                  emails to send to hit your targets.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How It Works Section */}
        <Card className="mt-12 max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-black text-center">💡 How Action AI Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-black mb-1">Enter Your Prospecting Focus</h4>
                  <p className="text-gray-600">
                    Tell us who you want to talk to today. Be specific about your target audience, such as "FSBO
                    listings in the downtown area" or "Past clients from 2-3 years ago."
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-black mb-1">Provide Your Details</h4>
                  <p className="text-gray-600">
                    Enter your name, email, and any specific goals or challenges you're facing with this audience.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-black mb-1">Receive Your Custom Action Plan</h4>
                  <p className="text-gray-600">
                    Our AI coach generates a complete daily action plan with specific tasks, goals, and professionally
                    written scripts for calls, texts, and emails.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-black mb-1">Execute and Track Results</h4>
                  <p className="text-gray-600">
                    Follow your personalized plan throughout the day, tracking your progress and results to improve
                    future prospecting efforts.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
