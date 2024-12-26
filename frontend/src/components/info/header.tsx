"use client";

import { useContactForm } from "@/store/formStore";
import { useTranslations } from "next-intl";
import React from "react";

export const Header: React.FC = () => {
  const { toggleOpenContact } = useContactForm();
  const t = useTranslations("InfoPage");

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-12 max-w-6xl mx-auto text-white">
      <h1 className="text-5xl lg:text-6xl lx:text-7xl 2xl:text-8xl">
        <span className="font-extrabold text-purple-800">Soft</span>Group
      </h1>
      <p
        className="leading-[150%] text-center font-semibold
        text-xs sm:text-sm md:text-base lg:text-lg lx:text-xl 2xl:text-2xl"
      >
        {t("Header.description")}
      </p>
      <button
        className="flex items-center border border-transparent
        px-6 py-3 text-lg lg:text-2xl lg:py-4 lg:px-8
      bg-purple-800 rounded-full duration-300 transition-all hover:bg-purple-500 hover:border-white 
        "
        onClick={toggleOpenContact}
      >
        {t("Header.button")}
      </button>
    </div>
  );
};
