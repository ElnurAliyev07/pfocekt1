import React from 'react'
import ToggleSwitch from './ToggleSwitch'

const SecurityBox = ({title, text, toggle}: {title: string, text: string, toggle: boolean}) => {
  return (
    <div className='bg-white py-[32px] px-[28px] rounded-[12px] font-medium text-t-black'>
        <div className='flex justify-between'>
            <h3 className='text-[20px] leading-[28px]'>{title}</h3>
            <div className={toggle ? 'visible' : 'hidden'}><ToggleSwitch /></div>
        </div>

        <div className='text-[14px] leading-[20px] font-normal mt-[16px]'>{text}</div>

        <button className='bg-[#444BD3] py-[8px] px-[20px] rounded-[8px] text-[16px] leading-[24px] mt-[32px] text-white font-poppins'>Yadda saxla</button>
    </div>
  )
}

export default SecurityBox