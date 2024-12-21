import React, { FC } from "react";
import ecommerce from "../../../../public/icons/ecommerce.png";
import Image from "next/image";

const categories = [
  {
    title: "Ecommerce",
    icon: "/icons/ecommerce.png",
  },
  {
    title: "Dashboard",
    icon: "/icons/dashboard.svg",
  },
  {
    title: "Buisness website",
    icon: "/icons/buisness-website.svg",
  },
  {
    title: "Portfolio",
    icon: "/icons/portfolio.svg",
  },
  {
    title: "Blog",
    icon: "/icons/blog.svg",
  },
  {
    title: "Social media",
    icon: "/icons/social-media.svg",
  },
];
const CategoryComp: FC = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="flex gap-4 p-4 overflow-x-auto snap-x snap-mandatory">
        {categories.map((category, index) => (
          <div
            key={index}
            className="snap-start min-w-32 aspect-square flex flex-col items-center justify-center bg-white rounded-lg cursor-pointer
          hover:bg-purple-500 transition hover:text-white"
          >
            <Image
              src={ecommerce}
              alt={category.title}
              width={60}
              height={60}
            />
            <span>{category.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryComp;
