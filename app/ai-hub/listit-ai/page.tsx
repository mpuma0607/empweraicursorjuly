import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Sparkles } from "lucide-react"
import ListingForm from "./listing-form"

export default function ListITPage() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-600 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">ListIT</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Generate emotionally compelling, professionally polished, and sensory-rich listing descriptions in seconds.
            Perfect for captivating potential buyers and showcasing properties at their best.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <Sparkles className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <CardTitle className="text-black">Professional Copy</CardTitle>
              <CardDescription>Expert-level listing descriptions that sell properties faster</CardDescription>
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
                <path d="M12 2v8" />
                <path d="m4.93 10.93 1.41 1.41" />
                <path d="M2 18h2" />
                <path d="M20 18h2" />
                <path d="m19.07 10.93-1.41 1.41" />
                <path d="M22 22H2" />
                <path d="M16 6a4 4 0 0 0-8 0" />
                <path d="M16 18a4 4 0 0 0-8 0" />
              </svg>
              <CardTitle className="text-black">Instant Results</CardTitle>
              <CardDescription>Get compelling descriptions in seconds, not hours</CardDescription>
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
                className="h-12 w-12 text-orange-500 mx-auto mb-4"
              >
                <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
              </svg>
              <CardTitle className="text-black">Sensory-Rich Language</CardTitle>
              <CardDescription>Descriptions that engage all senses and create emotional connections</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Tool Interface */}
        <Card className="max-w-4xl mx-auto border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-black text-center">Listing Description Generator</CardTitle>
            <CardDescription className="text-center">
              Fill out the property details below to generate a professional listing description
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ListingForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
