import React from 'react'
import CommentWithStars from '../components/CommentWithStars'
import TabMenu from '../components/TabMenu'

const page = () => {
  return (
    <div>
        <TabMenu />

        <div className='font-medium text-t-black p-[32px] bg-white rounded-[12px] flex flex-col mt-[40px]'>
            <h3 className='text-[20px] leading-[28px] border-b border-[#E8EAED] pb-[10px]'>Rəylər</h3> 

            <div className='text-[#64717C] text-[16px] leading-[24px] mt-[20px]'>8 Rəy</div>

            <div className='flex flex-col gap-[36px] mt-[40px]'>
                <CommentWithStars />
                <CommentWithStars />
                <CommentWithStars />
            </div>

            <button className='mt-[48px] underline tracking-[1px] text-[16px] leading-[19.36px] self-end'>Daha çox</button>
        </div>
    </div>
  )
}

export default page