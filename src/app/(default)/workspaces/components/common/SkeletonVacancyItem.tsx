import React from 'react'

const SkeletonVacancyItem = () => {
  return (
    <div className="bg-gray-100 animate-pulse flex flex-col md:border border-gray rounded-[20px] py-[24px] md:py-[34px] px-[16px] md:px-[18px]">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-[16px]">
      <div className="w-[64px] h-[64px] bg-gray-300 rounded-full"></div>
      <div>
        <div className="w-[150px] h-[20px] bg-gray-300 rounded-sm mb-[6px]"></div>
        <div className="w-[100px] h-[16px] bg-gray-300 rounded-sm"></div>
      </div>
    </div>
  </div>

  <div className="flex items-center flex-wrap gap-[14px] place-items-center my-[28px]">
    <div className="py-[6px] w-[92px] md:w-[96px] lg:w-[108px] h-[30px] bg-gray-300 rounded-[6px]"></div>
    <div className="py-[6px] w-[92px] md:w-[96px] lg:w-[108px] h-[30px] bg-gray-300 rounded-[6px]"></div>
    <div className="py-[6px] w-[92px] md:w-[96px] lg:w-[108px] h-[30px] bg-gray-300 rounded-[6px]"></div>
  </div>

  <div className="flex flex-col gap-[12px]">
    <div className="flex items-center gap-[12px]">
      <div className="w-[32px] h-[32px] bg-gray-300 rounded-full"></div>
      <div className="w-[100px] h-[20px] bg-gray-300 rounded-sm"></div>
    </div>
    <div className="flex items-center gap-[12px]">
      <div className="w-[32px] h-[32px] bg-gray-300 rounded-full"></div>
      <div className="w-[150px] h-[20px] bg-gray-300 rounded-sm"></div>
    </div>
  </div>

  <div className="flex flex-col mt-[36px]">
    <div className="w-full h-[40px] bg-gray-300 rounded-sm"></div>
  </div>

  <div className="flex items-center gap-1 mt-[24px]">
    <div className="w-[24px] h-[24px] bg-gray-300 rounded-sm"></div>
    <div className="w-[80px] h-[16px] bg-gray-300 rounded-sm"></div>
  </div>
</div>

  )
}

export default SkeletonVacancyItem
