import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ZillowShowcaseLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="text-center mb-12">
        <Skeleton className="h-6 w-32 mx-auto mb-4" />
        <Skeleton className="h-12 w-96 mx-auto mb-6" />
        <Skeleton className="h-6 w-full max-w-3xl mx-auto mb-2" />
        <Skeleton className="h-6 w-2/3 max-w-2xl mx-auto" />
      </div>

      {/* Training Modules Grid Skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className={i === 4 ? "md:col-span-2 lg:col-span-3" : ""}>
            <CardHeader>
              <div className="flex items-center">
                <Skeleton className="h-6 w-6 mr-3" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-4 w-full mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to Action Skeleton */}
      <div className="bg-gray-50 p-8 rounded-lg">
        <div className="text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-full max-w-md mx-auto mb-6" />
          <div className="flex flex-wrap justify-center gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-24" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
