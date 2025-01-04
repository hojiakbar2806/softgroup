"use client";

import React, { FC } from "react";
import {
  ChevronLeft,
  HeartIcon,
  LayoutDashboard,
  LogOutIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/routing";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebarDialogStore } from "@/store/profileStore";

const links = [
  { href: "/profile", label: "Dashboard", icon: <LayoutDashboard /> },
  { href: "/profile/wishlists", label: "Wishlists", icon: <HeartIcon /> },
];

const Sidebar: FC = () => {
  const { logout } = useAuthStore();
  const { isOpen, closeDialog } = useSidebarDialogStore();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      data-open={isOpen}
      className="-left-full md:left-0 fixed md:sticky w-64 h-screen flex flex-col justify-between top-0 bg-white shadow-lg p-4 z-50
      data-[open=true]:left-0 transition-all duration-300"
    >
      <div>
        <div className="w-full flex items-center justify-between border-b pb-4">
          <Link href={"/"}>
            <Image
              src="/icons/logo-dark.svg"
              alt="logo"
              width={140}
              height={44}
              className="w-24 sm:w-28 lg:w-32 xl:w-36 2xl:w-40"
            />
          </Link>
          <button className="md:hidden" onClick={closeDialog}>
            <ChevronLeft />
          </button>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          {links.map((link) => (
            <Button
              key={link.href}
              data-active={pathname.split("").slice(3).join("") === link.href}
              className={`w-full flex justify-start border 
                data-[active=true]:border-purple-500 data-[active=true]:bg-purple-500/10`}
              variant={"outline"}
              onClick={() => {
                router.push(link.href);
                closeDialog();
              }}
            >
              {link.icon}
              {link.label}
            </Button>
          ))}
        </div>
      </div>
      <Button className="w-full flex gap-4" onClick={logout}>
        <LogOutIcon />
        Logout
      </Button>
    </div>
  );
};

export default Sidebar;
