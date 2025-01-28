"use client";

import { FC } from "react";
import SearchComp from "./searchComp";
import { useRouter, useSearchParams } from "next/navigation";
import { getDictionary } from "@/features/localization/getDictionary";

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
};

const HeroSection: FC<Props> = ({ dictionary }) => {
  const dict = dictionary.TemplatePage.Header;
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <section className="text-center flex flex-col items-center bg-purpleGradient py-14 gap-10">
      <div className="container">
        <div className="flex items-center flex-col gap-6">
          <h1 className="text-3xl lg:text-4xl font-bold">{dict.title}</h1>
          <p className="text-gray-600 max-w-6xl">{dict.description}</p>
          <SearchComp dictionary={dictionary} />
        </div>
        <div className="mt-5 flex gap-4 justify-center">
          <button
            data-active={searchParams.get("tier") !== "premium"}
            className="bg-white text-purple-500 text-sm px-4 py-1 md:text-lg font-semibold rounded-full
            hover:bg-gray-100 transition-all duration-300
            active:bg-gray-200 bg-gradient-to-t 
            data-[active=true]:from-purple-500 
            data-[active=true]:via-purple-600 
            data-[active=true]:to-purple-700
            data-[active=true]:text-white"
            onClick={() => router.push(`?tier=free`)}
          >
            {dict.category.free}
          </button>
          <button
            data-active={searchParams.get("tier") === "premium"}
            className="bg-white text-purple-600 font-semibold text-sm px-4 py-2  md:text-lg rounded-full
            hover:bg-gray-100 transition-all duration-300 active:bg-gray-200 bg-gradient-to-t 
            data-[active=true]:from-purple-500 
            data-[active=true]:via-purple-600 
            data-[active=true]:to-purple-700
            data-[active=true]:text-white"
            onClick={() => router.push(`?tier=premium`)}
          >
            {dict.category.premium}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
