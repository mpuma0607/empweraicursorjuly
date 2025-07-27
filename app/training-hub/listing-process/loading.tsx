import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Skeleton className="h-5 w-32 bg-gray-700" />
          </div>
          <div className="text-center">
            <Skeleton className="h-10 w-96 mx-auto mb-4 bg-gray-700" />
            <Skeleton className="h-6 w-[600px] mx-auto bg-gray-700" />
          </div>
        </div>
      </div>

      {/* Overview Section Skeleton */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-[800px] mx-auto" />
          </div>
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        </div>
      </div>

      {/* 7 P's Grid Skeleton */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="border rounded-lg p-6 shadow-lg">
                <div className="text-center">
                  <Skeleton className="w-16 h-16 rounded-2xl mx-auto mb-4" />
                  <Skeleton className="h-6 w-12 mx-auto mb-3" />
                  <Skeleton className="h-6 w-24 mx-auto mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
