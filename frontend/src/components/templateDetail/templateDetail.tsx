"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import Rating from "../common/rating";
import {
  CheckIcon,
  DownloadIcon,
  EyeIcon,
  Heart,
  Share2,
  XIcon,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AddRateService,
  GetTemplateWithSlugService,
} from "@/services/template.service";
import { Template } from "@/types/template";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/utils/const";

type TemplateDetailProps = {
  slug: string;
};

export default function TemplateDetails({ slug }: TemplateDetailProps) {
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const router = useRouter();

  const { data, isLoading, isError } = useQuery<Template>({
    queryKey: ["template", slug],
    queryFn: () => GetTemplateWithSlugService(slug),
    retry: 1,
  });

  const mutation = useMutation({
    mutationFn: AddRateService,
  });

  const handleDownload = () => {
    router.push(`${BASE_URL}/template/download/${slug}`);
  };

  const handlePreview = () => {
    const url = `${BASE_URL}/templates/${slug}/index.html`;
    window.open(url, "_blank");
  };

  if (isError) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertDescription>
          Failed to load template details. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <TemplateDetailsSkeleton />;
  }

  const imageList = data?.images?.length ? data.images : ["/images/imgre.webp"];

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative aspect-video rounded-2xl overflow-hidden"
          >
            <Image
              src={"/images/imgre.webp"}
              fill
              priority
              alt={data?.title || "Template preview"}
              className="object-cover"
            />
          </motion.div>

          {imageList.length > 1 && (
            <div className="flex gap-4 pb-2">
              {imageList.map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(index)}
                  className="relative w-24 aspect-video flex-shrink-0 cursor-pointer"
                >
                  <Image
                    src={"/images/imgre.webp"}
                    fill
                    alt={`Preview ${index + 1}`}
                    className={`rounded-lg transition-all duration-300 object-cover
                      ${selectedImage !== index && "brightness-50"} 
                      ${selectedImage === index && "ring-2 ring-purple-500"}
                    `}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {data?.title}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Rating
              value={data?.avarage_rating || 0}
              onChange={(rate) => {
                mutation.mutate({ slug, rate });
              }}
            />
            <span className="text-gray-600">{data?.views || 0} views</span>
          </div>

          <div className="flex items-center gap-4">
            {data?.current_price === 0 ? (
              <span className="text-3xl font-bold text-purple-600">Free</span>
            ) : (
              <>
                {(data?.original_price || 0) > (data?.current_price || 0) && (
                  <span className="text-xl text-gray-400 line-through">
                    ${data?.original_price}
                  </span>
                )}
                <span className="text-xl font-bold text-purple-600">
                  ${data?.current_price}
                </span>
              </>
            )}
          </div>

          {data?.description && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {data.description}
              </p>
            </div>
          )}

          {data?.features && data.features.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Key Features
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    {feature.available ? (
                      <CheckIcon
                        size={20}
                        strokeWidth={3}
                        className="text-purple-500"
                      />
                    ) : (
                      <XIcon
                        size={20}
                        strokeWidth={3}
                        className="text-red-500"
                      />
                    )}
                    <span className="text-gray-600">{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-4 pt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 min-w-[180px] flex items-center justify-center gap-2 
                bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-3 font-medium"
              aria-label="Download"
              onClick={handleDownload}
            >
              <DownloadIcon size={20} />
              Download Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 min-w-[180px] flex items-center justify-center gap-2 
                bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-3 font-medium"
              aria-label="Preview"
              onClick={handlePreview}
            >
              <EyeIcon size={20} />
              Preview
            </motion.button>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600"
                aria-label="Like"
              >
                <Heart size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600"
                aria-label="Share"
              >
                <Share2 size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Loading skeleton component
function TemplateDetailsSkeleton() {
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
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-8 w-1/3" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-8" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
