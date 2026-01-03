import Image from 'next/image'
import React from 'react'
// import PackageCreate from '../ui/buttons/PackageCreate'
import { PackageSection } from '@/types/package.type'


interface Props {
  data: PackageSection

}

const Hero:React.FC<Props> = ({data}) => {

  return (
    <section className='custom-container pt-[84px] md:pt-[148px] '>
      <div className='md:mt-[42px] relative flex flex-col md:flex-row justify-evenly overflow-hidden items-center pt-[28px] px-[26px] pb-[24px] md:pb-0 md:px-[22px] bg-linear-to-r from-[#d0e8ff] to-[#f2d9f9] h-auto md:h-auto lg:h-[442px] rounded-[20px] mt-[24px]'>
        <div className='w-full md:w-[50%] lg:w-[700px] mb-4 lg:mb-0'>
          <h1 className='text-[24px] md:text-[28px] lg:text-[40px] font-semibold mb-5 text-t-black'>{data.title}</h1>
          <p className='text-[12px] md:text-[14px] lg:text-[22px] font-normal text-t-gray mb-[40px] lg:mb-16'>{data.description}</p>
          {/* <div className='md:flex'>
            <PackageCreate />
          </div> */}
        </div>

        <div className='z-2 mr-[30px]'>
          <Image src={data.image} className='md:w-[398px] object-contain' width={1000} height={1000} alt='package hero img' />
        </div>
      </div>
    </section>


  )
}

export default Hero
