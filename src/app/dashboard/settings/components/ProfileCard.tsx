import Image from 'next/image'
import React from 'react'
import { Edit, Location, Star } from '../svg/Svg'

const ProfileCard = () => {

  const ChildComponent = ({text}: {text: string}) => {
    return <div className='text-t-black text-[12px] leading-[16px] font-medium rounded-[8px] bg-[#F3F6FC] py-[8px] px-[12px]'>{text}</div>
  }

  return (
    <div className='bg-white h-[452px] rounded-[20px]'>
        {/* Banner section */}
        <div className='relative'>
          <Image className='rounded-[12px] w-full h-[271px] object-cover' src={'/banner.png'} alt='Banner image' width={4000} height={2000}/>

          <div className='absolute top-[17px] right-[34px] text-white backdrop-blur-xs bg-white/30 px-[12px] py-[8px] rounded-[12px] leading-[20px] text-[14px] font-medium'>
           Qoşuldu 10 Avg 2024
          </div>

          <div className='absolute top-[175px] left-[53px]'>
            <Image className='rounded-full' src={'/profile_banner.png'} alt='Profile picture' width={148} height={148} />

            <div className='flex items-center justify-center h-[40px] w-[40px] bg-[#EAEBFF] px-[12px] py-[8px] absolute top-[12px] left-[112px] rounded-[8px]'><Edit /></div>
          </div>
        </div>

        {/* Profile section */}
        <div className='flex'>
          <div className='mt-[69px] ml-[53px] flex flex-col gap-[8px]'>
            <div className='text-t-black text-[20px] leading-[28px] font-medium'>Ayaz Samadov</div>
            <div className='text-t-gray text-[16px] leading-[24px] font-medium'>Product Designer</div>
            <div className='flex items-center gap-[6px]'>
              <Star /> 
              <span className='font-medium text-[12px] leading-[16px] text-[#F5AB20]'>4.5</span>
            </div>
          </div>

          <div className='mt-[58px] ms-[64px]'>
            <div className='flex gap-[12px]'>
              <ChildComponent text='UX/Uİ Dizayner' />
              <ChildComponent text='Məhsul Dizayneri' />
              <ChildComponent text='Web Dizayner' />
              <ChildComponent text='UI Dizayner' />
            </div>

            <div className='text-t-gray text-[16px] leading-[20px] font-medium flex items-center gap-[4px] mt-[23px]'><Location /> Bakı, Azərbaycan</div>
          </div>
        </div>
    </div>
  )
}

export default ProfileCard