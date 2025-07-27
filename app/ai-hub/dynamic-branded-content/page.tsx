import { Suspense } from "react"
import DynamicBrandedContentForm from "./dynamic-branded-content-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function DynamicBrandedContentPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Dynamic Branded Content Creator</CardTitle>
          <CardDescription className="text-purple-100">
            Create professional branded content for any topic with AI-generated visuals and custom branding
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                <span className="ml-2 text-gray-600">Loading form...</span>
              </div>
            }
          >
            <DynamicBrandedContentForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
