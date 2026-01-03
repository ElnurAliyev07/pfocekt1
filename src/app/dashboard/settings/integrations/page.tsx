import React from 'react'
import Integration from '../components/Integration'
import { Facebook, Google, Linkedin, Stripe } from '../svg/Svg'
import Image from 'next/image'
import ToggleSwitch from '../components/ToggleSwitch'
import TabMenu from '../components/TabMenu'

const page = () => {
  return (
    <div>
      <TabMenu />

      <div className='grid grid-cols-2 gap-[36px] mt-[56px]'>
        <div className='bg-white py-[32px] px-[24px] rounded-[8px]'>
          <h3 className='font-poppins text-[18px] leading-[24px] font-medium'>Ödəniş İnteqrasiyaları</h3>

          <div className='flex flex-col gap-[28px] mt-[44px]'>
            <div className='flex justify-between'>
              <div className='bg-[#F9F9F9] w-[90px] h-[36px] flex items-center justify-center rounded-[8px]'><Stripe /></div>

              <div className='flex gap-[32px]'>
                <div className={'bg-[#EDFFE8] text-[#42B422] py-[6px] px-[20px] rounded-[4px] font-medium text-[12px] leading-[18px]'}>
                  Qoşulub
                </div>
                <div><ToggleSwitch /></div>
              </div>
            </div>

            <div className='flex justify-between'>
              <div className='bg-[#F9F9F9] w-[90px] h-[36px] flex items-center justify-center rounded-[8px]'><Image src={'/ePoint.png'} alt='ePoint logo' width={65} height={27}/></div>

              <div className='flex gap-[32px]'>
                <div className={'bg-[#EDFFE8] text-[#42B422] py-[6px] px-[20px] rounded-[4px] font-medium text-[12px] leading-[18px]'}>
                  Qoşulub
                </div>
                <div><ToggleSwitch /></div>
              </div>
            </div>

            <div className='flex justify-between'>
              <div className='bg-[#F9F9F9] w-[90px] h-[36px] flex items-center justify-center rounded-[8px]'><Image src={'/ePoint.png'} alt='ePoint logo' width={65} height={27}/></div>

              <div className='flex gap-[32px]'>
                <div className={'bg-[#EDFFE8] text-[#42B422] py-[6px] px-[20px] rounded-[4px] font-medium text-[12px] leading-[18px]'}>
                  Qoşulub
                </div>
                <div><ToggleSwitch /></div>
              </div>
            </div>
              
          </div>
        </div>



        <div className='bg-white py-[32px] px-[24px] rounded-[8px]'>
          <h3 className='font-poppins text-[18px] leading-[24px] font-medium'>Sosyal Medya İnteqrasiyaları</h3>
          <div className='flex flex-col gap-[20px] mt-[44px]'> 
            <Integration Icon={Facebook} connected={true} />
            <Integration Icon={Google} connected={true} />
            <Integration Icon={Linkedin} connected={false} />
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default page