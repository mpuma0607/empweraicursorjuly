import type { Metadata } from "next"
import RealDealForm from "./realdeal-form"

export const metadata: Metadata = {
  title: "RealDeal AI | Contract Analysis Tool",
  description: "Upload and analyze real estate contracts for easy-to-understand summaries",
}

export default function RealDealAI() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
          RealDeal AI
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Upload any real estate contract or addendum and get a clear, professional summary that breaks down all the
          important details in simple language.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <RealDealForm />
      </div>
    </div>
  )
}
