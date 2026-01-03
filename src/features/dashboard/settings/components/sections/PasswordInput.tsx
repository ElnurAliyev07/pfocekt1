import React from 'react'
import { EyeLight } from '../ui/Svg'

const PasswordInput = ({labelText}: {labelText: string}) => {
  return (
    <div>
        <label htmlFor='password' className='font-medium text-12px leading-16px text-[#14171A]'>{labelText}</label>

        <div className='relative mt-[8px]'>
            <input
             type='password'
             id='password'
             className='w-full border-1 border-[#E8EAED] py-[10px] px-[16px] rounded-[12px]'
            />
            <button className='absolute inset-y-0 right-3 flex items-center'><EyeLight /></button>
        </div>
    </div>
  )
}

export default PasswordInput