import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DotloopTrainingLoading() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="text-center">
            <Skeleton className="w-20 h-20 rounded-3xl mx-auto mb-6" />
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
        </div>

        {/* Training Topics Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {Array.from({ length: 12 }).map((_, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <Skeleton className="w-12 h-12 rounded-xl mx-auto mb-4" />
                <Skeleton className="h-6 w-32 mx-auto" />
              </CardHeader>
              <CardContent className="pt-0">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mx-auto mb-4" />
                <Skeleton className="h-6 w-24 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Resources Skeleton */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto border-0 shadow-lg">
            <CardContent className="p-8">
              <Skeleton className="h-8 w-48 mx-auto mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mx-auto mb-6" />
              <Skeleton className="h-12 w-32 mx-auto" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
