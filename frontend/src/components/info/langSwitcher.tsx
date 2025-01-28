"use client";

import { Locale } from "@/features/localization/i18n.config";
import { useLocale } from "@/hooks/useLocal";
import React from "react";

const LangSwitcher = () => {
  const { currentLang, setLang } = useLocale();

  return (
    <div className="flex flex-col items-center fixed bottom-2 gap-1 right-2 group cursor-pointer text-white">
      {["en", "ru", "uz"].map((item, index) => (
        <React.Fragment key={index}>
          <button
            onClick={() => setLang(item as Locale)}
            data-active={item === currentLang}
            className="flex items-center data-[active=true]:bg-white/10 border border-transparent p-1 md:p-2 rounded uppercase gap-3 
            data-[active=true]:border-white transition-all duration-100"
          >
            {item}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default LangSwitcher;
