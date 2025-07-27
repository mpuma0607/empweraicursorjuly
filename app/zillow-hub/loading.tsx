import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ZillowHubLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="text-center mb-12">
        <Skeleton className="h-6 w-32 mx-auto mb-4" />
        <Skeleton className="h-12 w-64 mx-auto mb-6" />
        <Skeleton className="h-6 w-full max-w-3xl mx-auto mb-2" />
        <Skeleton className="h-6 w-2/3 max-w-2xl mx-auto" />
      </div>

      {/* Stats Section Skeleton */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="text-center">
            <CardContent className="pt-6">
              <Skeleton className="w-12 h-12 rounded-full mx-auto mb-4" />
              <Skeleton className="h-8 w-16 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Feature Card Skeleton */}
      <Card className="mb-12">
        <div className="grid lg:grid-cols-2 gap-0">
          <div className="p-8 lg:p-12">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4 mb-6" />

            <div className="space-y-3 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <Skeleton className="h-5 w-5 mr-3" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ))}
            </div>

            <Skeleton className="h-12 w-64" />
          </div>

          <div className="p-8 lg:p-12 flex items-center justify-center">
            <Skeleton className="w-80 h-60 rounded-lg" />
          </div>
        </div>
      </Card>

      {/* Tools Grid Skeleton */}
      <div className="grid md:grid-cols-2 gap-8">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center">
                <Skeleton className="w-10 h-10 rounded-lg mr-3" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-4 w-full mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
