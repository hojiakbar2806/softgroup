"use client";

import { FC } from "react";
import { getDictionary } from "@/features/localization/getDictionary";
import { useContactForm } from "@/store/formStore";

type HeaderProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
};

export const Header: FC<HeaderProps> = ({ dictionary }) => {
  const { toggleOpenContact } = useContactForm();
  const dict = dictionary.InfoPage.Header;

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-12 max-w-6xl mx-auto text-white">
      <h1 className="text-6xl xl:text-8xl text-white/90">
        <span className="font-extrabold text-purple-600">Soft</span>Group
      </h1>
      <p
        className="leading-[150%] text-center text-white/90
        text-xs sm:text-sm md:text-base lg:text-xl lx:text-xl 2xl:text-2xl"
      >
        {dict.description}
      </p>
      <button
        className="flex items-center border border-transparent
        text-sm px-6 py-2 xl:py-3 xl:text-lg lg:px-8 text-white/90
      bg-purple-700 rounded-full duration-300 transition-all hover:bg-purple-500 hover:border-white 
        "
        onClick={toggleOpenContact}
      >
        {dict.button}
      </button>
    </div>
  );
};
