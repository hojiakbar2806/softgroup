"use client";

import React, { FC } from "react";
import { HeartIcon, LayoutDashboard, LogOutIcon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/routing";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/profile/settings", label: "Settings", icon: <Settings /> },
  { href: "/profile/templates", label: "Templates", icon: <LayoutDashboard /> },
  { href: "/profile/wishlists", label: "Wishlists", icon: <HeartIcon /> },
];

const Sidebar: FC = () => {
  const { logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="w-64 h-screen flex flex-col justify-between sticky top-0 bg-white shadow-lg p-4">
      <div>
        <div className="w-full border-b pb-4">
          <Link href={"/"}>
            <Image
              src="/icons/logo-dark.svg"
              alt="logo"
              width={140}
              height={44}
            />
          </Link>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          {links.map((link) => {
            const isActive =
              pathname === link.href || pathname.includes(link.href);
            return (
              <Button
                key={link.href}
                className={`w-full flex justify-start border ${
                  isActive
                    ? "border-purple-500 bg-purple-100 text-purple-700"
                    : "border-gray-300"
                }`}
                variant={"outline"}
                onClick={() => router.push(link.href)}
              >
                {link.icon}
                {link.label}
              </Button>
            );
          })}
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
