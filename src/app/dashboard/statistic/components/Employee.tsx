import React from 'react'
import Image from "next/image"

const Employee = () => {
    return (
        <div className='flex items-center'>

            <div className='w-10 h-10 object-cover mr-3 rounded-full'>
                <Image className='rounded-full' src="/grid.png" width={100} height={100} alt="user profile photo"  />
            </div>

            <div className='flex items-center justify-between w-full'>
                <div className='flex flex-col'>
                <div className='flex items-center gap-3'>
                    <h1 className='text-xs font-medium mb-[6px]'>Ayaz Samadov</h1>
                    <span className='text-xs bg-[#C6DFF8] py-[2px] px-2 font-medium rounded-sm'>Admin</span>
                </div>
                <p className='text-t-gray text-xs font-medium'>SMM</p>
                </div>
                <div className='flex flex-col justify-end'>
                <span className='text-end text-xs font-medium mb-[8px]'>60%</span>
                <span className='text-[10px] font-medium text-t-gray'>12 saat qalib</span>
            </div>
            </div>

        </div>
    )
}

export default Employee