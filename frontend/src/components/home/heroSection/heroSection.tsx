"use client";
import { FC } from "react";
import SearchComp from "./searchComp";
import CategoryComp from "./categoryComp";
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
        <CategoryComp />
      </div>
    </section>
  );
};

export default HeroSection;
