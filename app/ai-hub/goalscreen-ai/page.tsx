import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Sparkles } from "lucide-react"
import GoalScreenForm from "@/components/goal-screen-form"

export default function GoalScreenPage() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Target className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">GoalScreen AI</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Create personalized goal wallpapers for your phone and computer. Keep your real estate goals visible and
            stay motivated with custom-designed goal screens.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <Target className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <CardTitle className="text-black">Goal Visualization</CardTitle>
              <CardDescription>Turn your goals into beautiful, motivating wallpapers</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <Sparkles className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-black">Custom Design</CardTitle>
              <CardDescription>Personalized designs that match your style and motivation</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-amber-500 mx-auto mb-4"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <CardTitle className="text-black">Multiple Formats</CardTitle>
              <CardDescription>Perfect for phone, desktop, and tablet wallpapers</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Tool Interface */}
        <Card className="max-w-4xl mx-auto border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-black text-center">Goal Wallpaper Generator</CardTitle>
            <CardDescription className="text-center">
              Create your personalized goal wallpaper to keep your objectives visible and motivating
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GoalScreenForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
