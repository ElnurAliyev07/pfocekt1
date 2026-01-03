"use client";
import React from "react";
import { Loading } from "@/components/ui";

interface LoadingProps {
  width?: number;
  height?: number;
  text?: number;
}

const LoadingComponent: React.FC<LoadingProps> = ({
  width = 24,
  height = 24,
  text = 20,
}) => {
  return (
    <div className="w-[79px] h-[79px] flex justify-center items-center">
      <Loading.CircularProgress
        size="lg"
        color="primary"
        value={80}
        strokeWidth={3}
        showValueLabel={true}
        classNames={{
          svg: `w-${width} h-${height}`,
          indicator: "stroke-primary",
          track: "stroke-[#F2F2F7]",
          value: `text-[${text}px] font-semibold text-t-black`,
        }}
      />
    </div>
  );
};

export default LoadingComponent;
