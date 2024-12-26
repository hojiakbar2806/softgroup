import { FC } from "react";
import SearchComp from "./searchComp";
import CategoryComp from "./categoryComp";

const HeroSection: FC = () => {
  return (
    <section className="text-center flex flex-col items-center bg-purpleGradient py-14 gap-10">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl lg:text-4xl font-bold">
          Biznesingiz kelajagi uchun IT yechimlar!
        </h1>
        <p className="text-gray-600 max-w-6xl">
          Biz IT sohasida innovatsion yechimlar taklif etamiz: veb-sayt va mobil
          ilovalar yaratish, jarayonlarni avtomatlashtirish, kiberxavfsizlik,
          raqamli marketing, va sun'iy intellekt texnologiyalari bilan
          biznesingizni yangi cho‘qqilarga olib chiqamiz. Sizning maqsadlaringiz
          – bizning ilhomimiz!
        </p>
        <SearchComp />
      </div>
      <CategoryComp />
    </section>
  );
};

export default HeroSection;
