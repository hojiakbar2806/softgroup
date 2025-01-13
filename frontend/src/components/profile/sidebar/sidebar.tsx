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
import { usePathname } from "next/navigation";
import { useSidebarDialogStore } from "@/store/profileStore";
import { useLogoutMutation } from "@/services/authService";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import { baseApi } from "@/services/baseApi";

const links = [
  { href: "/profile", label: "Dashboard", icon: <LayoutDashboard /> },
  { href: "/profile/wishlists", label: "Wishlists", icon: <HeartIcon /> },
];

const Sidebar: FC = () => {
  const { isOpen, closeDialog } = useSidebarDialogStore();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [logoutSystem] = useLogoutMutation();

  const handleLogout = () => {
    logoutSystem();
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    window.location.href = "/";
    toast.success("Logout successful");
  };

  return (
    <div
      data-open={isOpen}
      className="-left-full md:left-0 fixed md:sticky w-64 h-screen flex flex-col justify-between top-0 bg-white shadow-lg p-4 z-50
      data-[open=true]:left-0 transition-all duration-300"
    >
      <div>
        <div className="w-full flex items-center justify-between border-b pb-4">
          <Link href="/">
            <h1 className="text-2xl md:text-3xl text-black">Softgroup</h1>
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
      <Button className="w-full flex gap-4" onClick={() => handleLogout()}>
        <LogOutIcon />
        Logout
      </Button>
    </div>
  );
};

export default Sidebar;
