"use client";

import { useAppContext } from "@/providers/AppProvider";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const Logo = () => {
  const { config } = useAppContext();
  return (
    <Link href="/" className="block transition-transform hover:scale-105">
    {
      config && 
      <Image
        className="w-[125px] lg:w-[159px]"
        src={config.logo}
        width={2000}
        height={2000}
        alt="Logo"
      />
    }
    
    </Link>
  );
};
