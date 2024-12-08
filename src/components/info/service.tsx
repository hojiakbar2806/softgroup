"use client";

import React from "react";
import { ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";

const Service = () => {
  const [active, setActive] = React.useState<number | null>();
  const t = useTranslations("InfoPage.OurServices");

  const toggleOpenCard = (index: number) => {
    if (active !== index) {
      setActive(index);
    } else setActive(null);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-20">
      <h1 className="font-bold text-white text-2xl md:text-3xl xl:text-4xl 2xl:text-5x">
        {t("title")}
      </h1>

      <div className="mx-auto shadow-white shadow py-6 px-8 max-w-6xl w-full flex flex-col gap-6 bg-white/5 rounded-2xl">
        {Array.from({ length: 6 }).map((_, index) => {
          const open = active === index;
          return (
            <div
              data-active={open}
              key={index}
              className="w-full group grid-cols-[1fr] grid grid-rows-[auto_0fr] gap-4 transition-all duration-300
              data-[active=true]:grid-rows-[auto_1fr]"
              onClick={() => toggleOpenCard(index)}
            >
              <div className="w-full flex border-b items-center justify-between cursor-pointer">
                <h1 className="font-semibold text-white text-xl md:text-2xl xl:text-3xl transition-all duration-300">
                  {t(`Services.${index}.name`)}
                </h1>
                <button
                  className={`transition-all duration-300
                  group-data-[active=true]:rotate-180`}
                >
                  <ChevronUp
                    stroke="white"
                    className="w-6 h-6 md:w-10 md:h-10 xl:w-12 xl:h-12"
                  />
                </button>
              </div>

              <p className="overflow-hidden transition-all duration-300 text-white text-sm md:text-base lg:text-lg xl:text-xl">
                {t(`Services.${index}.content`)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Service;
