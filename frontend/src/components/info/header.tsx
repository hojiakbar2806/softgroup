"use client";

import { useContactForm } from "@/store/formStore";
import { useTranslations } from "next-intl";
import React from "react";

export const Header: React.FC = () => {
  const { toggleOpenContact } = useContactForm();
  const t = useTranslations("InfoPage");

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-12 max-w-6xl mx-auto text-white">
      <h1 className="text-5xl lg:text-6xl xl:text-8xl">
        <span className="font-extrabold text-purple-800">Soft</span>Group
      </h1>
      <p
        className="leading-[150%] text-center
        text-xs sm:text-sm md:text-base lg:text-xl lx:text-xl 2xl:text-2xl"
      >
        {t("Header.description")}
      </p>
      <button
        className="flex items-center border border-transparent
        text-sm px-6 py-2 xl:py-3 xl:text-lg lg:px-8
      bg-purple-800 rounded-full duration-300 transition-all hover:bg-purple-500 hover:border-white 
        "
        onClick={toggleOpenContact}
      >
        {t("Header.button")}
      </button>
    </div>
  );
};
