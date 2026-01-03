import Image from 'next/image'
import React from 'react'
import Loading from './Loading'
import Statistic from './Statistic'


const Info: React.FC = () => {
  return (
    <div className='flex-1'>
      <div className='w-full lg:w-[95%] flex flex-col'>
        <div className='rounded-[16px] w-full p-4 lg:pt-[6px] lg:pr-[55px] lg:pb-[15px] lg:pl-[14px] bg-white lg:bg-[#FDF7EA] flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-0 shadow-xs lg:shadow-none'>
          <div className='flex flex-col lg:flex-row items-center gap-4 lg:gap-[29px] w-full lg:w-auto'>
            <div className='relative w-[100px] h-[100px] lg:w-[151px] lg:h-[201px] rounded-full lg:rounded-none overflow-hidden bg-[#FDF7EA] lg:bg-transparent'>
              <Image 
                src='/grid.png' 
                fill
                alt='info image' 
                className='object-cover lg:object-contain'
              />
            </div>
            <div className='text-center lg:text-left w-full lg:w-auto'>
              <h1 className='text-t-black text-xl lg:text-2xl mb-2 lg:mb-[21px] font-semibold'>User User</h1>
              <p className='max-w-[267px] text-t-gray text-sm lg:text-base mx-auto lg:mx-0'>Lorem ipsum dolor sit amet lorem ipsum dolor sit amet</p>
            </div>
          </div>
          <div className='w-full lg:w-auto flex justify-center lg:justify-end'>
            <Loading />
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[17px] mt-3 lg:mt-0'>
          <Statistic background="#FAD4D4" fill="#FF0252" />
          <Statistic background="#D4F5FA" fill="#31E4FF" />
          <Statistic background="#EFECFF" fill="#650AFF" />
        </div>
      </div>
    </div>

  )
}

export default Info
