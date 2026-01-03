import React from 'react'
import { Edit } from '../svg/Svg'

const Skills = () => {
  return (
    <div className='bg-white px-[24px] py-[32px] rounded-[20px]'>
        <div className='flex justify-between'>
            <h3 className='font-medium text-t-black text-[20px] leading-[28px]'>Bacarıqlar</h3>
            <div className='bg-[#F3F3FF] rounded-[5px] px-[12px] py-[8px] self-start'><Edit /></div>
        </div>

        <div className='flex flex-wrap gap-[12px] mt-[24px]'>
            <div className='text-t-black text-[12px] leading-[20px] font-medium rounded-[8px] bg-[#F3F6FC] py-[8px] px-[12px]'>Figma</div>
            <div className='text-t-black text-[12px] leading-[20px] font-medium rounded-[8px] bg-[#F3F6FC] py-[8px] px-[12px]'>Web Design</div>
            <div className='text-t-black text-[12px] leading-[20px] font-medium rounded-[8px] bg-[#F3F6FC] py-[8px] px-[12px]'>Mobile App Design</div>
            <div className='text-t-black text-[12px] leading-[20px] font-medium rounded-[8px] bg-[#F3F6FC] py-[8px] px-[12px]'>Sketch</div>
            <div className='text-t-black text-[12px] leading-[20px] font-medium rounded-[8px] bg-[#F3F6FC] py-[8px] px-[12px]'>SAAS</div>
            <div className='text-t-black text-[12px] leading-[20px] font-medium rounded-[8px] bg-[#F3F6FC] py-[8px] px-[12px]'>Prototyping</div>
        </div>
    </div>
  )
}

export default Skills