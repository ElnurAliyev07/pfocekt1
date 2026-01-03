import Image from 'next/image';
import React from 'react'

interface GroupChatProps {
  onBack: () => void;
  isMobile: boolean;
} 

const GroupChat = ({ onBack, isMobile }: GroupChatProps) => {
  return (
   
    <div className="flex flex-col w-full h-full">
      <div className="border-b border-gray-100 flex items-center pt-4 md:pt-5 px-4 md:px-6 pb-4 md:pb-5 justify-between">
        <div className="flex items-center gap-[10px]">
          {isMobile && (
            <button 
              onClick={onBack}
              className="mr-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 19L8 12L15 5"
                  stroke="#14171A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          <Image
            src="/singlechatpic.png"
            width={40}
            height={40}
            alt="singlechat"
            className="rounded-full"
          />
          <div className="flex flex-col gap-[6px]">
            <p className="font-medium text-[14px] md:text-[16px]">Florencio Dorrance</p>
            <div className="flex items-center gap-[5px] h-[10px]">
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="5" cy="5" r="5" fill="#68D391" />
              </svg>
              <span className="font-medium text-[11px] md:text-[12px] text-t-gray">
                Online
              </span>
            </div>
          </div>
        </div>
        <div>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
              stroke="#14171A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
              stroke="#14171A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
              stroke="#14171A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="flex flex-col gap-[16px] md:gap-[20px]">
            <div>
              <div className="flex items-start gap-[10px]">
                <Image
                  src="/singlechatpic.png"
                  width={40}
                  height={40}
                  alt="singlechat"
                />
                <div className="flex flex-col items-start gap-[7px]">
                  <p className="w-auto inline-block pt-2 pr-4 pb-2 pl-4 bg-[#F9F9F9] rounded-[12px] text-[#14171A] text-[14px]">
                    omg, this is amazing
                  </p>
                  <p className="w-auto inline-block pt-2 pr-4 pb-2 pl-4 bg-[#F9F9F9] rounded-[12px] text-[#14171A] text-[14px]">
                    perfect! ✅
                  </p>
                  <p className="w-auto inline-block pt-2 pr-4 pb-2 pl-4 bg-[#F9F9F9] rounded-[12px] text-[#14171A] text-[14px]">
                    Wow, this is really epic
                  </p>
                  <p className="text-[12px] text-t-gray">Today 12:45</p>
                </div>
              </div>
              <div className="flex items-start gap-[10px] justify-end">
                <div className="flex flex-col gap-[7px]">
                  <p className="w-auto inline-block pt-2 pr-4 pb-2 pl-4 bg-[#444BD3] rounded-[12px] text-[14px] text-white">
                    Hey! How are you?
                  </p>
                  <div className="w-full flex items-center justify-between">
                    <p className="text-[12px] text-t-gray">Today 12:45</p>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 12.9L7.143 16.5L15 7.5M20 7.563L11.428 16.563L11 16"
                        stroke="#0EBA70"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <Image
                  src="/singchatpic2.png"
                  width={40}
                  height={40}
                  alt="chatpic"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="w-[45%] h-px bg-[#F9F9F9]"></div>
              <div className="w-[102px] h-[30px] bg-[#F9F9F9] pt-1 pr-4 pb-1 pl-4 rounded-[48px] text-[12px] flex items-center justify-center">
                03.11.2024
              </div>
              <div className="w-[45%] h-px bg-[#F9F9F9]"></div>
            </div>
            <div>
              <div className="flex items-start gap-[10px]">
                <Image
                  src="/singlechatpic.png"
                  width={40}
                  height={40}
                  alt="singlechat"
                />
                <div className="flex flex-col items-start gap-[7px]">
                  <p className="w-auto inline-block pt-2 pr-4 pb-2 pl-4 bg-[#F9F9F9] rounded-[12px] text-[#14171A] text-[14px]">
                    just ideas for next time
                  </p>
                  <p className="w-auto inline-block pt-2 pr-4 pb-2 pl-4 bg-[#F9F9F9] rounded-[12px] text-[#14171A] text-[14px]">
                    I&apos;ll be there in 2 mins ⏰
                  </p>
                  <p className="text-[12px] text-t-gray">Today 12:45</p>
                </div>
              </div>
              <div className="flex items-start gap-[10px] justify-end">
                <div className="flex flex-col gap-[7px]">
                  <div className="flex flex-col items-end gap-[7px]">
                    <p className="w-auto inline-block pt-2 pr-4 pb-2 pl-4 bg-[#444BD3] rounded-[12px] text-[14px] text-white">
                      woohoooo
                    </p>
                    <p className="w-auto inline-block pt-2 pr-4 pb-2 pl-4 bg-[#444BD3] rounded-[12px] text-[14px] text-white">
                      Haha oh man
                    </p>
                    <p className="w-auto inline-block pt-2 pr-4 pb-2 pl-4 bg-[#444BD3] rounded-[12px] text-[14px] text-white">
                      Haha that&apos;s terrifying 😂
                    </p>
                  </div>
                  <div className="w-full flex items-center justify-between">
                    <p className="text-[12px] text-t-gray">Today 12:45</p>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 12.9L7.143 16.5L15 7.5M20 7.563L11.428 16.563L11 16"
                        stroke="#0EBA70"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <Image
                  src="/singchatpic2.png"
                  width={40}
                  height={40}
                  alt="chatpic"
                />
              </div>
            </div>
            <div>
              <div className="flex items-start gap-[10px]">
                <Image
                  src="/singlechatpic.png"
                  width={40}
                  height={40}
                  alt="singlechat"
                />
                <div className="flex flex-col items-start gap-[7px]">
                  <p className="w-auto inline-block pt-2 pr-4 pb-2 pl-4 bg-[#F9F9F9] rounded-[12px] text-[#14171A] text-[14px]">
                    aww
                  </p>
                  <p className="w-auto inline-block pt-2 pr-4 pb-2 pl-4 bg-[#F9F9F9] rounded-[12px] text-[#14171A] text-[14px]">
                    omg, this is amazing
                  </p>
                  <p className="w-auto inline-block pt-2 pr-4 pb-2 pl-4 bg-[#F9F9F9] rounded-[12px] text-[#14171A] text-[14px]">
                    woohoooo 🔥
                  </p>
                  <p className="text-[12px] text-t-gray">Today 12:45</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 md:p-6 flex items-center gap-[8px] border-t border-gray-100">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.9707 12V15.5C11.9707 17.43 13.5407 19 15.4707 19C17.4007 19 18.9707 17.43 18.9707 15.5V10C18.9707 6.13 15.8407 3 11.9707 3C8.1007 3 4.9707 6.13 4.9707 10V16C4.9707 19.31 7.6607 22 10.9707 22"
              stroke="#14171A"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="pt-2 pr-5 pb-2 pl-5 border-2 border-gray-200 rounded-[12px] w-full flex items-center">
            <input
              type="text"
              placeholder="Type a message"
              className="w-full outline-hidden text-sm md:text-base"
            />
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.1391 2.96004L7.10914 5.96004C1.03914 7.99004 1.03914 11.3 7.10914 13.32L9.78914 14.21L10.6791 16.89C12.6991 22.96 16.0191 22.96 18.0391 16.89L21.0491 7.87004C22.3891 3.82004 20.1891 1.61004 16.1391 2.96004ZM16.4591 8.34004L12.6591 12.16C12.5091 12.31 12.3191 12.38 12.1291 12.38C11.9391 12.38 11.7491 12.31 11.5991 12.16C11.4597 12.0189 11.3814 11.8285 11.3814 11.63C11.3814 11.4316 11.4597 11.2412 11.5991 11.1L15.3991 7.28004C15.6891 6.99004 16.1691 6.99004 16.4591 7.28004C16.7491 7.57004 16.7491 8.05004 16.4591 8.34004Z"
                fill="#444BD3"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupChat