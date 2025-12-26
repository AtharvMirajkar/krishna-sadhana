import { Skeleton, TextSkeleton, CardSkeleton, ButtonSkeleton } from './Skeleton';

export function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZiZDM4YiIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <Skeleton className="w-24 h-24 rounded-full" />
            </div>

            <Skeleton className="h-16 w-96 mx-auto" />

            <TextSkeleton lines={2} className="max-w-2xl mx-auto" />

            <div className="flex flex-wrap justify-center gap-4 pt-8">
              <ButtonSkeleton />
              <ButtonSkeleton />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-24">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton
                key={i}
                contentLines={3}
                className="animate-fadeIn"
                style={{ animationDelay: `${0.4 + i * 0.1}s` }}
              />
            ))}
          </div>

          <div className="mt-24 text-center">
            <TextSkeleton lines={1} className="text-xl max-w-3xl mx-auto mb-4" />
            <Skeleton className="h-6 w-32 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
