'use client';

import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center">
        <div className="relative w-12 h-12 mb-6">
          <div className="absolute inset-0 border-4 border-gray-200 border-t-[#4285F4] rounded-full animate-spin" style={{ animationDuration: '0.6s' }}></div>
        </div>
        <div className="text-gray-800 font-medium text-lg text-center">Daxil olunur...</div>
        <div className="text-gray-500 text-sm mt-1 text-center">Zəhmət olmasa gözləyin</div>
      </div>
    </div>
  );
};

export default Loading;