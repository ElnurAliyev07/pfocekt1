import React from 'react'
import Checkmark from '../ui/icons/Checkmark'
import { AboutSection } from '@/types/about.type'

interface Props {
  data: AboutSection
}

const Advantages: React.FC<Props> = ({data}) => {
  return (
    <section className="custom-container mt-[72px] md:mt-[100px] lg:mt-[124px]">
    <h3 className="max-w-[600px] text-[24px] lg:text-[40px] font-semibold text-text-black dark:text-text-dark-black leading-[32px] lg:leading-[64px] md:w-[70%]">Peşəkar Xidmət
    </h3>
    <div className="mt-[32px] lg:mt-[72px] min-h-[400px] grid items-center lg:grid-cols-2 gap-[48px] lg:gap-[70px]">
        <div className="space-y-[32px] lg:space-y-0 flex h-full flex-col justify-between">
            <div className="flex justify-start">
                <div className="bg-[#DCFFEB] rounded-[12px] py-[8px] lg:py-[24px] px-[39px] lg:px-[32px] flex items-center gap-[12px]">
                    <Checkmark className='w-[21px] h-[21px] lg:w-[40px] lg:h-[40px]' />
                    <span className="lg:text-[32px] leading-[40px] font-semibold tracking-wider text-t-black ">100% Güvənilir</span>
                </div>
            </div>
            <div className="flex justify-center w-full">
                <div className="bg-[#EAB56E] text-text-white rounded-[12px] py-[20px] lg:py-[32px] px-[38px] lg:px-[70px] flex flex-col items-center">
                    <div className="flex items-center gap-[4px]">
                        <span className="text-t-black text-[36px] lg:text-[48px] font-semibold">{data.statistic.number_of_hires}</span>
                        <span className="text-t-black text-[32px] font-semibold ">+</span>
                    </div>
                    <p className="text-t-black text-[20px] lg:text-[24px] font-medium text-center">
                        İşə götürülmə sayı
                    </p>
                </div>
            </div>
            <div className="flex justify-end">
                <div className="bg-[#FFD9D9] rounded-[12px] py-[8px] lg:py-[24px] px-[39px] lg:px-[32px] flex items-center gap-[12px]">
                    <Checkmark className='w-[21px] h-[21px] lg:w-[40px] lg:h-[40px]' />
                    <span className="lg:text-[32px] leading-[40px] font-semibold tracking-wider text-t-black ">100% Güvənilir</span>
                </div>
            </div>
        </div>
        <div className="space-y-[10px] lg:space-y-[24px] md:h-[488px]">
          {/* <!-- Card --> */}
          {data.punkts.map((item, index) => (
             <div key={index} className=" dark:bg-secondary-dark bg-[#FFFFFF] md:bg-transparent rounded-[20px] px-[33px] py-[16px] md:px-[16px] md:py-[24px] flex items-center gap-[24px] md:gap-[16px]">
             <span className="text-primary font-medium text-[24px] leading-[28px]">0{index + 1}</span>
             <p className="text-[12px] md:text-[20px] leading-[16px] md:leading-[28px] font-medium text-text-black dark:text-text-dark-black">{item.title}</p>
           </div>
          ))}
        </div>
      </div>
</section>
  )
}

export default Advantages
