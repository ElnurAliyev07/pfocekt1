import React from 'react'
import { Edit, GenderMale, Language } from '../svg/Svg'

const Salary = () => {
  return (
    <div className='bg-white px-[24px] py-[32px] rounded-[20px]'>
        <div className='flex justify-between'>
            <div>
                <div className='flex gap-[4px] text-[16px]'>
                    <p className='text-t-black  font-normal leading-[24px]'>2000 AZN</p>
                    <p className='text-t-gray leading-[32px] font-medium'>/ Aylıq</p>
                </div>
                <div className='flex gap-[4px] text-[16px]'>
                    <p className='text-t-black  font-normal leading-[24px]'>700 AZN</p>
                    <p className='text-t-gray leading-[32px] font-medium'>/ Proyekt başı</p>
                </div>
                <div className='flex gap-[4px] text-[16px]'>
                    <p className='text-t-black  font-normal leading-[24px]'>500 AZN</p>
                    <p className='text-t-gray leading-[32px] font-medium'>/ Paket</p>
                </div>
            </div>
            <div className='bg-[#F3F3FF] rounded-[5px] px-[12px] py-[8px] self-start'><Edit /></div>
        </div>

        <div className='mt-[48px]'>
            <div className='flex justify-between border-b border-[#E8EAED] py-[12px] px-[10px]'>
                <div className='flex gap-[8px] text-t-gray text-[16px] leading-[24px] font-medium'><GenderMale /> Cins</div>
                <div className='text-t-black text-[18px] leading-[24px] font-medium'>Kişi</div>
            </div>
            <div className='flex justify-between border-b border-[#E8EAED] py-[12px] px-[10px]'>
                <div className='flex gap-[8px] text-t-gray text-[16px] leading-[24px] font-medium'><Language />İngilis dili</div>
                <div className='text-t-black text-[18px] leading-[24px] font-medium'>Əla</div>
            </div>
            <div className='flex justify-between border-b border-[#E8EAED] py-[12px] px-[10px]'>
                <div className='flex gap-[8px] text-t-gray text-[16px] leading-[24px] font-medium'><Language />Alman dili</div>
                <div className='text-t-black text-[18px] leading-[24px] font-medium'>Orta</div>
            </div>
        </div>
    </div>
  )
}

export default Salary