"use client";

import { FC } from "react";
import SearchComp from "./searchComp";
import { useTranslations } from "use-intl";

const HeroSection: FC = () => {
  const t = useTranslations("TemplatePage.Header");
  return (
    <section className="text-center flex flex-col items-center bg-purpleGradient py-14 gap-10">
      <div className="container">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl lg:text-4xl font-bold">{t("title")}</h1>
          <p className="text-gray-600 max-w-6xl">{t("description")}</p>
          <SearchComp />
        </div>
        <div className="mt-5 flex gap-4 justify-center">
          <button
            className="bg-white text-white text-sm px-4 py-1 md:text-lg font-semibold rounded-full
        hover:bg-gray-100 transition-all duration-300
        active:bg-gray-200 bg-gradient-to-t from-purple-500 via-purple-600 to-purple-700"
          >
            Free
          </button>
          <button
            className="bg-white text-purple-600 font-semibold text-sm px-4 py-2  md:text-lg rounded-full
        hover:bg-gray-100 transition-all duration-300
        active:bg-gray-200"
          >
            Premium
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
