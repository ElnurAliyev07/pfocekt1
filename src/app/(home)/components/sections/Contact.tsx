import Image from 'next/image'
import React from 'react'
import ContactWithUs from '../ui/buttons/ContactWithUs'
import { ContactSection } from '@/types/home.type'

interface Props {
  data: ContactSection
}

const Contact: React.FC<Props> = ({ data }) => {
  return (
    <section className='custom-container'>
      <div className='relative mt-[72px] md:mt-[100px] lg:mt-[148px] h-auto md:h-[500px] overflow-hidden rounded-[8px] md:rounded-[20px]'>
        <div className='h-full'>
          <Image src={data.image_overlay} className='w-full object-cover h-full rounded-[8px] md:rounded-[16px]' width={3000} height={3000} quality={100} alt="contact img" />
        </div>
        <div className='absolute top-[-170px] left-[-132px] bg-primary w-[265px] md:w-[535px] lg:w-[844px] h-[900px] flex justify-center flex-col opacity-85 rotate-20'></div>
        <div className='absolute top-0 left-[17px] lg:left-[83px] w-[168px] md:w-[400px] lg:w-[579px] flex flex-col justify-center h-full'>
          <h1 className='text-[24px] md:text-[40px] lg:text-[68px] font-semibold mb-2 md:mb-1 text-white'>{data.title}</h1>
          <p className='text-[12px] md:text-[16px] lg:text-[20px] max-w-[428px] font-normal text-white mb-[36px] md:mb-16'>{data.description}</p>
          <div className='flex'>
            <ContactWithUs />
          </div>
        </div>
      </div>
    </section>

  )
}

export default Contact
