"use client";

import { useAuthStore } from "@/store/authStore";
import React, { useEffect } from "react";

export default function SettingsPage() {
  const { refreshToken } = useAuthStore();

  useEffect(() => {
    refreshToken();
  }, []);
  return <div></div>;
}
