import React from "react";

const Header = () => {
  return (
    <div className="w-full flex items-center justify-between mt-[38px]">
      <h1 className="font-semibold text-[36px]">Mənim Tasklarım</h1>
      <button className="bg-primary flex items-center rounded-[8px] py-3 px-4 gap-[5px]">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.6673 10.834H10.834V16.6673H9.16732V10.834H3.33398V9.16732H9.16732V3.33398H10.834V9.16732H16.6673V10.834Z"
            fill="white"
          />
        </svg>
        <span className="text-white font-medium text-[14px]">Task əlavə et</span>
      </button>
    </div>
  );
};

export default Header;
