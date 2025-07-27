import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WhosWhoForm } from "./whos-who-form"

export default function WhosWhoAIPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Who's Who AI</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover property owner information and contact details using advanced skip tracing technology
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🔍 Skip Tracing</CardTitle>
              <CardDescription>Get detailed owner information for any property address</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Property owner names</li>
                <li>• Contact information</li>
                <li>• Property details</li>
                <li>• Professional summary</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🤖 AI Analysis</CardTitle>
              <CardDescription>AI-powered professional summaries of owner information</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Organized contact details</li>
                <li>• Property ownership insights</li>
                <li>• Professional formatting</li>
                <li>• Email delivery option</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Property Owner Lookup</CardTitle>
            <CardDescription>
              Enter a property address to discover owner information and contact details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WhosWhoForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
