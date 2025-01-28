"use client";

import React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { BASE_URL } from "@/lib/const";
import { useGetCategoriesQuery } from "@/services/categoryService";
import { useLocale } from "@/hooks/useLocal";

const CategoryComp = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentLang } = useLocale();

  const { data, isLoading } = useGetCategoriesQuery();

  const handleCategoryClick = (slug?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="w-full flex justify-center">
      <div className="container px-4">
        <div className="flex justify-center gap-4 overflow-x-auto snap-x snap-mandatory py-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="snap-start min-w-20 aspect-square flex flex-col items-center justify-center bg-gray-200 rounded-lg animate-pulse"
              />
            ))
          ) : (
            <>
              <div
                className="snap-start min-w-20 aspect-square flex flex-col items-center justify-center bg-white rounded-lg cursor-pointer
                hover:bg-purple-500 transition-all hover:text-white shadow-sm"
                onClick={() => handleCategoryClick()}
              >
                All
              </div>
              {data?.map((category) => {
                const translatedTitle = category.translations?.find(
                  (translation) => translation.language === currentLang
                )?.title;

                return (
                  <div
                    data-active={category.slug === searchParams.get("category")}
                    key={category.id}
                    className="snap-start min-w-20 aspect-square flex flex-col items-center justify-center gap-2 bg-white rounded-lg cursor-pointer
                    hover:bg-purple-500 transition-all hover:text-white shadow-sm p-2
                    data-[active=true]:bg-purple-500 data-[active=true]:text-white"
                    onClick={() => handleCategoryClick(category.slug)}
                  >
                    <Image
                      src={`${BASE_URL}/${category.image_url}`}
                      alt={translatedTitle || category.slug}
                      width={60}
                      height={60}
                      className="size-8 object-contain"
                    />
                    <span className="text-[10px] max-w-20 text-center line-clamp-2">
                      {translatedTitle || category.slug}
                    </span>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryComp;
