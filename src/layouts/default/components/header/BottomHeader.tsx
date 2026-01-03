import React from 'react'
import Search from '../ui/icons/Search'
import AxesBottom from '../ui/icons/AxesBottom'
import LanguageSwitcher from '../ui/buttons/LanguageSwitcher'
import ThemeChanger from '../ui/buttons/ThemeChanger'

const BottomHeader = () => {
  return (
    <div className='hidden lg:block bg-white pb-[20px]'>
        <div className='custom-container'>
            <div className='flex items-center justify-between'>
                <div></div>
                <div className='w-[490px] h-[52px] px-[24px] py-[10px] rounded-[16px] border border-custom-gray flex items-center gap-[8px] divide-x-1 divide-t-[#B8BABD]'>
                    <div className='flex items-center flex-1 gap-[8px]'>
                        <Search/>
                        <input className='flex-1 border-none outline-hidden border-t-black' type="text" placeholder='Sizə maraqlı olanı axtarın' />
                    </div>
                    <div className='w-[90px] flex items-center pl-[12px] gap-[4px]'>
                        <span className='text-[#64717C]'>İstedad</span>
                        <AxesBottom/>
                    </div>
                </div>
                <div className='flex items-center gap-[12px]'>
                    <LanguageSwitcher/>
                    <ThemeChanger/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default BottomHeader