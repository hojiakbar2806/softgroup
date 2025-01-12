"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Locale, useRouter, usePathname } from "@/i18n/routing";

const languages = [
  { code: "uz", label: "O'zbek", icon: "/icons/uzbekistan.svg" },
  { code: "ru", label: "Русский", icon: "/icons/russia.svg" },
  { code: "en", label: "English", icon: "/icons/united-states.svg" },
];

const LanguageDropdown: React.FC = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (lang: string) => {
    router.replace({ pathname: pathname }, { locale: lang as Locale });
    setIsOpen(false);
  };

  const currentLanguage = languages?.find((l) => l.code === locale);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-24 md:w-32 flex items-center gap-1 transition rounded p-2"
      >
        <Image
          src={currentLanguage?.icon || ""}
          width={24}
          height={24}
          alt={currentLanguage?.label || ""}
          className=" sm:size-5 lg:size-6 2xl:size-8"
        />
        <span className="text-xs text-white sm:text-sm lg:text-base 2xl:text-lg">
          {currentLanguage?.label}
        </span>
      </button>

      <div
        data-state={isOpen ? "open" : "close"}
        className="w-full absolute right-0 overflow-hidden top-full mb-2 -translate-y-4 opacity-0 bg-white rounded border border-gray-200 shadow-lg transition
        data-[state=open]:translate-y-0 
        data-[state=open]:opacity-100 
        data-[state=close]:translate-y-1 
        data-[state=close]:opacity-0
        "
        onClick={(e) => e.stopPropagation()}
      >
        {languages
          .filter((l) => l.code !== locale)
          .map((l) => (
            <button
              key={l.code}
              onClick={() => handleLanguageChange(l.code)}
              className="w-full flex items-center px-2 py-1 gap-1
            hover:bg-gray-100 transition"
            >
              <Image
                src={l.icon}
                width={24}
                height={24}
                alt={l.label}
                className="sm:size-5 lg:size-6 2xl:size-8"
              />
              <span className="text-xs sm:text-sm lg:text-base 2xl:text-lg">
              {l.label}
            </span>
            </button>
          ))}
      </div>
    </div>
  );
};

export default LanguageDropdown;
