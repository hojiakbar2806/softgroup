"use client";

import { cn } from "@/utils/utils";
import React, { useState } from "react";

interface InputProps extends React.ComponentProps<"input"> {
  label: string;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = React.memo(
  ({ label, className, ...props }) => {
    const [value, setValue] = useState(props.value || "");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
      if (props.onChange) {
        props.onChange(event);
      }
    };

    return (
      <label
        htmlFor={label}
        className={cn(
          "w-full min-h-14 flex items-end bg-none relative border rounded px-3 py-2",
          className
        )}
      >
        <input
          id={label}
          {...props}
          value={value}
          onChange={handleChange}
          className="peer w-full text-lg border-none bg-transparent outline-none"
        />
        <span
          className={cn(
            "absolute l-2 top-1/2 cursor-text -translate-y-1/2 peer-focus:top-3 peer-focus:text-xs transition-all duration-200",
            value ? "top-3 text-xs text-blue-500" : ""
          )}
        >
          {label}
        </span>
      </label>
    );
  }
);
Input.displayName = "Input";
export default Input;
