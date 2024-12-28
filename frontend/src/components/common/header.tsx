"use client";

import { HeartIcon, ShoppingCart } from "lucide-react";
import React, { FC } from "react";
import useCartStore from "@/store/cartStore";
import { Link } from "@/i18n/routing";
import Image from "next/image";

const Header: FC = () => {
  const { setCartDialog } = useCartStore();
  return (
    <header className="flex justify-between bg-[#2d394b] items-center shadow-sm py-3 sticky top-0 z-50">
      <Link href="/">
        <Image src="/icons/logo.svg" width={176} height={55} alt="logo" />
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/wishlist">
          <HeartIcon className="text-white " />
        </Link>
        {/* <Link href="/profile">
          <User2 className="text-white" />
        </Link> */}
        <button onClick={() => setCartDialog(true)}>
          <ShoppingCart className="text-white" />
        </button>
        <Link
          href="/login"
          className="flex border-l pl-5 items-center text-lg duration-300 transition-all"
        >
          <button className="text-white">Login</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
