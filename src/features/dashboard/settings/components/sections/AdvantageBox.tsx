import ToggleSwitch from "@/components/ui/ToggleSwitch";
import React from "react";

const AdvantageBox = ({ title }: { title: string }) => {
  return (
    <div className="bg-white py-[40px] px-[28px] rounded-[12px] font-medium text-t-black font-poppins">
      <div className="flex justify-between">
        <h3 className="text-[20px] leading-[28px]">{title}</h3>
        <div>
          <ToggleSwitch />
        </div>
      </div>

      <div className="text-[14px] leading-[20px] font-normal mt-[28px] text-t-gray">
        Lorem ipsum dolor sit amet lorem ipsum dolor sit
      </div>
    </div>
  );
};

export default AdvantageBox;
