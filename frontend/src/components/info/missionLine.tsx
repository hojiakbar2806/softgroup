"use client";

import { useTranslations } from "next-intl";
import React from "react";

export const MissionLine: React.FC = () => {
  const t = useTranslations("InfoPage.OurMissions");

  return (
    <div className=" flex flex-col items-center gap-10">
      <h1 className="font-bold text-white text-2xl md:text-3xl xl:text-4xl 2xl:text-5x">
        {t("title")}
      </h1>
      <div className="space-y-5 relative before:absolute max-w-7xl before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        {Array.from({ length: 6 }).map((_, i) => {
          return (
            <div
              key={i}
              className="animate-appear  relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-nightSkyRadial  text-slate-500  shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <h1 className="text-md lg:text-2xl text-white">{i + 1}</h1>
              </div>
              <div className="w-[calc(100%-4rem)] bg-white/5 md:w-[calc(50%-2.5rem)] p-4 md:p-6 rounded-xl  shadow shadow-white">
                <div className="flex items-center justify-between space-x-3 mb-1 md:mb-4">
                  <h1 className="font-semibold text-white text-xl md:text-2xl xl:text-3xl">
                    {t(`Missions.${i}.name`)}
                  </h1>
                </div>
                <p className="text-white text-sm md:text-base lg:text-lg xl:text-xl">
                  {t(`Missions.${i}.content`)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
