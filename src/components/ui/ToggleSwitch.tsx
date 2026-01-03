"use client";

import * as Switch from "@radix-ui/react-switch";
import React from "react";

interface Props {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: {
    root: "w-8 h-4",
    thumb: "w-3 h-3 translate-x-0.5 data-[state=checked]:translate-x-[16px]",
  },
  md: {
    root: "w-11 h-6",
    thumb: "w-5 h-5 translate-x-0.5 data-[state=checked]:translate-x-[22px]",
  },
  lg: {
    root: "w-16 h-9",
    thumb: "w-8 h-8 translate-x-0.5 data-[state=checked]:translate-x-[36px]",
  },
};

export default function ToggleSwitch({ checked, onCheckedChange, size = "md" }: Props) {
    const rootClass = `${sizeClasses[size].root} bg-gray-300 rounded-full relative data-[state=checked]:bg-green-500 transition-colors`;
    const thumbClass = `block bg-white rounded-full shadow-sm transition-transform ${sizeClasses[size].thumb}`;

    return (
      <div className="flex items-center space-x-2">
        <Switch.Root
          className={rootClass}
          id="airplane-mode"
          onCheckedChange={onCheckedChange}
          checked={checked}
        >
          <Switch.Thumb className={thumbClass} />
        </Switch.Root>
      </div>
    );
}
