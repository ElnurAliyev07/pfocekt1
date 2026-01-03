import { AboutSection } from '@/types/about.type'
import React from 'react'

interface Props {
  data: AboutSection; 
}

const Result: React.FC<Props> = ({data}) => {
  
  return (
    <section className="custom-container mt-[64px] md:mt-[100px] lg:mt-[124px]">
    <div className="flex flex-col-reverse md:grid  md:grid-cols-2 items-center gap-y-[48px] md:gap-x-8 ">
      {/* <!-- Left side stats --> */}
      <div className="grid grid-cols-2 w-full md:w-auto md:mt-auto lg:mt-0 gap-x-[20px] gap-y-[16px] lg:gap-x-[24px] lg:gap-y-[48px] md:order-2">
        <div className="md:space-y-[4px] space-y-[8px]">
          <p className="text-[40px] lg:text-[68px] font-semibold text-primary leading-[60px] md:leading-[82px]">{data.statistic.freelancer}+</p>
          <p className="text-t-black font-medium dark:text-text-dark-black text-[16px] lg:text-[20px] leading-[28px]">Frilanser sayı</p>
        </div>
        <div className="md:space-y-[4px] space-y-[8px]">
          <p className="text-[40px] lg:text-[68px] font-semibold text-primary leading-[60px] md:leading-[82px]">{data.statistic.projects}+</p>
          <p className="text-t-black font-medium dark:text-text-dark-black text-[16px] lg:text-[20px] leading-[28px]">Proyekt sayı</p>
        </div>
        <div className="md:space-y-[4px] space-y-[8px]">
          <p className="text-[40px] lg:text-[68px] font-semibold text-primary leading-[60px] md:leading-[82px]">{data.statistic.company}+</p>
          <p className="text-t-black font-medium dark:text-text-dark-black text-[16px] lg:text-[20px] leading-[28px]">Şirkət sayı</p>
        </div>
        <div className="md:space-y-[4px] space-y-[8px]">
          <p className="text-[40px] lg:text-[68px] font-semibold text-primary leading-[60px] md:leading-[82px]">{data.statistic.order}+</p>
          <p className="text-t-black font-medium dark:text-text-dark-black text-[16px] lg:text-[20px] leading-[28px]">Sifariş sayı</p>
        </div>
        
      </div>
       {/* <!-- Right side content --> */}
      <div className='md:order-1 lg:mr-[128px]'>
        <h2 className="text-[24px] lg:text-[40px] font-semibold leading-[32px] md:leading-[48px] tracking-[-1.14px] text-t-black dark:text-text-dark-black">Haqqımızda</h2>
        <div 
        
          dangerouslySetInnerHTML={{
            __html: data.description.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>'),
          }}
         className="mt-[20px] md:mt-[24px] text-[16px] lg:text-[22px] font-normal leading-[24px] md:leading-[28px] text-t-gray dark:text-text-dark-black"
         >
        </div>
      </div> 
    </div>
</section>
  
  )
}

export default Result
