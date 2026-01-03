import React from "react";
import Image from 'next/image';

const TaskCards2 = () => {
  return (
    <div className="bg-[#F6F7FA] rounded-[12px] py-[24px] px-[20px]">
      <p className="font-semibold mb-[9px]">Implement Login</p>
      <div className="flex text-primary items-center gap-[5px]">
        <svg
          width="6"
          height="7"
          viewBox="0 0 6 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="3" cy="3.5" r="3" fill="#444BD3" />
        </svg>
        <span className="font-medium text-[12px]">Development</span>
      </div>
      <p className="text-[12px] text-t-gray mt-[20px]">
        Add Forgot password option when login & send email...
      </p>
      <div className="flex items-center justify-between mt-[20px]">
        <div className="flex items-center gap-[6px]">
          <div className="bg-[#FFECDF] flex items-center gap-[5px] py-[4px] px-[8px] rounded-[4px]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
                stroke="#F97316"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 4.6665V7.99984L10 9.99984"
                stroke="#F97316"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[#F97316] font-medium text-[10px]">
              2 gün qaldı
            </span>
          </div>
        </div>
        <Image src="/user.png" width={54} height={32} alt="users" />
      </div>
    </div>
  );
};

export default TaskCards2;
