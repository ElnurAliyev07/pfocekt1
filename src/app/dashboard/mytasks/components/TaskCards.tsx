import React from "react";
import Image from 'next/image'

const TaskCards = () => {
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
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 6.33349C2 4.12435 3.79086 2.3335 6 2.3335H10C12.2091 2.3335 14 4.12436 14 6.3335V10.6668C14 12.876 12.2091 14.6668 10 14.6668H6C3.79086 14.6668 2 12.876 2 10.6668V6.33349Z"
              stroke="#64717C"
            />
            <path d="M2 6H14" stroke="#64717C" strokeLinecap="round" />
            <path
              d="M5.33301 1.3335L5.33301 3.3335"
              stroke="#64717C"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.667 1.3335V3.3335"
              stroke="#64717C"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <ellipse
              cx="7.99967"
              cy="10.0002"
              rx="0.666667"
              ry="0.666667"
              fill="#64717C"
            />
            <ellipse
              cx="10.6667"
              cy="10.0002"
              rx="0.666667"
              ry="0.666667"
              fill="#64717C"
            />
            <ellipse
              cx="5.33366"
              cy="10.0002"
              rx="0.666667"
              ry="0.666667"
              fill="#64717C"
            />
          </svg>
          <span className="text-t-gray font-medium text-[10px]">
            10.10.2024
          </span>
        </div>
        <Image src="/user.png" width={54} height={32} alt="users" />
      </div>
    </div>
  );
};

export default TaskCards;
