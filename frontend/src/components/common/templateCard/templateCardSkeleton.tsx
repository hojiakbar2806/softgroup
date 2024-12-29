import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";

export const TemplateCardSkeleton: FC = () => {
  return (
    <div className="relative w-full max-w-sm bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden">
      {/* Thumbnail Skeleton */}
      <div className="relative h-48 w-full">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content Skeleton */}
      <div className="p-4 flex flex-col gap-4">
        {/* Title Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-7 w-3/4" />
        </div>

        {/* Rating and Price Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16" />
          </div>
        </div>

        {/* Button Skeleton */}
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>

      {/* Decorative Background Blurs */}
      <div className="absolute top-0 right-0 -z-10 w-32 h-32 bg-purple-200/50 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 w-32 h-32 bg-blue-200/50 rounded-full blur-3xl" />
    </div>
  );
};
