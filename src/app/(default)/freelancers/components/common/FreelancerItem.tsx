import Image from 'next/image'
import React from 'react'
import Rating from '../ui/icons/Rating'

const FreelancerItem = () => {
  return (
<div className="rounded-[16px] bg-white py-[24px] px-[27px] lg:px-[0] lg:py-[32px] lg:pl-5 lg:pr-2 flex flex-col items-center lg:items-start lg:flex-row gap-[24px] lg:gap-[32px]">
    
        <Image className='rounded-full object-cover w-[132px] h-[132px] md:w-[150px] md:h-[150px]' width={1000} height={1000} src="/grid.png" alt="profile img" />
    
    <div className="py-[12px] md:p-[12px] lg:w-[390px] flex flex-col">
        <h2 className="text-[24px] font-medium text-t-black">Nicat Məmmədov</h2>
        <p className="mt-[4px] font-medium text-[16px] text-t-gray">UI-UX Design Expart</p>
        <div className="mt-[8px] mb-6 flex gap-px">
            <Rating />
            <Rating />
            <Rating />
            <Rating />
            <Rating />
        </div>
        <div className="flex flex-wrap items-center md:items-end gap-[9px] lg:gap-[12px]">
            <div className="rounded-[8px] lg:rounded-[22px] text-primary h-[31px] flex items-center justify-center px-[24px] md:px-[19.5px] text-[12px] font-medium bg-[#EFF0FF]">Figma</div>
            <div className="rounded-[8px] lg:rounded-[22px] text-primary h-[31px] flex items-center justify-center px-[24px] md:px-[19.5px] text-[12px] font-medium bg-[#EFF0FF]">Balsamiq</div>
            <div className="rounded-[8px] lg:rounded-[22px] text-primary h-[31px] flex items-center justify-center px-[24px] md:px-[19.5px] text-[12px] font-medium bg-[#EFF0FF]">Hotjar</div>
        </div>
    </div>
</div>
  )
}

export default FreelancerItem
