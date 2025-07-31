import { Suspense } from "react"
import MyMarketForm from "./mymarket-form"
import Loading from "./loading"

export default function MyMarketAIPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MyMarket AI
          </h1>
          <p className="text-lg text-gray-600">
            Get comprehensive market insights for rental and housing markets across the United States
          </p>
        </div>
        
        <Suspense fallback={<Loading />}>
          <MyMarketForm />
        </Suspense>
      </div>
    </div>
  )
} 