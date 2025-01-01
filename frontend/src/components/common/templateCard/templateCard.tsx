"use client";

import Image from "next/image";
import { Link, useRouter } from "@/i18n/routing";
import { FC } from "react";
import { motion } from "framer-motion";
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
    <motion.div
      className="group relative w-full max-w-sm bg-gradient-to-br from-white to-gray-50 
        rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
      onClick={() => router.push(`/${product?.slug}`)}
    >
      <div className="absolute top-2 right-2 z-10">
        {product?.original_price > product?.current_price && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 bg-red-400 text-white px-3 py-1 rounded-full text-sm font-medium"
          >
            <span className="line-through">${product?.original_price}</span>
          </motion.div>
        )}
      </div>

      <motion.div
        whileHover={{ scale: 1.03 }}
        className="relative h-48 w-full overflow-hidden"
      >
        <Image
          src={`${BASE_URL}/${product?.images[0].url}`}
          fill
          style={{ objectFit: "cover" }}
          alt={translated?.title || ""}
          className="group-hover:brightness-105 transition-all duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </motion.div>

      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between space-y-2">
          <Link href={`/${product?.id}`}>
            <h2
              className="text-xl font-semibold text-gray-800 group-hover:text-purple-600 
              transition-colors line-clamp-1"
            >
              {translated?.title}
            </h2>
          </Link>
          <span className="ml-2 text-sm text-gray-600">
            ({product?.views} views)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <Rating value={product?.avarage_rating} readonly />

          <div className="flex items-center gap-2">
            {product?.original_price > 0 && (
              <span className="text-sm text-gray-400 line-through">
                ${product?.original_price}
              </span>
            )}
            <span className="text-lg font-bold text-purple-600">
              {product?.current_price === 0
                ? "Free"
                : `$${product?.current_price}`}
            </span>
          </div>
        </div>
        <Link href={`${locale}/${product?.slug}/preview`} target="_blank">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full cursor-pointer flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 
              text-white rounded-xl py-3 font-medium transition-colors"
          >
            View Preview
            <ArrowUpRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </motion.button>
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
    </motion.div>
  );
};

export default TemplateCard;
