import { AboutSection } from '@/types/about.type';
import Image from 'next/image'
import React from 'react'

interface Props {
  data: AboutSection; 
}
const Hero : React.FC<Props> = ({data}) => {
  return (
    <section className='custom-container pt-[72px] md:pt-[148px]'>
      <div className='overflow-hidden rounded-[20px] relative flex items-center justify-center h-[165px] md:h-[350px] lg:h-[450px]'>
        <Image src={data.hero_image_overlay} className="w-full h-full lg:h-[450px] object-cover bg-center object-center" width={2000} height={2000} alt="about img" />
        <div className='absolute top-0 left-0 w-full h-full bg-primary opacity-33'></div>
        <h1 className='absolute text-white font-semibold text-[24px] md:text-[60px]'>Haqqımızda</h1>
      </div>
    </section>
  )
}

export default Hero
