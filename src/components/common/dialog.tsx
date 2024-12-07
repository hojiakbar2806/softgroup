"use client";

import React from "react";

type DialogProps= {
  children: React.ReactNode;
  dialogState?: "open" | "close";
  onClose?: () => void;
};

const Dialog: React.FC<DialogProps> = ({ children, onClose, dialogState }) => {
  return (
    <div
      data-state={dialogState}
      className="fixed w-full h-full top-0 left-0 bg-black/50 z-40 transition-opacity duration-300 data-[state=open]:opacity-100 data-[state=close]:opacity-0 data-[state=close]:pointer-events-none"
      onClick={onClose}
    >
      <div
        role="dialog"
        id="cart-dialog"
        data-state={dialogState}
        className={`w-full sm:w-96 bg-white shadow-lg h-screen fixed top-0 right-0 z-50 transition-transform duration-300 data-[state=open]:translate-x-0 data-[state=close]:translate-x-full`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Dialog;
