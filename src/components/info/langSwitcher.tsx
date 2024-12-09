"use client";

import { locales } from "@/config";
import { useLocale } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const LangSwitcher = () => {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    // <div
    //   className="fixed text-white bg-white/10 bottom-10 right-10 group cursor-pointer grid grid-rows-[auto_0fr] items-center border
    //    rounded-lg duration-300 transition-all hover:grid-rows-[auto_1fr] hover:gap-4 px-4 py-2 text-xl
    //    "
    // >
    //   <button className="w-full flex items-center gap-3">
    //     {locale}
    //     {/* <ChevronDown className="group-hover:rotate-180 transition-all duration-300" /> */}
    //   </button>
    //   <div className="flex flex-col gap-2 overflow-hidden">
    //     {locales
    //       .filter((item) => item !== locale)
    //       .map((item, index) => (
    //         <button
    //           onClick={() => toggleLocale(item)}
    //           key={index}
    //           className="w-full flex items-center gap-3 border-b border-transparent hover:border-white transition-all duration-100
    //           opacity-0 group-hover:opacity-100"
    //         >
    //           {item}

    //         </button>
    //       ))}
    //   </div>
    // </div>
    <div className="flex flex-col items-center fixed bottom-2 gap-1 right-2 group cursor-pointer text-white">
      {locales.map((item, index) => (
        <React.Fragment key={index}>
          <Link
            data-active={item === locale}
            href={`/${item}/${pathname.split("/").slice(2).join("/")}`}
            className="flex items-center data-[active=true]:bg-white/10 border border-transparent p-1 md:p-2 rounded uppercase gap-3 
            data-[active=true]:border-white transition-all duration-100"
          >
            {item}
            {item === locale}
          </Link>
          {/* {index + 1 !== locales.length && <span className="w-1/2 h-px bg-white"/>} */}
        </React.Fragment>
      ))}
    </div>
  );
};

export default LangSwitcher;
