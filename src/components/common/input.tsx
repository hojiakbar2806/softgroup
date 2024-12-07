"use client";

import React, { useState } from "react";
import clx from "classnames";

interface InputProps extends React.ComponentProps<"input"> {
  label: string;
  className?: string;
  labelClass?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = React.memo(
  ({ label, className, labelClass, ...props }) => {
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
        className={clx("w-full relative border-gray-300 rounded ", className)}
      >
        <input
          id={label}
          {...props}
          value={value}
          onChange={handleChange}
          className="peer w-full autofill:bg-white border-none bg-transparent p-2.5 outline-none"
        />
        <span
          className={clx(
            "absolute  peer-focus:top-0 left-3 -translate-y-1/2 text-gray-500 transition-all duration-200",
            value ? "text-blue-500 top-0" : " top-1/2",
            labelClass
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
