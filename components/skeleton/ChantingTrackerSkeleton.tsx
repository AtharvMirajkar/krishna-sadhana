import { Skeleton, TextSkeleton, StatsCardSkeleton } from './Skeleton';

export function ChantingTrackerSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-20 mx-1 rounded" />
            ))}
          </div>
        </div>

        {/* Chart Area */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="w-full h-64 rounded" />
        </div>

        {/* Mantra Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8">
          <Skeleton className="h-8 w-40 mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-6 w-12 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
