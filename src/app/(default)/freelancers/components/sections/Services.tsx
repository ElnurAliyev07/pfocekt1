import Image from 'next/image'
import React from 'react'

const Services = () => {
  return (
    <section className="custom-container flex flex-col lg:block mt-[72px] md:mt-[60px]">
    <h4 className="text-[36px] leading-[44px] text-t-black dark:text-text-dark-black font-semibold hidden lg:block">Servislərimiz</h4>
    <div className="lg:mt-[64px] flex flex-col lg:grid grid-cols-2 gap-[48px] lg:gap-[24px] md:gap-[100px]">
        <div className='order-2 lg:order-1'>
          <ul className="flex flex-col gap-[10px] md:mt-[130px] lg:mt-0 md:gap-4">
            <li className="text-[20px] bg-white py-[16px] px-[33px] md:py-6 md:px-[17px] rounded-[20px] flex items-center gap-[24px] md:gap-5 ">
              <span className='text-[24px] md:text-[28px] text-primary font-semibold'>01</span>
              <p className='text-[12px] md:text-[18px] font-medium text-t-black'>Freelancing-ə giriş: Freelancing-in təsviri, üstünlükləri və təqdim olunan xidmət növləri.</p>
            </li>
            <li className="text-[20px] bg-white py-[16px] px-[33px] md:py-6 md:px-[17px] rounded-[20px] flex items-center gap-[24px] md:gap-5 ">
              <span className='text-[24px] md:text-[28px] text-primary font-semibold'>02</span>
              <p className='text-[12px] md:text-[18px] font-medium text-t-black'>Freelancing-ə giriş: Freelancing-in təsviri, üstünlükləri və təqdim olunan xidmət növləri.</p>
            </li>
            <li className="text-[20px] bg-white py-[16px] px-[33px] md:py-6 md:px-[17px] rounded-[20px] flex items-center gap-[24px] md:gap-5 ">
              <span className='text-[24px] md:text-[28px] text-primary font-semibold'>03</span>
              <p className='text-[12px] md:text-[18px] font-medium text-t-black'>Freelancing-ə giriş: Freelancing-in təsviri, üstünlükləri və təqdim olunan xidmət növləri.</p>
            </li>
            <li className="text-[20px] bg-white py-[16px] px-[33px] md:py-6 md:px-[17px] rounded-[20px] flex items-center gap-[24px] md:gap-5 ">
              <span className='text-[24px] md:text-[28px] text-primary font-semibold'>04</span>
              <p className='text-[12px] md:text-[18px] font-medium text-t-black'>Freelancing-ə giriş: Freelancing-in təsviri, üstünlükləri və təqdim olunan xidmət növləri.</p>
            </li>
            <li className="text-[20px] bg-white py-[16px] px-[33px] md:py-6 md:px-[17px] rounded-[20px] flex items-center gap-[24px] md:gap-5 ">
              <span className='text-[24px] md:text-[28px] text-primary font-semibold'>05</span>
              <p className='text-[12px] md:text-[18px] font-medium text-t-black'>Freelancing-ə giriş: Freelancing-in təsviri, üstünlükləri və təqdim olunan xidmət növləri.</p>
            </li>
          </ul>   
        </div>
        
        <div className="relative flex mb-[48px] md:mt-[100px] lg:mt-0 flex-col lg:flex-row gap-[45px] lg:items-center justify-center order-1 lg:order-2">
          <div>
            <Image className="w-[192px] h-[148px] md:w-[313px] md:h-[240px] relative md:absolute lg:left-[50px] md:left-[100px] bottom-[-75px] md:top-0 lg:top-[200px] lg:bottom-[95px] z-10 border-[#FBFCFF] border-15 rounded-[15px] object-cover" width={1000} height={1000} src="/grid.png" alt="Person 2" />
          </div>
          <div className="absolute lg:top-[73px] md:right-[100px] right-0 lg:right-0 z-[-1px]">
            <Image className="w-[226px] h-[155px] md:w-[369px] md:h-[250px] rounded-[22px] object-cover" width={1000} height={1000} src="/grid.png" alt="Person 2" />
          </div>
        </div>

    </div>
</section>
  )
}

export default Services
