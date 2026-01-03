import Image from 'next/image'
import React from 'react'

const Testimonial = () => {
  return (
    <div className='pt-5 pb-8 px-5 border rounded-[20px]'>
            <div className='flex items-center gap-1 mb-5'>
                <span className='text-xs text-t-black font-medium'>Proyekt</span>
                <span className='w-2 h-2 bg-primary rounded-full'></span>
                <span className='text-xs text-t-black font-medium'>Task</span>
            </div>
            <div className='flex items-center gap-[17px] mb-4'>
                <div className='w-10 h-10 object-cover rounded-full'>
                    <Image className='rounded-full' src='/grid.png' width={100} height={100} alt='user profile image' />
                </div>
                <div>
                    <h1 className='text-sm text-t-black font-medium mb-1'>Gunel Qemberova</h1>
                    <p className='text-xs text-t-gray font-medium'>12 Avqust 2024</p>
                </div>
            </div>
            <div>
                <p className='text-xs text-t-gray font-normal'>Lorem ipsum dolor sit amet consectetur. Turpis semper vitae tellus netus.</p>
            </div>
        </div>
  )
}

export default Testimonial
