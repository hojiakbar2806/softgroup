"use client";

import { Star } from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/utils/utils";

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  isReadOnly?: boolean;
}

const Rating: React.FC<RatingProps> = ({
  value,
  onChange,
  isReadOnly = false,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleMouseEnter = (newValue: number) => {
    if (!isReadOnly) {
      setHoverValue(newValue);
    }
  };

  const handleMouseLeave = () => {
    if (!isReadOnly) {
      setHoverValue(null);
    }
  };

  const handleClick = (ratingValue: number) => {
    if (onChange) {
      onChange(ratingValue);
    }
  };

  return (
    <div className="flex items-centergap-0 sm:gap-1 md:gap-2">
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
              disabled={isReadOnly}
            />
            <Star
              key={index}
              className={cn(
                "w-4 h-4 sm:w-4 sm:h-5 md:w-6 md:h-6 xl:w-7 xl:h-7 cursor-pointer",
                {
                  "text-yellow-400 fill-yellow-400":
                    ratingValue <= (hoverValue || value),
                  "text-dark/20": ratingValue > (hoverValue || value),
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
