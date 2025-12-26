import { Skeleton, TextSkeleton, CardSkeleton } from './Skeleton';

export function MantraLibrarySkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        <div className="space-y-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>

                  <div className="space-y-3">
                    <Skeleton className="h-6 w-64" />
                    <Skeleton className="h-5 w-56" />
                    <TextSkeleton lines={2} lineHeight="h-4" />
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <Skeleton className="w-32 h-10 rounded-lg" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="w-20 h-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
