"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Locale, useRouter, usePathname } from "@/i18n/routing";

const languages = [
  { code: "uz", label: "Uzbek", icon: "/icons/uzbekistan.svg" },
  { code: "ru", label: "Russian", icon: "/icons/russia.svg" },
  { code: "en", label: "English", icon: "/icons/united-states.svg" },
];

const LanguageDropdown: React.FC = () => {
  const locale: string = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) =>
    !dropdownRef.current?.contains(e.target as Node) && setIsOpen(false);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (lang: string) => {
    router.replace(
      { pathname: pathname, query: params },
      { locale: lang as Locale }
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 text-white rounded-lg ring-1 ring-white"
      >
        <Globe />
        <span>{languages.find((l) => l.code === locale)?.label}</span>
        <ChevronDown className={`transition ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <ul className="w-full absolute mt-2 bg-white border rounded-md overflow-hidden">
          {languages
            .filter((item) => item.code !== locale)
            .map((l) => (
              <li
                key={l.code}
                onClick={() => handleLanguageChange(l.code)}
                className="flex items-center gap-2 px-4  py-2 cursor-pointer hover:bg-blue-100"
              >
                <Image src={l.icon} width={20} height={20} alt={l.label} />
                {l.label}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageDropdown;
