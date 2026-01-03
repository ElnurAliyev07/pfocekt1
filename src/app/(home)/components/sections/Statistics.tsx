import { Statistic } from '@/types/home.type'
import Image from 'next/image'
import React from 'react'

interface Props {
    statistic: Statistic[]
}

const Statistics: React.FC<Props> = ({statistic}) => {
  return (
    <section className="mt-[80px] md:mt-[100px] lg:mt-[200px] custom-container">
    <div className="">
        <div className="flex items-center justify-between">
            <h3 className="text-[24px] md:text-[36px] leading-[32px] md:leading-[44px] text-t-black dark:text-text-dark-black font-semibold">Statistikamız</h3>
        </div>
    </div>
    <div className="mt-[40px] md:mt-[48px] py-[32px] md:py-[24px] px-[36px] bg-[#E8E9FF] rounded-[20px]">
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[80px] lg:gap-0">
            
            {statistic.map((item,index) => (
                <div key={index} className="flex flex-col items-center">
                <div className="w-[80px] h-[80px] grid place-items-center">
                    <Image className='rounded-[50px] object-cover w-auto h-auto' src={item.file} width={300} height={300} alt={item.title}/>
                </div>
                <span className="mt-[20px] text-primary dark:text-text-dark-white text-[24px] leading-[32px] font-bold">{item.number}</span>
                <p className="mt-[4px] leading-[24px] text-primary dark:text-primary-dark">{item.title}</p>    
            </div>
            ))}
            
        </div>
    </div>
    
</section>
  )
}

export default Statistics
