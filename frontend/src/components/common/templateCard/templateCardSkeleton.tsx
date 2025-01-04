import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";

export const TemplateCardSkeleton: FC = () => {
  return (
    <div className="relative w-full max-w-sm bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg overflow-hidden">
      <div className="relative w-full">
        <Skeleton className="aspect-video" />
      </div>

      <div className="p-2 flex flex-col gap-2">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
        </div>

        <div className="flex items-center gap-1">
          <Skeleton className="h-6 w-24" />
        </div>

        <Skeleton className="h-8 w-full rounded-lg" />
      </div>

      <div className="absolute top-0 right-0 -z-10 w-32 h-32 bg-purple-200/50 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 w-32 h-32 bg-blue-200/50 rounded-full blur-3xl" />
    </div>
  );
};
