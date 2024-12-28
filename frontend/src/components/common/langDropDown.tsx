"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Locale, useRouter, usePathname } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";

const languages = [
  { code: "uz", label: "O'zbek", icon: "/icons/uzbekistan.svg" },
  { code: "ru", label: "Русский", icon: "/icons/russia.svg" },
  { code: "en", label: "English", icon: "/icons/united-states.svg" },
];

const LanguageDropdown: React.FC = () => {
  const locale: string = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonWidth, setButtonWidth] = useState(0);

  useEffect(() => {
    if (buttonRef.current) {
      setButtonWidth(buttonRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (lang: string) => {
    router.replace({ pathname: pathname }, { locale: lang as Locale });
    setIsOpen(false);
  };

  const currentLanguage = languages.find((l) => l.code === locale);

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 rounded-lg
          bg-white hover:bg-gray-50
          border border-gray-200
          transition-colors duration-200"
      >
        <div className="flex items-center gap-2">
          <Image
            src={currentLanguage?.icon || ""}
            width={20}
            height={20}
            alt={currentLanguage?.label || ""}
            className="rounded"
          />
          <span className="text-gray-700 text-sm">
            {currentLanguage?.label}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full right-0 mb-2
          bg-white rounded-lg border border-gray-200 shadow-lg"
            style={{
              width: buttonWidth || "auto",
              zIndex: 50,
            }}
            // onClick={(e) => e.stopPropagation()}
          >
            <div className="py-1">
              {languages.map((l) => (
                <motion.div
                  key={l.code}
                  whileTap={{ backgroundColor: "#f3f4f6" }}
                  onClick={() => handleLanguageChange(l.code)}
                  className={`flex items-center gap-3 px-4 py-2 cursor-pointer
                  ${
                    l.code === locale
                      ? "bg-gray-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Image
                    src={l.icon}
                    width={20}
                    height={20}
                    alt={l.label}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">{l.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageDropdown;
