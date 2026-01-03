import Image from 'next/image'
import React from 'react'
import Employees from '../ui/icons/Employees'
import Star from '../ui/icons/Star'
import Calendar from '../ui/icons/Calendar'
import Wallet from '../ui/icons/Wallet'
import ApplyBtn from '../ui/buttons/ApplyBtn'
import MoreBtn from '../ui/buttons/MoreBtn'


const PackageItem = () => {
  return (
<div className="bg-white rounded-[20px] overflow-hidden">
    <div>
        <Image className="h-[160px] w-full" width={1000} height={1000} src="/grid.png" alt="package img" />
    </div>
    <div className="p-[20px] pb-[32px]">
        <h3 className="text-[22px] font-medium">Vebsayt hazırlanması</h3>
        <div className="mt-[20px] flex flex-wrap gap-[8px]">
            <div className="rounded-[8px] py-[8px] px-[12px] bg-[#D7D9DD40]/25 text-t-black text-[12px] font-medium">UX/Uİ Dizayner</div>
            <div className="rounded-[8px] py-[8px] px-[12px] bg-[#D7D9DD40]/25 text-t-black text-[12px] font-medium">Marketoloq</div>
            <div className="rounded-[8px] py-[8px] px-[12px] bg-[#D7D9DD40]/25 text-t-black text-[12px] font-medium">Frontend Proqramçı</div>
            <div className="rounded-[8px] py-[8px] px-[12px] bg-[#D7D9DD40]/25 text-t-black text-[12px] font-medium">Backend Proqramçı</div>
        </div>
        <div className="mt-[28px] space-y-[16px]">
            <div className="flex gap-[32px]">
                <div className="gap-[12px] flex items-center">
                    <div className="w-[28px] h-[28px] rounded-[8px] bg-[#F1F1FF] grid place-items-center">
                        <Employees />
                    </div>
                    <span className="text-t-black font-medium">4 Nəfər</span>
                </div>
                <div className="gap-[12px] flex items-center">
                    <div className="w-[28px] h-[28px] rounded-[8px] bg-[#F1F1FF] grid place-items-center">
                        <Star />
                    </div>
                    <span className="text-t-black font-medium">5 Ulduz</span>
                </div>
            </div>
            <div className="flex gap-[32px]">
                <div className="gap-[12px] flex items-center">
                    <div className="w-[28px] h-[28px] rounded-[8px] bg-[#F1F1FF] grid place-items-center">
                        <Calendar />
                    </div>
                    <span className="text-t-black font-medium">30 Gün</span>
                </div>
                <div className="gap-[12px] flex items-center">
                    <div className="w-[28px] h-[28px] rounded-[8px] bg-[#F1F1FF] grid place-items-center">
                        <Wallet />
                    </div>
                    <span className="text-t-black font-medium">200 Azn</span>
                </div>
            </div>
        </div>
        <div className="mt-[32px] grid grid-cols-2 gap-[16px]">
            <ApplyBtn />
            <MoreBtn />
        </div>
    </div>
   
</div>
  )
}

export default PackageItem
