import React from 'react'
import CreateOffice from '../ui/button/CreateOffice'
import Image from 'next/image'
import { WorkspaceHero } from '@/types/workspace.type'

interface Props {
  data: WorkspaceHero
}

const Hero: React.FC<Props> = ({data}) => {
  return (
    <section className='custom-container pt-[72px] md:pt-[100px]  lg:pt-[148px]'>
      <div className='relative pl-[22px] pr-[29px] pt-[28px] lg:pt-0 lg:p-0 h-auto flex justify-evenly flex-col md:flex-row overflow-hidden items-center bg-linear-to-r from-[#d0e8ff] to-[#f2d9f9] md:h-[442px] rounded-[12px] lg:rounded-[20px] mt-[24px] lg:mt-[19px]'>

        <div className='w-full md:w-[50%] lg:w-[600px] mb-4 lg:mb-0'>
          <h1 className='text-[24px] md:text-[38px] lg:text-[48px] font-semibold mb-5 lg:mb-1 text-t-black'>{data.title}</h1>
          <p className='text-[12px] md:text-[18px] lg:text-[22px] font-normal text-t-gray mb-[40px] lg:mb-16'>{data.description}</p>
          <div className='lg:flex'>
            <CreateOffice />
          </div>
        </div>

        <div className='md:mr-[30px]'>
          <Image src={data.image} className='w-[209px] h-[209px] md:w-[348px] md:h-[348px] lg:w-[398px] lg:h-[398px] object-cover' width={1000} height={1000} alt='workspace hero img' />
        </div>

        <div className='absolute bottom-[70px] right-[-85px] z-10 md:top-[100px] md:right-[-85px] lg:z-0 lg:right-[-300px] lg:top-[-42px] w-[145px] h-[146px] lg:w-[371px] lg:h-[374px] rounded-[20px] bg-[#BEDCFF] rotate-45'></div>
        <div className='absolute bottom-[-10px] right-[-75px] md:top-[230px] md:right-[-75px] lg:right-[-280px] lg:bottom-0 lg:top-[140px] w-[145px] h-[146px] lg:w-[371px] lg:h-[374px] rounded-[20px] bg-[#EACFF9] rotate-45'></div>
      </div>
    </section>
  )
}

export default Hero
