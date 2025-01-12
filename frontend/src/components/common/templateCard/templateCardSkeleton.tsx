import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";

export const TemplateCardSkeleton: FC = () => {
  return (
    <div className="relative w-full max-w-sm bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden">
      <div className="relative w-full">
        <Skeleton className="aspect-[4/3]" />
      </div>

      <div className="p-2 flex gap-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-24" />
      </div>

      <div className="absolute top-0 right-0 -z-10 w-32 h-32 bg-purple-200/50 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 w-32 h-32 bg-blue-200/50 rounded-full blur-3xl" />
    </div>
  );
};
