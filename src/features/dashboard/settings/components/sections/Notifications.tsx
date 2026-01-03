import React from 'react'
import ToggleSwitch from './ToggleSwitch'

const Notifications = ({title, notifications}: {title: string, notifications: string[]}) => {
  return (
    <div className='bg-white py-[32px] px-[24px] rounded-[8px]'>
        <div className='flex justify-between'>
            <h3 className='font-medium text-[18px] leading-[24px] font-poppins'>{title}</h3>
            <div className='flex gap-[53px] text-t-black font-medium text-[14px] leading-[20px]'>
                <p>Email</p>
                <p>SMS</p>
            </div>
        </div>

        <div className='mt-[48px] flex flex-col gap-[28px]'>
            {
                notifications.map((notification, index)=>(
                    <div key={index} className='flex justify-between'>
                        <h4 className='font-poppins font-medium text-[16px] leading-[24px]'>{notification}</h4>

                        <div className='flex gap-[20px]'>
                            <ToggleSwitch />
                            <ToggleSwitch />
                        </div>
                    </div>
                ))
            }   
        </div>

        <div className='flex gap-[20px] mt-[48px] place-self-end'>
            <button className='text-[16px] leading-[24px] py-[8px] px-[37.5px] bg-[#E8EAED] rounded-[8px]'>Ləğv et</button>
            <button className='text-[16px] leading-[24px] py-[8px] px-[37.5px] bg-primary text-white rounded-[8px]'>Təsdiqlə</button>
        </div>
    </div>
  )
}

export default Notifications