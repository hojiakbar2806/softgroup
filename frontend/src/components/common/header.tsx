"use client";

import { HeartIcon, User2Icon } from "lucide-react";
import { FC } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

const Header: FC = () => {
  const t = useTranslations("TemplatePage.Header");
  return (
    <header className="flex justify-between bg-[#3a4352] items-center shadow-sm py-3 sticky top-0 z-50">
      <Link href="/">
        <Image src="/icons/logo.svg" width={176} height={55} alt="logo" />
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/profile/wishlists">
          <HeartIcon className="text-white " />
        </Link>
        <Link href="/profile/settings">
          <User2Icon className="text-white" />
        </Link>
        <Link href="/profile/templates/add-template">
          <Button variant={"outline"}>{t("button")}</Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
