import { CardSkeleton, TextSkeleton, ButtonSkeleton } from './Skeleton';

export function SpiritualJournalSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="text-center mb-12 animate-pulse">
          <div className="h-12 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 rounded-lg mx-auto mb-4 w-80"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mx-auto w-96"></div>

          {/* Date selector skeleton */}
          <div className="flex items-center justify-center gap-4 mt-6 mb-6">
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-lg w-40"></div>
            <ButtonSkeleton />
          </div>

          {/* Tab navigation skeleton */}
          <div className="flex justify-center gap-2 mb-8">
            <ButtonSkeleton />
            <ButtonSkeleton />
          </div>
        </div>

        <div className="space-y-6">
          {/* New entry button skeleton */}
          <div className="text-center">
            <ButtonSkeleton />
          </div>

          {/* Journal entries skeleton */}
          <CardSkeleton>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <TextSkeleton className="h-6 w-48" />
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
              <TextSkeleton className="h-4 w-32" />
              <div className="space-y-2">
                <TextSkeleton className="h-4 w-full" />
                <TextSkeleton className="h-4 w-full" />
                <TextSkeleton className="h-4 w-3/4" />
              </div>
            </div>
          </CardSkeleton>

          <CardSkeleton>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <TextSkeleton className="h-6 w-56" />
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
              <TextSkeleton className="h-4 w-40" />
              <div className="space-y-2">
                <TextSkeleton className="h-4 w-full" />
                <TextSkeleton className="h-4 w-5/6" />
                <TextSkeleton className="h-4 w-4/5" />
              </div>
            </div>
          </CardSkeleton>
        </div>
      </div>
    </div>
  );
}
