import React from 'react'
import Testimonial from './Testimonial'

const Testimonials = () => {
  return (
    <div className="w-full py-8 px-4 lg:px-6 bg-white mt-8 rounded-[20px]">
      <h1 className="text-[32px] text-t-black font-medium mb-3">Rəylər</h1>
      <p className='text-[20px] font-medium text-t-gray mb-7'>80 Rəy</p>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[12px] lg:gap-6'>
         <Testimonial />
         <Testimonial />
         <Testimonial />
      </div>
      <div className='mt-8'>
                <p className='text-[16px] text-t-black font-medium text-end'>Daha çox</p>
            </div>
    </div>
  )
}


export default Testimonials
