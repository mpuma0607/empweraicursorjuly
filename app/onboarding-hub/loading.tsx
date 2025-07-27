import { Skeleton } from "@/components/ui/skeleton"

export default function OnboardingHubLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-indigo-900 text-white py-24">
        <div className="relative container mx-auto px-4 text-center">
          <Skeleton className="h-16 w-96 mx-auto mb-6 bg-white/10" />
          <Skeleton className="h-6 w-64 mx-auto mb-8 bg-white/10" />
          <Skeleton className="h-6 w-full max-w-3xl mx-auto bg-white/10" />
        </div>
      </section>

      {/* Resources Section Skeleton */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg">
                <Skeleton className="h-20 w-20 mx-auto mb-6 rounded-3xl" />
                <Skeleton className="h-6 w-32 mx-auto mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mx-auto mb-6" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
