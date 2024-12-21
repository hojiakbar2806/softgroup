"use client";

import { HeartIcon, ShoppingCart, User2 } from "lucide-react";
import React, { FC } from "react";
import LanguageDropdown from "./langDropDown";
import useCartStore from "@/store/cartStore";
import { Link } from "@/i18n/routing";

const Header: FC = () => {
  const { setCartDialog } = useCartStore();
  return (
    <header className="flex justify-between bg-[#2d394b] items-center shadow-sm py-5 sticky top-0 z-50">
      <h1 className="text-3xl font-bold text-blue-100">Logo</h1>
      <div className="flex items-center gap-6">
        <Link href="/wishlist">
          <HeartIcon className="text-white " />
        </Link>
        <Link href="/profile">
          <User2 className="text-white" />
        </Link>
        <button onClick={() => setCartDialog(true)}>
          <ShoppingCart className="text-white" />
        </button>
        <LanguageDropdown />
      </div>
    </header>
  );
};

export default Header;
