"use client";

import { useContactForm } from "@/store/formStore";
import React from "react";

export const Header: React.FC = () => {
  const { toggleOpenContact } = useContactForm();
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-12 max-w-6xl mx-auto text-white">
      <h1 className="text-4xl md:text-5xl lg:text-6xl lx:text-7xl 2xl:text-8xl">
        <span className="font-extrabold text-purple-800">Soft</span>Group
      </h1>
      <p
        className="leading-[150%] text-center font-semibold
        text-xs sm:text-sm md:text-base lg:text-lg lx:text-xl 2xl:text-2xl"
      >
        Sizning IT sohasidagi ehtiyojlaringiz uchun ishonchli hamkor! Bu
        innovatsion dasturiy ta'minot ishlab chiqarish va joriy etish bo'yicha
        mahsulot yaratuvchi,O'zbekistonda yangi va ilg'or uslubda xizmat
        ko'rsatish,ishlab chiqarish jarayonlarini avtomatlashtirish va biznesni
        yaratishga yordam beruvchi kompaniyadir.Biz bilan birgalikda
        biznesingizni global bozorda yuksaltirish osonroq!
      </p>
      <button
        className="flex items-center border border-transparent
        text-sm px-4 py-2 sm:px-6 sm:text-lg lg:text-2xl lg:py-4 lg:px-8
      bg-purple-800 rounded-full duration-300 transition-all hover:bg-purple-500 hover:border-white 
        "
        onClick={toggleOpenContact}
      >
        Contact us
      </button>
    </div>
  );
};
