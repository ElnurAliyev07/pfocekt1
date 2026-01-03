import React from 'react';

const SubtaskItemSkeleton = () => {
    return (
        <>
            <div className="flex items-center animate-pulse">
                <div className="bg-gray-300 h-[16px] w-[50px] rounded-full px-[16px]"></div>
                <div className="flex justify-between gap-[16px] items-center px-[16px] py-[12.5px] flex-1 rounded-[12px] border border-[#E8EAED] bg-gray-200">
                    <div className="space-y-[8px]">
                        <div className="flex items-center gap-[20px]">
                            <div className="bg-gray-300 h-[18px] w-[150px] rounded-sm"></div>
                            <div className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[4px] bg-gray-300 h-[24px] w-[80px]"></div>
                        </div>
                        <div className="text-text-gray text-[12px] font-medium gap-px flex flex-wrap">
                            <div className="bg-gray-300 h-[12px] w-[60px] rounded-sm"></div> -
                            <div className="bg-gray-300 h-[12px] w-[60px] rounded-sm"></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-[16px]">
                        <div className="flex flex-col items-end gap-[14px]">
                            <div className="bg-gray-300 h-[14px] w-[100px] rounded-sm"></div>
                            <div className="bg-gray-300 h-[12px] w-[150px] rounded-sm"></div>
                        </div>
                        <div className="bg-gray-300 h-[24px] w-[24px] rounded-full"></div>
                    </div>
                </div>
                <div className="ml-[16px] w-[76px] relative">
                    <div className="bg-gray-300 h-[50px] rounded-[8px] flex items-center justify-center"></div>
                    <div className="absolute bg-gray-300 w-[10px] h-[69px] rounded-[8px] bottom-[-85px] left-[33px]"></div>
                </div>
            </div>
            <div className="flex flex-wrap gap-[12px] justify-end ml-[16px] w-[calc(100%-108px)]">
                <div className="bg-gray-300 h-[28px] w-[100px] rounded-[5px]"></div>
                <div className="bg-gray-300 h-[28px] w-[100px] rounded-[5px]"></div>
                <div className="bg-gray-300 h-[28px] w-[100px] rounded-[5px]"></div>
                <div className="bg-gray-300 h-[28px] w-[100px] rounded-[5px]"></div>
                <div className="bg-gray-300 h-[28px] w-[100px] rounded-[5px]"></div>
            </div>
        </>
    );
};

export default SubtaskItemSkeleton;
