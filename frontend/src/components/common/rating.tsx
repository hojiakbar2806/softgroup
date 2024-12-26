"use client";

import { cn } from "@/utils/utils";
import { Star } from "lucide-react";
import React, { useState } from "react";

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
}

const Rating: React.FC<RatingProps> = ({
  value,
  onChange,
  readonly = false,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleMouseEnter = (newValue: number) => {
    if (!readonly) {
      setHoverValue(newValue);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(null);
    }
  };

  const handleClick = (ratingValue: number) => {
    if (onChange) {
      onChange(ratingValue);
    }
  };

  return (
    <div className="flex items-center gap-0 md:gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={ratingValue}>
            <input
              type="radio"
              value={ratingValue}
              checked={value === ratingValue}
              onChange={() => handleClick(ratingValue)}
              className="hidden"
              disabled={readonly}
            />
            <Star
              key={index}
              strokeWidth={1.4}
              className={cn(
                "w-4 h-4 sm:w-4 sm:h-5 md:w-6 md:h-6 xl:w-7 xl:h-7 cursor-pointer text-gray-400",
                {
                  "text-yellow-400 fill-yellow-400":
                    ratingValue <= (hoverValue || value),
                }
              )}
              onMouseEnter={() => handleMouseEnter(ratingValue)}
              onMouseLeave={handleMouseLeave}
            />
          </label>
        );
      })}
    </div>
  );
};

export default Rating;
