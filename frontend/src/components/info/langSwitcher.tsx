"use client";

import { locales } from "@/config";
import { useLocale } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const LangSwitcher = () => {
  const locale = useLocale();
  const pathname = usePathname();

  const handleClick = () => {
    const activeElement = document.activeElement as HTMLInputElement;
    activeElement?.blur();
  };

  return (
    <div className="flex flex-col items-center fixed bottom-2 gap-1 right-2 group cursor-pointer text-white">
      {locales.map((item, index) => (
        <React.Fragment key={index}>
          <Link
            data-active={item === locale}
            onClick={handleClick}
            href={`/${item}/${pathname.split("/").slice(2).join("/")}`}
            className="flex items-center data-[active=true]:bg-white/10 border border-transparent p-1 md:p-2 rounded uppercase gap-3 
            data-[active=true]:border-white transition-all duration-100"
          >
            {item}
            {item === locale}
          </Link>
        </React.Fragment>
      ))}
    </div>
  );
};

export default LangSwitcher;
