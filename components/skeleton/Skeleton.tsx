// Base skeleton component
interface SkeletonProps {
  className?: string;
  animate?: boolean;
  style?: React.CSSProperties;
}

export function Skeleton({
  className = "",
  animate = true,
  style,
}: SkeletonProps) {
  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 rounded ${
        animate ? "animate-pulse" : ""
      } ${className}`}
      style={style}
    />
  );
}

// Text skeleton
interface TextSkeletonProps extends SkeletonProps {
  lines?: number;
  lineHeight?: string;
}

export function TextSkeleton({
  lines = 1,
  lineHeight = "h-4",
  className = "",
  ...props
}: TextSkeletonProps) {
  if (lines === 1) {
    return <Skeleton className={`${lineHeight} ${className}`} {...props} />;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`${lineHeight} ${i === lines - 1 ? "w-3/4" : "w-full"}`}
          {...props}
        />
      ))}
    </div>
  );
}

// Card skeleton
interface CardSkeletonProps extends SkeletonProps {
  hasImage?: boolean;
  contentLines?: number;
  children?: React.ReactNode;
}

export function CardSkeleton({
  hasImage = false,
  contentLines = 3,
  className = "",
  children,
  ...props
}: CardSkeletonProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 ${className}`}
      {...props}
    >
      {children ? (
        children
      ) : (
        <>
          {hasImage && <Skeleton className="w-full h-48 rounded-lg mb-4" />}
          <div className="space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <TextSkeleton lines={contentLines} lineHeight="h-4" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Button skeleton
export function ButtonSkeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <Skeleton className={`h-12 w-32 rounded-full ${className}`} {...props} />
  );
}

// Avatar skeleton
export function AvatarSkeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <Skeleton className={`w-12 h-12 rounded-full ${className}`} {...props} />
  );
}

// Stats card skeleton
export function StatsCardSkeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl p-6 ${className}`}
      {...props}
    >
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="w-8 h-8 rounded" />
        <Skeleton className="w-12 h-6 rounded" />
      </div>
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}
