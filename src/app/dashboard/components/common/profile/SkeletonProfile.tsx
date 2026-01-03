import React from 'react'

const SkeletonProfile = () => {
  return (
    <div className='flex items-center gap-[12px] animate-pulse'>
      <div className='bg-gray-300 rounded-full w-[48px] h-[48px]' />
      <div className='space-y-[4px]'>
        <div className='bg-gray-300 w-[100px] h-[16px] rounded-sm' />
        <div className='bg-gray-300 w-[60px] h-[12px] rounded-sm' />
        <div className='flex items-center gap-[6px]'>
          <div className='bg-gray-300 w-[20px] h-[16px] rounded-sm' />
          <div className='bg-gray-300 w-[30px] h-[12px] rounded-sm' />
        </div>
      </div>
    </div>
  )
}

export default SkeletonProfile