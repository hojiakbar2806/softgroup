"use client";

import TitleCard from "@/components/profile/titleCard";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export default function WishtlistPage() {
  const { refreshToken } = useAuthStore();
  useEffect(() => {
    refreshToken();
  }, []);
  return (
    <section className="flex-1">
      <div className="container w-full">
        <TitleCard title="Wishlist" />
      </div>
    </section>
  );
}
