import React from "react";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import MobileHeader from "./components/header/MobileHeader";
import { Config } from "@/types/config.type";

const DefaultLayout = ({
  children,
  config,
}: {
  children: React.ReactNode;
  config: Config;
}) => {
  return (
    <div className="min-h-screen flex flex-col">  
      <Header config={config} />
      <MobileHeader config={config} />
      <main className="flex-1 pt-16 md:pt-0">
        {children}
      </main>
      <Footer config={config} />
    </div>
  );
};

export default DefaultLayout;
