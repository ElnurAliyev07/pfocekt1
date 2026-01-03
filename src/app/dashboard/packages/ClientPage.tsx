"use client";
import Search from "@/components/ui/icons/Search";
import React, { useState } from "react";
import PackageItem from "./components/common/PackageItem";
import NotFound from "./components/sections/NotFound";
import SectionWrapper from "@/components/common/wrappers/SectionWrapper";

const ClientPage = () => {
  const [count] = useState<number>(1);
  return (
    <SectionWrapper disabled>
      {count > 0 ? (
        <div>
          <div className="mt-[24px]">
            <div className="bg-white border border-borderDefault rounded-[12px] h-[48px] w-[290px] flex px-[16px] items-center gap-[8px]">
              <Search />
              <input
                id="searchInput"
                placeholder="Axtarın"
                className="flex-1 border-none outline-hidden focus:ring-0 p-0"
                type="text"
              />
            </div>
          </div>

          <div className="mt-[48px] grid grid-cols-3 gap-[24px]">
            <PackageItem />
            <PackageItem />
            <PackageItem />
          </div>
        </div>
      ) : (
        <NotFound />
      )}
    </SectionWrapper>
  );
};

export default ClientPage;
