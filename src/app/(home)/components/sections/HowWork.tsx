import { HowToWork } from '@/types/home.type'
import Image from 'next/image'
import React from 'react'

interface Props {
    data: HowToWork[]
}

const HowWork: React.FC<Props> = ({data}) => {
  return (
    <section data-aos="fade-down" className="mt-[80px] md:mt-[100px] lg:mt-[200px] custom-container">
    <h3 className="text-[24px] md:text-[36px] font-semibold leading-[32px] md:leading-[44px] text-t-black dark:text-text-dark-black">Necə işləyir?</h3>
    <p className="mt-[12px] md:mt-[16px] leading-[28px] text-[12px] md:text-[20px] font-normal md:font-medium text-t-gray dark:text-text-dark-black/70">Sizin rahatlığınız üçün daima üzərimizdə çalışırıq.</p>
    <div className="mt-[48px] md:mt-[64px] grid md:grid-cols-2 lg:grid-cols-4 gap-[40px] md:gap-[84px]">
        {data?.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
            <div className="w-[80px] h-[80px] md:w-[90px] md:h-[90px] grid place-items-center">
                <Image className='rounded-[50px] w-auto h-auto' src={item.file} width={300} height={300} alt={item.title} />
            </div>
            <h4 className="leading-[28px] text-[20px] font-semibold mt-[16px] text-center text-t-black dark:text-text-dark-black">{item.title}</h4>
            <p className="leading-[24px] text-[16px] font-normal md:font-medium w-[200px] md:w-full text-center mt-[16px] text-t-gray dark:text-text-dark-black/50">{item.description}</p>
        </div>
        ))} 
    </div>
</section>
  )
}

export default HowWork
