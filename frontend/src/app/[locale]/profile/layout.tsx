"use client";

import Sidebar from "@/components/profile/sidebar/sidebar";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const { refreshToken } = useAuthStore();

  useEffect(() => {
    refreshToken();
  }, []);

  return (
    <div className="w-full flex bg-blue-50">
      <Sidebar />
      {children}
    </div>
  );
}
