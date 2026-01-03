"use client";

import { useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import Header from "./components/header/Header";
import MobileHeader from "./components/header/MobileHeader";
import { Config } from "@/types/config.type";
import { useAppContext } from "@/providers/AppProvider";

export default function DashboardLayout({
  children,
  config,
}: {
  children: React.ReactNode;
  config: Config;
}) {
  const [open, setOpen] = useState(true);
  const { deviceType } = useAppContext();

  return (
    <div className="flex bg-background-dashboard min-h-screen">
      <Sidebar open={open} setOpen={setOpen} config={config} />
      {deviceType !== "desktop" && <MobileHeader config={config} />}
      <div
        className={`flex-1 ${open ? "lg:pl-[272px]" : "lg:pl-20"} duration-300`}
      >
        <div className="px-[16px] py-[24px] mt-[60px] lg:mt-0 lg:p-[32px] lg:pr-[108px]">
          {deviceType === "desktop" && <Header />}
          <div className="lg:mt-[30px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
