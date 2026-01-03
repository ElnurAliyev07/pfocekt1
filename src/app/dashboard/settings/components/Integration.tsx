import React from 'react'
import ToggleSwitch from './ToggleSwitch'

const Integration = ({Icon, connected}: {Icon: React.ComponentType, connected: boolean}) => {
  return (
    <div className='flex justify-between items-center'>
        <div className='bg-[#F9F9F9] rounded-[16px] p-[12px]'>{<Icon />}</div>

        <div className='flex gap-[32px]'>
          <div className={`${connected ? 'bg-[#EDFFE8] text-[#42B422] px-[20px]' : 'bg-[#FFECEC] text-[#F00500] px-[12px]'} py-[6px]  rounded-[4px] font-medium text-[12px] leading-[18px] w-[98px] text-center`}>{connected ? 'Qoşulub' : 'Qoşulmayıb'}</div>
          <div><ToggleSwitch /></div>
        </div>
    </div>
  )
}

export default Integration