import { FC } from "react";
import { Skeleton } from "../ui/skeleton";

const TemplateDetailsSkeleton: FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Skeleton className="w-full aspect-video rounded-2xl" />
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="w-24 aspect-video rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-full rounded-xl" />
          <Skeleton className="h-6 w-1/2 rounded-xl" />
          <Skeleton className="h-4 w-2/3 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default TemplateDetailsSkeleton;
