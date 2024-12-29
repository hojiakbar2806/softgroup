"use client";

import { HeartIcon, ShoppingCart, User2 } from "lucide-react";
import { FC } from "react";
import useCartStore from "@/store/cartStore";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Button } from "../ui/button";

const Header: FC = () => {
  const { setCartDialog } = useCartStore();

  return (
    <header className="flex justify-between bg-[#3a4352] items-center shadow-sm py-3 sticky top-0 z-50">
      <Link href="/">
        <Image src="/icons/logo.svg" width={176} height={55} alt="logo" />
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/wishlist">
          <HeartIcon className="text-white " />
        </Link>
        <Link href="/profile/settings">
          <User2 className="text-white" />
        </Link>
        <button onClick={() => setCartDialog(true)}>
          <ShoppingCart className="text-white" />
        </button>
        <Link href="/profile/templates/add-template">
          <Button variant={"outline"}>Add Template</Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
