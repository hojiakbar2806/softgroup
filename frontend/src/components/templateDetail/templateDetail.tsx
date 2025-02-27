"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  CheckIcon,
  CopyIcon,
  EyeIcon,
  Heart,
} from "lucide-react";
import { BASE_URL } from "@/lib/const";
import { toast } from "sonner";
import useWishListStore from "@/store/wishListStore";
import TemplateDetailsSkeleton from "./templateDetailSkeleton";
import {
  useAddViewMutation,
  useDownloadTemplateMutation,
  useGetTemplateWithSlugQuery,
} from "@/services/templateService";
import { useDispatch } from "react-redux";
import { openModal } from "@/features/modal/loginMessageModalSlice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useLocale } from "@/hooks/useLocal";
import { getDictionary } from "@/features/localization/getDictionary";
import Link from "next/link";

type TemplateDetailProps = {
  slug: string;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
};

export default function TemplateDetails({
  slug,
  dictionary,
}: TemplateDetailProps) {
  const dict = dictionary;
  const { currentLang } = useLocale();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const { toggleItem, hasInWishList } = useWishListStore();
  const { data, isLoading, isError } = useGetTemplateWithSlugQuery(slug);
  const [
    downloadTemplate,
    { isError: isDownloadError, isLoading: isDownloading, error },
  ] = useDownloadTemplateMutation();
  const [addView] = useAddViewMutation();

  useEffect(() => {
    addView(slug);
  }, [slug]);

  const handleDownload = async () => {
    try {
      const blob = await downloadTemplate(slug).unwrap();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      if (slug.split(".").length > 1) {
        link.download = slug;
      } else {
        link.download = `${slug}.zip`;
      }
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center h-full">
        <h1 className="text-3xl font-bold">404</h1>
        <p className="text-lg">{dict.TemplateDetailPage.notfound}</p>
      </div>
    );
  }

  if (isDownloadError) {
    const status = (error as FetchBaseQueryError).status;

    if (status === 406) {
      dispatch(
        openModal({
          message: dict.Common.modal.permissionError,
          path: "/profile/add-template",
          button: dict.Common.modal.addTemplate,
        })
      );
    }
  }

  if (isLoading) {
    return <TemplateDetailsSkeleton />;
  }

  const imageList: { id: number; url: string }[] = data?.images || [];
  const translated = data?.translations?.find(
    (item) => item.language === currentLang
  );

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-video rounded-2xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105">
            <Image
              src={`${BASE_URL}/${imageList[selectedImage].url}`}
              fill
              priority
              alt={translated?.title || "Template preview"}
              className="object-cover transition-all duration-300"
            />
          </div>

          {imageList.length > 1 && (
            <div className="flex overflow-x-scroll scrollbar-none gap-4 pb-2">
              {imageList.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-24 aspect-video flex-shrink-0 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 hover:ring-2 hover:ring-purple-500 ${
                    selectedImage !== index && "brightness-50"
                  }`}
                >
                  <Image
                    src={`${BASE_URL}/${img.url}`}
                    fill
                    alt={`Preview ${index + 1}`}
                    className="rounded-lg transition-all duration-300 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="flex justify-between text-2xl md:text-3xl font-bold text-gray-900">
              <span>{translated?.title}</span>
              <span>
                {data?.current_price === 0 ? (
                  <span className="text-3xl font-bold text-purple-600">
                    {dict.TemplateDetailPage.free}
                  </span>
                ) : (
                  <span className="text-3xl font-bold text-purple-600">
                    {dict.TemplateDetailPage.premium}
                  </span>
                )}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              {dict.TemplateDetailPage.downloads}: {data?.downloads || 0}
            </span>
          </div>

          <div className="flex items-center gap-4"></div>

          {translated?.description && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">
                {dict.TemplateDetailPage.description}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {translated?.description}
              </p>
            </div>
          )}

          {data?.features && data.features.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {dict.TemplateDetailPage.feature}
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.features.map((feature, i) => {
                  const text =
                    feature.translations.find(
                      (item) => item.language === currentLang
                    )?.text || "";
                  return (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <CheckIcon size={20} />
                      <span>{text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-4 pt-6">
            <button
              className="flex-1 min-w-[200px] select-none flex items-center justify-center gap-2 
              bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-3 font-medium transition-all duration-300"
              aria-label="Download"
              onClick={handleDownload}
            >
              {isDownloading
                ? dict.TemplateDetailPage.downloading
                : dict.TemplateDetailPage.download}
              <ArrowUpRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            {slug.split(".").length == 1 && (
              <Link href={`${slug}/preview`} target="_blank">
                <button
                  className="flex-1 min-w-[200px] flex items-center justify-center gap-2 
                bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-3 font-medium transition-all duration-300"
                  aria-label="Preview"
                >
                  <EyeIcon size={20} />
                  {dict.TemplateDetailPage.preview}
                </button>
              </Link>
            )}
            <div className="flex gap-2">
              <button
                className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-300"
                aria-label="Like"
                onClick={() => toggleItem(data)}
              >
                <Heart
                  size={20}
                  fill={hasInWishList(data?.id) ? "red" : "none"}
                  stroke="red"
                />
              </button>
              <button
                className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-300"
                aria-label="Share"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success(dict.TemplateDetailPage.copied);
                }}
              >
                <CopyIcon size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
