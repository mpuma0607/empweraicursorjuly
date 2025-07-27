import type { Metadata } from "next"
import QuickCMAForm from "@/components/quickcma-form"

export const metadata: Metadata = {
  title: "QuickCMA AI | The Next Level U",
  description: "Get detailed comparative market analysis for any property",
}

export default function QuickCMAPage() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">QuickCMA AI</h1>
          <p className="text-muted-foreground mt-2">
            Get comprehensive comparative market analysis with comparable homes data
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <QuickCMAForm />
          </div>
        </div>
      </div>
    </div>
  )
}
