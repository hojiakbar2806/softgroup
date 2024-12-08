"use client";

import { locales } from "@/config";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const LangButton = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = (newLocale: string) => {
    const newPathname = pathname.split("/").slice(2).join("/");
    router.push(`/${newLocale}/${newPathname}`, { scroll: false });
  };

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
    <div className="flex items-center gap-3 fixed bottom-5 right-10 group cursor-pointer text-white">
      {locales.map((item, index) => (
        <React.Fragment key={index}>
          <button
            data-active={item === locale}
            onClick={() => toggleLocale(item)}
            className="flex items-center data-[active=true]:bg-white/10 p-2 rounded uppercase gap-3 border-b border-transparent transition-all duration-100"
          >
            {item}
            {item === locale}
          </button>
          <span>{index + 1 !== locales.length && "|"}</span>
        </React.Fragment>
      ))}
    </div>
  );
};

export default LangButton;
