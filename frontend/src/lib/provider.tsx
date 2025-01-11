"use client";

import { Provider } from "react-redux";
import { makeStore } from "@/lib/store";
import { useState } from "react";

export function RTKProviders({ children }: { children: React.ReactNode }) {
  const [store] = useState(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}