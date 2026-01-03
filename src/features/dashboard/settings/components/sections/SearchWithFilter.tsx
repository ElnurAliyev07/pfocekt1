import React from 'react'
import { ArrowDown, Search } from '../ui/Svg'

const SearchWithFilter = () => {
  return (
    <div className='bg-white border border-[#E8EAED] rounded-[16px] py-[14px] px-[24px] flex justify-between w-[400px] items-center'>
        
        <div className='flex items-center gap-[8px]'>
            <Search />
            <input type='text' className='text-[16px] leading-[16px] text-t-gray font-normal' placeholder='Axtar' />
        </div>

        <div className='flex gap-[4px]'>
            <p className='text-t-gray font-normal text-[16px] leading-[16px] font-poppins border-s border-[#E8EAED] ps-[12px]'>Ən yeni</p>
            <ArrowDown />
        </div>
    </div>
  )
}

export default SearchWithFilter