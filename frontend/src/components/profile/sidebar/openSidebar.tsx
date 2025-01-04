"use client";

import { useSidebarDialogStore } from "@/store/profileStore";
import { MenuIcon } from "lucide-react";
import React, { FC } from "react";

const OpenSidebar: FC = () => {
  const { openDialog } = useSidebarDialogStore();
  return (
    <button className="md:hidden" onClick={openDialog}>
      <MenuIcon />
    </button>
  );
};

export default OpenSidebar;
