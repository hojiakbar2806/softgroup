import { X } from "lucide-react";
import React, { FC } from "react";

type DialogHeaderProps = {
  title: string;
  setCartDialog: (param: boolean) => void;
};

const DialogHeader: FC<DialogHeaderProps> = ({ setCartDialog, title }) => {
  return (
    <div className="w-full flex justify-between items-center p-6 border-b">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <button onClick={() => setCartDialog(false)}>
        <X className="text-red-500" />
      </button>
    </div>
  );
};

export default DialogHeader;
