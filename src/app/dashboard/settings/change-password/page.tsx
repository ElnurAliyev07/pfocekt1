import React from 'react'
import PasswordInput from '../components/PasswordInput'
import TabMenu from '../components/TabMenu'

const page = () => {
  return (
    <div>
      <TabMenu />
      
      <div className='w-[458px] bg-white py-[32px] px-[25px] rounded-[12px] mt-[56px]'>
          <h3 className='font-medium text-[20px] leading-[28px] font-poppins text-t-black'>Şifrə dəyişmə</h3>

          <div className='flex flex-col gap-[32px] mt-[36px]'>
              <PasswordInput labelText='Şifrə' />
              <PasswordInput labelText='Yeni şifrə' />
          </div>

          <div className='flex gap-[20px] mt-[48px] place-self-end'>
              <button className='text-[16px] leading-[24px] py-[8px] px-[37.5px] bg-[#E8EAED] rounded-[8px]'>Ləğv et</button>
              <button className='text-[16px] leading-[24px] py-[8px] px-[37.5px] bg-primary text-white rounded-[8px]'>Təsdiqlə</button>
          </div>
      </div>
    </div>
  )
}

export default page