"use client";

import Image from "next/image";
import { useRouter } from "@/i18n/routing";
import { FC } from "react";
import { EyeIcon, HeartIcon } from "lucide-react";
import { MyTemplate } from "@/types/template";
import { useLocale, useTranslations } from "next-intl";
import { BASE_URL } from "@/lib/const";
import { useAddLikeMutation } from "@/services/templateService";

const TemplateCard: FC<{ product: MyTemplate }> = ({ product }) => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("TemplatePage.Header.category");

  const translated = product.translations?.find(
    (item) => item.language === locale
  );

  const [addLike, { isLoading }] = useAddLikeMutation();

  return (
    <div
      data-process={product?.status ? false : true}
      className="group flex flex-col cursor-pointer relative w-full bg-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden
      rounded-xl md:rounded-2xl
      data-[process=false]:pointer-events-none"
      onClick={() => router.push(`/templates/${product?.slug}`)}
    >
      <Image
        src={`${BASE_URL}/${product?.images[0].url}`}
        priority
        width={500}
        height={350}
        alt={translated?.title || ""}
        className="aspect-video object-cover border-b group-hover:scale-105 transition-all duration-300"
      />

      <div className="flex flex-1 flex-col px-3 gap-1 sm:gap-2">
        <div className="flex items-center justify-between my-2 gap-2">
          <div className="flex items-center gap-2">
            <h2
              className="text-sm sm:text-lg text-gray-800 group-hover:text-purple-600 
              transition-colors line-clamp-1"
            >
              {translated?.title}
            </h2>
            <span className="text-xs sm:text-sm px-1 py-px rounded font-bold text-purple-600 bg-purple-100">
              {product?.current_price === 0 && t("free")}
            </span>
          </div>
          <div className="flex gap-2">
            <div
              data-loading={isLoading}
              className="flex text-sm items-center gap-px text-gray-400 group-hover:text-purple-600 transition-colors
              data-[loading=true]:animate-ping"
              onClick={(e) => {
                e.stopPropagation();
                addLike(product?.slug);
              }}
            >
              <HeartIcon className={`size-4`} />
              {product?.likes}
            </div>
            <div className="flex text-sm items-center gap-px text-gray-400 group-hover:text-purple-600 transition-colors">
              <EyeIcon className="size-4" />
              {product?.views}
            </div>
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 -z-10 w-32 h-32 bg-blue-200/50 rounded-full 
        blur-3xl group-hover:bg-blue-300/50 transition-colors"
      />
      {product?.status && (
        <div className="flex items-center justify-center w-full h-full absolute bg-black/10">
          <span className="text-white bg-purple-500 py-1 px-2 rounded">
            {product?.status}
          </span>
        </div>
      )}
    </div>
  );
};

export default TemplateCard;
