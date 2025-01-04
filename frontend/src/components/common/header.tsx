"use client";

import { HeartIcon, User2Icon } from "lucide-react";
import { FC } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";

const Header: FC = () => {
  const t = useTranslations("TemplatePage.Header");
  return (
    <header className="flex justify-center bg-[#3a4352] shadow-sm py-3 sticky top-0 z-50">
      <div className="container flex justify-between items-center">
        <Link href="/">
          <Image
            src="/icons/logo.svg"
            width={176}
            height={55}
            alt="logo"
            className="w-24 sm:w-28 lg:w-32 xl:w-36 2xl:w-40"
          />
        </Link>
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-5 2xl:gap-6">
          <Link href="/profile/wishlists">
            <HeartIcon className="text-white size-4 sm:size-5 lg:size-6 2xl:size-8" />
          </Link>
          <Link href="/profile">
            <User2Icon className="text-white size-4 sm:size-5 lg:size-6 2xl:size-8" />
          </Link>
          <Link
            href="/profile/add-template"
            className="text-xs whitespace-nowrap px-3 py-1.5 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:brightness-105 font-medium rounded-lg transition
            sm:px-4 sm:text-sm lg:px-5 lg:text-base 2xl:px-6 2xl:text-lg"
          >
            {t("button")}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
