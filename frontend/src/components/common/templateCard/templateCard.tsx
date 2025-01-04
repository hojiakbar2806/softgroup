"use client";

import Image from "next/image";
import { Link, useRouter } from "@/i18n/routing";
import { FC } from "react";
import { ArrowUpRight } from "lucide-react";
import Rating from "../rating";
import { Template } from "@/types/template";
import { useLocale } from "next-intl";
import { BASE_URL } from "@/utils/const";

const TemplateCard: FC<{ product: Template }> = ({ product }) => {
  const router = useRouter();
  const locale = useLocale();

  const translated = product.translations?.find(
    (item) => item.language === locale
  );

  return (
    <div
      className="group flex flex-col cursor-pointer relative w-full bg-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden
      rounded-lg md:rounded-xl lg:rounded-2xl 2xl:rounded-3xl"
      onClick={() => router.push(`/templates/${product?.slug}`)}
    >
      <div className="absolute top-2 right-2 z-10">
        {product?.original_price > product?.current_price && (
          <div className="flex items-center gap-1 bg-red-400 text-white px-3 py-1 rounded-full text-sm font-medium">
            <span className="line-through">${product?.original_price}</span>
          </div>
        )}
      </div>

      <Image
        src={`${BASE_URL}/${product?.images[0].url}`}
        width={500}
        height={350}
        alt={translated?.title || ""}
        className="aspect-video object-cover border-b group-hover:scale-105 transition-all duration-300"
      />

      <div className="flex flex-1 flex-col p-2 gap-1 sm:gap-2">
        <div className="flex items-center justify-between">
          <h2
            className="text-sm sm:text-lg font-semibold text-gray-800 group-hover:text-purple-600 
              transition-colors line-clamp-1"
          >
            {translated?.title}
          </h2>
          <span className="ml-2 text-[8px] sm:text-xs text-gray-600">
            ({product?.views} views)
          </span>
        </div>

        <div className="flex  items-center justify-between">
          <Rating value={product?.avarage_rating} readonly />

          <div className="flex items-center gap-2">
            {product?.original_price > 0 && (
              <span className="text-xs sm:text-lg text-gray-400 line-through">
                ${product?.original_price}
              </span>
            )}
            <span className="text-xs sm:text-lg font-bold text-purple-600">
              {product?.current_price === 0
                ? "Free"
                : `$${product?.current_price}`}
            </span>
          </div>
        </div>
        <Link
          href={`${locale}/templates/${product?.slug}/preview`}
          target="_blank"
          className="mt-auto flex items-center justify-center gap-2 text-xs whiterap px-3 py-1 text-white bg-gradient-to-br from-purple-600 to-blue-500 font-medium rounded-lg
            sm:px-4 sm:text-sm lg:px-5 lg:text-base 2xl:px-6 2xl:text-lg"
        >
          View Preview
          <ArrowUpRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      <div
        className="absolute top-0 right-0 -z-10 w-32 h-32 bg-purple-200/50 rounded-full 
        blur-3xl group-hover:bg-purple-300/50 transition-colors"
      />
      <div
        className="absolute bottom-0 left-0 -z-10 w-32 h-32 bg-blue-200/50 rounded-full 
        blur-3xl group-hover:bg-blue-300/50 transition-colors"
      />
    </div>
  );
};

export default TemplateCard;
