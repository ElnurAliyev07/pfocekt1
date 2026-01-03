'use client'

import { useAppContext } from "@/providers/AppProvider";
import { useState, useEffect } from "react";

const LoadingOverlay = () => {
  const { isLoading, loadingText } = useAppContext();
  const [customLoadingText, setCustomLoadingText] = useState("Yüklənir");
  const [dots, setDots] = useState("");
  
  useEffect(() => {
    if (!isLoading) return;
    
    // Loading yazısına animasiya əlavə et
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "";
        if (prev === "..") return "...";
        if (prev === ".") return "..";
        return ".";
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  const displayText = loadingText ? `${loadingText}${dots}` : `${customLoadingText}${dots}`;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[10000] backdrop-blur-sm bg-black/40 transition-all duration-300">
      <div className="bg-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-md flex flex-col items-center border border-white/20">
        <div className="relative">
          {/* Əsas spinner */}
          <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          
          {/* Əlavə effekt üçün ikinci spinner */}
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-b-blue-400/70 rounded-full animate-spin"></div>
          
          {/* Mərkəzdə pulsasiya effekti */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
        
        <p className="mt-5 text-white font-medium tracking-wider">{displayText}</p>
        
        {/* Əlavə animasiya üçün kiçik nöqtə */}
        <div className="mt-2 flex space-x-1">
          <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></span>
          <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
          <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;