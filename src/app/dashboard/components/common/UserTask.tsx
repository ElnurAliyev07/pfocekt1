import Image from 'next/image'
import React from 'react'
import { Date } from '../svgs/SvgS'

const UserTask = () => {
  return (
    <div className='h-[192px] flex flex-col justify-between bg-[#F7F9FF] px-[20px] py-[28px] rounded-[20px]'>

        <div className='flex justify-between'>
            <div className='flex gap-[8px] items-center justify-center'>
                <div className='relative'>
                    <div className='absolute -right-1 -top-1 flex items-center justify-center w-[16px] h-[16px] text-[10px] font-medium leading-[12px] bg-[#38D24A] text-white rounded-full'>12</div>
                    <Image className="rounded-full w-10 h-10" width={1000} height={1000} src="/grid.png" alt="grid" />
                </div>
                <div className='flex flex-col justify-between'>
                    <h4 className='text-sm text-t-black font-medium'>Ayaz Samadov</h4>
                    <p className='text-xs text-t-gray'>Product Designer</p>
                </div>
            </div>
            
            <div className='flex gap-1 items-center bg-[#EFECFF] text-[#444BD3] rounded-sm px-2 py-1 self-center'>
                <div className='bg-[#444BD3] w-2 h-2 rounded-full'></div>
                <p className='text-sm font-medium'>Davam edir</p>
            </div>
        </div>

        <p className='text-t-gray text-sm'>Lorem ipsum dolor sit amet consectetur. Turpis semper vitae tellus netus.</p>

        <div className='flex gap-2'>
            <div><Date /></div>
            <p className='text-xs text-t-gray'>10.10.2024- 18.10.2024</p>
        </div>
    </div>
  )
}

export default UserTask