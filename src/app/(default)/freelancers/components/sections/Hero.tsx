import Image from 'next/image'
import React from 'react'
import BeFreelancer from '../ui/buttons/BeFreelancer'

const Hero = () => {
  return (
    <section className='custom-container md:mt-[60px]'>
    <section className='relative flex flex-col md:flex-row justify-evenly overflow-hidden items-center pt-[28px] px-[22px] bg-linear-to-r bg-primary md:from-[#2D34C4] md:to-[#545AC2] h-[503px] md:h-auto lg:h-[442px] rounded-[20px] mt-[24px]'>
    

     <div className='w-full md:w-[50%] lg:w-[700px] mb-4 lg:mb-0'>
        <h1 className='text-[24px] md:text-[28px] lg:text-[40px] font-semibold mb-5 text-white'>Peşəkar frilanserlər və işəgötürənlər üçün platform</h1>
        <p className='text-[12px] md:text-[14px] lg:text-[22px] font-normal text-white mb-[40px] lg:mb-16'>Dizayn yaratmaq indi daha asandır. Alətlərimiz və şablonlarımızla istədiyiniz layihələri həyata keçirin.</p>
            <div className='md:flex'>
            <BeFreelancer />
            </div>
        </div>

        <div className='z-2'>
            <Image src="/freelance-hero.png" className='w-[204px] h-[204px] md:w-[328px] md:mt-[60px] md:ml-[10px] md:h-[328px] object-cover' width={1000} height={1000} alt='workspace hero img' />
        </div>
        
        <div className='absolute md:top-[60px] top-[300px] right-[-59px] md:right-[200px] lg:right-[257px] w-[144px] h-[32px] md:w-[175px] md:h-[48px] rounded-[100px] bg-white/15'></div>
        <div className='absolute top-[341px] md:top-[136px] right-[27px] z-1 md:right-[257px] lg:right-[310px] w-[144px] h-[32px] md:w-[175px] md:h-[48px] rounded-[100px] bg-white/15'></div>
        <div className='absolute md:bottom-[155px] lg:bottom-[168px] bottom-[85px] right-[-52px] z-1 md:right-[200px] lg:right-[241px] w-[144px] h-[32px] md:w-[175px] md:h-[48px] rounded-[100px] bg-white/15'></div>
        <div className='absolute md:bottom-[73px] bottom-[40px] right-[-92px] md:right-[257px] lg:right-[310px] w-[144px] h-[32px] md:w-[175px] md:h-[48px] rounded-[100px] bg-white/15'></div>
        

    </section>
    </section>

   
  )
}

export default Hero
