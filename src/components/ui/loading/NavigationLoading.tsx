"use client";

import React, { useEffect, useState } from "react";

const NavigationLoading = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Daha hızlı ilerleme için interval süresini azalt ve artış miktarını artır
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) return prev + 10; // Her 50ms'de %10 artır
        clearInterval(interval); // %100'e ulaştığında durdur
        return 100;
      });
    }, 50);

    return () => clearInterval(interval); // Component unmount olduğunda temizle
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[4px] bg-gray-200 z-50">
      <div
        className="h-full bg-primary transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default NavigationLoading;
