import React, { useState } from "react";
import { cn } from "@/lib/utils"; // Utility function (probably for class names)

interface InputProps extends React.ComponentProps<"input"> {
  label: string;
  className?: string;
  error?: boolean; // For indicating error state
  helperText?: string | false | undefined; // For helper text or error message
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = React.memo(
  ({ label, className, error, helperText, ...props }) => {
    const [value, setValue] = useState(props.value || "");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
      if (props.onChange) {
        props.onChange(event);
      }
    };

    return (
      <div className="w-full">
        <label
          htmlFor={label}
          className={cn(
            "w-full h-12 flex items-end bg-none relative border rounded px-3 py-2",
            error ? "border-red-500" : "border-gray-300",
            className
          )}
        >
          <input
            id={label}
            {...props}
            value={value}
            onChange={handleChange}
            className="peer w-full text-sm border-none bg-transparent outline-none"
          />
          <span
            className={cn(
              "absolute left-2 top-1/2 cursor-text -translate-y-1/2 peer-focus:top-3 peer-focus:text-xs transition-all duration-200",
              value ? "top-3 text-xs text-blue-500" : "",
              error ? "text-red-500" : ""
            )}
          >
            {label}
          </span>
        </label>
        {helperText && (
          <p className="text-sm text-red-500 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
export default Input;
