"use client";

import { HeartIcon, User2Icon } from "lucide-react";
import { FC } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import LanguageDropdown from "./langDropDown";
import useWishListStore from "@/store/wishListStore";

const Header: FC = () => {
  const t = useTranslations("TemplatePage.Header");
  const { wishListItems } = useWishListStore();
  const wishListCount = wishListItems.length;

  return (
    <header className="flex justify-center bg-[#3a4352] shadow-sm py-3 sticky top-0 z-50">
      <div className="container flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl md:text-3xl text-white">Softgroup</h1>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-5 2xl:gap-6">
          <LanguageDropdown />
          <Link href="/profile/wishlists" className="relative">
            <HeartIcon className="text-white size-4 sm:size-5 lg:size-6 2xl:size-8" />
            {wishListCount > 0 && (
              <span className="absolute -top-1 -right-1  w-4 h-4 text-xs font-semibold text-white bg-red-500 rounded-full flex items-center justify-center">
                {wishListCount}
              </span>
            )}
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
